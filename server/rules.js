Configs.allow({
    'insert': function () {
        // add custom authentication code here
        return true;
    }
});

Images.allow({
    'insert': function () {
        // add custom authentication code here
        return true;
    },
    'update': function () {
        // add custom authentication code here
        return true;
    },
    'remove': function(){
        return true;
    }
});