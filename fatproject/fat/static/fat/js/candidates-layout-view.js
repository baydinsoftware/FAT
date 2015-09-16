var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
	module.CandidatesLayoutView = Marionette.LayoutView.extend({
		template: "#template-CandidatesLayoutView",
		regions: {
			"displayCandidatesRegion": "#DisplayCandidatesRegion",
			"stageNavigationRegion": "#StageNavigationRegion"
		},
		ui: {
			"activeCandidates": "#activeCandidates",
			"myCandidates": "#myCandidates",
			"archivedCandidates": "#archivedCandidates",
			'waiting': "#waiting",
		},
		events: {
			"click @ui.activeCandidates": "onActiveClicked",
			"click @ui.myCandidates": "onMineClicked",
			"click @ui.archivedCandidates": "onArchivedClicked",
			"click .candidateItemView" : "item_clicked",
		},
		// find a better way to do this, or move to inside Candidate View
	    item_clicked: function(e){
	    	var self = this
	        var current_id = $(e.currentTarget).data('id');
	        App.appRouter.navigate("#candidatedetail/" + current_id, {trigger: true})
	    },
		onShow: function(){
			this.displayCandidates(false);
		},
		onActiveClicked: function() {
			// pass in archived = false
			this.displayCandidates(false);
		},
		onMineClicked: function(){
			this.getMyCandidatesFirst();
		},
		onArchivedClicked: function(){
			// pass in archived == true
			this.displayCandidates(true);
		},
		getMyCandidatesFirst: function(){
			var self = this;
			var myCandidates = new Candidates();
			var owner = new User({id: currentUser.get('id')});
			owner.fetch({
				success: function(){
					myCandidates.add(owner.get('candidates'));
					var activeCandidates = myCandidates.filterByAttr('archived', false);
					self.fetchStagesThenDisplay(activeCandidates);
				}
			});
		},
		displayCandidates: function(archived){
			var self = this
			var allCandidates = new Candidates();
			allCandidates.fetch({				
				success: function() {
					allCandidates = allCandidates.filterByAttr('archived', archived);
					self.fetchStagesThenDisplay(allCandidates);
				}
			});
		},
		setStageCandidates: function(candidateSubset, stages){
			stages.each(function(model){
					var stage_id = model.get('id');
					var filtered = candidateSubset.filterByAttr('stage', stage_id);
					model.set('candidates', filtered);
				})
			return stages;
		},
		fetchStagesThenDisplay: function(candidates){
			var self = this
			var myStages = new Stages();
			myStages.fetch({
				success: function(){
					// set stage region 
					var myStageRegion = new StagesView({collection: myStages})
					self.stageNavigationRegion.show(myStageRegion)
					// set candidates region
					var myNewStages = self.setStageCandidates(candidates, myStages);
					var myCandidatesView = new CandidatesView({collection: myNewStages}); 
					self.displayCandidatesRegion.show(myCandidatesView);

				}
			});
		},
	});
});