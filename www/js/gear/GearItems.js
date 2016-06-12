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
                    {"genreid":"g005","name":"燃料", "img":"images/camp-icons/wood.png","cls":"cls-brown"},
                    {"genreid":"g006","name":"ファニチャー", "img":"images/camp-icons/table.png","cls":"cls-teal"},
                    {"genreid":"g007","name":"調理・食器", "img":"images/camp-icons/pot-on-fire.png","cls":"cls-deeporange"},
                    {"genreid":"g008","name":"クーラー・ボトル", "img":"images/camp-icons/basket.png","cls":"cls-lightblue"},
                    {"genreid":"g009","name":"ウェアー・シューズ", "img":"images/camp-icons/vest.png","cls":"cls-green"},
                    {"genreid":"g010","name":"登山用品", "img":"images/camp-icons/stickman.png","cls":"cls-bluegrey"},
                    {"genreid":"g012","name":"アクセサリ", "img":"images/camp-icons/orientation.png","cls":"cls-red"},
                    {"genreid":"g013","name":"衛生用品", "img":"images/camp-icons/healthcare.png","cls":"cls-cyan"},
                    {"genreid":"g013","name":"釣具", "img":"images/camp-icons/fish.png","cls":"cls-blue"},
                    {"genreid":"g013","name":"アクティビティー", "img":"images/camp-icons/transport.png","cls":"cls-lime"},
                    {"genreid":"g014","name":"その他", "img":"images/camp-icons/oval.png","cls":"cls-grey"}
                ];
            return data;
        });