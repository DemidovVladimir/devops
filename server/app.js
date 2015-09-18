DigitaloceanApi = Meteor.npmRequire('dropletapi').Droplets;
digitalocean = new DigitaloceanApi('53f18570fd32d2c80e57e05dd2f55f8dd8e3e5623948dc1cf8d25a74445130b4');
var execSSH = Meteor.npmRequire('ssh-exec');
var rexec = Meteor.npmRequire('ssh-pool');
var path = Meteor.npmRequire('path');
var fs = Meteor.npmRequire('fs');
var spawn = Meteor.npmRequire('child_process').spawn;
var exec = Npm.require('child_process').exec;

/**
 * maintainDroplets - object to manipulate droplets
 * @return {Object} result or error
 */
var maintainDroplets = {
    // Creating droplet info
    dropletInfo: function (id, done) {
        digitalocean.getDropletById(id, function (error, result) {
            if (error) {
                done(error, null);
            } else {
                done(null, result);
            }
        });
    },
    // Return list of all droplets in my digitalocean account
    listOfDroplets: function (done) {
        digitalocean.listDroplets(function (error, result) {
            if (error) {
                done(error, null);
            } else {
                done(null, result);
            }
        });
    },
    // Creating droplet that costs five dollar
    createFiveDollarDroplet: function (title, done) {
        var myNewDropletData = {
            "name": title,
            "region": "nyc3",
            "size": "512mb",
            "image": "ubuntu-14-04-x64",
            "ssh_keys": ['39:df:93:90:8c:87:14:cf:da:14:f4:e8:f7:f6:85:8b'],
            "backups": false,
            "ipv6": true,
            "user_data": null,
            "private_networking": null
        };
        digitalocean.createDroplet(myNewDropletData, function (error, result) {
            if (error) {
                done(error, null);
            } else {
                done(null, result);
            }
        });
    },
    // This method is not usefull yet and maybe not usefull all the time
    createPublicSSH: function (done) {
        return;
    },
    // Be patiant this method deletes droplet with id passed to the method
    deleteDroplet: function (id, done) {
        digitalocean.deleteDroplet(id, function (error, result) {
            if (error) {
                done(error, null);
            } else {
                done(null, result);
            }
        });
    },
    // Further goes methods that wraps async functions to work with DDP convention
    wrappedDropletInfo: function(id){
        var wrappedMaintainDroplets = Async.wrap(maintainDroplets.dropletInfo);
        return wrappedMaintainDroplets(id);
    },
    wrappedDropletList: function(){
        var wrappedMaintainDroplets = Async.wrap(maintainDroplets.listOfDroplets);
        return wrappedMaintainDroplets();
    },
    wrappedCreateFiveDollarDroplet: function(title){
        var wrappedMaintainDroplets = Async.wrap(maintainDroplets.createFiveDollarDroplet);
        return wrappedMaintainDroplets(title);
    },
    wrappedCreatePublicSSH: function(){
        var wrappedMaintainDroplets = Async.wrap(maintainDroplets.createPublicSSH);
        return wrappedMaintainDroplets();
    },
    wrappedDeleteDroplet: function(id){
        var wrappedMaintainDroplets = Async.wrap(maintainDroplets.deleteDroplet);
        return wrappedMaintainDroplets(id);
    }
};

/**
 * Object ssh to manipulate ssh connection and commands
 * Don't forget to create ssh key on nodejs server app and confirm it on digitalocean account
 */

var ssh = {
    // This will be useless after deployment and totaly now so can be deleted any time
    access: function(done) {
        process.stdin
            .pipe(execSSH('echo try typing something; cat -', 'root@45.55.63.157'))
            .pipe(process.stdout);
    },
    wrappedAccess: function(){
        var wrappedSSH = Async.wrap(ssh.access);
        return wrappedSSH();
    },
    // Install git on remote server via ssh from nodejs app
    gitInstall: function(done){
        var connection = new rexec.Connection({
            remote: 'root@104.131.65.46'
        });

        //Meteor.bindEnvironment(function(error, body) {
        connection.run('sudo apt-get update; sudo apt-get --assume-yes install git')
            .then( Meteor.bindEnvironment(function (result) {
                if (result) {
                    CustomResults.remove({},function(err, res) {
                        if (err) console.log(err);
                        CustomResults.insert({'git': 'created'}, function (err, res) {
                            if (err) console.log(err);
                            done(null, 'created');
                        });
                    });
                }

            })
        );
    },
    wrappedGitInstall: function(){
        var wrappedSSH = Async.wrap(ssh.gitInstall);
        return wrappedSSH();
    },
    readFile: function(){
        //var data = fs.readdirSync('./assets/app/');

        //var data = fs.readFileSync('./deploy.json', 'utf8');

        //api.addAssets(filenames, architecture);

        //var data = new FS.File('deploy.json');
        //FS.File = function(ref, createdByTransform) {
        //    var self = this;
        //
        //    self.createdByTransform = !!createdByTransform;
        //
        //    if (ref instanceof FS.File || isBasicObject(ref)) {
        //         Extend self with filerecord related data
                //FS.Utility.extend(self, FS.Utility.cloneFileRecord(ref, {full: true}));
            //} else if (ref) {
            //    self.attachData(ref);
            //}
        //};
    },
    uploadApp: function(dropletId, done){
        var ipAddress = digitalOceanApiCalls.getInfoDroplet(dropletId);
        //console.log(ipAddress.data.droplet.networks.v4[0].ip_address);
        var connection = new rexec.Connection({
            remote: 'root@'+ipAddress.data.droplet.networks.v4[0].ip_address
        });

        //Meteor.bindEnvironment(function(error, body) {
        connection.run('apt-get update; apt-get --assume-yes install git; git init; git clone -b ONLINE-droplets https://github.com/DemidovVladimir/devops.git; apt-get --assume-yes install build-essential libssl-dev; apt-get --assume-yes install npm; apt-get --assume-yes install nodejs; curl https://install.meteor.com/ | sh; export LC_ALL=C; sudo dd if=/dev/zero of=/swapfile bs=1024 count=256k; sudo mkswap /swapfile; sudo swapon /swapfile; echo "/swapfile       none    swap    sw      0       0" >> /etc/fstab; echo 10 | sudo tee /proc/sys/vm/swappiness; echo vm.swappiness = 10 | sudo tee -a /etc/sysctl.conf; sudo chown root:root /swapfile; sudo chmod 0600 /swapfile; cd devops; meteor')
            .then( Meteor.bindEnvironment(function (error, result) {
                if (result) {
                    CustomResults.remove({},function(err, res) {
                        if (err) console.log(err);
                        CustomResults.insert({'git': 'created'}, function (err, res) {
                            if (err) console.log(err);
                            done(null, 'created');
                        });
                    });
                }

            })
        );




        //console.log(fs.readdirSync('../server/assets/'));

        //if (!fs.existsSync("./"+ipAddress.data.droplet.id)){
        //    fs.mkdirSync("./"+ipAddress.data.droplet.id);
        //}
        //
        //Meteor.bindEnvironment(fs.writeFile("/deploy.json", content, function(err) {
        //    if(err) {
        //        return console.log(err);
        //    }
        //    console.log("The file was saved!");
        //}));





        //var command = spawn('MINA_CONFIG=./assets/app/deploy1.json mina deploy');
        //
        //command.stdout.on('data', function (data) {
        //    console.log('stdout: ' + data);
        //});
        //
        //command.stderr.on('data', function (data) {
        //    console.log('stderr: ' + data);
        //});
        //
        //command.on('close', function (code) {
        //    console.log('child process exited with code ' + code);
        //});
    },
    wrappedUploadApp: function(dropletId){
        var wrappedSSH = Async.wrap(ssh.uploadApp);
        return wrappedSSH(dropletId);
    }
};

Meteor.methods({
    // 2f3b35539598085aaedd8bfa5eb5af5bd89b0a26
    'deleteImages': function(){
        Images.remove({});
    },
    'getGitToken': function (user) {
        github.authenticate({
            type: "token",
            token: gitHubToken
        });
        github.authorization.get({id: gitHubToken.id,headers: {
        }}, function (err,res) {
            if (err) {
                console.log(err.msg);
            }
            if (res) {
                // gitHubToken = res.token;
                console.log(res);
                gitHubToken = res;
            }
        });
    },
    'deleteAuthGitHub': function (user) {
        github.authenticate({
            type: "token",
            token: gitHubToken
        });
        if (user) {
            github.authorization.delete({id: gitHubToken.id}, function (err,res) {
                if (err) {
                    console.log(err);
                }
                console.log('Deleted token - ' + res);
            });
        }
    },
    'receiveToken': function (user) {
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
        }, function (err, res) {
            if (res.token) {
                gitHubToken = res;
            }
        });
    },
    'createRepo': function (user) {
        // empty while
    },










    // All droplets manipulations
    'getDroplet': function (id) {
        var response = maintainDroplets.wrappedDropletInfo(id);
        console.log(response.droplet.networks.v4[0].ip_address);
        //Droplets.remove({});
        //Droplets.insert({infoOfDroplet: response});
    },
    'getDropletsList': function () {
        var response = maintainDroplets.wrappedDropletList();
        console.log(response);
        //Droplets.remove({});
        //Droplets.insert({listOfDroplets: response});
    },
    'createPublicSSH': function(){
        var response = maintainDroplets.wrappedCreatePublicSSH();
        Droplets.remove({});
        Droplets.insert({createdSSH: response});
    },
    'createFiveDollarDroplet': function(userId, dropletTitle){
        this.unblock();
        var response = maintainDroplets.wrappedCreateFiveDollarDroplet(dropletTitle);
        Droplets.insert({
            createdBy: userId,
            createdDropletId: response.droplet.id,
            dropletTitle: dropletTitle,
            date: new Date()
        });
    },
    'deleteDroplet': function(id){
        maintainDroplets.wrappedDeleteDroplet(id);
        Droplets.remove({createdDropletId: id});
    },
    'readFile': function(){
        ssh.readFile();
    },
    'uploadApp': function(id){
        ssh.wrappedUploadApp(id);
    },

    // All ssh operations
    'sshAccess': function(){
        ssh.wrappedAccess();
    },
    'sshGitInstall': function(){
        ssh.wrappedGitInstall();
    },
    'deleteResults': function(){
        CustomResults.remove({});
    },


    'checkHTTP': function () {
        this.unblock();
        try {
            var result = HTTP.call("GET", "https://api.digitalocean.com/v2/account",{
                headers:{
                    'Authorization': 'Bearer 53f18570fd32d2c80e57e05dd2f55f8dd8e3e5623948dc1cf8d25a74445130b4',
                    'Content-Type': 'application/json'
                }
                //data:{
                //    "name": "regionoil.kz",
                //    "ip_address": "128.199.237.84"
                //}
            });
            return true;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    }


});

/**
 * http calls to api
 * @type {{Object}}
 */
var digitalOceanApiCalls = {
    getInfoDroplet: function(id){
        try {
            var result = HTTP.call("GET", "https://api.digitalocean.com/v2/droplets/"+id,{
                headers:{
                    'Authorization': 'Bearer 53f18570fd32d2c80e57e05dd2f55f8dd8e3e5623948dc1cf8d25a74445130b4',
                    'Content-Type': 'application/json'
                }
            });
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return e;
        }
    }
};

