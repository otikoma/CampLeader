//キャンプ場代
app.controller('ExpenseCampsightController', function($scope, $controller, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.total = function() {
            var total = (getpeopleTotal() + getchildTotal() + getSight()) * $scope.expense.datas.days;
            if(isNaN(total)) {
                total = 0;
            }
            return total;
        }
        function getpeopleTotal() {
            var total = ($scope.expense.datas.entrance_fee) * ($scope.expense.datas.people_num);
            if(isNaN(total)) {
                total = 0;
            }
            return total;
        }
        function getchildTotal() {
            var total = $scope.expense.datas.entrance_fee_child * $scope.expense.datas.people_num_child;
            if(isNaN(total)) {
                total = 0;
            }
            return total;
        }
        function getSight() {
            var total = $scope.expense.datas.sight_fee * $scope.expense.datas.sight_num;
            if(isNaN(total)) {
                total = 0;
            }
            return total;
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
//費用
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
//交通費
app.controller('ExpenseMovingController', function($scope, $controller, $filter, $mdDialog, PlanData) {
        $controller('PlanEditController', {$scope: $scope}); //This works
        $scope.expense = PlanData.selectedExpence;
        $scope.total = function() {
            return Math.ceil(1*$scope.expense.datas.car + 1*$scope.getGasTotal() + (1*$scope.expense.datas.highway_outward + 1*$scope.expense.datas.highway_homeward));
        }
        //ガソリン代合計
        $scope.getGasTotal = function() {
            var gasoline_price = $scope.expense.datas.gasoline_price;
            var fuel_consumption = $scope.expense.datas.fuel_consumption;
            var distance = $scope.expense.datas.distance;
            var res = Math.ceil((gasoline_price / fuel_consumption) * distance);
            if(isNaN(res)) {
                res = 0;
            }
            return res;
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
                templateUrl: 'html/plan/move/searchHighwayDialog.html',
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
        $scope.isOutWard = true;
        $scope.searchHighwayOutward = function(ev) {
            $scope.isOutWard = true;
            $scope.showDialog(ev, function(ans){
                $scope.expense.datas.highway_outward = ans;
            });
        };
        $scope.searchHighwayHomeward = function(ev) {
            $scope.isOutWard = false;
            $scope.showDialog(ev, function(ans){
                $scope.expense.datas.highway_homeward = ans;
            });
        };
        
        //高速経路・料金検索
        function DialogController($scope, $mdDialog,  $filter, $http, $httpParamSerializerJQLike, SettingData) {
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
            if($scope.isOutWard) {
                $scope.startIc = SettingData.items.highway_home;
            }else {
                $scope.endIc = SettingData.items.highway_home;
            }
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
                post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                if(data.Result.FromICs != undefined) {
                    if(Array.isArray(data.Result.FromICs.IC)) {
                        $scope.startSuggest = data.Result.FromICs.IC;
                    } else {
                        $scope.startSuggest = [data.Result.FromICs.IC];
                    }
                } else {
                    $scope.startSuggest = [];
                }
                });
            }
            $scope.getEndSuggest = function() {
                var param = { f: "渋", t: $scope.endIc, c:'普通車' };
                post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                    if(!data.Result.ToICs != undefined) {
                        if(Array.isArray(data.Result.ToICs.IC)) {
                            $scope.endSuggest = data.Result.ToICs.IC;
                        } else {
                            $scope.endSuggest = [data.Result.ToICs.IC];
                        }
                    }else {
                        $scope.endSuggest = [];
                    }
                });
            }
            $scope.search = function() {
                blur();
                var param = { f: $scope.startIc, t: $scope.endIc, c:'普通車' }
                post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                    var status = data.Result.Status;
                    if(status === undefined) {
                        alert("経路が見つかりませんでした");
                        $scope.routes = [];
                        $scope.routeIndex = 0;
                        $scope.routesShow = [];
                    }else if("NotEnd" === status) {
                        alert("経路が見つかりませんでした");
                        $scope.routes = [];
                        $scope.routeIndex = 0;
                        $scope.routesShow = [];
                    } else if("End" === status){
                        $scope.routes =  data.Result.Routes.Route;
                        $scope.routeIndex = 0;
                        $scope.routesShow = [];
                        $scope.getRoute();
                    }
                });
            }
            $scope.showSubSections = function($event, SubSections) {
               var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    clickOutsideToClose:true,
                    targetEvent: $event,
                    templateUrl: 'html/plan/move/subSectionDialog.html',
                    locals: {
                       items: SubSections
                    },
                    controller: SubSectionsDialogController
                });
            };
            function SubSectionsDialogController($scope, $mdDialog, items) {
                $scope.SubSections = items;
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                }
            };
        };
});



app.controller('SearchHighwayController', function($scope, $mdDialog,  $filter, $http, $httpParamSerializerJQLike, SettingData) {

        $scope.startSuggest = [];
        $scope.endSuggest = [];
        $scope.routes = [];
        $scope.routeIndex = 0;
        $scope.routesShow = [];
        
        $scope.startIc = SettingData.items.highway_home;
        
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
            post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                var status = data.Result.Status;
                if(status != undefined) {
                    if(Array.isArray(data.Result.FromICs.IC)) {
                        $scope.startSuggest = data.Result.FromICs.IC;
                    } else {
                        $scope.startSuggest = [data.Result.FromICs.IC];
                    }
                } else {
                    $scope.startSuggest = [];
                }
            });
        }
        $scope.getEndSuggest = function() {
            var param = { f: "渋", t: $scope.endIc, c:'普通車' };
            post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                var status = data.Result.Status;
                if(status != undefined) {
                    if(Array.isArray(data.Result.ToICs.IC)) {
                        $scope.endSuggest = data.Result.ToICs.IC;
                    } else {
                        $scope.endSuggest = [data.Result.ToICs.IC];
                    }
                } else {
                    $scope.endSuggest = [];
                }
            });
        }
        $scope.search = function() {
            blur();
            var param = { f: $scope.startIc, t: $scope.endIc, c:'普通車' }
            post($scope, $http, $httpParamSerializerJQLike, param, function(data) {
                var status = data.Result.Status;
                if(status === undefined) {
                    alert("経路が見つかりませんでした");
                    $scope.routes = [];
                    $scope.routeIndex = 0;
                    $scope.routesShow = [];
                }else if("NotEnd" === status) {
                    alert("経路が見つかりませんでした");
                    $scope.routes = [];
                    $scope.routeIndex = 0;
                    $scope.routesShow = [];
                } else if("End" === status){
                    $scope.routes =  data.Result.Routes.Route;
                    $scope.routeIndex = 0;
                    $scope.routesShow = [];
                    $scope.getRoute();
                }
            });
        }
        $scope.showSubSections = function($event, SubSections) {
           var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                clickOutsideToClose:true,
                targetEvent: $event,
                templateUrl: 'html/plan/move/subSectionDialog.html',
                locals: {
                   items: SubSections
                },
                controller: SubSectionsDialogController
            });
        };
        function SubSectionsDialogController($scope, $mdDialog, items) {
            $scope.SubSections = items;
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
        };
});
function post(scope, http, httpParamSerializerJQLike, param, successCallback) {
    // 1サーバーに対してHTTP POSTでリクエストを送信
    scope.error=false;
    var startic = scope.startIc;
    var endic = scope.endIc;
    var x2js = new X2JS();
    http({
        method: 'POST',
        headers: {
            // 1リクエストヘッダーを設定
            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
        },
        // 2リクエストデータをjQueryと同様の形式で送信
        transformRequest: httpParamSerializerJQLike,
        url: 'http://kosoku.jp/api/route.php',
        data: param
    })
    // 成功時の処理
    .success(function(data, status, headers, config){
        var dat =  x2js.xml_str2json(data);
        scope.result = dat;
        successCallback(dat);
    })
    // 失敗時の処理
    .error(function(data, status, headers, config){
        scope.error=true;
        scope.result = '通信失敗！';
    });
}