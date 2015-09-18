var subscriptions = new SubsManager();

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
        return subscriptions.subscribe('droplets');
    },
    fastRender: true
});
