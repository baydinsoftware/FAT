var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
	module.PositionsLayoutView = Marionette.LayoutView.extend({
		template: "#template-PositionsLayoutView",
		regions: {
			"positionRegion": "#PositionRegion",
			"positionsLayoutRegion": "positionsLayoutRegion",
			"displayPositionsRegion": "#allPositionsWrapper",
			"departmentListRegion": "#departmentListWrapper",
		},
		ui: {
			"addListing": "#AddListing",
			"all_positions_button": "#allPositions",
			"active_positions_button": "#activePositions",
			"inactive_positions_button": "#inactivePositions",
		},
		events: {
			"click @ui.addListing": "showAddListingPage",
			"click .positionItemView": "position_clicked",
			"click .editListing": "showEditListingPage",
			"click @ui.all_positions_button": "onRender",
			"click @ui.active_positions_button": "onActivePositionsClicked",
			"click @ui.inactive_positions_button": "onInactivePositionsClicked",
		},
		initialize: function() {
			this.bindUIElements();
		},
		showEditListingPage: function(e){
			var listing_id = $(e.currentTarget).data('id');
			FatApp.appRouter.navigate("#listing/" + listing_id, {trigger: true});
		},
		showAddListingPage: function(){
			console.log("showAddListingPage");
			FatApp.appRouter.navigate("#addlisting", {trigger: true});
		},
		onRender: function() {
			this.displayPositions();
		},
		displayPositions: function() {
			var self = this;
			var allPositions = new Positions();
			allPositions.fetch({
				success: function(){
					self.fetchDepartmentsThenDisplay(allPositions);
				}
			});
		},
		fetchDepartmentsThenDisplay: function(positions) {
			var self = this;
			var allDepartments = new Departments();
			allDepartments.fetch({
				success: function(){
					var departmentsView = new DepartmentsView({ collection: allDepartments });
					self.departmentListRegion.show(departmentsView);
					var setDepartments = self.setDepartmentPositions(positions, allDepartments);
					var setDepartmentsView = new DepartmentsCompositeView({ collection: setDepartments });
					self.displayPositionsRegion.show(setDepartmentsView);
				}
			});
		},
		setDepartmentPositions: function(positionSubset, departments){
			departments.each(function(model){
				var dept_id = model.get('id');
				var filtered = positionSubset.filterByAttr('department', dept_id);
				model.set('positions', filtered);
			});
			return departments;
		},
		position_clicked: function(e) {
	        var current_id = $(e.currentTarget).data('id');
	        // use position id to tell where on the page to be once you get there
	        App.appRouter.navigate("#department/" + current_id, {trigger: true});
		},
		onActivePositionsClicked: function() {
			this.filterActiveOrInactive(false);
		},
		onInactivePositionsClicked: function() {
			this.filterActiveOrInactive(true);
		},
		filterActiveOrInactive: function(bool) {
			var self = this;
			var allPositions = new Positions();
			allPositions.fetch({
				success: function(){
					var filteredPositions = allPositions.filterByAttr('archived', bool);
					self.fetchDepartmentsThenDisplay(filteredPositions);
				}
			});
		},
	});
});

var AddListingView = Marionette.LayoutView.extend({
	template: "#template-AddListingView",
	regions:{
		"departmentSelectRegion": ".DepartmentSelectRegion",
	},
	ui:{
		"addListing": "#AddListingButton",
		"department_select": ".DepartmentSelectRegion select",
		"add_department_button": "#add_department_button",
		"cancelAddListing": "#CancelAddListing",
		"positionDescription": ".positionDescription"
	},
	events: {
		"click @ui.cancelAddListing": "cancelAdd",
		"click @ui.addListing": "createNewListing",
		"change @ui.department_select": "add_department_prep",
		"click @ui.add_department_button": "add_department_function",
	},
	initialize: function(){
	},
	// eventually, we will move the add_position_function and add_department_functions
	// to an admin page, but for the time being they can live here rent-free 
	onShow: function(){	
		var allDepartments = new Departments();
		this.createDropDown(allDepartments, "Department", this.departmentSelectRegion)
	},
	cancelAdd: function(){
		this.destroy();
		FatApp.appRouter.navigate("#joblistings", {trigger: true});
	},
	createNewListing: function() {
		var self = this;
		var name = $("#position_name").val();
		var dept = this.ui.department_select.val();
		console.log(dept);
		var description = this.ui.positionDescription.val();
		this.model.set({"name": name, "department": dept, 
									"description": description});
		this.model.save(null, {
			success: function(){
				FatApp.appRouter.navigate("#joblistings", {trigger: true});
   			},
			error: function(){
				$("#addPositionMessage").html($('<strong>', {
						text: "Encountered an error in position creation"
					})
				);
			}
		});
	},
	add_department_prep: function() {
		var department = $(".DepartmentSelectRegion select").val();
		if( department == "Create_Department" ) {
			$("#createDepartmentRegion").toggle(true);
		}
		else { 
			$("#createDepartmentRegion").toggle(false);
		}
	},
	add_department_function: function() {
		this.save_to_db(Department, "Department")
	},
	save_to_db: function(model, modelString) {
		var value = $("#Add" + modelString + "Text").val();
		var model_instance = new model({"name": value});
		model_instance.save(null, {
			success: function(){
				$("#addPositionMessage").html($('<strong>', {
						text: "Successfully created a " + value + " "+ modelString + "."
					}));
				$("." + modelString + "SelectRegion select").prepend($('<option>', {
						selected: true,
						value: model_instance.id,
						text: value
					}));
				$("#Add" + modelString + "Text").val("");
				$("#create" + modelString + "Region").toggle();
			},
			error: function(){
				$("#addPositionMessage").html($('<strong>', {
						text: "Encountered an error in" + modelString + "creation"
				}));
			}
		});
	},
	createDropDown: function(collection_object, stringName, region_name) {
		var self = this;
		collection_object.fetch({
			success: function(){
				var DropDownView = new DropDownMenuView({
											collection: collection_object, 
											childView: DropDownItemView})
				DropDownView.render();
				region_name.show(DropDownView);
				$("." + stringName + "SelectRegion select").append($
					('<option>', {
						text: "Create New " + stringName,
						value: "Create_" + stringName 
					})
				);
				self.add_department_prep();
				self.bindUIElements();
			}
		});	
	},
})
