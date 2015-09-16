// setup
"use strict";
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie("csrftoken");

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module("FatAppMainModule", function(module, App, Backbone, Marionette, $, _){
	module.AddCandidateView = Marionette.LayoutView.extend({
		template: "#template-AddCandidateView",
		regions: {
			"addRegion": "#AddCandidateRegion",
			"stageSelectRegion": ".StageSelectRegion",
			"userSelectRegion": ".UserSelectRegion",
			"positionSelectRegion": ".PositionSelectRegion",
		},
		ui: {
			"stage_select": ".StageSelectRegion select",
			"add_stage_button": "#add_stage_button",
			"position_select": ".PositionSelectRegion select",
			"add_position_button": "#add_position_button",
			"add_candidate_button": "#add_candidate_button",
			"test": "#test",
			"cancel": "#CancelAddCandidate",
		},

		events: {
			"change @ui.stage_select": "add_stage_prep",
			"click @ui.add_stage_button": "add_stage_function",
			"click @ui.add_position_button": "add_position_function",
			"click @ui.add_candidate_button": "add_candidate_function",
			"click @ui.cancel": "cancelAddCandidate",
		},
		cancelAddCandidate: function(){
			FatApp.appRouter.navigate("#candidates", {trigger: true});
		},
		add_stage_prep: function() {
			this.bindUIElements();
			var stage = this.ui.stage_select.val();
			if( stage == "Create_Stage" ) {
				$("#createStageRegion").toggle(true);
			}
			else { 
				$("#createStageRegion").toggle(false);
			}
		},

		add_stage_function: function() {
			this.save_to_db(Stage, "Stage");
		},
		save_to_db: function(MyModel, modelString) {
			var value = $("#Add" + modelString + "Text").val();

			var model_instance = new MyModel({"name": value});
			model_instance.save(null, {
				success: function(){
					$("#addCandidateMessage").html($("<strong>", {
							text: "Successfully created a " + value + " "+ modelString + "."
						}));
					$("." + modelString + "SelectRegion select").prepend($("<option>", {
							selected: true,
							value: model_instance.id,
							text: value
						}));
					$("#Add" + modelString + "Text").val("");
					$("#create" + modelString + "Region").toggle();
				},
				error: function(){
					$("#addCandidateMessage").html($("<strong>", {
							text: "Encountered an error in" + modelString + "creation"
					}));
				}
			});
		},

		add_position_function: function() {
			this.save_to_db(Position, "Position");
		},

		add_candidate_function: function() {
			// validate email
			var name     = $("#candidate_name").val();
			var email    = $("#candidate_email").val();
			var posi_id  = this.ui.position_select.val();
			var stage_id = this.ui.stage_select.val();
			var owner_id = $(".UserSelectRegion select").val();
			var waiting  = false;
			var archived = false;
			var lmw = new Date();
			var lmw_string = lmw.toISOString();

			var candidate = new Candidate({
				"name": name, "email": email, 
				"position": posi_id, "stage": stage_id,
				"waiting": waiting, "owner": owner_id,
				"archived": archived, "last_marked_waiting": lmw_string
			});
			var self = this;
			candidate.save(null, {
				success: function(){
					var candidate_id = candidate.get("id");
					self.addAction(candidate_id);
					$("#addCandidateMessage").html($("<strong>", {
						text: "Successfully created a candidate profile for " + candidate.get("name") + "."
					}));
					FatApp.appRouter.navigate("#candidatedetail/" + candidate_id, {trigger: true});
				},
				error: function(){
					$("#addCandidateMessage").html($("<strong>", {
						text: "Encountered an error in candidate creation"
					}));
				}
			});
		},
		addAction: function(candidate_id) {
			var dateCreated = new Date();
			var date_string = dateCreated.toISOString();
			var description = "created by " + currentUser.get('display_name');
			var user_picture = currentUser.get('profile_picture');
			var action = new Action({'candidate': candidate_id, 'description': description,
									'user_picture': user_picture,'date_added': date_string });
			action.save();
		},
		initialize: function() {
			this.bindUIElements();	
		},
		onRender: function(){
			var self = this;
			var allUsers = new Users();
			allUsers.fetch({
				success: function() {
					var UserDropDownView = new DropDownMenuView({
												collection: allUsers, 
												childView: DropDownUserView});
					UserDropDownView.render();
					self.userSelectRegion.show(UserDropDownView);
				}
			});

			var allPositions = new Positions();
			this.createDropDown(allPositions, "Position", self.positionSelectRegion);
	
			var allStages = new Stages();
			this.createDropDown(allStages, "Stage", self.stageSelectRegion);
		},
		createDropDown: function(collection_object, stringName, region_name){
			var self = this;
			collection_object.fetch({
				success: function(){
					if (collection_object instanceof Positions){
						collection_object = collection_object.filterByAttr('archived',false);
					}
					var DropDownView = new DropDownMenuView({
												collection: collection_object, 
												childView: DropDownItemView});
					region_name.show(DropDownView);
					if (collection_object instanceof Stages){
						$("." + stringName + "SelectRegion select").append($
							("<option>", {
								text: "Create New " + stringName,
								value: "Create_" + stringName 
							})
						);
						self.add_stage_prep();
					}
				}
			});	
		},
	});
});