var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
	module.AddStageView = Marionette.LayoutView.extend({
		template: "#template-AddStageView",
		regions: {
			"addRegion": "#AddStageRegion",
		},
		ui: {
			"add_button": "#add_stage_button"
		},

		events: {
			"click @ui.add_button": "add_stage_function"
		},


		add_stage_function: function(){
			var name = $("#stage_name").val();
			var stage = new Stage({"name": name});
			stage.save(null, {
				success: function(){
					$("#addStageMessage").html($('<strong>', {
							text: "Successfully created a " + stage.get("name") + " stage."
						}));

					// add it to the display
					var div_id = "stage_" + stage.id;
					var num_applicants = stage.get("candidates").length;
					$("#allStagesWrapper").append($('<div>', {
						class: "stage_div",
						id: div_id
					}));
					$("#"+div_id).append($('<strong>', {
						text: stage.get("name")
					}));
					$("#"+div_id).append(" -- "+num_applicants+" applicants");
				},
				error: function(){
					$("#addStageMessage").html($('<strong>', {
							text: "Encountered an error in stage creation"
						}));
				}
			});
		},

		initialize: function() {
			this.bindUIElements();

		},
		onRender: function(){
			var allStages = new Stages();
			allStages.fetch({
				success: function() {
					allStages.each( function(stage) {
						var div_id = "stage_" + stage.id;
						var num_applicants = stage.get("candidates").length;
						$("#allStagesWrapper").append($('<div>', {
							class: "stage_div",
							id: div_id
						}));
						$("#"+div_id).append($('<strong>', {
							text: stage.get("name")
						}));
						$("#"+div_id).append(" -- "+num_applicants+" applicants");
						
					});
				},
			});
		},
	});
});