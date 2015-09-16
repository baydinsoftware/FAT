var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
	module.AddPositionView = Marionette.LayoutView.extend({
		template: "#template-AddPositionView",
		regions: {
			"addRegion": "#AddPositionRegion",
		},
		ui: {
			"add_button": "#add_position_button"
		},

		events: {
			"click @ui.add_button": "add_position_function"
		},


		add_position_function: function(){
			var name = $("#position_name").val();
			var position = new Position({"name": name});
			position.save(null, {
				success: function(){
					$("#addPositionMessage").html($('<strong>', {
							text: "Successfully created a " + position.get("name") + " position."
						}));

					// add our newly minted position to the display
					var div_id = "position_" + position.id;
					var num_applicants = position.get("candidates").length;
					$("#allPositionsWrapper").append($('<div>', {
						class: "position_div",
						id: div_id
					}));
					$("#"+div_id).append($('<strong>', {
						text: position.get("name")
					}));
					$("#"+div_id).append(" -- "+num_applicants+" applicants");

				},
				error: function(){
					$("#addPositionMessage").html($('<strong>', {
							text: "Encountered an error in position creation"
						}));
				}
			});
		},

		initialize: function() {
			this.bindUIElements();


		},
		onRender: function() {
			var allPositions = new Positions();
			allPositions.fetch({
				success: function() {
					allPositions.each( function(position) {
						var div_id = "position_" + position.id;
						var num_applicants = position.get("candidates").length;
						$("#allPositionsWrapper").append($('<div>', {
							class: "position_div",
							id: div_id
						}));
						$("#"+div_id).append($('<strong>', {
							text: position.get("name")
						}));
						$("#"+div_id).append(" -- "+num_applicants+" applicants");

					});
				},
			});
		},
	});
});