// This is a JavaScript file

app.controller('GearListController', function($scope, $filter, GearGenre, GearData) {
            $scope.genres = GearGenre.items;
            $scope.items = GearData.items;
            $scope.openDetail = function(gearid) {
                GearData.selectedItem = $filter("filter")(GearData.items, {"gearid" : gearid})[0];
                app.navi.pushPage('html/gear/gearDetail.html');
            };
            $scope.getItems = function(genreid) {
                var items = $filter("filter")($scope.items, {"genreid" : genreid});
                return items;
            };
            $scope.getImage = function(item) {
                var images = item.images;
                if(images === undefined || images.length ==0) {
                    return "images/noimage.gif";
                }else {
                    return images[0].src;
                }
            };
            $scope.openEdit = function() {
                GearData.selectedItem = {"genreid" : "g001", "gearid" : createId('GR'), "name" : "","text":"","price":"","brand":"", "images":[]};
                app.navi.pushPage('html/gear/gearEdit.html');
            };
            app.navi.on("postpop", function() {
                $scope.$apply(function () {
                    $scope.items = GearData.items;
                });
            });
            $scope.isios = monaca.isIOS;
        });
app.controller('GearDetailController', function($scope, $filter, GearGenre, GearData) {
            $scope.item = GearData.selectedItem;
            $scope.genre = $filter("filter")(GearGenre.items, {"genreid" : $scope.item.genreid})[0];
            $scope.openEdit = function() {
                app.navi.pushPage('html/gear/gearEdit.html');
            }
            app.navi.on("postpop", function() {
                $scope.item = GearData.selectedItem;
                $scope.$apply(function () {
                    setImmediate(function() {
                        carousel_detail.refresh();
                    });
                });
            });
            $scope.isios = monaca.isIOS;
        });
app.controller('GearEditController', function($scope, $filter, GearGenre, GearData) {
            $scope.item = GearData.selectedItem;
            $scope.edititem = angular.copy($scope.item);
            $scope.genres = GearGenre.items;
            $scope.genre = $filter("filter")(GearGenre.items, {"genreid" : $scope.item.genreid})[0];
            
            $scope.noimage = ($scope.edititem.images === undefined || $scope.edititem.images.length == 0);
            
            $scope.backPage = function() {
                //登録していない画像を削除
                if(!$scope.noimage) {
                    angular.forEach($scope.edititem.images, function(image) {
                        if(image.newflg){
                            deleteImage(image.name);
                            var index = $scope.edititem.images.indexOf(image);
                            $scope.edititem.images.splice(index, 1);
                        }
                    });
                }
                app.navi.popPage();
            };
            $scope.update = function() {
                //画像
                var newImages = [];
                angular.forEach($scope.edititem.images, function(image) {
                    if(image.isdelete) {
                        deleteImage(image.name);
                    } else {
                        newImages.push({"src" : image.src, "class":image.class, "name": image.name});
                    }
                });
                $scope.edititem.images = newImages;
                //データ登録
                var olditems = GearData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.edititem.gearid === item.gearid) {
                        var index = GearData.items.indexOf(item);
                        GearData.items.splice(index, 1);
                    }
                });
                GearData.items.push($scope.edititem);
                GearData.selectedItem = $scope.edititem;
                if(saveStrageData('GearData', GearData.items)) {
                    app.navi.popPage();
                }
            };
            //ダイアログ
            ons.ready(function() {
                $scope.genreCls = $scope.genre.cls;
                ons.createDialog('html/gear/genresDialog.html', {parentScope: $scope}).then(function(dialog) {
                    $scope.dialog = dialog;
                });
                camerainit();
            });
            $scope.showDialog = function() {
                $scope.dialog.show();
            };
            $scope.hideDialog = function() {
                $scope.dialog.hide();
            };
            
            $scope.openCamera = function() {
                camera($scope);
            }
            $scope.openAlbum = function() {
                album($scope);
            }
            
            $scope.tempDeleteImage = function() {
                angular.forEach($scope.edititem.images, function(image) {
                    if(image.checked){
                        image.checked = false;
                        image.isdelete = true;
                    }
                });
            }
            $scope.setGenre = function(genreid) {
                $scope.genre = $filter("filter")($scope.genres, {"genreid" : genreid})[0];
                $scope.edititem.genreid = $scope.genre.genreid;
                $scope.genreCls = $scope.genre.cls;
                $scope.hideDialog();
            }
            $scope.selectImage =function(image) {
                if(image.checked) {
                    image.checked = false;
                } else{ 
                    image.checked = true;
                }
            }
            $scope.isios = monaca.isIOS;
        });