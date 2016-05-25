// This is a JavaScript file

app.controller('SettingController', function($scope, $filter, SettingData) {
    $scope.setting = SettingData.items;
    
    $scope.update = function() {
        SettingData.items = {"fuel_consumption":$scope.setting.fuel_consumption,"gasoline_price":$scope.setting.gasoline_price};
        if(saveStrageData('SettingData', SettingData.items)) {
            alert("更新しました");
        }
    }
});

app.factory('SettingData', function(){
    var data = {};
    data.items = getStrageData('SettingData');
    return data;
});