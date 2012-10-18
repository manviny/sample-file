
function FileSystemHelper() { 
}

FileSystemHelper.prototype = {
	writeLine: function(fileName, text, onSuccess, onError) {
		var that = this;
		var grantedBytes = 0;

		window.requestFileSystem(LocalFileSystem.PERSISTENT, grantedBytes,
								 function(fileSystem) {
									 that.createFile.call(that, fileSystem, fileName, text, onSuccess, onError);
								 },
								 function(error) {
									 error.message = "Request file system failed.";
									 onError.call(that, error);
								 });
	},
    
	createFile: function(fileSystem, fileName, text, onSuccess, onError) { 
		var that = this;
		var options = {
			create: true, 
			exclusive: false
		};

		fileSystem.root.getFile(fileName, options,
								function(fileEntry) {
									that.createFileWriter.call(that, fileEntry, text, onSuccess, onError);
								},
								function (error) {
									error.message = "Failed creating file.";
									onError.call(that, error);
								});
	},
    
	createFileWriter: function(fileEntry, text, onSuccess, onError) {
		var that = this;
		fileEntry.createWriter(
			function(fileWriter) {
				var len = fileWriter.length;
				fileWriter.seek(len);
				fileWriter.write(text + '\n');
				var message = "Wrote: " + text;
				onSuccess.call(that, message);
			},
			function(error) {
				error.message = "Unable to create file writer.";
				onError.call(that, error);
			});
        
	},

	readTextFromFile : function(fileName, onSuccess, onError) {
		var that = this;
        
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
								 function(fileSystem) {
									 that.getFileEntry.call(that, fileSystem, fileName, onSuccess, onError);
								 },
								 function(error) {
									 error.message = "Unable to request file system.";
									 onError.call(that, error);
								 });
	},
    
	getFileEntry: function(fileSystem, fileName, onSuccess, onError) {
        
		var that = this;
		// Get existing file, don't create a new one.
		fileSystem.root.getFile(fileName, null,
								function(fileEntry) {
									that.getFile.call(that, fileEntry, onSuccess, onError);
								}, 
								function(error) {
									error.message = "Unable to get file entry for reading.";
									onError.call(that, error);
								});
	},

	getFile: function(fileEntry, onSuccess, onError) { 
		var that = this; 
		fileEntry.file(
			function(file) { 
				that.getFileReader.call(that, file, onSuccess);
			},
			function(error) {
				error.message = "Unable to get file for reading.";
				onError.call(that, error);
			});
	},

	getFileReader: function(file, onSuccess) {
		var that = this;
		var reader = new FileReader();
		reader.onloadend = function(evt) { 
			var textToWrite = evt.target.result;
			onSuccess.call(that, textToWrite);
		};
        
		reader.readAsText(file);
	},
   
    
	deleteFile: function(fileName, onSuccess, onError) {
		var that = this;
       
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
			that.getFileEntryForDelete.call(that, fileSystem, fileName, onSuccess, onError);
		}, function(error) {
			error.message = "Unable to retrieve file system.";
			onError.call(that, error);
		});
	}, 
    
	getFileEntryForDelete: function(fileSystem, fileName, onSuccess, onError) { 
		var that = this;
		fileSystem.root.getFile(fileName, null, 
								function (fileEntry) {
									that.removeFile.call(that, fileEntry, onSuccess, onError);
								},
								function(error) {
									error.message = "Unable to find the file.";
									onError.call(that, error)
								});
	},
    
	removeFile : function(fileEntry, onSuccess, onError) {
		var that = this;
		fileEntry.remove(function (entry) {
			var message = "File removed.";
			onSuccess.call(that, message);
		}, function (error) {
			error.message = "Unable to remove the file.";
			onError.call(that, error)
		});
	}
};