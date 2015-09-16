var FatApp = FatApp || new Backbone.Marionette.Application();

var User = Backbone.Model.extend({
	defaults: {
		"username": "no name",
	},
    urlRoot: '/users/'	
});

var Users = Backbone.Collection.extend({
    model: User,
    comparator: "id",
    url: '/users/',
    filterByAttr: function(type, params){
        var filtered = new Candidates();
        var filteredColl = this.filter(function(item){
            return item.get(type) == params;
        });
        filtered.reset(filteredColl);
        return filtered;
    }
});

var UserItemView = Marionette.ItemView.extend({
	model: User,
	getTemplate: function(){
		if(this.model.get('is_staff')) { return "#template-AdminItemView"; }
		else { return "#template-UserItemView"; }
	},
	tagName: "tr",
    onShow:function(){

    },
    onRender: function(e){
        this.$el.attr('data-id', this.model.get('id'));
    },
    className: "userItemView"
});

var UsersView = Marionette.CollectionView.extend({
	childView: UserItemView,
	tagName: "table",
	className: "table table-hover",
	ui: {
		"userItemView":".userItemView"
	},
	events: {
		"click @ui.userItemView" : "userClicked",
	},
	userClicked: function(e){
        var current_id = $(e.currentTarget).data('id');
        FatApp.appRouter.navigate("#userdetail/" + current_id, {trigger: true});
    },
});

var UserNonEditView = Marionette.ItemView.extend({
	template: "#template-UserNonEditView",
	model: User
});

var UserDetailView = Marionette.LayoutView.extend({
	template: "#template-UserDetailView",
	regions:{
		"userInfoDisplay": "#userInfoDisplay"
	},
	ui:{
		"save": "#saveUserButton",
		"first_name": "#first_name",
		"last_name": "#last_name",
		"email": "#email",
		"cancel": "#cancelUserChanges",
		"admin": "#admin",
		"adminDisplayLock": "#adminDisplayLock",
		"userProfilePicture": "#userProfilePicture",
	},
	events: {
		"click @ui.save": "saveUser",
		"click @ui.cancel": "goBack",
		"click @ui.admin": "toggleAdmin"
	},
	// Can only promote/demote from admin if you are an admin yourself, and only if you're trying to change someone else's status
	toggleAdmin: function(e){
		if((this.model.get('username') != currentUser.get('username')) && (currentUser.get('is_staff') == "True")) {
	        if ($(e.target).text() == "true"){
	            $(e.target).text("false");
	        }
	        else{
	            $(e.target).text("true");
	        }
	       	this.model.set('is_staff', (!this.model.get('is_staff')));
	    }
    },
	saveUser: function(){
		var self = this;
		var first_name = this.ui.first_name.val();
		var last_name = this.ui.last_name.val();
		var email = this.ui.email.val();
		this.model.set("first_name", first_name);
		this.model.set("last_name", last_name);
		this.model.set("email", email);		
		this.model.save(null, {
			success: function(){
				// change the cached currentUser if the user has changed their own admin status
		       	if(self.model.get('username') == currentUser.get('username')) {
		       		if(self.model.get('is_staff')) { currentUser.set('is_staff', "True"); }
		       		else { currentUser.set('is_staff', "False"); }
		       	}
				self.goBack();
			},
			error: function(){
				console.log("something went wrong");
			}
		});
	},
	goBack: function(){
		FatApp.appRouter.navigate("#users", {trigger: true});
	},
	onShow: function(){
		// The url by default ends with "?sz=50", so we need to resize the image before we display it. 
		var raw_url = this.model.get('userprofile').picture_url;
		var source = raw_url.substring(0, raw_url.length-2) + "200";
		this.ui.userProfilePicture.html($('<img>', {src: source}));

		// same condition as above
		if((this.model.get('username') != currentUser.get('username')) && (currentUser.get('is_staff') == "True")) {
			this.ui.adminDisplayLock.toggle();
		}
	},
	onRender: function(){
		// if it is not the user's profile or the user is not an admin, then they should not be able to edit the profile
		if(!((this.model.get('username') == currentUser.get('username')) || (currentUser.get('is_staff') == "True"))) {
			var userNonEditView = new UserNonEditView({model: this.model});
			this.userInfoDisplay.show(userNonEditView);
		}
	}
});