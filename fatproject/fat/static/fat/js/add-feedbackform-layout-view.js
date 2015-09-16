var FatApp = FatApp || new Backbone.Marionette.Application();

var AddFeedbackFormView = Marionette.LayoutView.extend({
    template: '#template-AddFeedbackFormView',
    tagname: 'div',
    regions: {
        "questionsRegion": "#QuestionsRegion"
    },
    ui: {
       	"addFeedbackForm": "#AddFeedbackForm",
        "cancelAdd": "#CancelAddFeedbackForm",
       	"secretByDefault": "#SecretByDefault",
       	"addQuestion": "#AddQuestion",
        "rating": ".RatingTypeSelectRegion select",
        "formName": "#form_name",
    },
    events: {
    	"click @ui.addFeedbackForm": "createFeedbackForm",
    	"click @ui.secretByDefault": "toggleSecretByDefault",
    	"click @ui.addQuestion": "addFormQuestion",
        "click @ui.cancelAdd": "destroy",
    },
    // USE UI !!!!!
    // modelEvents: {
    // }, 
    questions: null,
    initialize: function(options){
        this.bindUIElements();
        this.questions = new Questions();
        console.log("initializing");
        // console.log(this.ui)
    },
    addFormQuestion: function(){
        var new_question = new Question();
        console.log("question added")
        this.questions.add(new_question);
        // this.questions.create will post to backend
    },
    createFeedbackForm: function(){
        console.log("Creating FeedbackForm")
    	var self = this;
    	var form_name = this.ui.formName.val();
    	var rating_type = this.ui.rating.val();
    	var secret_by_default = this.ui.secretByDefault.text();
    	var new_form = new FeedbackForm({
    		"name": form_name,
    		"rating_type": rating_type,
    		"secret_by_default": secret_by_default,
    	})
    	new_form.save(null, {
    		success: function(){
                self.questions.invoke('set', {"form": new_form.get("id")})
                self.questions.invoke('save')
				$("#addFeedbackFormMessage").html(
                    $('<strong>', {
                        text: "Successfully created a " + form_name + " form."
                    })
                );
    		}
    	})
    },
    toggleSecretByDefault: function(e){
        if ($(e.target).text() == 'true'){
            $(e.target).text('false')
        }
        else{
            $(e.target).text('true')
        }
    },
    
    onShow:function(){
        var questionDisplay = new CreateQuestionsView({collection: this.questions})
        this.questionsRegion.show(questionDisplay)
    },
})
