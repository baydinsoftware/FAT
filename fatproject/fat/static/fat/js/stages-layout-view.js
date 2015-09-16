var FatApp = FatApp || new Backbone.Marionette.Application();

var StagesLayoutView = Marionette.LayoutView.extend({
	template: "#template-StagesLayoutView",
	regions: {
		"stageLayoutRegion": "#stageLayoutRegion",
		"stageListRegion": "#StageListRegion",
		"addStageRegion": "#addStageRegion",
	},
	ui: {
		"add_button": "#add_stage_button",
		"stage_name": "#stage_name",
		"errorMessage": "#addStageMessage"
	},
	events: {
		"click @ui.add_button": "add_stage_function",
	},
	onRender: function() {
		if(currentUser.get('is_staff') == "False") {
			var improperPermissionsView = new ImproperPermissionsView();
            this.stageLayoutRegion.show(improperPermissionsView);
		} else {
			var self = this;
			var stages = new Stages();
			stages.fetch({
				success: function() {
					var stagesView = new StagesListView({collection: stages});
					self.stageListRegion.show(stagesView);
				}
			});
		}
	},
	add_stage_function: function(){
		var self = this;
		var name = this.ui.stage_name.val();
		var stage = new Stage({"name": name});
		stage.save(null, {
			success: function(){
				self.render();
			},
			error: function(){
				self.ui.errorMessage.html($('<strong>', {
						text: "Encountered an error in stage creation"
				}));
			}
		});
	},
	initialize: function() {
		this.bindUIElements();
	},
});
