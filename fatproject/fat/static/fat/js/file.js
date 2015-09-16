var FatApp = FatApp || new Backbone.Marionette.Application();

var File = Backbone.Model.extend({
	defaults: {
		"name": "no name",

	},
    urlRoot: '/files/'	
});

var Files = Backbone.Collection.extend({
    model: File,
    comparator: "name",
    url: '/files/',
});

var FileView = Marionette.ItemView.extend({
	model: File,
	template: "#template-FileItemView",
	ui: {
		"downloadFileButton": "#downloadButton",
		"removeFileButton": "#removeButton",
	},
	events: {
		"click @ui.downloadFileButton": "downloadFile",
		"click @ui.removeFileButton": "removeFile",
	},
	downloadFile: function() {
		var name = this.model.get("name");
		var path = this.model.get("filepath");
		window.open("download/?name=" + name + "&filepath=" + path);
	},
	// we need to remove the file from S3 and then destroy the model
	removeFile: function() {
		var path = this.model.get("filepath");
		$.get("remove/", {'filepath': path});
		this.model.destroy();
	}
});

var FilesView = Marionette.CollectionView.extend({
	childView: FileView,
});