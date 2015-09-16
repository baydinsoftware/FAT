var FatApp = FatApp || new Backbone.Marionette.Application();

var CurrentUser = Backbone.Model.extend({
	defaults: {
		"username": "",
		"id": '',
	},
});


var CurrentUserView = Marionette.ItemView.extend({
	//template: ???
});