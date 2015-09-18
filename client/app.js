// counter starts at 0
Session.setDefault('counter', 0);

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Template.home.helpers({
    title: 'Devops Development',
    some: function(){
        return Some.findOne({});
    },
    count: function(){
        return Some.find({}).count();
    },
    gitToolsTitle: "Lets\'s work with git...",
    linkToGitTools: '\gitTools',
    linkToDeploy: '\deployTools',
    deployTools: 'Deploy automatic'
});

//Template.home.events({
//    'click .getGit': function () {
        // increment the counter when button is clicked
        //Meteor.call('postSome', Meteor.user());
    //}
//});

Template.gitTools.helpers({

});
Template.gitTools.events({
    'click .getGitHubToken': function(){
        Meteor.call('getGitToken', Meteor.user());
    },
    'click .deleteAuthGitHub': function(){
        Meteor.call('deleteAuthGitHub', Meteor.user());
    },
    'click .receiveTokenGitHub': function(){
        Meteor.call('receiveToken', Meteor.user());
    },
    'click .createGitHubRepo': function(){
        Meteor.call('createRepo', Meteor.user());
    }
});

Template.deploy.onRendered(function () {
    Meteor.call('deleteResults');
});

Template.deploy.helpers({
    title: 'Auto deployment!',
    info: function(){
        return Droplets.find({}).fetch();
    },
    list: function(){
        return Droplets.find({}).fetch();
    },
    createdDroplets: function(){
        return Droplets.find({createdBy: Meteor.user().username}).fetch();
    },
    results: function(){
        return CustomResults.find({}).fetch();
    },
    images: function () {
        return Images.find({}); // Where Images is an FS.Collection instance
    }
});

Template.deploy.events({
    'click .readFile': function(e){
        e.preventDefault();
        Meteor.call('readFile');
    },
    'click .getList': function(e){
        e.preventDefault();
        Meteor.call('getDropletsList');
    },
    'click .deleteImages': function(){
        Meteor.call('deleteImages');
    },
    'change .myFileInput': function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            Images.insert(files[i], function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            });
        }
    },
    /**
     * Group of droplet create actions
     * @ param e
     */
    'submit .dropletInfoClass': function(e){
        e.preventDefault();
        Meteor.call('createFiveDollarDroplet', Meteor.user().username, e.target.dropletTitle.value);
    },
    'click .fiveDollarDroplet': function(){
        Meteor.call('createFiveDollarDroplet', Meteor.user().username, $('#dropletTitle').val());
    },

    'click .createPublicSSH': function(e){
        e.preventDefault();
        Meteor.call('createPublicSSH');
    },
    'click .deleteDroplet': function(e){
        e.preventDefault();
        Meteor.call('deleteDroplet', this.createdDropletId);
    },
    // This stuff will be useless and must be deleted after deployment
    'click .sshAccess': function(){
        Meteor.call('sshAccess');
    },
    'click .sshGitInstall': function(){
        Meteor.call('sshGitInstall');
    },
    'click .checkHTTP': function(){
        Meteor.call('checkHTTP');
    },
    'click .uploadApp': function(){
        Meteor.call('uploadApp', this.createdDropletId);
    }

    //"submit .new-task": function (event) {
    //     Prevent default browser form submit
        //event.preventDefault();
        //
        // Get value from form element
        //var text = event.target.text.value;

});
