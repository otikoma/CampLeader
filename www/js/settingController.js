// This is a JavaScript file
app.controller('TopController', function($scope){

});
app.controller('SettingController', function($scope, $http, $httpParamSerializerJQLike, SettingData) {
    $scope.setting = SettingData.items;
    $scope.startSuggest = [];
    
    
    $scope.getStartSuggest = function() {
        var param = { f: $scope.setting.highway_home, t: "渋", c:'普通車' };
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
    $scope.update = function() {
        SettingData.items = {
            "fuel_consumption":$scope.setting.fuel_consumption,
            "gasoline_price":$scope.setting.gasoline_price,
            "highway_home":$scope.setting.highway_home
        };
        if(saveStrageData('SettingData', SettingData.items)) {
            alert("更新しました");
        }
    }
    $scope.openKousoku = function() {
        window.open("http://kosoku.jp/", '_system'); 
    }
});

app.factory('SettingData', function() {
    var data = {};
    data.items = getStrageData('SettingData');
    return data;
});


app.controller('ShareController', function($scope, ShareData) {
    $scope.subject = ShareData.subject;
    $scope.text = ShareData.text;
    $scope.share = function() {
        window.plugins.share.show(
          {
              subject: $scope.subject,
              text: $scope.text
          },
          function() {}, // Success function
          function() {alert('Share failed')} // Failure function
      );
    }
});

app.factory('ShareData', function() {
    var data = {};
    data.subject = "";
    data.text = "";
    return data;
});
