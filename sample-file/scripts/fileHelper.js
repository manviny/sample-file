
function FileSystemHelper(fileName, notificationElementId) { 
    this.fileName =  fileName;
    this.notificationElementId = notificationElementId;
    this.initializeFileToWrite();
}

FileSystemHelper.prototype = {
    savedWriter: null,
    fileName: null,
    notificationElementId: null,
    
    writeNotification: function(value) {
        var notificationBox = document.getElementById(this.notificationElementId);
        notificationBox.innerText = value;
    },
    
    initializeFileToWrite: function() {
        var that = this;
        var grantedBytes = 0;
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, grantedBytes,
            function() {
                that.createFile.apply(that, arguments);
            },
            function(error) {
                 writeNotification("Request file system failed. Code = " + error.code);
            });
    },
    
    createFile: function(fileSystem) { 
        var that = this;
        var options = {
            create: true, 
            exclusive: false
        };
        
        fileSystem.root.getFile(that.fileName, options,
            function() {
                that.createFileWriter.apply(that, arguments);
            },
            function (error) {
                writeNotification("Failed creating file. Code = " + error.code);
            });
    },
    
    createFileWriter: function(fileEntry) {
        var that = this; 
        fileEntry.createWriter(
            function() {
                that.saveWriter.apply(that, arguments);
            },
            function(error) {
               writeNotification("Unable to create file writer. Code = " + error.code);
            });
    },

    saveWriter: function(writer) {
        var that = this;
        that.savedWriter = writer;
    },
    
    readTextFromFile : function() {
        var that = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
            function() {
                that.getFileEntry.apply(that, arguments);
            },
            function(error) {
                that.writeNotification("Unable to request file system. Code = " + error.code);
            });
    },
    
    getFileEntry: function(fileSystem) {
        var that = this;
        // Get existing file, don't create a new one.
        fileSystem.root.getFile(that.fileName, null,
            function() {
                that.getFile.apply(that, arguments);
            }, 
            function(error) {
                that.writeNotification("Unable to get file entry for reading. Code = " + error.code); 
            });
    },

    getFile: function(fileEntry) {
        var that = this; 
        fileEntry.file(
            function() {
                that.getFileReader.apply(that, arguments);
            },
            function(error) {
                that.writeNotification("Unable to get file for reading. Code = " + error.code);
            });
    },

    getFileReader: function(file) {
        var that = this;
        var reader = new FileReader();
        
        reader.onloadend = function(evt) { 
            console.log(evt);
            var textToWrite = evt.target.result;
            that.writeNotification(textToWrite);
        };
        reader.readAsText(file);
    },
    
    writeTextToFile: function(text) {
        var that = this;
        if (fileSystemHelper.savedWriter) {
            that.savedWriter.write(text + "\n");
            that.writeNotification("Wrote '" + text + "'");
        }
        else {
            that.writeNotification("No writer initialized!"); 
        }
    },
    
    deleteFile: function() {
        var that = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function() {
            that.getFileEntryForDelete.apply(that, arguments);
        }, function() {
            fileSystemHelper.writeNotification("Unable to retrieve file system.");
        });
    }, 
    
    getFileEntryForDelete: function(fileSystem) {
        var that = this;
        fileSystem.root.getFile(that.fileName, null, 
            function () {
                that.removeFile.apply(that, arguments);
            } , 
            function() {
                fileSystemHelper.writeNotification("Unable to find the file.");
            });
    },
    
    removeFile : function(fileEntry) {
        fileEntry.remove(function (entry) {
            fileSystemHelper.writeNotification("Removed the file.");
        }, function (error) {
            fileSystemHelper.writeNotification("Unable to remove the file.");
        });
    }
    
};