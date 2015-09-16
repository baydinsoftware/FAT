"use strict";
var FatApp = FatApp || new Backbone.Marionette.Application();


var CreateQuestionView = Marionette.ItemView.extend({
    template: "#template-CreateQuestionView",
	model: Question,
    ui: {
        "delete": ".delete",
        "question_text": ".question_text",
        "required": ".required"
    },
    events: {
        "click @ui.delete": "removing",
        "change @ui.question_text": "setQuestionText",
        "click @ui.required": "toggleQuestionRequired",
    },
    modelEvents:{
    },
	initialize: function(){
        this.bindUIElements();
    },
    removing: function(){
        this.model.destroy();
    },
    setQuestionText: function(e){
        var question_text = e.target.value;
        console.log(question_text)
        this.model.set("question_text", question_text);
    },
    onShow: function(){
        if (this.model.get('required')){
            this.ui.required.attr('checked', true);
        }
    },
    toggleQuestionRequired: function(e){
        var required = $(e.target).is(":checked");
        this.model.set("required", required);
    }
});

var CreateQuestionsView = Marionette.CollectionView.extend({
	childView: CreateQuestionView,
	initialize: function(){
  	}, 
});

var DisplayQuestionView = Marionette.ItemView.extend({
    template: "#template-DisplayQuestionView",
    model: Question,
    initialize: function(){

    },
    editAnswer: function(){
    }
});

var DisplayQuestionsView = Marionette.CollectionView.extend({
    childView: DisplayQuestionView, 
});


var DisplayAnswerBoxView = Marionette.ItemView.extend({
    template: "#template-DisplayAnswerBoxView",
    model: Answer,
    ui: {
        "answer_text": ".answer_text",
        "question_required": "span"
    },
    events:{
        "change @ui.answer_text": "editAnswer",
    },
    modelEvents:{
        "change:isMissing": "highlightRed",
    },
    highlightRed: function(){
        this.ui.answer_text.toggleClass('requiredField')
    },
    initialize: function(){
        this.bindUIElements();
    },
    editAnswer: function(e){
        // on answers updated, set answers
        var answer_text = e.target.value;
        this.model.set("text", answer_text);
        if (answer_text != ""){
            console.log(answer_text)
            this.model.set("isMissing", false);
            this.ui.answer_text.toggleClass('requiredField',false)
        }
    },
    onShow: function(){
        console.log(this.model.get("question_required"))
        if (this.model.get("question_required")){
            this.ui.question_required.toggle();
        }
    }
});

var DisplayAnswerBoxesView = Marionette.CollectionView.extend({
    childView: DisplayAnswerBoxView, 
});

var DisplayAnswerItemView = Marionette.ItemView.extend({
    model: Answer,
    template: "#template-DisplayAnswerItemView",
    ui: {
    },
    events: {
        // "input @ui.editing": "saveAnswerText", 
    },
    saveAnswerText: function(e){
        // var value = e.target.innerText
        // console.log(this.model)
        // this.model.set('text', value);
        // this.model.save();
    },
})

var EditAnswerItemView = Marionette.ItemView.extend({
    model: Answer,
    template: "#template-EditAnswerItemView",
    ui: {
        "saveAnswer": "#saveAnswer",
        "answer_text": "textarea",
        "question_required": ".required"
    },
    events: {
        "change @ui.answer_text": "editAnswer",
    },
    modelEvents:{
        "change:isMissing": "highlightRed",
    },
    highlightRed: function(){
        this.ui.answer_text.toggleClass('requiredField')
    },

    editAnswer: function(e){
        // on answers updated, set answers
        var answer_text = e.target.value;
        if (this.model.get("question_required") && answer_text == ""){
            this.model.set("isMissing", true)
        }
        else{
            this.model.set('text', answer_text);
            this.model.set("isMissing", false);
            this.model.save();
        }
    },
    onShow: function(){
        if (this.model.get("question_required")){
            this.ui.question_required.toggle();
        }
    }
})


var DisplayAnswerItemsView = Marionette.CollectionView.extend({
    // childView: DisplayAnswerItemView,
})