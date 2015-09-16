"use strict";
var FatApp = FatApp || new Backbone.Marionette.Application();

var FeedbackItemDisplayView = Marionette.LayoutView.extend({
    model: Feedback,
    template: "#template-FeedbackItemDisplayView",

    regions: {
        "displayAnswerItemsRegion": "#DisplayAnswerItemsRegion"
    },
    ui: {
        "secret": "#Secret",
        "ratingSelect": "#rating select",
        "rating": "#rating",
        "ratingRequired": "#rating .required",
        "editFeedback": "#EditFeedback",
        "doneEditingFeedback": "#DoneEditingFeedback",
        "displayRating": "#displayRating",
        "editableRating": "#editableRating",
        "editableSecret": ".editableSecret",
        "deleteFeedback": "#DeleteFeedback",
        "displayNotes": "#displayNotes",
        "editableNotes": "#editableNotes",
        "editNotes": ".edit_notes"
    },
    events: {
        "click @ui.editableSecret": "toggleSecret",
        "change @ui.ratingSelect": "editRating",
        "click @ui.editFeedback": "feedbackEditable",
        "click @ui.doneEditingFeedback": "toggleFeedbackDisplay",
        "click @ui.deleteFeedback": "deleteFeedback",
        "change @ui.editNotes": "editNotes",
    },
    canEdit: false,
    answerCollection: null,
    initialize: function(options){
        this.bindUIElements();
        if (this.model.get("author") == currentUser.get("id")){
        	this.canEdit = true;
        }
    },
    editNotes: function(e){
        var notes = e.target.value;
        this.model.set("notes", notes);
        this.model.save();
        console.log("notes changed")
    },
    deleteFeedback: function(){
        this.model.destroy();
    },
    toggleFeedbackDisplay: function(){
        console.log("doneEditing")
        var valid = true;
        this.answerCollection.each(function(answer){
            if (answer.get("isMissing")){
                valid = false;
            }
        })
        if (valid == true){
            this.render();
        }
        else{
            console.log("required question missing, answers to questions not saved properly")
        }
    },
    feedbackEditable: function(){
		var displayAnswerItemsView = new DisplayAnswerItemsView({
        	collection: this.answerCollection, 
        	childView: EditAnswerItemView,
        });
        this.displayAnswerItemsRegion.show(displayAnswerItemsView)
        this.ui.deleteFeedback.toggle();
        this.ui.doneEditingFeedback.toggle();
        this.ui.editFeedback.toggle();
        this.ui.displayRating.toggle();
        this.ui.editableRating.toggle();
        this.ui.editableNotes.toggle();
        this.ui.displayNotes.toggle();
        this.ui.secret.toggleClass("editableSecret");
        this.bindUIElements;
    },
    editRating: function(){
  		var rating = null;
        var ratingSelected = this.ui.ratingSelect.val();
        if (ratingSelected != ""){
            rating = ratingSelected;
        }
        this.model.set('rating', rating);
        this.model.save()
    },
    displayAnswers: function(){
        var self = this;
        if (this.answerCollection == null){
            var answerArray = this.model.get("answers");
            this.answerCollection = new Answers(answerArray);
        }   
        var displayAnswerItemsView = new DisplayAnswerItemsView({
        	collection: this.answerCollection, 
        	childView: DisplayAnswerItemView,
        });
        this.displayAnswerItemsRegion.show(displayAnswerItemsView);
    },
    onRender:function(){
	    var rating_type = this.model.get("rating_type");
	        if (rating_type != "No Rating"){
	         this.ui.rating.toggle();
	            if (rating_type == "Rating Required"){
	                this.ui.ratingRequired.toggle();
	            }
	            else{
	                this.ui.ratingSelect.prepend($("<option>",{
	                    value: "",
	                    text: "None"
	                }))
	            }
	            this.ui.ratingSelect.val(this.model.get('rating'))
	        }
	    if (this.canEdit == true){
	    	this.ui.editFeedback.toggle();
            this.ui.deleteFeedback.toggle();
	    }
        this.displayAnswers();
    },
    toggleSecret: function(e){
        if ($(e.target).text() == "true"){
            $(e.target).text("false");
        }
        else{
            $(e.target).text("true");
        }
        this.model.set('secret', (!this.model.get('secret')));
        this.model.save();
    },
});

var FeedbackCollectionView = Marionette.CollectionView.extend({
    childView: FeedbackItemDisplayView,
    initialize: function(){
    }
});


var TimelineCollection = Backbone.Collection.extend({
    comparator: function(a, b) {
      var a = new Date(a.get('date_updated')).getTime();
      var b = new Date(b.get('date_updated')).getTime();
      if (a == b) return 0;
      return (a < b) ? 1 : -1;
    },
    model: function(attr,options){
        switch(attr.type){
            case 'feedback':
                console.log('feedback')
                return new Feedback(attr,options);
            case 'action':
                console.log('action')
                return new Action(attr,options);
        }
    }
})


var TimelineView = Marionette.CollectionView.extend({
    getChildView: function(child){
        if(child instanceof Feedback){ 
            console.log("feedback")
            return FeedbackItemDisplayView; 
        }
        return ActionItemView;
    },
})
