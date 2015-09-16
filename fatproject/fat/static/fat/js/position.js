var FatApp = FatApp || new Backbone.Marionette.Application();

var Position = Backbone.Model.extend({
	defaults: {
		"name": "",
		"department": "",
		"description": "",
	},
    urlRoot: '/positions/'	
});

var Positions = Backbone.Collection.extend({
    model: Position,
    comparator: "archived",
    filterByAttr: function(type, params){
        var filtered = new Positions();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    },

    url: '/positions/',
});

var PositionView = Marionette.ItemView.extend({
	model: Position,
	template: '#template-PositionItemView',
	ui:{
		'container': 'tr',
		'toggleActive': '#toggleActive',
	},
	events: {
		'click @ui.toggleActive': 'toggleActiveListing'
	},
	onRender: function(e){
		var active = !(this.model.get('archived'));
		if (active) {
			this.ui.toggleActive.text('Inactivate')
		}
		else{
			this.ui.toggleActive.text('Activate')
		}
	},
	toggleActiveListing: function(){
		var active = !(this.model.get('archived'));
		this.model.set('archived', active);
		this.model.save();
		if (active) {
			this.ui.toggleActive.text('Activate')
		}
		else{
			this.ui.toggleActive.text('Inactivate')
		}
	},
	tagName: "tr",
});

var PositionSidebarItemView = Marionette.ItemView.extend({
	template: "#template-PositionSidebarItemView",
})

var PositionSidebarView = Marionette.CollectionView.extend({
	childView: PositionSidebarItemView,
	tagName: 'ul',
	className: 'list-group'
})

var CandidatesPositionView = Marionette.CompositeView.extend({
    template: "#template-CandidatesPositionView",
    model: Position,
    childView: CandidatePositionView,
    initialize: function(){
        this.collection = new Candidates(this.model.get('candidates'));
    },
    tagName: "table",
    className: "table table-hover"
});

var CandidatesPositionCollectionView = Marionette.CollectionView.extend({
    childView: CandidatesPositionView,
})