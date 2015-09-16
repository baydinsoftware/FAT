var FatApp = FatApp || new Backbone.Marionette.Application();

var Candidate = Backbone.Model.extend({
	defaults: {
		"name": "no name",
		"status": "waiting",
		"email": "",
		"stage": "",
	},
    urlRoot: '/candidates/'	
});

var Stage = Backbone.Model.extend({
    defaults: {
        "name": "new stage",
        "candidates": [],
    },
    urlRoot: '/stages/'
});

var Candidates = Backbone.Collection.extend({
    model: Candidate,
    comparator: "date_added",

    compareISOs: function(aISO, bISO) {
      var a = new Date(aISO).getTime();
      var b = new Date(bISO).getTime();
      if (a == b) return 0;
      return (a < b) ? 1 : -1;
    },
    // descending
    comparator: function(a, b) {
      var result;
      if (a.get("waiting")) {
        if (b.get("waiting")) {
          result = this.compareISOs(a.get("date_added"), b.get("date_added")); 
        } else {
          // a comes first
          result = 1;
        }
      } else if (b.get("waiting")) {
        // b comes first
        result = -1;
      } else {
        result = this.compareISOs(a.get("date_added"), b.get("date_added"));
      }
      return result;
    },
    url: '/candidates/',
    
    initialize: function (models) {

    },
    filterByAttr: function(type, params){
        var filtered = new Candidates();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    }
});

var Stages = Backbone.Collection.extend({
    model: Stage,
    url: '/stages',
});

var FeedbackForm = Backbone.Model.extend({
    defaults: {
        "rating": 'required',
        "questions": []
    },
    urlRoot: '/feedbackforms/' 
});

var FeedbackForms = Backbone.Collection.extend({
    model: FeedbackForm,
    url: '/feedbackforms',
    filterByAttr: function(type, params){
        var filtered = new FeedbackForms();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    },
    filterTwoAttr: function(attr1, param1, attr2, param2){
        var filtered = new FeedbackForms();
        var filteredColl = this.filter(function(item){
            return (item.get(attr1) == param1 || item.get(attr2) == param2);
        });
        filtered.reset(filteredColl);
        return filtered;
    },
});

var Question = Backbone.Model.extend({
    defaults: {
        "required": false,
        "question_text": ""
    },

    urlRoot: '/questions/',
  
});

var Questions = Backbone.Collection.extend({
    model: Question,
    
    url: '/questions/',
});


var Answer = Backbone.Model.extend({
    defaults: {
        "text": "",
        "extraAttribute": "hi",
        "isMissing": false
    },
    urlRoot: '/answers/',
  
});

var Answers = Backbone.Collection.extend({
    model: Answer,
    url: '/answers/',
});

var Feedback = Backbone.Model.extend({
    urlRoot: '/feedback/',
    defaults: {
        type: 'feedback'
    },
});

var FeedbackCollection = Backbone.Collection.extend({
    model: Feedback,
    url: '/feedback/',
    comparator: function(a, b) {
      var a = new Date(a.get('date_updated')).getTime();
      var b = new Date(b.get('date_updated')).getTime();
      if (a == b) return 0;
      return (a < b) ? 1 : -1;
    },
    filterTwoAttr: function(attr1, param1, attr2, param2){
        var filtered = new FeedbackCollection();
        var filteredColl = this.filter(function(item){
            return (item.get(attr1) == param1 || item.get(attr2) == param2);
        });
        filtered.reset(filteredColl);
        return filtered;
    },
    filterByAttr: function(type, params){
        var filtered = new FeedbackCollection();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    },
    ratingSum: function(){
        return this.reduce(function(memo, value) { return memo + value.get("rating")}, 0);
    }
});