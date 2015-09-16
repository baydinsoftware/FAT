from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from fat.models import Position, Stage, Candidate, Feedback, Source, UserProfile, WhiteListItem
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import datetime
from django.template import loader
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
import json
import os
import fileupload

@login_required
def main(request):
	return render(request, 'fat/main.html')

def login_page(request):
	return render(request, 'fat/login.html')

# the reason that we have so many branching paths for logging in is 
# due to the possible log in cases:
#	1. First User
#	2. Subsequent User / no whitelist
#	3. Subsequent User / whitelist
#	4. Admin / logs in despite whitelist 
#		->(we can only check admin status after they authenticate)

@csrf_protect
def login_view(request):
	login_user = False
	email = request.POST['email']
	# if a whitelist does not exist yet, we will log the user in
	if not WhiteListItem.objects.all():
		login_user = True
	# otherwise we need to iterate through the whitelist and check if we can log the user in
	else: 
		for i in WhiteListItem.objects.all():
			if i.item in email:
				login_user = True
	# at this point, we've taken care of the first three cases, now we need to check admin status
	username = request.POST['username']
	password = "default_password"
	user = authenticate(username=username, password=password)
	if user is not None:
		if user.is_staff:
			login_user = True

		# if the user should be logged in, then we are free to update the profile picture if it has been changed
		if login_user: 
			profile = user.userprofile
			profile.picture_url = request.POST['picture_url']
			profile.save()
			login(request, user)
		return JsonResponse({'login_user': login_user})
	else:
		# now we can reject users who should not be logging in
		if not login_user:
			return JsonResponse({'login_user': login_user})

		new_user = User(username = username)
		new_user.set_password(password)
		new_user.first_name = request.POST['first']
		new_user.last_name = request.POST['last']
		new_user.email = email
		# if the user is the first to be created, set them as the default admin
		if not User.objects.all():
			new_user.is_staff = True 
		new_user.save()	
		profile = UserProfile(user=new_user, picture_url=request.POST['picture_url'], display_name=request.POST['display_name'])
		profile.save()
		user = authenticate(username=username, password=password)
		login(request, user)
		return JsonResponse({'login_user': login_user})

def logout_view(request):
	logout(request)
	return render(request, 'fat/logout.html')

@login_required
@csrf_protect
def upload_file(request):
	fileinstance = request.FILES['file']
	file_path = request.POST['id'] + "/" + fileinstance.name
	if fileupload.check_if_key_exists(file_path) is None:
		fileupload.put_file_in_bucket_as_string(file_path, fileinstance.read())
		return JsonResponse({'created_new': True})
	else:
		return JsonResponse({'created_new': False})

@login_required
@csrf_protect
def download_file(request):
	filename = request.GET['name']
	filepath = request.GET['filepath']
	file_string = fileupload.get_file_contents_as_string(filepath)
	response = HttpResponse(file_string, content_type="application/octet_stream")
	contentDisposition = 'attachment; filename=' + filename
	response['Content-Disposition'] = contentDisposition
	return response

@login_required
@csrf_protect
def remove_file(request):
	filepath = request.GET['filepath']
	fileupload.delete_key(filepath)
	return JsonResponse({'filepath': filepath})