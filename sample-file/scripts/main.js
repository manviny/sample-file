document.addEventListener("deviceready", onDeviceReady, false);

var fileSystemHelper;

function onDeviceReady() {
    var writeFileButton = document.getElementById("writeFileButton"),
        readFileButton = document.getElementById("readFileButton"),
        deleteFileButton = document.getElementById("deleteFileButton");
    
    writeFileButton.addEventListener("click", writeTextToFile);
    readFileButton.addEventListener("click", readTextFromFile);
    deleteFileButton.addEventListener("click", deleteFile);

    fileSystemHelper = new FileSystemHelper("readme.txt", "results");
}

function deleteFile() {
    fileSystemHelper.deleteFile();
}

function readTextFromFile() {
    fileSystemHelper.readTextFromFile();
}

function writeTextToFile() {
    fileSystemHelper.writeTextToFile('Line');
}