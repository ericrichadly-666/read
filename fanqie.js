/*
番茄小说 2026.03.27 终极全量净化脚本 (递归扫描版)
*/

let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 1. 深度递归清理函数：自动识别并删除所有层级中的广告、视频、奖励等字段
function deepClean(data) {
    const adKeywords = ["ad_info", "video_ad", "pangle", "reward", "extra", "dialog_info", "splash", "ad_config", "interstitial", "report_ad", "click_url"];
    
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (shouldDelete(data[i], adKeywords)) data.splice(i, 1);
            else deepClean(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            // 如果键名包含广告关键字，或者值里包含广告特征，直接删除该键
            if (adKeywords.some(k => key.toLowerCase().includes(k)) || shouldDelete(data[key], adKeywords)) {
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
    // 识别字节跳动特有的广告标识符
    return keywords.some(k => str.includes(k)) || str.includes("banner_ad") || str.includes("feed_ad");
}

// 2. 强制身份注入：确保 App 认为你是 VIP 且设置了无广告模式
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.status = 1;
    if (obj.data.settings) {
        obj.data.settings.no_ad = true;
        obj.data.settings.is_vip = true;
    }
}

// 3. 执行全量清理
deepClean(obj);

$done({ body: JSON.stringify(obj) });
