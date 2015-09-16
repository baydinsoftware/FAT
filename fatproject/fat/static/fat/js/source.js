var FatApp = FatApp || new Backbone.Marionette.Application();

var Source = Backbone.Model.extend({
	defaults: {
		"name": "no name",

	},
    urlRoot: '/sources/'	
});

var Sources = Backbone.Collection.extend({
    model: Source,
    comparator: "name",
    url: '/sources/',
});

var SourceView = Marionette.ItemView.extend({
	//template: ???
});

var SourcesView = Marionette.CollectionView.extend({
	childView: SourceView,
});