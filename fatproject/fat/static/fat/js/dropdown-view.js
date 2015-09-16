var FatApp = FatApp || new Backbone.Marionette.Application();

var DropDownItemView = Backbone.Marionette.ItemView.extend({
    tagName: "option",
    template: "#template-DropDownItemView",
    initalize: function(){
        this.model.on("sync", this.render, this);
    },
    onRender: function(){
        this.$el.attr('value', this.model.get('id'))
        if (this.model.get("selected")){
            this.$el.attr('selected', true)
        }
    }
});

var DropDownUserView = Backbone.Marionette.ItemView.extend({
    tagName: "option",
    template: "#template-DropDownUserView",
    initalize: function(){
        this.model.on("sync", this.render, this);
    },
    onRender: function(){
        this.$el.attr('value', this.model.get('id'))
        if (this.model.get("selected")){
            this.$el.attr('selected', true)
        }
    }
});

var DropDownMenuView = Backbone.Marionette.CollectionView.extend({
    // pass options to child options
    tagName: "select",
    className: "form-control",
    // valueName: this.collection.get("candidate_attr"), 
    template: "template-DropDownMenuView",

});