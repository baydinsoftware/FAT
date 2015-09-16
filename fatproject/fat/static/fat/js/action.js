var FatApp = FatApp || new Backbone.Marionette.Application();

var Action = Backbone.Model.extend({
	defaults: {
		"name": "no name",

	},
    urlRoot: '/actions/',
    defaults: {
        type: 'action'
    },	
});

var Actions = Backbone.Collection.extend({
    model: Action,
    comparator: "name",
    url: '/actions/',
    filterByAttr: function(type, params){
        var filtered = new Actions();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    }

});

var ActionItemView = Marionette.ItemView.extend({
	template: "#template-ActionItemView",
    tagname: "tr",
});

var ActionsView = Marionette.CollectionView.extend({
	childView: ActionItemView,
});