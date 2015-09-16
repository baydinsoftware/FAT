var FatApp = FatApp || new Backbone.Marionette.Application();

var WhiteListItem = Backbone.Model.extend({
	defaults: {
		"name": "no name",

	},
    urlRoot: '/whitelistitems/'	
});

var WhiteListItems = Backbone.Collection.extend({
    model: WhiteListItem,
    comparator: "item",
    url: '/whitelistitems/',
});

var WhiteListView = Marionette.ItemView.extend({
	model: WhiteListItem,
	template: "#template-WhiteListItem",
	ui: {
		"delete": "#WLdelete"
	},
	events: {
		"click @ui.delete": "deleteItem",
	},
	deleteItem: function() {
		this.model.destroy();
	}
});

var WhiteListsView = Marionette.CollectionView.extend({
	childView: WhiteListView,
});

var ImproperPermissionsView = Marionette.ItemView.extend({
	template: "#template-ImproperPermissionsView",
	ui: {
		"returnHomeButton": "#improperPermissionsReturnHome"
	},
	events: {
		"click @ui.returnHomeButton": "goBackHome"
	},
	goBackHome: function(){
		FatApp.appRouter.navigate("", {trigger: true});
	},
})