var FatApp = FatApp || new Backbone.Marionette.Application();

var Department = Backbone.Model.extend({
	defaults: {
		"name": "no name",
		"positions": [],
	},
    urlRoot: '/departments/'	
});

var Departments = Backbone.Collection.extend({
    model: Department,
    comparator: "name",
    url: '/departments/',
});

var DepartmentView = Marionette.ItemView.extend({
	template: "#template-DepartmentView",
    tagName: "ul",
    className: "list-group"
});

var DepartmentsView = Marionette.CollectionView.extend({
	childView: DepartmentView,
});

var DepartmentCompositeView = Marionette.CompositeView.extend({
	template: "#template-DepartmentCompositeView",
	model: Department,
	initialize: function() {
		this.collection = this.model.get('positions');
	},
	childView: PositionView,
	tagName: "table",
	className: "table table-hover"
});

var DepartmentsCompositeView = Marionette.CollectionView.extend({
	childView: DepartmentCompositeView
});

