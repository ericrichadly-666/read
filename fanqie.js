/*
番茄小说 2026.03.27 终极暴力净化版
*/

let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 深度清理函数
function deepClean(data) {
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (isAd(data[i])) data.splice(i, 1);
            else deepClean(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            if (isAd(key) || isAd(data[key])) {
                delete data[key];
            } else {
                deepClean(data[key]);
            }
        }
    }
}

// 广告关键词判定
function isAd(val) {
    const adKeys = ["ad_info", "video_ad", "pangle", "reward", "extra", "dialog_info", "splash", "ad_config"];
    let str = JSON.stringify(val).toLowerCase();
    return adKeys.some(key => str.includes(key));
}

// 核心身份伪造
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.status = 1;
}

deepClean(obj);

$done({ body: JSON.stringify(obj) });
