/*
番茄小说 终极防复活脚本 (2026.03.27)
*/
let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 1. 全局深度递归清理广告特征
function deepPurge(data) {
    const keys = ["ad_info", "video_ad", "pangle", "reward", "extra", "dialog_info", "splash", "ad_config", "interstitial", "report_ad", "click_url"];
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (isAd(data[i])) data.splice(i, 1);
            else deepPurge(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            if (keys.some(k => key.toLowerCase().includes(k)) || isAd(data[key])) {
                delete data[key];
            } else {
                deepPurge(data[key]);
            }
        }
    }
}

function isAd(val) {
    if (!val) return false;
    let s = JSON.stringify(val).toLowerCase();
    return s.includes("ad/params") || s.includes("is_ad") || s.includes("pangle") || s.includes("video_ads");
}

// 2. 强行锁定 VIP 和无广告状态
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.status = 1;
    // 覆盖阅读器内部配置
    if (obj.data.settings) {
        obj.data.settings.no_ad = true;
        obj.data.settings.is_vip = true;
    }
    // 针对章节信息的广告清除
    if (obj.data.chapter_info) {
        obj.data.chapter_info.ad_info = null;
    }
}

deepPurge(obj);
$done({ body: JSON.stringify(obj) });
