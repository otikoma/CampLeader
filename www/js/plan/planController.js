// This is a JavaScript file
app.controller('PlanListController', function($mdDialog, $scope, $filter, PlanData) {
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
            $scope.isios = monaca.isIOS;
        });
app.controller('PlanDetailController', function($scope, $filter, $mdDialog, $mdMedia, PlanData, ExpenseCategory) {
            $scope.item = PlanData.selectedItem;
            $scope.exCategory = ExpenseCategory.items;
            $scope.selectedIndex = 0;
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
            //編集・追加ボタン押下
            $scope.openEdit = function(ev) {
                if($scope.selectedIndex === 0) {
                    app.navi.pushPage('html/plan/eventEdit.html');
                } else if($scope.selectedIndex === 1) {
                    $scope.openAddSchedule();
                } else if($scope.selectedIndex === 2) {
                    $scope.showDialog();
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
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e01","total": 0,"datas": {
                        "campsitename":"","days": 1, "entrance_fee" : "", "people_num" : "", "entrance_fee_child" : "", "people_num_child" : "", "sight_fee" : "", "sight_num" : ""
                    }
                };
                app.navi.pushPage('html/plan/campsight/exCampsight.html');
                $scope.hideDialog();
            }
            //交通費入力
            $scope.openAddExMoving = function() {
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e02","total": 0,"datas": {
                        "car":"","fuel_consumption": "", "gasoline_price" : "", "distance" : "", "highway_outward" : "", "highway_homeward" : ""
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
            app.navi.on("postpop", function() {
                $scope.item = PlanData.selectedItem;
                $scope.$apply();
            });
            $scope.isios = monaca.isIOS;
        });
app.controller('PlanEditController', function($scope, $filter, $location,$timeout, $anchorScroll, PlanData) {
            $scope.item = PlanData.selectedItem;
            $scope.edititem = angular.copy($scope.item);
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
            
            $scope.isios = monaca.isIOS;
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
app.controller('ExpenseCampsightController', function($scope, $controller, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.total = function() {
            return (($scope.expense.datas.entrance_fee * $scope.expense.datas.people_num) + ($scope.expense.datas.entrance_fee_child * $scope.expense.datas.people_num_child)
            + ($scope.expense.datas.sight_fee * $scope.expense.datas.sight_num)) * $scope.expense.datas.days;
        }
        //キャンプ場代　更新
        $scope.updateExpenseCampsight = function() {
                $scope.expense.total = $scope.total();
                var olditems = $scope.edititem.expenses;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.expense.expenseid === item.expenseid) {
                        var index = $scope.edititem.expenses.indexOf(item);
                        $scope.edititem.expenses.splice(index, 1);
                    }
                });
                $scope.edititem.expenses.push($scope.expense);
                $scope.update();
        }
});
app.controller('ExpenseMovingController', function($scope, $controller, $filter, $mdDialog, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.total = function() {
            return Math.ceil($scope.expense.datas.car + $scope.getGasTotal() + ($scope.expense.datas.highway_outward + $scope.expense.datas.highway_homeward));
        }
        //ガソリン代合計
        $scope.getGasTotal = function() {
            var gasoline_price = $scope.expense.datas.gasoline_price;
            var fuel_consumption = $scope.expense.datas.fuel_consumption;
            var distance = $scope.expense.datas.distance;
            if(fuel_consumption === "" || fuel_consumption === 0) {
                return 0;
            }
            return Math.ceil((gasoline_price / fuel_consumption) * distance);
        }
        //交通費更新
        $scope.updateExpenseMoving = function() {
                $scope.expense.total = $scope.total();
                var olditems = $scope.edititem.expenses;
                if(olditems === null || olditems === undefined) {
                    $scope.edititem.expenses = [];
                }else {
                    var b = false;
                    angular.forEach(olditems, function(item) {
                        if ($scope.expense.expenseid === item.expenseid) {
                            var index = $scope.edititem.expenses.indexOf(item);
                            $scope.edititem.expenses.splice(index, 1);
                        }
                    });
                }
                $scope.edititem.expenses.push($scope.expense);
                $scope.update();
        }
        //ダイアログ表示
        $scope.showDialog = function(ev,func) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'html/plan/move/searchHighway.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen:true
            })
            .then(function(answer) {
                func(answer);
            }, function() {
                return;
            });
        };
        //高速検索を開く
        $scope.searchHighwayOutward = function(ev) {
            $scope.showDialog(ev, function(ans){
                $scope.expense.datas.highway_outward = ans;
            });
        };
        $scope.searchHighwayHomeward = function(ev) {
            $scope.showDialog(ev, function(ans){
                $scope.expense.datas.highway_homeward = ans;
            });
        };
        
        //高速経路・料金検索
        function DialogController($scope, $mdDialog,  $filter, $http, $httpParamSerializerJQLike) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $scope.startSuggest = [];
            $scope.endSuggest = [];
            $scope.routes = [];
            $scope.routeIndex = 0;
            $scope.routesShow = [];
            var x2js = new X2JS();
            $scope.getRoute = function() {
                var idx = $scope.routeIndex;
                for(var i = idx; i < $scope.routes.length && i < idx + 3; i++) {
                    //select初期値
                    var sectionArr = $scope.comvartArray($scope.routes[i].Details.Section);
                    angular.forEach(sectionArr, function(section) {
                        var tollArr = $scope.comvartArray(section.Tolls.Toll)
                        section.radioval = $scope.getTollVal(tollArr[0]);
                    });
                    $scope.routesShow.push($scope.routes[i]);
                    $scope.routeIndex++;
    
                }
            }
            $scope.comvartArray = function(obj) {
                if(Array.isArray(obj)) {
                    return obj;
                }else {
                    var arr = new Array();
                    arr.push(obj);
                    return arr;
                }
            }
            $scope.getTollVal = function(toll) {
                var num = toll.match(/^[0-9]+/);
                return 1 * num;
            }
            $scope.getTollTotal = function(route) {
                var total = 0;
                var sectionArr = $scope.comvartArray(route.Details.Section);
                angular.forEach(sectionArr, function(section) {
                    total += 1 * section.radioval;
                });
                return total;
            }
            $scope.getStartSuggest = function() {
                var param = { f: $scope.startIc, t: "渋", c:'普通車' };
                $scope.post(param, function(data) {
                    var status = data.Result.Status;
                    if(Array.isArray(data.Result.FromICs.IC)) {
                        $scope.startSuggest = data.Result.FromICs.IC;
                    } else {
                        $scope.startSuggest = [data.Result.FromICs.IC];
                    }
                });
            }
            $scope.getEndSuggest = function() {
                var param = { f: "渋", t: $scope.endIc, c:'普通車' };
                $scope.post(param, function(data) {
                    var status = data.Result.Status;
                    if(Array.isArray(data.Result.ToICs.IC)) {
                        $scope.endSuggest = data.Result.ToICs.IC;
                    } else {
                        $scope.endSuggest = [data.Result.ToICs.IC];
                    }
                });
            }
            $scope.search = function() {
                var param = { f: $scope.startIc, t: $scope.endIc, c:'普通車' }
                $scope.post(param, function(data) {
                    var status = data.Result.Status;
                    if("NotEnd" === status) {
                        alert("経路が見つかりませんでした");
                    } else if("End" === status){
                        $scope.routes =  data.Result.Routes.Route;
                        $scope.routeIndex = 0;
                        $scope.routesShow = [];
                        $scope.getRoute();
                    }
                });
            }
            $scope.post = function(param, successCallback) {
                // 1サーバーに対してHTTP POSTでリクエストを送信
                var startic = $scope.startIc;
                var endic = $scope.endIc;
                
                $http({
                    method: 'POST',
                    headers: {
                        // 1リクエストヘッダーを設定
                        'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    // 2リクエストデータをjQueryと同様の形式で送信
                    transformRequest: $httpParamSerializerJQLike,
                    url: 'http://kosoku.jp/api/route.php',
                    data: param
                })
                // 成功時の処理
                .success(function(data, status, headers, config){
                    var dat =  x2js.xml_str2json(data);
                    $scope.result = dat;
                    successCallback(dat);
                })
                // 失敗時の処理
                .error(function(data, status, headers, config){
                    alert("ERROR");
                    $scope.result = '通信失敗！';
                });
            }
        };
});
app.controller('ExpenseOtherController', function($scope, $controller, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        
        //更新
        $scope.updateExpense = function() {
                $scope.expense.total = $scope.expense.datas.expence;
                var olditems = $scope.edititem.expenses;
                var b = false;
                angular.forEach(olditems, function(item) {
                    if ($scope.expense.expenseid === item.expenseid) {
                        var index = $scope.edititem.expenses.indexOf(item);
                        $scope.edititem.expenses.splice(index, 1);
                    }
                });
                $scope.edititem.expenses.push($scope.expense);
                $scope.update();
        }
});

