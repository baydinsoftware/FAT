var FatApp = FatApp || new Backbone.Marionette.Application();

// StageView exists under the candidates tab
var StageView = Marionette.ItemView.extend({
    model: Stage,
    template: "#template-StageView",
    tagName: "ul",
    className: "list-group"
});

var StagesView = Marionette.CollectionView.extend({
    childView: StageView,
});

// StageListView exists under the stage tab
var StageListView = Marionette.ItemView.extend({
    model: Stage,
    template: "#template-StageItemView",
    ui:{
        "stageRemoveButton": "#stageRemoveButton",
    },
    events:{
        "click @ui.stageRemoveButton": "onRemoveStageClicked",
    },
    
    // Preferrably these would be html messages rather than alerts, but where are we going to put that message given that
    // we are in the item view right now? How do we move this function to the layout view so that we have the ability to 
    onRemoveStageClicked: function() {
        if(this.model.get('candidates').length != 0) {
            alert("You're trying to delete a stage that still has candidates in it! \n\nPlease remove or shift all of the candidates before deleting it.");
        } else if(this.model.get('id') == 10) { 
            alert("you cannot delete the hired stage. Hiring candidates is literally the point of FAT. \n\nStep it up bucko")
        } else {
            this.model.destroy();
        }
    },
    tagName: "tr",
});

var StagesListView = Marionette.CollectionView.extend({
    childView: StageListView,
    tagName: "table",
    className: "table table-hover",
});

var CandidateView = Marionette.ItemView.extend({
    model: Candidate,
	template: '#template-CandidateItemView',
    onShow:function(){

    },
    onRender: function(e){
        this.$el.attr('data-id', this.model.get('id'))
        if (this.model.get("waiting")){
            this.$el.toggleClass('waitingGrayedOut');
        };
    },
    tagName: "tr",
    className: "candidateItemView"
});

var CandidateStageView = Marionette.CompositeView.extend({
    template: "#template-CandidateStageView",
    model: Stage,
    childView: CandidateView,
    initialize: function(){
        this.collection = this.model.get('candidates');
    },
    tagName: "table",
    className: "table table-hover",
});

var CandidatesView = Marionette.CollectionView.extend({
	childView: CandidateStageView,
});

var CandidatePositionView = Marionette.ItemView.extend({
    model: Candidate,
    template: '#template-CandidatePositionView',
    onShow:function(){
    },
    onRender: function(e){
        this.$el.attr('data-id', this.model.get('id'))
        if (this.model.get("waiting")){
            this.$el.toggleClass('waitingGrayedOut');
        };
    },
    tagName: "tr",
    className: "candidatePositionView"
});
