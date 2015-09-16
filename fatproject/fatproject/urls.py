"""fatproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
	1. Add an import:  from blog import urls as blog_urls
	2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.models import User
from fat.models import Candidate, Stage, Position, Source, FeedbackForm, Question, Department, Feedback, Answer, File, Action, UserProfile, WhiteListItem
from rest_framework import routers, serializers, viewsets

class NameRelatedField(serializers.RelatedField):
	def to_representation(self, value):
		return value.name

class DisplayNameRelatedField(serializers.RelatedField):
	def to_representation(self, value):
		return value.userprofile.display_name

class QuestionTextRelatedField(serializers.RelatedField):
	def to_representation(self, value):
		return value.question_text

class QuestionRequiredRelatedField(serializers.RelatedField):
	def to_representation(self, value):
		return value.required

class ImgSrcRelatedField(serializers.RelatedField):
	def to_representation(self, value):
		return value.userprofile.picture_url

# Serializers define the API representation.
class FileSerializer(serializers.ModelSerializer):
	class Meta:
		model = File
		fields = ('name', 'filepath', 'candidate', 'id')

class ActionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Action
		fields = ('candidate', 'description', 'user_picture', 'date_updated')

class AnswerSerializer(serializers.ModelSerializer):
	question_required = QuestionRequiredRelatedField(source = "question", read_only = True)
	question_text = QuestionTextRelatedField(source = "question", read_only = True)
	class Meta: 
		model = Answer
		fields = ('question', 'text', 'feedback', 'question_text', 'question_required', 'id')

class FeedbackSerializer(serializers.ModelSerializer):
	picture_url = ImgSrcRelatedField(source = "author", read_only = True)
	answers = AnswerSerializer(many = True, read_only = True)
	author_name = DisplayNameRelatedField(source = "author", read_only = True)
	class Meta:
		model = Feedback
		fields = ('rating', 'secret', 'date_updated', 'form', 'author', 'candidate', 'stage', 'id', 'answers', 'author_name', 'notes', 'picture_url')

class CandidateSerializer(serializers.ModelSerializer): 
	owner_name = DisplayNameRelatedField(source = 'owner', read_only = True)
	position_name = NameRelatedField(source = 'position', read_only = True)
	stage_name = NameRelatedField(source = 'stage', read_only = True)
	files = FileSerializer(many = True, required = False, read_only=True)
	actions = ActionSerializer(many = True, required = False, read_only=True)
	feedbackCollection = FeedbackSerializer(many = True, read_only = True)
	class Meta:
		model = Candidate
		fields = ('url', 'name', 'email', 'date_added', 'stage', 'id', 'waiting', 'position', 'owner', 'archived', 'last_marked_waiting', 'owner_name', 'stage_name', 'position_name', 'files', 'feedbackCollection', 'actions')
		# depth = 2

class StageSerializer(serializers.ModelSerializer):
	candidates = CandidateSerializer(many = True, read_only=True)
	class Meta:
		model = Stage
		fields = ('name', 'candidates', 'id')

class PositionSerializer(serializers.ModelSerializer):
	candidates = CandidateSerializer(many = True, read_only=True)
	department_name = NameRelatedField(source = 'department', read_only = True)
	class Meta:
		model = Position
		fields = ('name', 'candidates', 'archived', 'department', 'department_name', 'id', 'description')

class DepartmentSerializer(serializers.ModelSerializer):
	positions = PositionSerializer(many=True, read_only=True)
	class Meta:
		model = Department
		fields = ('name', 'positions', 'id')

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('user', 'picture_url', 'display_name')

class UserSerializer(serializers.ModelSerializer):
	candidates = CandidateSerializer(many = True, read_only=True)
	userprofile = UserProfileSerializer(read_only=True)
	class Meta:
		model = User
		fields = ('username', 'candidates', 'id', 'password', 'last_login', 'is_superuser', 'userprofile', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', 'groups', 'user_permissions')

class QuestionSerializer(serializers.ModelSerializer): 
	answers = AnswerSerializer(many = True, read_only = True)
	class Meta:
		model = Question
		fields = ('form', 'required', 'question_text', 'id', 'answers')
		# depth = 2

class FormSerializer(serializers.ModelSerializer):
	questions = QuestionSerializer(many = True, read_only = True)
	feedbacks = FeedbackSerializer(many = True, read_only = True)
	print feedbacks
	class Meta:
		model = FeedbackForm
		fields = ('rating_type', 'name', 'secret_by_default', 'questions', 'id', 'active', 'feedbacks')

class WhiteListItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = WhiteListItem
		fields = ('item', 'id')

# ViewSets define the view behavior.
class CandidateViewSet(viewsets.ModelViewSet):
	queryset = Candidate.objects.all()
	serializer_class = CandidateSerializer

class StageViewSet(viewsets.ModelViewSet):
	queryset = Stage.objects.all()
	serializer_class = StageSerializer

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class PositionViewSet(viewsets.ModelViewSet):
	queryset = Position.objects.all()
	serializer_class = PositionSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
	queryset = Department.objects.all()
	serializer_class = DepartmentSerializer

class FormsViewSet(viewsets.ModelViewSet):
	queryset = FeedbackForm.objects.all()
	serializer_class = FormSerializer

class QuestionsViewSet(viewsets.ModelViewSet):
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

class FilesViewSet(viewsets.ModelViewSet):
	queryset = File.objects.all()
	serializer_class = FileSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
	queryset = Feedback.objects.all()
	serializer_class = FeedbackSerializer

class AnswersViewSet(viewsets.ModelViewSet):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer

class ActionsViewSet(viewsets.ModelViewSet):
	queryset = Action.objects.all()
	serializer_class = ActionSerializer

class WhiteListItemViewSet(viewsets.ModelViewSet):
	queryset = WhiteListItem.objects.all()
	serializer_class = WhiteListItemSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'candidates', CandidateViewSet)
router.register(r'stages', StageViewSet)
router.register(r'users', UserViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'feedbackforms', FormsViewSet)
router.register(r'questions', QuestionsViewSet)
router.register(r'files', FilesViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'answers', AnswersViewSet)
router.register(r'actions', ActionsViewSet)
router.register(r'whitelistitems', WhiteListItemViewSet)

urlpatterns = [
	url(r'^fat/', include('fat.urls')),
	url(r'^admin/', include(admin.site.urls)),
	url(r'^', include(router.urls)),
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]