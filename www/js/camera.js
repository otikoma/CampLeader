// This is a JavaScript file

var persistentDirectoryEntry;
var fileurl;
var scope;

function camerainit() {
    if(window.requestFileSystem != undefined) {
        // あらかじめPERSISTENTファイルシステムを要求し，DirectoryEntryオブジェクトを取得しておく
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getPersistentDirectoryEntry, failFS);
    }
}

function getPersistentDirectoryEntry(fileSystem) {
    persistentDirectoryEntry = fileSystem.root;
}

function camera($scope) {
  fileurl = null;
  scope = $scope;
  sourceType = Camera.PictureSourceType.CAMERA;
  navigator.camera.getPicture(getPictureSuccess, failCamera,
  {
    quality: 10,
    destinationType: Camera.DestinationType.FILE_URI ,
    correctOrientation: true,
//    allowEdit : true,
    sourceType: sourceType
  });
}

function album($scope) {
  fileurl = null;
  scope = $scope;
  sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
  navigator.camera.getPicture(getPictureSuccess, failCamera,
  {
    quality: 10,
    destinationType: Camera.DestinationType.FILE_URI ,
    correctOrientation: true,
    allowEdit : true,
    sourceType: sourceType
  });
}

function getPictureSuccess(uri) {
  // Camera APIから渡されるファイルパスと，resolveLocalFileSystemURIメソッドを用いて
  // TEMPORARYファイルシステムに作成された画像ファイルのFileEntryオブジェクトを取得する
  window.resolveLocalFileSystemURL(uri, moveToPersistent, failFS);
}
function moveToPersistent(fileEntry) {
  // あらかじめ取得しておいたPERSISTENTファイルシステムのDirectoryEntryオブジェクトと
  // resolveLocalFileSystemURIメソッドで取得したFileEntryオブジェクトを用いて，ファイルをPERSISTENTに移動
  fileEntry.moveTo(persistentDirectoryEntry, createId("IMG",".jpg"), moveToSuccess, failFS);
}

function moveToSuccess(fileEntry) {
    scope.$apply(function() {
        scope.edititem.images.push({"src":fileEntry.toURL(),"class":"heightlong", "name" : fileEntry.name, "newflg" : true});
    });
    
}

function failCamera(message) {
  //alert('カメラ操作に失敗しました。\n' + message);
}

function failFS(error) {
  //alert('ファイルシステム操作に失敗しました。\nエラーコード: ' + error.code);
}

function deleteImage(name) {
//    alert(name);
    persistentDirectoryEntry.getFile(name,{}, delFile, errorDel);
}

function delFile(entry) {
    entry.remove(successDel, errorDel);
}
function successDel() {
    //alert('削除したよ！');
}
function errorDel() {
    //alert('削除失敗！');
}
function deleteImageAll() {
    var directoryReader = persistentDirectoryEntry.createReader();
    directoryReader.readEntries(delFileAll, errorDel);
}
function delFileAll(entries) {
    for ( index = 0; index < entries.length; index++ ) {
        if ( entries[index].isFile ) {
            entries[index].remove(successDel, errorDel);
        }
    }
}