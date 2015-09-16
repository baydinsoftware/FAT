"use strict";
var FatApp = FatApp || new Backbone.Marionette.Application();

var FeedbackFormLayoutView = Marionette.LayoutView.extend({
	template: "#template-FeedbackFormLayoutView",
	regions: {
        "improperViewRegion": "#FeedbackFormImproperView",
        "contentRegion": "#FeedbackFormContentRegion",
        "navRegion": "#FeedbackFormNavRegion",
        "editRegion": "#FeedbackFormEditRegion",
    },
    ui: {
    	"createFeedbackForm": "#createFeedbackForm",
        "feedbackFormItem": "#FeedbackFormNavRegion button",
        "cancelAdd": "#CancelNewForm"
    },
    events: {
    	"click @ui.createFeedbackForm": "showAddFeedbackFormView",
        "click @ui.feedbackFormItem": "feedbackFormItemDisplay",
        "click @ui.cancelAdd": "cancelAddForm",
    },
    showAddFeedbackFormView: function(){
		var addFeedbackFormView = new AddFeedbackFormView();
        console.log(addFeedbackFormView.ui);
		this.contentRegion.show(addFeedbackFormView);
        // show cancel button
        $("#CancelAddFeedbackForm").toggle();
        this.ui.cancelAdd.toggle();
    },
    cancelAddForm: function(){
        this.render();
    },
    feedbackFormItemDisplay: function(e){
        var formId = $(e.target).attr("data-id");
        var self = this;
        var currentForm = new FeedbackForm({id : formId});
        currentForm.fetch({
            success: function(){
                var currentFormDisplay = new FeedbackFormEditView({model: currentForm})
                console.log(currentFormDisplay.ui);
                self.editRegion.show(currentFormDisplay);
            }
        })
    },
    onRender: function(){
        if(currentUser.get('is_staff') == "False") {
            var improperPermissionsView = new ImproperPermissionsView();
            this.improperViewRegion.show(improperPermissionsView);
        } else {
        	var self = this;
        	var allforms = new FeedbackForms();
        	allforms.fetch({
        		success: function(){
                    var activeForms = allforms.filterByAttr('active', true);
        			var feedbackFormNavView = new FeedbackFormNavView({collection: activeForms});
        			self.navRegion.show(feedbackFormNavView);
                    var firstFormDisplay = new FeedbackFormEditView({model: allforms.first()});
                    self.editRegion.show(firstFormDisplay);
        		}
        	});
        }
    }
});

var FeedbackFormEditView = AddFeedbackFormView.extend({
	model: FeedbackForm,
    ui: {
        "heading": ".heading",
        "feedbackFormItem": "#FeedbackFormNavRegion button",
    },
    events:{
        "click @ui.addFeedbackForm": "existingFeedback",
        "click @ui.secretByDefault": "toggleSecretByDefault",
        "click @ui.addQuestion": "addFormQuestion",
        "click @ui.cancelAdd": "destroy",
    },
    oldQuestions: null,
    existingFeedback: function(){
        var self = this;
        var feedback = new FeedbackCollection();
        feedback.fetch({
            success: function(){
                var thisFormFeedback = feedback.filterByAttr('form', self.model.get('id'));
                var numFeedback = thisFormFeedback.length;
                if (numFeedback > 0){
                    self.markOldInactiveCreateNew();
                }
                else{
                    self.editOldForm();
                }
            }
        })
    },
    editOldForm:function(){
        console.log('editing form');
        this.model.set('name', this.ui.formName.val());
        this.model.set('rating_type', this.ui.rating.val());
        this.model.set('secret_by_default', this.ui.secretByDefault.text());
        this.model.save();
        this.oldQuestions.invoke('destroy');
        this.questions.invoke('set', {"form": this.model.get("id")})
        this.questions.invoke('save');
        $("#addFeedbackFormMessage").html(
            $('<strong>', {
                text: "Successfully edited " + this.ui.formName.val() + " form."
            })
        );
    },
    markOldInactiveCreateNew: function(){
        console.log("event override")
        this.model.set("active", false);
        this.model.save();
        this.createFeedbackForm();
    },
    initialize: function(){
        _.extend(this.ui, AddFeedbackFormView.prototype.ui);
        this.bindUIElements();
        this.questions = new Questions();
    },
    onRender: function(){
        this.ui.heading.html("Edit Form");
        this.ui.formName.val(this.model.get('name'));
        this.ui.rating.val(this.model.get('rating_type'));
        this.oldQuestions = new Questions(this.model.get('questions'));
        var questionDisplay = new CreateQuestionsView({collection: this.questions});
        this.questionsRegion.show(questionDisplay);
        if (this.model.get('secret_by_default')){
            this.ui.secretByDefault.text(true)
        }
        // copy questions into new question collection, remove id's?
        this.copyCollection(this.oldQuestions, this.questions);
        console.log(this.questions);
        // check if there is feedback from old form

    },
    copyCollection: function(coll1, coll2){
        var idAttribute = coll1.model.prototype.idAttribute;
        // console.log(coll1.toJSON());
        var data = _.map(coll1.toJSON(), function(obj){ return _.omit(obj, idAttribute); });
        console.log(data);
        coll2.add(data);
    }
})

var FeedbackFormListView = Marionette.LayoutView.extend({
	template: "#template-FeedbackFormListView",
	model: FeedbackForm,
	tagName: "button",
	className: "btn btn-default",
    onRender: function(){
        this.$el.attr('data-id', this.model.get('id'))
    },
})

var FeedbackFormNavView = Marionette.CollectionView.extend({
	className: "btn-group-vertical",
	childView: FeedbackFormListView,
})

var RatingTableItemView = Marionette.ItemView.extend({
    template: "#template-RatingTableItemView",
    model: Feedback,
    tagName: 'td',
})

// collection passed in will be unsecreted feedback for that candidate - based on feedbackform
var RatingTableRowView = Marionette.CompositeView.extend({
    template: "#template-RatingTableRowView",
    model: FeedbackForm,
    initialize: function(options){
        var allFeedback = new FeedbackCollection(this.model.get('feedbacks'));
        var thisCandidateFeedback = allFeedback.filterByAttr('candidate', options.candidateId);
        this.collection = thisCandidateFeedback.filterByAttr('secret', false);
        var average = this.collection.ratingSum()/this.collection.length;
        this.model.set('average', average); 
    },
    onShow: function(){
        if (this.collection.length == 0){
            this.destroy();
        }
        console.log(this.model.get('average'));
    },
    childView: RatingTableItemView,
    tagName: 'tr',
})

// collection passeed in will be active feedback forms
var RatingTableCollectionView = Marionette.CollectionView.extend({
    childView: RatingTableRowView,
    tagName: 'table',
    className: 'table table-hover',
    initialize: function(options){
        this.candidateId = options.candidateId;
        this.collection = this.collection.filterTwoAttr('rating_type', 'Rating Required', 'rating_type', 'Rating Optional');
    },
    childViewOptions: function(){
        return ({candidateId: this.candidateId})
    },
})