Meteor.publish("userData",function(){
    if(this.userId){
        return Meteor.users.find({_id: this.userId});
    }
});

Meteor.publish('someData', function(){
   return Some.find();
});

Meteor.publish('droplets', function(){
    return Droplets.find();
});