"use strict";
var FatApp = FatApp || new Backbone.Marionette.Application();

var FeedbackFormDetailView = Marionette.LayoutView.extend({
    template: "#template-FeedbackFormDetailView",
    tagname: "div",
    regions: {
        "displayAnswerBoxesRegion": "#DisplayQuestionsRegion"
    },
    ui: {
        "addFeedback": "#AddFeedback",
        "cancelFeedback": "#CancelFeedback",
        "secret": "#Secret",
        "ratingSelect": "#rating select",
        "rating": "#rating",
        "ratingRequired": "#rating .required",
        "notes": ".edit_notes"
    },
    events: {
        "click @ui.addFeedback": "saveFeedback",
        "click @ui.secret": "toggleSecret",
        "click @ui.cancelFeedback": "destroy",
    },
    // modelEvents: {
    // },
    candidate: null,
    answerCollection: null,
    initialize: function(options){
        this.bindUIElements();
        // console.log(options.candidate);
        this.candidate = options.candidate;
    },
    saveFeedback: function(){
        var self = this;
        var form_id = this.model.get("id");
        var secret = this.ui.secret.text();
        var author = currentUser.get("id");
        var candidate = this.candidate.get("id");
        var stage = this.candidate.get("stage");
        var notes = this.ui.notes.val();
        var rating_type = this.model.get("rating_type");
        var rating = null;
        var ratingSelected = this.ui.ratingSelect.val();
        if (rating_type != "No Rating" && ratingSelected != ""){
            rating = ratingSelected;
        }
        var feedback = new Feedback({
            "form": form_id,
            "secret": secret,
            "author": author,
            "candidate": candidate,
            "stage": stage,
            "rating": rating,
            "date_updated": (new Date()).toISOString(),
            "notes": notes,
        })

        //iterate through answer feedback - set isMissing for questions that are required and is blank
        if (this.validate()){
            console.log("validated")
            feedback.save(null,{
                success: function(){
                    self.answerCollection.invoke('set', {"feedback": feedback.get("id")});
                    self.answerCollection.invoke('save');
                    // setTimeout(self.timeoutFunction, 10000)
                    self.destroy();
                }
            }); 
        }
        else{
            console.log("Fill out required fields")
        }
    },
    timeoutFunction: function(){
        // console.log("10secondslater")
    },
    toggleSecret: function(e){
        if ($(e.target).text() == "true"){
            $(e.target).text("false");
        }
        else{
            $(e.target).text("true");
        }
    },
    displayQuestions: function(){
        var self = this;
        var questionArray = this.model.get("questions");
        this.answerCollection = new Answers();
        questionArray.forEach(function(question){
            self.answerCollection.add(new Answer({
                "question": question.id, 
                "question_text": question.question_text,
                "question_required": question.required,
            }));
        });
        var displayAnswerBoxesView = new DisplayAnswerBoxesView({collection: this.answerCollection});
        this.displayAnswerBoxesRegion.show(displayAnswerBoxesView);

    },
    onShow:function(){
    	var rating_type = this.model.get("rating_type");
 		if (rating_type != "No Rating"){
    		this.ui.rating.toggle();
            if (rating_type == "Rating Required"){
                console.log("hi");
                this.ui.ratingRequired.toggle();
            }
            else{
                console.log(this.ui.ratingSelect)
                this.ui.ratingSelect.prepend($("<option>",{
                    value: "",
                    text: "None",
                    selected: true,
                }))
            }
 		}
 		this.displayQuestions();
        // store feedback id and save when save is clicked for each answer? make answers an attribute, 
    },
    validate: function(){
        var valid = true;
        this.answerCollection.each(function(answer){
            console.log(answer.get("question_required"), answer.get("text"))
            if (answer.get("question_required") && answer.get("text") == ""){
                console.log('hello???')
                answer.set("isMissing", true)
                valid = false;
            }
        })
        return valid;
    }
});