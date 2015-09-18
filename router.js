var subscriptions = new SubsManager();
Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'home',
    waitOn: function(){
        return [subscriptions.subscribe('someData', this.userId)]
    },
    fastRender: true
});
Router.route('/gitTools',{
   name: 'gitTools',
    fastRender: true
});

Router.route('/deployTools',{
    name: 'deploy',
    subscriptions: function(){
        return [
            subscriptions.subscribe('droplets'),
            subscriptions.subscribe('cresults'),
            subscriptions.subscribe('images')
        ];
    },
    fastRender: true
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

Router.onBeforeAction(requireLogin, {only: 'deploy'});