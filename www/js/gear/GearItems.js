// This is a JavaScript file

        app.factory('GearData', function(){
            var data = {};
            data.items = getStrageData('GearData');
            return data;
        }).factory('GearGenre', function(){
            var data = {};
            data.items = [
                    {"genreid":"g001","name":"テント・タープ", "img":"images/camp-icons/tent.png","cls":"cls-pink"},
                    {"genreid":"g002","name" : "ライト・ランタン", "img":"images/camp-icons/light150.png","cls":"cls-amber"},
                    {"genreid":"g003","name":"シュラフ", "img":"images/camp-icons/sleepingbag.png","cls":"cls-deeppurple"},
                    {"genreid":"g004","name":"BBQ・焚火", "img":"images/camp-icons/flame14.png","cls":"cls-orange"},
                    {"genreid":"g005","name":"ファニチャー", "img":"images/camp-icons/table.png","cls":"cls-teal"},
                    {"genreid":"g006","name":"調理・食器", "img":"images/camp-icons/pot-on-fire.png","cls":"cls-deeporange"}
                ];
            return data;
        });