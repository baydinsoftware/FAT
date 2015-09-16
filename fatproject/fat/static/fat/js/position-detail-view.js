var FatApp = FatApp || new Backbone.Marionette.Application();

FatApp.module('FatAppMainModule', function(module, App, Backbone, Marionette, $, _){
    module.PositionDetailView = Marionette.LayoutView.extend({
        model: Position,
        template: '#template-PositionDetailView',
        regions: {
            "displayCandidatesRegion": "#DisplayCandidatesRegion",
            "positionNavRegion": "#PositionNavRegion"
        },
        events: {
            "click .candidatePositionView" : "item_clicked",
        },
        item_clicked: function(e) {
            var self = this;
            var current_id = $(e.currentTarget).data('id');
            App.appRouter.navigate("#candidatedetail/" + current_id, {trigger: true});
        },
        onRender: function() {
            var self = this;
            var candidates_array = this.model.get("candidates");
            var candidates = new Candidates();
            candidates.reset(candidates_array);
      
            var positions = new Positions();
            positions.fetch({
                success: function(){
                    var thisDepartment = self.model.get('department');
                    var thisDepartmentPositions = new Positions(positions.where({department: thisDepartment}));
                    // console.log(thisDepartmentPositions)
                    var positionsNavView = new PositionSidebarView({collection: thisDepartmentPositions});
                    self.positionNavRegion.show(positionsNavView);
                    // console.log(thisDepartmentPositions)
                    var candidatesView = new CandidatesPositionCollectionView({collection: thisDepartmentPositions});
                    console.log(candidatesView)
                    self.displayCandidatesRegion.show(candidatesView);
                }
            })
        },
        tagName: 'div',
    });
});


