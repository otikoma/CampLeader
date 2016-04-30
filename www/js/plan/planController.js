// This is a JavaScript file
app.controller('PlanListController', function($scope, $filter, PlanData) {
            $scope.items = PlanData.items;
            $scope.openDetail = function(planid) {
                PlanData.selectedItem = $filter("filter")(PlanData.items, {"planid" : planid})[0];
                app.navi.pushPage('html/plan/planDetail.html');
            };
            $scope.getItems = function() {
                //年月でフィルタリングしたい
                //var items = $filter("filter")($scope.items, {"datefrom" : selected});
                var items = $scope.items;
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
                PlanData.selectedItem = {"planid" : createId('PL'), "title" : "","datefrom":new Date(),"dateto":new Date(),"text":"", "images":[], "schedules":[], "expenses":[]};
                app.navi.pushPage('html/plan/eventEdit.html');
            };
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
            
            $scope.openEdit = function() {
                app.navi.pushPage('html/plan/eventEdit.html');
            }
            
            $scope.openAddSchedule = function() {
                var timefrom = new Date($scope.item.datefrom);
                var timeto = new Date($scope.item.datefrom);
                timefrom.setHours(7, 0, 0, 0);
                timeto.setHours(7, 0, 0, 0);
                
                PlanData.selectedSchedule = {"scheduleid" : createId('SC'), "title" : "","timefrom": timefrom,"timeto": timeto,"text":""};
                app.navi.pushPage('html/plan/scheduleEdit.html');
            }
            $scope.openEditSchedule = function(scheduleid) {
                PlanData.selectedSchedule = $filter("filter")($scope.item.schedules, {"scheduleid" : scheduleid})[0];
                app.navi.pushPage('html/plan/scheduleEdit.html');
            }
            $scope.openEditExpense = function(expenseid) {
                PlanData.selectedExpence = $filter("filter")($scope.item.expenses, {"expenseid" : expenseid})[0];
                var category = PlanData.selectedExpence.category;
                if("e01" == category) {
                    app.navi.pushPage('html/plan/exCampsight.html');
                } else if("e02" == category) {
                    app.navi.pushPage('html/plan/move/exMoving.html');
                }
            }
            $scope.openAddExpense = function() {
                $scope.showDialog();
            }
            $scope.openAddExCampfield = function() {
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e01","total": 0,"datas": {
                        "campsitename":"","days": 1, "entrance_fee" : "", "people_num" : "", "entrance_fee_child" : "", "people_num_child" : "", "sight_fee" : "", "sight_num" : ""
                    }
                };
                app.navi.pushPage('html/plan/exCampsight.html');
                $scope.hideDialog();
            }
            $scope.openAddExMoving = function() {
                PlanData.selectedExpence = {"expenseid" : createId('EX'), "category" : "e02","total": 0,"datas": {
                        "car":"","fuel_consumption": "", "gasoline_price" : "", "distance" : "", "highway_outward" : "", "highway_homeward" : ""
                    }
                };
                app.navi.pushPage('html/plan/move/exMoving.html');
                $scope.hideDialog();
            }
            var exLogoPath = new Array();;
            angular.forEach(ExpenseCategory.items, function(item, i) {
                exLogoPath[item.categoryid] = item.img;
            });
            $scope.getIcon = function(categoruid) {
                var category = $filter("filter")($scope.exCategory, {"categoryid" : categoruid})[0];
                return category.img;
            }
            $scope.total = function() {
                var total = 0;
                angular.forEach($scope.item.expenses, function(expense, i) {
                    total += expense.total;
                });
                return "" + total;
            }
            //日付リストの取得
            $scope.dates = [];
            var date = new Date($scope.item.datefrom);
            var dateto = new Date($scope.item.dateto);
            while (date <= dateto) {
                $scope.dates.push($filter("date")(date, "yyyy/MM/dd"));
                date.setDate(date.getDate() + 1);
            }
            //ダイアログ
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
                    }
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    return;
                });
            };
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
app.controller('ExpenseCampsightController', function($scope, $controller, $filter, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.backPage = function() {
               app.navi.popPage();
        };
        $scope.total = function() {
            return (($scope.expense.datas.entrance_fee * $scope.expense.datas.people_num) + ($scope.expense.datas.entrance_fee_child * $scope.expense.datas.people_num_child)
            + ($scope.expense.datas.sight_fee * $scope.expense.datas.sight_num)) * $scope.expense.datas.days;
        }
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
app.controller('ExpenseMovingController', function($scope, $controller, $filter, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.total = function() {
            return Math.ceil($scope.expense.datas.car + $scope.getGasTotal() + $scope.expense.datas.highway_outward + $scope.expense.datas.highway_homeward);
        }
        $scope.getGasTotal = function() {
            var gasoline_price = $scope.expense.datas.gasoline_price;
            var fuel_consumption = $scope.expense.datas.fuel_consumption;
            var distance = $scope.expense.datas.distance;
            if(fuel_consumption === "" || fuel_consumption === 0) {
                return 0;
            }
            return Math.ceil((gasoline_price / fuel_consumption) * distance);
        }
        $scope.updateExpenseMoving = function() {
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
        $scope.searchHighway = function() {
            PlanData.selectedExpence = $scope.expense;
            var options = new Object;
            options.animation = "lift";
            app.navi.pushPage('html/plan/move/searchHighway.html', options);
        };
});
app.controller('SearchHighwayController', function($scope, $filter, $http, $httpParamSerializerJQLike, PlanData) {
        
        $scope.expense = PlanData.selectedExpence;
        
        $scope.startSuggest = [];
        $scope.endSuggest = [];
        $scope.routes = [];
        $scope.routeIndex = 0;
        $scope.routesShow = [];
        var x2js = new X2JS();
        $scope.getRoute = function() {
            var idx = $scope.routeIndex;
            for(var i = idx; i < $scope.routes.length && i < idx + 3; i++) {
                $scope.routesShow.push($scope.routes[i]);
                $scope.routeIndex++;
            }
        }
        $scope.comvartArray = function(obj) {
            if(Array.isArray(obj)) {
                return obj;
            }else {
                var arr = new Array();
                arr.push(obj)
                return arr;
            }
        }
        $scope.getStartSuggest = function() {
            var param = { f: $scope.startIc, t: "渋", c:'普通車' }
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
            var param = { f: "渋", t: $scope.endIc, c:'普通車' }
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
});
