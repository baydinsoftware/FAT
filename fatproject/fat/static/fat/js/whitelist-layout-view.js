var FatApp = FatApp || new Backbone.Marionette.Application();

var WhiteListLayoutView = Marionette.LayoutView.extend({
	template: "#template-WhiteListLayoutView",
	regions: {
        "whiteListDisplayRegion": "#whiteListDisplayRegion",
        "whiteListItemsRegion": "#whiteListItemsRegion",
    },
    ui: {
        "save": "#WLsave",
        "cancel": "#WLcancel",
        "newItem": "#newWhiteListItem",
    },
    events: {
        "click @ui.save": "saveItem",
        "click @ui.cancel": "goBack",
    },
    saveItem: function(){
        var self = this;
        var itemToAdd = new WhiteListItem({'item':this.ui.newItem.val()});
        itemToAdd.save(null, {
            success: function() { self.render(); },
            error: function() { console.log('encountered an error'); }
        });
    },
    goBack: function(){
        FatApp.appRouter.navigate("#users", {trigger: true});
    },
    // need to get all of the whitelistitems, and place them here
    onRender: function(){
        // if the user should not be seeing this page, show them a different template
        if (currentUser.get('is_staff') == "False"){
            var improperPermissionsView = new ImproperPermissionsView();
            this.whiteListDisplayRegion.show(improperPermissionsView);
        } else {
            var self = this;
            var allWhiteListItems = new WhiteListItems();
            allWhiteListItems.fetch({
                success: function() {
                    var whiteListItemsView = new WhiteListsView({collection: allWhiteListItems});
                    self.whiteListItemsRegion.show(whiteListItemsView);
                }
            });
        };
    },
});