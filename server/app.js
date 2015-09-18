digitaloceanApi = Meteor.npmRequire('dropletapi').Droplets;
digitalocean = new digitaloceanApi('53f18570fd32d2c80e57e05dd2f55f8dd8e3e5623948dc1cf8d25a74445130b4');

Meteor.startup(function () {

});

Meteor.methods({
    //2f3b35539598085aaedd8bfa5eb5af5bd89b0a26
    'getGitToken': function(user){
        github.authenticate({
            type: "token",
            token: gitHubToken
        });
        github.authorization.get({id: gitHubToken.id,headers: {
        }}, function(err,res){
            if(err) console.log(err.msg);
            if (res) {
                //gitHubToken = res.token;
                console.log(res);
                gitHubToken = res;
            }
        });
    },
    'deleteAuthGitHub':function(user){
        github.authenticate({
            type: "token",
            token: gitHubToken
        });
        if(user){
            github.authorization.delete({id:gitHubToken.id},function(err,res){
                if(err) console.log(err);
                console.log('Deleted token - '+res);
            });
        }
    },
    'receiveToken': function(user){
        github.authenticate({
            type: "basic",
            username: 'DemidovVladimir',
            password: 'sveta230583'
        });
        github.authorization.create({
            scopes: ["user", "public_repo", "repo", "repo:status", "gist"],
            note: "what this auth is for",
            headers: {
                "X-GitHub-OTP": "817672"
            }
        }, function(err, res) {
            if (res.token) {
                gitHubToken = res;
            }
        });
    },
    'createRepo': function(user) {

    },

    'removeDropletsInfo': function(){
        Droplets.remove({});
    },
    'getDroplet': function(id){
        var response = wrappedDropletInfo(id);
        Droplets.remove({});
        Droplets.insert({infoOfDroplet:response});
    },
    'getDropletsList': function(){
        var response = wrappedDropletList();
        Droplets.remove({});
        Droplets.insert({listOfDroplets:response});
    }
});

var wrappedDropletInfo = Async.wrap(dropletInfo);

function dropletInfo(id,callback) {
    digitalocean.getDropletById(id, function (error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            callback(null, result);
        }
    });
}

var wrappedDropletList = Async.wrap(listOfDroplets);

function listOfDroplets(callback){
    digitalocean.listDroplets(function (error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            callback(null, result);
        }
    });
}
