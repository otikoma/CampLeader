/////localstrageからデータ取得
function getStrageData(key) {
    var list = localStorage.getItem(key);
    if (list == null) {
        return new Array();
    } else {
        return JSON.parse(list);
    }
}

/////localstrageへデータ保存
function saveStrageData(key, list) {
    try {
        localStorage.setItem(key, JSON.stringify(list));
        return true;
    } catch (e) {
        console.log(e);
        alert('Error saving to storage.');
        return false;
    }
}
function removeStrageData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        alert('Error removing to storage.');
        return false;
    }
}

function createId(prefix, suffix) {
    if(suffix ===undefined) {
        suffix ="";
    }
    var d = new Date();
    var n = d.getTime();
    return prefix + n + suffix;
}
