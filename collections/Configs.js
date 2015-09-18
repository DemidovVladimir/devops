Configs = new FS.Collection("configs", {
    stores: [new FS.Store.FileSystem("configs", {path: "~/configs"})]
});