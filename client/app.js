// counter starts at 0
Session.setDefault('counter', 0);

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Meteor.startup(function () {
    Meteor.call('removeDropletsInfo');
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


Template.deploy.helpers({
    title: 'Auto deployment!',
    info: function(){
        return Droplets.find({}).fetch();
    },
    list: function(){
        return Droplets.find({}).fetch();
    }
});

Template.deploy.events({
    'click .getInfo': function(e){
        Meteor.call('getDroplet', 6961815);
        e.preventDefault();
    },
    'click .getList': function(e){
        Meteor.call('getDropletsList');
        e.preventDefault();
    }
});
