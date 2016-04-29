// This is a JavaScript file

        app.factory('PlanData', function(){
            var data = {};
            data.items = getStrageData('PlanData');
            
            angular.forEach(data.items, function(item) {
                item.datefrom = new Date(item.datefrom);
                item.dateto = new Date(item.dateto);
                angular.forEach(item.schedules, function(schedule) {
                    schedule.timefrom = new Date(schedule.timefrom);
                    schedule.timeto = new Date(schedule.timeto);
                });
            });
            
            return data;
        }).factory('ExpenseCategory', function(){
            var data = {};
            data.items = [
                    {"categoryid":"e01","name":"キャンプ場代", "img":"images/camp-icons/tent.svg","cls":"cls-pink"},
                    {"categoryid":"e02","name" : "交通費", "img":"images/camp-icons/light150.png","cls":"cls-amber"},
                    {"categoryid":"e03","name":"食費", "img":"images/camp-icons/sleepingbag.png","cls":"cls-deeppurple"},
                    {"categoryid":"e04","name":"その他", "img":"images/camp-icons/flame14.png","cls":"cls-orange"}
                ];
            
            return data;
        });

// title : string タイトル
// datefrom : date 出発日
// datetto : date 終了日
// text :string テキスト
// images : array 画像情報
//  [image]
//    src : string 画像URI
// expenses : array 費用
//  [expence]
//    expenseid : string ID
//    categoryid : string カテゴリID
//    total : number 単価
//    datas : map 詳細（カテゴリによって異なる）
//       *[e01]
//          campsightname : string キャンプ場名
//          days: number  日数
//　　　　　entrance_fee : number 大人料金
//          people_num : number 人数
//          entrance_fee_child:number  子供料金
//          people_num_child:number  人数
//          sight_fee :number サイト料金
//          sight_num :number サイト数
//       *[e02]
//          car : number 車代
//          fuel_consumption : 燃費
//          gasoline_price : ガソリン代
//          distance : 距離
//          highway_outward : 往路
//          highway_homeward : 復路
// schedules : array
//  [schedule]
//    scheduleid : string ID
//    title : string 項目名
//    categoryid : string カテゴリID
//    timefrom : datetime 開始時間
//    timeto : datetime 終了時間
