// This is a JavaScript file
app.controller('PlanListController', function($scope, $filter, PlanData, ShareData) {
            $scope.items = PlanData.items;
            $scope.openDetail = function(planid) {
                PlanData.selectedItem = $filter("filter")(PlanData.items, {"planid" : planid})[0];
                app.navi.pushPage('html/plan/planDetail.html');
            };
            $scope.getItems = function() {
                var itemArr = new Array();
                if(!$scope.selectedMonth) {
                    itemArr = $scope.items;
                } else {
                    //年月でフィルタリングしたい
                    angular.forEach($scope.items, function(item) {
                        if("" + item.datefrom.getFullYear() + item.datefrom.getMonth() === "" + $scope.selectedMonth.getFullYear() + $scope.selectedMonth.getMonth()) {
                            itemArr.push(item);
                        }
                    });
                }
                //var items = $scope.items;
                return itemArr;
            };
            $scope.selectedMonthFilter = function(element) {
                if(!$scope.selectedMonth) return true;
                return element.datefrom.getMonth() == $scope.selectedMonth;
            }
            $scope.getImage = function(item) {
                var images = item.images;
                if(images === undefined || images.length ==0) {
                    return "images/noimage.gif";
                }else {
                    return images[0].src;
                }
            };
            $scope.openEdit = function() {
                PlanData.selectedItem = {"planid" : createId('PL'), "title" : "","datefrom":new Date(),"dateto":new Date(),"text":"", "images":[], "schedules":[], "expenses":[]};
                app.navi.pushPage('html/plan/eventEdit.html');
            };
            $scope.share = function(item) {
                var text = "■" + item.title + "\n";
                text = text + "■日程\n";
                text = text + "　" + $filter('date')(item.datefrom, "MM月dd日")  + "～" + $filter('date')(item.dateto, "MM月dd日") + "\n";
                text = text + "\n";
                if(item.text != "") {
                    text = text + item.text + "\n";
                }
                text = text + "■スケジュール\n";
                var schedules = $filter("orderBy")(item.schedules, "timefrom");
                var date ="";
                angular.forEach(schedules, function(schedule) {
                    if($filter('date')(schedule.timefrom, "MM月dd日") != date) {
                        date = $filter('date')(schedule.timefrom, "MM月dd日");
                        text = text + "　" + date + "\n";
                    }
                    text = text + "　" + $filter('date')(schedule.timefrom, "H時mm分")  + "～" + $filter('date')(schedule.timeto, "H時mm分") + "\n";
                    text = text + "　" + schedule.title + "\n";
                    if(schedule.text != "") {
                        text = text + "　　" + schedule.text + "\n";
                    }
                });
                ShareData.subject = item.title;
                ShareData.text = text;
                app.navi.pushPage('html/share/share.html');
            }
            
            $scope.delete = function(planid) {
                //データ削除
                if(!window.confirm(deletemsg)) {
                    return;
                }
                var olditems = PlanData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if (planid === item.planid) {
                        var index = PlanData.items.indexOf(item);
                        PlanData.items.splice(index, 1);
                    }
                });
                if(saveStrageData('PlanData', PlanData.items)) {
                    app.navi.popPage();
                }
            }
            app.navi.on("postpop", function() {
                $scope.$apply(function () {
                    $scope.items = PlanData.items;
                });
            });
        });
app.controller('PlanDetailController', function($scope, $filter, $mdDialog, $mdMedia, PlanData, PlanCategory, ExpenseCategory,
    GearGenre,GearData, SettingData) {
            $scope.item = PlanData.selectedItem;
            $scope.exCategory = ExpenseCategory.items;
            $scope.selectedIndex = 0;
            $scope.plancategory = PlanCategory.items;
            $scope.genres = GearGenre.items;
            $scope.gears = GearData.items;
            $scope.numpeople = $scope.item.numpeople;
            $scope.getSchedulesDate = function(date) {
                var start = new Date(date);
                var end = new Date(date);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59);
                var schedules = [];
                angular.forEach($scope.item.schedules, function(schedule, i) {
                    var timefrom = new Date(schedule.timefrom);
                    if(timefrom >= start && timefrom <= end) {
                        schedules.push(schedule);
                    }
                });
                schedules = $filter("orderBy")(schedules, "timefrom");
                return schedules;
            }
            $scope.getGear = function(gearid) {
                return $filter("filter")(GearData.items, {"gearid" : gearid})[0];
            }
            $scope.getExTitle = function(expense) {
                    if(expense.category === "e01") {
                        return "キャンプ場";
                    } else if(expense.category === "e02") {
                        return "移動費";
                    } else if(expense.category === "e04") {
                        return expense.datas.title;
                    }
                
            }
            //編集・追加ボタン押下
            $scope.openEdit = function(ev) {
                if($scope.selectedIndex === 0) {
                    app.navi.pushPage('html/plan/eventEdit.html');
                } else if($scope.selectedIndex === 1) {
                    $scope.openAddSchedule();
                } else if($scope.selectedIndex === 2) {
                    $scope.showDialog();
                } else if($scope.selectedIndex === 3) {
                    $scope.openSetGears();
                }
            }
            //予定の追加
            $scope.openAddSchedule = function() {
                var timefrom = new Date($scope.item.datefrom);
                var timeto = new Date($scope.item.datefrom);
                timefrom.setHours(7, 0, 0, 0);
                timeto.setHours(7, 0, 0, 0);
                
                PlanData.selectedSchedule = {"scheduleid" : createId('SC'), "title" : "","timefrom": timefrom,"timeto": timeto,"text":""};
                app.navi.pushPage('html/plan/scheduleEdit.html');
            }
            //予定の編集
            $scope.openEditSchedule = function(scheduleid) {
                PlanData.selectedSchedule = $filter("filter")($scope.item.schedules, {"scheduleid" : scheduleid})[0];
                app.navi.pushPage('html/plan/scheduleEdit.html');
            }
            //金額の編集
            $scope.openEditExpense = function(expenseid) {
                PlanData.selectedExpence = $filter("filter")($scope.item.expenses, {"expenseid" : expenseid})[0];
                var category = PlanData.selectedExpence.category;
                if("e01" == category) {
                    app.navi.pushPage('html/plan/campsight/exCampsight.html');
                } else if("e02" == category) {
                    app.navi.pushPage('html/plan/move/exMoving.html');
                } else if("e04" == category) {
                    app.navi.pushPage('html/plan/otherex/exOther.html');
                }
            }
            //キャンプ場代入力
            $scope.openAddExCampfield = function() {
                var days = $scope.getDates().length;
                if(days > 1) {
                    days = days -1; //泊数
                }
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e01","total": 0,"datas": {
                        "campsitename":"","days": days, "entrance_fee" : "", "people_num" : $scope.item.numpeople, "entrance_fee_child" : "", "people_num_child" : $scope.item.numchild, "sight_fee" : "", "sight_num" : 1
                    }
                };
                app.navi.pushPage('html/plan/campsight/exCampsight.html');
                $scope.hideDialog();
            }
            //交通費入力
            $scope.openAddExMoving = function() {
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e02","total": 0,"datas": {
                        "car":"","fuel_consumption": SettingData.items.fuel_consumption, "gasoline_price" : SettingData.items.gasoline_price, "distance" : "", "highway_outward" : "", "highway_homeward" : ""
                    }
                };
                app.navi.pushPage('html/plan/move/exMoving.html');
                $scope.hideDialog();
            }
            //その他費用入力
            $scope.openAddExOther = function() {
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e04","total": 0,"datas": {
                        "title":"","expence": ""
                    }
                };
                app.navi.pushPage('html/plan/otherex/exOther.html');
                $scope.hideDialog();
            }
            $scope.openSetGears = function() {
                app.navi.pushPage('html/plan/belongings/setBelongings.html');
            }
            //アイコン画像取得
            $scope.getIcon = function(categoryid) {
                var category = $filter("filter")($scope.exCategory, {"categoryid" : categoryid})[0];
                return category.img;
            }
            //合計金額
            $scope.total = function() {
                var total = 0;
                angular.forEach($scope.item.expenses, function(expense, i) {
                    total += expense.total;
                });
                return "" + total;
            }
            $scope.division = function() {
                if($scope.numpeople > 0) {
                    return Math.floor($scope.total() / $scope.numpeople);
                } else {
                    return $scope.total();
                }
            }
            //日付リストの取得（出発日～終了日）
            $scope.getDates = function() {
                var dates = [];
                var date = new Date($scope.item.datefrom);
                var dateto = new Date($scope.item.dateto);
                while (date <= dateto) {
                    dates.push($filter("date")(date, "yyyy/MM/dd"));
                    date.setDate(date.getDate() + 1);
                }
                return dates;
            }
            //ダイアログ表示
            $scope.showDialog = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'html/plan/dialogExCategory.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen:false
                })
                .then(function(answer) {
                    if(answer === "e01") {
                        $scope.openAddExCampfield();
                    } else if(answer === "e02") {
                        $scope.openAddExMoving();
                    } else if(answer === "e04") {
                        $scope.openAddExOther();
                    }
                }, function() {
                    return;
                });
            };
            //ダイアログ内のコントローラー
            function DialogController($scope, $mdDialog, ExpenseCategory) {
                $scope.categories = ExpenseCategory.items;
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
            $scope.deleteSchedule = function(scheduleid) {
                //データ削除
                if(!window.confirm(deletemsg)) {
                    return;
                }
                var olditems = $scope.item.schedules;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if (scheduleid === item.scheduleid) {
                        var index = $scope.item.schedules.indexOf(item);
                        $scope.item.schedules.splice(index, 1);
                    }
                });
                $scope.update();
            }
            $scope.deleteExpense = function(expenseid) {
                //データ削除
                if(!window.confirm(deletemsg)) {
                    return;
                }
                var olditems = $scope.item.expenses;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if (expenseid === item.expenseid) {
                        var index = $scope.item.expenses.indexOf(item);
                        $scope.item.expenses.splice(index, 1);
                    }
                });
                $scope.update();
            }
            $scope.update = function() {
                //データ登録
                var olditems = PlanData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.item.planid === item.planid) {
                        var index = PlanData.items.indexOf(item);
                        PlanData.items.splice(index, 1);
                    }
                });
                PlanData.items.push($scope.item);
                PlanData.selectedItem = $scope.item;
                saveStrageData('PlanData', PlanData.items);
            }
        
            $scope.getGenres = function() {
                return $scope.genres;
            }
            $scope.getGears = function(genreid) {
                var gears = [];
                angular.forEach($scope.item.gears, function(value) {
                    var gear = $scope.getGear(value.gearid);
                    if(gear.genreid === genreid) {
                        gears.push(value);
                    }
                });
                return gears;
            }
            $scope.toggleCheck = function(gearitem) {
                gearitem.selected = !gearitem.selected;
                $scope.update();
            }
            app.navi.on("postpop", function() {
                $scope.item = PlanData.selectedItem;
                $scope.$apply();
            });
        });
app.controller('PlanEditController', function($scope, $filter, $location,$timeout, $anchorScroll, PlanData, PlanCategory, GearData) {
            $scope.item = PlanData.selectedItem;
            $scope.edititem = angular.copy($scope.item);
            $scope.plancategory = PlanCategory.items;
            $scope.gears = GearData.items;
            //日付変換    
            $scope.edititem.datefrom = new Date($scope.edititem.datefrom);
            $scope.edititem.dateto = new Date($scope.edititem.dateto);
            
            $scope.backPage = function() {
                if(!window.confirm(msg)) {
                    return;
                }
                app.navi.popPage();
            };
            $scope.update = function() {
                //データ登録
                if($scope.edititem.gears === undefined) {
                    $scope.edititem.gears = [];
                    angular.forEach($scope.gears, function(gear) {
                        if(gear.plancategory.indexOf($scope.edititem.plancategory) >= 0) {
                            gear.selected = false;
                            $scope.edititem.gears.push({"gearid":gear.gearid,"selected":false});
                        }
                    });
                }
                var olditems = PlanData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.edititem.planid === item.planid) {
                        var index = PlanData.items.indexOf(item);
                        PlanData.items.splice(index, 1);
                    }
                });
                PlanData.items.push($scope.edititem);
                PlanData.selectedItem = $scope.edititem;
                if(saveStrageData('PlanData', PlanData.items)) {
                    app.navi.popPage();
                }
            }
            $scope.jumpTo = function (id) {
                $timeout(function() {
                    $location.hash(id);
                    $anchorScroll();
                }, 500);
            }
        });
app.controller('ScheduleEditController', function($scope, $controller, $filter, PlanData) {
            $controller('PlanEditController', {$scope: $scope}); //This works
            $scope.editSchedule = angular.copy(PlanData.selectedSchedule);
            $scope.updateSchedule = function() {
                var newSchedule;
                var selectedDate = new Date($scope.selectDate);
                var timefrom = new Date($scope.editSchedule.timefrom);
                var timeto = new Date($scope.editSchedule.timeto);
                timefrom.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                timeto.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                
                $scope.editSchedule.timefrom = timefrom;
                $scope.editSchedule.timeto = timeto;
                var olditems = $scope.edititem.schedules;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.editSchedule.scheduleid === item.scheduleid) {
                        var index = $scope.edititem.schedules.indexOf(item);
                        $scope.edititem.schedules.splice(index, 1);
                    }
                });
                $scope.edititem.schedules.push($scope.editSchedule);
                $scope.update();
            }
            $scope.dates = [];
            var idx,selectIdx = 0;
            var date = new Date($scope.edititem.datefrom);
            var dateto = new Date($scope.edititem.dateto);
            while (date <= dateto) {
                $scope.dates.push($filter("date")(date, "yyyy/MM/dd"));
                if($filter("date")(date, "yyyy/MM/dd") === $filter("date")($scope.editSchedule.timefrom, "yyyy/MM/dd")) {
                    $scope.selectDate = $filter("date")(date, "yyyy/MM/dd");
                }
                date.setDate(date.getDate() + 1);
                idx++;
            }
});

app.controller('BelongingsController', function($scope, $controller, $filter, PlanData, GearGenre, GearData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.genres = GearGenre.items;
        $scope.items = $filter("filter")(GearData.items, {"deleteflg" : '!1'});;
        $scope.selectedGear = $scope.edititem.gears;
        
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
        $scope.isChecked = function(gearid) {
            for(var i=0; i < $scope.selectedGear.length; i++) {
                var selectedGear = $scope.selectedGear[i];
                if(selectedGear.gearid === gearid) {
                    return true;
                }
            }
            return false;
        };
        $scope.change = function(gearid) {
            var index = -1;
            angular.forEach($scope.selectedGear, function(gear, i) {
                if(gearid === gear.gearid) {
                    index = i;
                }
            });
            if(index < 0) {
                $scope.selectedGear.push({"gearid":gearid,"selected":false});
            }else{
                $scope.selectedGear.splice(index, 1);
            }
        }
        app.navi.on("prepop", function() {
            if(event.leavePage.page === "html/plan/belongings/setBelongings.html") {
                $scope.edititem.gears = $scope.selectedGear;
                var olditems = PlanData.items;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.edititem.planid === item.planid) {
                        var index = PlanData.items.indexOf(item);
                        PlanData.items.splice(index, 1);
                    }
                });
                PlanData.items.push($scope.edititem);
                PlanData.selectedItem = $scope.edititem;
                saveStrageData('PlanData', PlanData.items);
            }
        });
});
