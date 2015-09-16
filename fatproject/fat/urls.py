from django.conf.urls import include, url

from . import views

urlpatterns = [
	url(r'^$', views.login_page, name='login_page'),
	url(r'^main', views.main, name='main'),
	url(r'^login_view', views.login_view, name='login_view'),
	url(r'^logout_view', views.logout_view, name='logout'),
	url(r'^upload', views.upload_file, name='upload'),
	url(r'^download', views.download_file, name='download'),
	url(r'^remove', views.remove_file, name='remove'),
]