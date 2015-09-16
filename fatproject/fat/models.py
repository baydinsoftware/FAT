from django.db import models
from django.contrib.auth.models import User
import datetime
# Create your models here.

class Department(models.Model):
	name = models.CharField(max_length=200, default="misc")
	def __unicode__(self):
		return (self.name)

class Position(models.Model):
	name = models.CharField(max_length = 200, default = "")
	archived = models.BooleanField(default = False)
	department = models.ForeignKey(Department, related_name='positions')
	description = models.TextField(default = "", blank = True);
	def __unicode__(self):
		return (self.name)

class Stage(models.Model):
	name = models.CharField(max_length = 200, default = "", unique = True)
	# maybe make this a function
	# total = models.IntegerField(default = 0)
	def __unicode__(self):
		return (self.name)

class Source(models.Model):
	name = models.CharField(max_length = 200, default = "")
	def __unicode__(self):
		return (self.name)

class Candidate(models.Model):
	name = models.CharField(max_length = 200, default = "")
	date_added = models.DateTimeField('Date Added', auto_now_add=True)
	waiting = models.BooleanField(default= False, blank = True)
	position = models.ForeignKey(Position, related_name = 'candidates')
	owner = models.ForeignKey(User, related_name = 'candidates')
	stage = models.ForeignKey(Stage, related_name = 'candidates')	
	last_marked_waiting = models.DateTimeField('Last Marked Waiting', default = None)
	source = models.ForeignKey(Source, null = True)
	email = models.EmailField(max_length = 250, default = "")
	archived = models.BooleanField(default= False)
	def __unicode__(self):
		return ("Candidate: " + self.name  + "; " +  self.owner.username + 
				": " + self.last_marked_waiting.strftime('%Y-%m-%d %H:%M') + 
				", " + self.stage.name + ", " + str(self.waiting))

class FeedbackForm(models.Model):
	rating_type = models.CharField(default = "", max_length = 200)
	secret_by_default = models.BooleanField(default = False)
	name = models.CharField(max_length = 200, default = "")
	active = models.BooleanField(default = True)
	def __unicode__(self):
		return self.name

class Question(models.Model):
	question_text = models.TextField(default = "")
	form = models.ForeignKey(FeedbackForm, related_name = "questions")
	required = models.BooleanField(default = False)
	def __unicode__(self):
		return self.question_text

# things assocated with stage and candidate
class Feedback(models.Model):
	form = models.ForeignKey(FeedbackForm, related_name = 'feedbacks')
	notes = models.TextField(default = "", blank = True)
	#if rating is 0 that means rating was not required
	rating = models.IntegerField(default = 0, null = True)
	author = models.ForeignKey(User)
	candidate = models.ForeignKey(Candidate, related_name = 'feedbackCollection')
	secret = models.BooleanField(default = False)
	date_updated = models.DateTimeField('date published', default = None, null = True)
	stage = models.ForeignKey(Stage, null = True)
	def __unicode__(self):
		return ("Author: " + self.author.username + ", Candidate: " + 
				self.candidate.name +
				", Secret: " + str(self.secret))

class Answer(models.Model):
	question = models.ForeignKey(Question)
	text = models.TextField(default = "", blank = True)
	feedback = models.ForeignKey(Feedback, related_name = "answers")

class File(models.Model):
	candidate = models.ForeignKey(Candidate, related_name = 'files')
	name = models.CharField(max_length=200, default="untitled")
	filepath = models.CharField(max_length=200, default="/untitled")
	def __unicode__(self):
		return ("Candidate: " + self.candidate.name + ", " + self.name)

class Action(models.Model):
	candidate = models.ForeignKey(Candidate, related_name = 'actions')
	description = models.CharField(default='empty', max_length=400)
	user_picture = models.CharField(default='', max_length=400)
	date_updated = models.DateTimeField('Date Added', auto_now_add=True)
	def __unicode__(self):
		return ("Candidate: " +
			self.candidate.name + ", " + self.description + 
			", added on " + self.date_updated.strftime('%Y-%m-%d %H:%M'))

class UserProfile(models.Model):
	user = models.OneToOneField(User, related_name = "userprofile")
	picture_url = models.CharField(default="", max_length=400)
	display_name = models.CharField(default="", max_length=50)
	def __unicode__(self):
		return (self.user.username + '-- picture url: ' + self.picture_url)

class WhiteListItem(models.Model):
	item = models.CharField(default="", max_length=200)
	def __unicode__(self):
		return ("Item: " + self.item)
