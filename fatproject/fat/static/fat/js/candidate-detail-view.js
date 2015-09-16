"use strict";
var FatApp = FatApp || new Backbone.Marionette.Application();

var CandidateDetailView = Marionette.LayoutView.extend({
    template: "#template-CandidateDetailView",
    tagname: "div",
    regions: {
        "candidateDisplayRegion": "#candidateDisplayRegion",
        "stageSelectRegion": ".StageSelectRegion",
        "userSelectRegion": ".UserSelectRegion",
        "positionSelectRegion": ".PositionSelectRegion",
        "formSelectRegion": "#FormSelectRegion",
        "formDisplayRegion": ".FormDisplayRegion",
        "filesDisplayRegion": "#filesDisplayRegion",
        "timelineRegion": "#TimelineRegion",
        "dummyActionRegion": "#ActionRegion",
        "ratingTableRegion": "#RatingTableRegion",
    },
    ui: {
        "waiting": "#waiting",
        "editing": "[contenteditable=true]",  
        "edit_stage": ".StageSelectRegion select",
        "edit_position": ".PositionSelectRegion select",
        "edit_owner": ".UserSelectRegion select",
        "form_selected": "#FormSelectRegion select",
        "archived": "#archived",
        "filename_input": "#filename",
        "unsecretAll": "#unsecretAll",
        "filesUploadProgress": "#filesUploadProgressRegion",
        "dropFileRegion": "#dropFileRegion",
        "trashCandidateButton": "#trashCandidateButton",
        "confirmTrashCandidate": "#confirmTrashCandidate",
        "yesTrashCandidate": "#yesTrashCandidate",
        "noTrashCandidate": "#noTrashCandidate",
    },
    events: {
      "click @ui.waiting": "onWaitingClicked",
      "click @ui.archived": "onArchivedClicked",
      "input @ui.editing": "saveEditing",
      "change @ui.edit_stage": "saveDropDownEditing",
      "change @ui.edit_position": "saveDropDownEditing",
      "change @ui.edit_owner": "saveDropDownEditing",
      "change @ui.form_selected": "displayForm",
      "click @ui.unsecretAll": "unsecretAllFeedback",
      "click @ui.trashCandidateButton": "toggleConfirmTrash",
      "click @ui.yesTrashCandidate": "trashCandidate",
      "click @ui.noTrashCandidate": "toggleConfirmTrash"
    },
    modelEvents: {
    }, 
    initialize: function(){
    },
    displayForm: function(e){
        var self = this;
        var value = e.target.value || e.value;
        var form = new FeedbackForm({id: value});
        form.fetch({
            success: function(){
                var feedbackFormDetailView = new FeedbackFormDetailView({model: form, candidate: self.model});
                self.formDisplayRegion.show(feedbackFormDetailView);
            }
        });  
    },
    onArchivedClicked: function(e){
        this.model.set("archived", !this.model.get("archived"));
        this.model.save();
        var description;
        if ($(e.target).text() == 'true'){
            $(e.target).text('false');
            description = currentUser.get('display_name') + " unarchived " + this.model.get('name');
        }
        else{
            $(e.target).text('true');
            description = currentUser.get('display_name') + " archived " + this.model.get('name');
        }
        this.addAction(description);
    },
    unsecretAllFeedback: function(){
        var thisCandidateFeedback = new FeedbackCollection(this.model.get('feedbackCollection'));
        thisCandidateFeedback.invoke('set', {"secret": false});
        thisCandidateFeedback.invoke('save');
    },
    saveEditing: function(e){
        var field = e.target.id;
        var value = e.target.innerText;
        if (field == "email"){
            if (!this.validateEmail(value)){
                $("#email").css("color", "red");
                return false;
            }
            $('#email').css("color","green");
        }
        this.model.set(field, value);
        this.model.save();
    },
    saveDropDownEditing: function(e){
        var self = this;
        var value = e.target.value;
        var field = $(e.target).parent().closest('div').attr('value');
        var text = $(e.target).find("option:selected").text();
        this.model.set(field, value);
        this.model.save(null,{
            success: function(){
                var description = currentUser.get('display_name') + " changed " + field + " to " + text;
                self.addAction(description);
            }
        });
    },
    addAction: function(description) {
        var dateCreated = new Date();
        var dateString = dateCreated.toISOString();
        var user_picture = currentUser.get('profile_picture');
        var action = new Action({'candidate': this.model.get('id'),  'description': description,
                            'user_picture': user_picture, 'date_added': dateString });
        action.save();
    },
    showRatingTable: function(){
        var self = this;
        var allForms = new FeedbackForms();
        allForms.fetch({
            success: function(){
                var ratingTableView = new RatingTableCollectionView({
                                            collection: allForms,
                                            'candidateId': self.model.get('id')});
                self.ratingTableRegion.show(ratingTableView);
            }  
        })
    },
    createDropDown: function(collection_object, attr_name, region_name){
        var self = this;
        collection_object.fetch({
            success: function(){
                // set current choice to be autoselected
                if (collection_object instanceof Users){
                    var child_view = DropDownUserView;
                } else {var child_view = DropDownItemView;}
                if (collection_object instanceof FeedbackForms){
                    var selected_model = collection_object.findWhere({name: "notes"});
                    collection_object = collection_object.filterByAttr('active',true);
                }
                else{
                    var selected_model = collection_object.findWhere({id: self.model.get(attr_name)});
                }
                if (collection_object instanceof Positions){
                    collection_object = collection_object.filterByAttr('archived', false);
                }
                selected_model.set({selected: true});
                var dropDownView = new DropDownMenuView({
                                            collection: collection_object, 
                                            childView: child_view});
                region_name.show(dropDownView);  
            }
        });
    },
    showDropDowns: function(){
        var allStages = new Stages();
        this.createDropDown(allStages, "stage", this.stageSelectRegion);
        var allPositions = new Positions();
        this.createDropDown(allPositions, "position", this.positionSelectRegion);
        var allUsers = new Users();
        this.createDropDown(allUsers, "owner", this.userSelectRegion);
        var allForms = new FeedbackForms();
        this.createDropDown(allForms, "form", this.formSelectRegion);
    },
    onShow:function(){
        var self = this;
        // If the candidate has been hired, then only Admins should still be able to access the page
        // NOTE: the stage check is hardcoded in for time purposes. If we needed to make a server call to see if
        // we have the proper 'hired' stage, then the onShow function would continue displaying the candidate's information. Given
        // that we need to protect sensitive information here, then we cannot afford to have a split second of information shown
        // while the call to the server is executing.
        if((this.model.get('stage') == 10) && (currentUser.get('is_staff') == "False")) {
            var improperPermissionsView = new ImproperPermissionsView();
            self.candidateDisplayRegion.show(improperPermissionsView);
        } else {
            this.showRatingTable();
            this.displayFiles();
            this.showDropDowns();
            this.createFileDropZone();
            this.ui.confirmTrashCandidate.toggle();
            
            // show notes
            var form = new FeedbackForm({id: 1});
            form.fetch({
                success: function(){
                    var feedbackFormDetailView = new FeedbackFormDetailView({model: form, candidate: self.model});
                    self.formDisplayRegion.show(feedbackFormDetailView);
                }
            })
            // render saved feedback in timeline view

            var thisCandidateFeedback = new FeedbackCollection(this.model.get('feedbackCollection'));
            var viewableFeedback = null;
            if (currentUser.get('is_staff') == "True"){
                viewableFeedback = thisCandidateFeedback;
                this.ui.unsecretAll.toggle();
            }else{
                viewableFeedback = thisCandidateFeedback.filterTwoAttr('secret', false, 'author', currentUser.get('id'));
            }
            // render actions 
            var allActions = new Actions();
            allActions.fetch({
                success: function(){
                    // filter actions by candidate!!!!
                    var thisCandidateActions = allActions.filterByAttr('candidate', self.model.get('id'));
                    var timelineCollection = new TimelineCollection();
                    timelineCollection.add(viewableFeedback.toJSON());
                    timelineCollection.add(thisCandidateActions.toJSON());
                    var thisCandidateFeedbackDisplay = 
                        new TimelineView({collection: timelineCollection});
                    self.timelineRegion.show(thisCandidateFeedbackDisplay);
                }
            });

            // toggle color of waiting
            if (!this.model.get("waiting")){
                $('#waiting').toggleClass('waitingCandidate');
            };

            
        }
    },
    createFileDropZone: function() {
        var self = this;
        this.ui.dropFileRegion.dropzone({ 
            url: "/fat/upload", 
            sending: function(file, xhr, formData) {
                formData.append("id", self.model.get("id"));
            },
            init: function() {
                // create new file to correspond with our key in S3
                this.on('success', function(file, response){
                    if(response['created_new']) { 
                        var uniqueFileName = self.model.get("id") + "/" + file.name;
                        var new_file = new File({ 'name': file.name, 'filepath' : uniqueFileName, 'candidate': self.model.get("id") });                      
                        new_file.save();
                    } else {
                        alert("We already have a file with that name!");
                    }
                    // self.render();   // redisplay files
                    // for some reason, the files will not redisplay properly. Either only the first one redisplays, 
                    // or no files redisplay until the page is reloaded. To circumvent this, I guess we just have to force a reload
                    // i really don't feel good about forcing a window.location.reload()
                    window.location.reload();
                });
                this.on('uploadprogress', function(file, progress, bytesSent) {
                    self.ui.dropFileRegion.html("File Upload Progress: " + progress + "%");
                    if( progress == 100 ) { self.ui.dropFileRegion.html("upload complete, please wait while the page reloads"); }
                });
            }
        });
    },
    displayFiles: function(){
        var candidateFiles = this.model.get("files");
        var files = new Files();
        files.reset(candidateFiles);
        var filesView = new FilesView({collection: files});
        this.filesDisplayRegion.show(filesView);
    },
    onWaitingClicked: function(e){
        var this_model = this.model.get("id");
        this.model.set("waiting", !this.model.get("waiting"));
        this.model.save();
        $('#waiting').toggleClass('waitingCandidate');
        if ($(e.target).text() == 'true'){
            $(e.target).text('false');
        }
        else{
            $(e.target).text('true');
        }
    },
    validateEmail: function (email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    trashCandidate: function() {
        this.model.destroy();
        FatApp.appRouter.navigate("", {trigger: true});
        window.location.reload(); // i think maybe this reload is a necessary evil
    },
    toggleConfirmTrash: function() {
        this.ui.confirmTrashCandidate.toggle();
    }
});
