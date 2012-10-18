document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var fileApp = new FileApp();
	fileApp.run();
}

function FileApp() {
}

FileApp.prototype = {
	fileSystemHelper: null,
	fileNameField: null,
	textField: null,
     
	run: function() {
		var that = this,
    		writeFileButton = document.getElementById("writeFileButton"),
    		readFileButton = document.getElementById("readFileButton"),
    		deleteFileButton = document.getElementById("deleteFileButton");
        
		that.fileNameField = document.getElementById("fileNameInput");
		that.textField = document.getElementById("textInput");
        
		writeFileButton.addEventListener("click",
										 function() { 
											 that.writeTextToFile.call(that); 
										 });
        
		readFileButton.addEventListener("click",
										function() {
											that.readTextFromFile.call(that);
										});
        
		deleteFileButton.addEventListener("click",
										  function() {
											  that.deleteFile.call(that)
										  });
        
		fileSystemHelper = new FileSystemHelper();
	},
    
	deleteFile: function () {
		var that = this,
		    fileName = that.fileNameField.value;
        
		if (that.isValidFileName(fileName)) {
			fileSystemHelper.deleteFile(fileName, that.onSuccess, that.onError);
		}
		else {
			var error = { code: 44, message: "Invalid filename"};
			that.onError(error);
		}
	},
    
	readTextFromFile: function() {
		var that = this,
		    fileName = that.fileNameField.value;
        
		if (that.isValidFileName(fileName)) {
			fileSystemHelper.readTextFromFile(fileName, that.onSuccess, that.onError);
		}
		else {
			var error = { code: 44, message: "Invalid filename"};
			that.onError(error);
		}
	},
    
	writeTextToFile: function() {
		var that = this,
    		fileName = that.fileNameField.value,
    		text = that.textField.value;

		if (that.isValidFileName(fileName)) {
			fileSystemHelper.writeLine(fileName, text, that.onSuccess, that.onError)
		}
		else {
			var error = { code: 44, message: "Invalid filename"};
			that.onError(error);
		}
	},
    
	onSuccess: function(value) {
		var notificationBox = document.getElementById("result");
		notificationBox.innerText = value;
	},
    
	onError: function(error) {

		var errorCodeDiv = document.createElement("div"),
    		errorMessageDiv = document.createElement("div"),
    		notificationBox = document.getElementById("result");

		errorCodeDiv.innerText = "Error code: " + error.code;
		errorMessageDiv.innerText = "Message: " + error.message;
        
		notificationBox.innerHTML = "";
		notificationBox.appendChild(errorCodeDiv);
		notificationBox.appendChild(errorMessageDiv);
	},
    
	isValidFileName: function(fileName) {
		//var patternFileName = /^[\w]+\.[\w]{1,5}$/;

		return fileName.length > 2;
	}
}