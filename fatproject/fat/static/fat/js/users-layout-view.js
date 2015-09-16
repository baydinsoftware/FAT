var FatApp = FatApp || new Backbone.Marionette.Application();

var UsersLayoutView = Marionette.LayoutView.extend({
    template: '#template-UserLayoutView',
    regions: {
        "userDisplayRegion": "#UserDisplayRegion",
        "userLayoutAdminOnly": "#userLayoutAdminOnly",
    },
    ui: {
        "whiteListButton": "#userLayoutWhiteListButton",
        "adminOnly": "#userLayoutAdminOnly"
    },
    events: {
        "click @ui.whiteListButton": "onWhiteListButtonClick"
    },
    initialize: function(options){
        this.bindUIElements();
    },
    onWhiteListButtonClick: function() {
        FatApp.appRouter.navigate("#loginmanagement", {trigger: true});
    },
    onShow: function(){
        var self = this;
        var myUsers = new Users();
        myUsers.fetch({
            success: function(){
                self.userDisplayRegion.show(new UsersView({collection: myUsers}))
            }
        });
        if (currentUser.get('is_staff') == "False"){
            this.ui.adminOnly.toggle(false);
        }
    },
});