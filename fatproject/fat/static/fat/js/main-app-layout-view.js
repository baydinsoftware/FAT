var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
	module.MainAppLayoutView = Marionette.LayoutView.extend({
		tagName: "div",
		className: "mainAppLayoutView",
		template: "#template-MainAppLayoutView",
		ui: {
			"fatTitle": ".fatTitle",
			"adminTabs": ".admin",
		},
		events: {
			"click @ui.fatTitle": "onFatTitleClicked",
		},
		regions: {
			"contentRegion": "#ContentRegion",
		},
		initialize: function(options){
			this.initRouter();
			App.addRegions({
				contentRegion: "#ContentRegion",
			});	
		},
		onRender: function(){
			if(!Backbone.History.started){
				Backbone.history.start();
			}
		},
		initRouter: function() {
			var self = this;
			var appRouteHandler = {
					'' : 'onCandidatesRoute',
				'candidates' : 'onCandidatesRoute',
				'addcandidate': 'onAddCandidateRoute',
				'candidatedetail/:id': 'onCandidateDetailRoute',
				'stages': 'onStagesRoute',
				'joblistings': 'onPositionsRoute',
				'listing/:id': 'onListingDetailRoute',
				'department/:id': 'onDepartmentRoute',
				'feedbackform': 'onFeedBackFormRoute',
				'users': 'onManageUserRoute',
				'userdetail/:id': 'onUserDetailRoute',
				'loginmanagement': 'onLogInManagementRoute',
				'addlisting': 'onAddListingRoute',
				'*notFound' : 'onNotFoundRoute',
			}
			var appRouterController = {
				onAddListingRoute: function(){
					self.onAddListingNavigated();
				},
				onListingDetailRoute: function(id){
					self.onListingDetailNavigated(id);
				},
				onCandidatesRoute: function() {
					self.onCandidatesNavigated();
				},
				onAddCandidateRoute: function() {
					self.onAddCandidateNavigated();
				},
				onStagesRoute: function() {
					self.onStagesNavigated();
				},
				onPositionsRoute: function() {
					self.onPositionsNavigated();
				},
				onCandidateDetailRoute: function(id){
					self.onCandidateDetailNavigated(id);
				},
				onDepartmentRoute: function(id){
					self.onDepartmentNavigated(id);
				},
				onFeedBackFormRoute: function(){
					self.onFeedBackFormNavigated();	
				},
				onManageUserRoute: function(){
					self.onManageUserNavigated();
				},
				onUserDetailRoute: function(id){
					self.onUserDetailNavigated(id);
				},
				onLogInManagementRoute: function() {
					self.onLogInManagementNavigated();
				},
				onNotFoundRoute: function() {
					console.log("what are you doing");
				},
			};
			var MyRouter = Marionette.AppRouter.extend({});
			App.appRouter = new MyRouter({
				appRoutes: appRouteHandler, 
				controller: appRouterController
			});
		},
		onShow: function(){
			if(currentUser.get('is_staff') == "False") {
				this.ui.adminTabs.toggle();
			}
		},
		onFatTitleClicked: function() {
		},
		onAddListingNavigated: function(){
			var newPosition = new Position();
			var newListingView = new AddListingView({model: newPosition});
			this.contentRegion.show(newListingView);
		},
		onListingDetailNavigated: function(id){
			var self = this;
			var thisListing = new Position({id: id})
			thisListing.fetch({
				success: function(){
					var editListingView = new AddListingView({model: thisListing});
					self.contentRegion.show(editListingView);
				}
			})
		},
		onManageUserNavigated: function(){
			var usersLayoutView = new UsersLayoutView();
			this.contentRegion.show(usersLayoutView);
		},
		onUserDetailNavigated: function(id){
			var self = this;
			var user = new User({id: id});
			user.fetch({
				success: function() {
					var userDetailView = new UserDetailView({model: user});
					self.contentRegion.show(userDetailView);
				}
			})
		},
		onCandidatesNavigated: function() {
			var candidatesLayoutView = new module.CandidatesLayoutView();
			this.contentRegion.show(candidatesLayoutView);
		},
		onAddCandidateNavigated: function() {
			var addCandidateView = new module.AddCandidateView();
			this.contentRegion.show(addCandidateView);
		},
		onCandidateDetailNavigated: function(id){
			var self = this;
			var candidate = new Candidate({id: id});
        	candidate.fetch({
        		success: function(){
        			var currentCandidateView = new CandidateDetailView({model : candidate});
        			self.contentRegion.show(currentCandidateView);
        		}
        	});
		},
		onFeedBackFormNavigated: function(){
			var feedbackFormLayoutView = new FeedbackFormLayoutView();
			this.contentRegion.show(feedbackFormLayoutView);
		},
		onStagesNavigated: function() {
			var stagesLayoutView = new StagesLayoutView();
			this.contentRegion.show(stagesLayoutView);
		},
		onPositionsNavigated: function() {
			var positionsLayoutView = new module.PositionsLayoutView();
			this.contentRegion.show(positionsLayoutView);
		},
		onDepartmentNavigated: function(id) {
			var self = this;
			var position = new Position({id: id});
			position.fetch({
				success: function() {
					var currentPositionView = new module.PositionDetailView({model: position});
					self.contentRegion.show(currentPositionView);
				}
			});
		},
		onLogInManagementNavigated: function() {
			var whiteListLayoutView = new WhiteListLayoutView();
			this.contentRegion.show(whiteListLayoutView);
		}
	});
});