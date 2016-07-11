// This is a JavaScript file

        app.factory('GearData', function(){
            var data = {};
            data.items = getStrageData('GearData');
            angular.forEach(data.items, function(record) {
                if(record.plancategory === undefined) {
                    record.plancategory = [];
                }
            });
            return data;
        }).factory('GearGenre', function(){
            var data = {};
            data.items = getStrageData('GearGenre');
            return data;
        });
        