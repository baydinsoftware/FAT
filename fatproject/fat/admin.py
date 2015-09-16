from django.contrib import admin

# Register your models here.

from .models import Position, Stage, Candidate, Feedback

admin.site.register(Position)
admin.site.register(Stage)
admin.site.register(Candidate)
admin.site.register(Feedback)