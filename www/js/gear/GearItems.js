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
            data.items = [
                    {"genreid":"g001","name":"テント・タープ", "img":"images/camp-icons/tent.png","cls":"cls-pink"},
                    {"genreid":"g002","name" : "ライト・ランタン", "img":"images/camp-icons/lantern.png","cls":"cls-amber"},
                    {"genreid":"g003","name":"シュラフ・マット", "img":"images/camp-icons/sleepingbag.png","cls":"cls-deeppurple"},
                    {"genreid":"g004","name":"BBQ・焚火", "img":"images/camp-icons/flame.png","cls":"cls-orange"},
                    {"genreid":"g005","name":"ファニチャー", "img":"images/camp-icons/table.png","cls":"cls-teal"},
                    {"genreid":"g006","name":"調理・食器", "img":"images/camp-icons/pot-on-fire.png","cls":"cls-deeporange"},
                    {"genreid":"g007","name":"ウェアー", "img":"images/camp-icons/vest.png","cls":"cls-blue"},
                    {"genreid":"g008","name":"靴", "img":"images/camp-icons/dr-mateen-boot.png","cls":"cls-brown"},
                    {"genreid":"g009","name":"バックパック", "img":"images/camp-icons/bagpack.png","cls":"cls-purple"},
                    {"genreid":"g010","name":"アクセサリ", "img":"images/camp-icons/orientation.png","cls":"cls-red"},
                    {"genreid":"g011","name":"衛生用品", "img":"images/camp-icons/healthcare.png","cls":"cls-lightblue"}
                ];
            return data;
        });