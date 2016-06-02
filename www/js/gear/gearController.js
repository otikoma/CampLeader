// This is a JavaScript file

app.controller('GearListController', function($scope, $filter, GearGenre, GearData) {
            $scope.genres = GearGenre.items;
            $scope.items = $filter("filter")(GearData.items, {"deleteflg" : '!1'});
            $scope.searchOpen = false;
            $scope.openDetail = function(gearid) {
                GearData.selectedItem = $filter("filter")(GearData.items, {"gearid" : gearid})[0];
                app.navi.pushPage('html/gear/gearDetail.html');
            };
            $scope.getGenres = function() {
                if($scope.serachGenre && $scope.serachGenre.length > 0) {
                    return $filter("filter")($scope.genres, {"genreid" : $scope.serachGenre});
                } else {
                    return $scope.genres;
                }
            }
            $scope.getItems = function(genreid) {
                var items = $filter("filter")($scope.items, {"genreid" : genreid});
                items = $filter("orderBy")(items,"name");
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
                GearData.selectedItem = {"genreid" : "g001", "gearid" : createId('GR'), "name" : "","text":"","price":"","brand":"", "images":[], "plancategory":[],"deleteflg":"0"};
                app.navi.pushPage('html/gear/gearEdit.html');
            };
            $scope.delete = function(gearid) {
                //データ削除
                if(!window.confirm(deletemsg)) {
                    return;
                }
                var olditems = GearData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if (gearid === item.gearid) {
                        angular.forEach(item.images, function(image) {
                            deleteImage(image.name);
                        });
                        var index = GearData.items.indexOf(item);
                        GearData.items.splice(index, 1);
                        GearData.items.push({"genreid" : item.genreid, "gearid" : item.gearid, "name" : item.name,"text":"","price":"","brand":item.brand, "images":[], "plancategory":item.plancategory,"deleteflg":"1"});
                    }
                });
                saveStrageData('GearData', GearData.items);
            }
            app.navi.on("postpop", function() {
                $scope.items = GearData.items;
            });
        });
app.controller('GearDetailController', function($scope, $filter, GearGenre, GearData, PlanCategory) {
            $scope.item = GearData.selectedItem;
            $scope.genre = $filter("filter")(GearGenre.items, {"genreid" : $scope.item.genreid})[0];
            $scope.genreCls = $scope.genre.cls;
            $scope.images = $scope.item.images;
            $scope.plancategory = PlanCategory.items;
            if($scope.images === undefined || $scope.images.length ==0) {
                $scope.images = [{src:"images/noimage.gif",class:"heightlong"}];
            }
            $scope.openEdit = function() {
                app.navi.pushPage('html/gear/gearEdit.html');
            }
            $scope.plancategoryexists = function (item) {
                return $scope.item.plancategory.indexOf(item) > -1;
            };
            app.navi.on("postpop", function() {
                $scope.item = GearData.selectedItem;
                $scope.genre = $filter("filter")(GearGenre.items, {"genreid" : $scope.item.genreid})[0];
                $scope.genreCls = $scope.genre.cls;
                $scope.images = $scope.item.images;
                if($scope.images === undefined || $scope.images.length ==0) {
                    $scope.images = [{src:"images/noimage.gif",class:"heightlong"}];
                }
                $scope.$apply(function () {
                    setImmediate(function() {
                        carousel_detail.refresh();
                    });
                });
            });
            $scope.isios = monaca.isIOS;
        });
app.controller('GearEditController', function($scope, $filter, $mdDialog, GearGenre, GearData, PlanCategory) {
            $scope.item = GearData.selectedItem;
            $scope.edititem = angular.copy($scope.item);
            $scope.genres = GearGenre.items;
            $scope.plancategory = PlanCategory.items;
            $scope.genre = $filter("filter")(GearGenre.items, {"genreid" : $scope.item.genreid})[0];
            
            $scope.noimage = ($scope.edititem.images === undefined || $scope.edititem.images.length == 0);
            
            $scope.backPage = function() {
                if(!window.confirm(msg)) {
                    return;
                }
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
                camerainit();
            });

            //ダイアログ表示
            $scope.showDialog = function(ev) {
                $mdDialog.show({
                    controller: GenreDialogController,
                    templateUrl: 'html/gear/genresDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen:false
                })
                .then(function(answer) {
                    $scope.setGenre(answer);
                }, function() {
                    return;
                });
            };
            function GenreDialogController($scope, GearGenre){
                $scope.genres = GearGenre.items;
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
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
            $scope.plancategorytoggle = function (item) {
                blur();
                var idx = $scope.edititem.plancategory.indexOf(item);
                if (idx > -1) {
                    $scope.edititem.plancategory.splice(idx, 1);
                }
                else {
                    $scope.edititem.plancategory.push(item);
                }
            };
            $scope.plancategoryexists = function (item) {
                return $scope.edititem.plancategory.indexOf(item) > -1;
            };
        });