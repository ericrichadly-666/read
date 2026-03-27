/*
番茄小说 2026.03.27 终极暴力净化版 (Eric专用)
*/

let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 深度清理函数：遍历所有层级，只要发现广告特征就删除
function deepClean(data) {
    const adKeywords = ["ad_info", "video_ad", "pangle", "reward", "extra", "dialog_info", "splash", "ad_config", "interstitial"];
    
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (shouldDelete(data[i], adKeywords)) data.splice(i, 1);
            else deepClean(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            if (adKeywords.includes(key.toLowerCase()) || shouldDelete(data[key], adKeywords)) {
                delete data[key];
            } else {
                deepClean(data[key]);
            }
        }
    }
}

function shouldDelete(val, keywords) {
    if (!val) return false;
    let str = JSON.stringify(val).toLowerCase();
    return keywords.some(k => str.includes(k));
}

// 强制注入 VIP 状态和设置
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.status = 1;
    if (obj.data.settings) {
        obj.data.settings.no_ad = true;
        obj.data.settings.is_vip = true;
    }
}

deepClean(obj);
$done({ body: JSON.stringify(obj) });
