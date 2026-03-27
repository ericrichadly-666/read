/*
番茄小说 2026.03.27 终极防复活版
*/
let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 核心逻辑：无论数据结构如何，只要包含广告关键字就删除
function universalClean(data) {
    const keys = ["ad_info", "video_ad", "pangle", "reward", "extra", "dialog_info", "splash", "ad_config", "interstitial", "report_ad", "click_url", "ad_v2"];
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (isAd(data[i])) data.splice(i, 1);
            else universalClean(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            if (keys.some(k => key.toLowerCase().includes(k)) || isAd(data[key])) {
                delete data[key];
            } else {
                universalClean(data[key]);
            }
        }
    }
}

function isAd(val) {
    if (!val) return false;
    let s = JSON.stringify(val).toLowerCase();
    return s.includes("ad/params") || s.includes("is_ad") || s.includes("pangle") || s.includes("video_ads");
}

// 强制注入 VIP 状态并清空已知广告节点
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.status = 1;
    if (obj.data.settings) {
        obj.data.settings.no_ad = true;
        obj.data.settings.is_vip = true;
    }
}

universalClean(obj);
$done({ body: JSON.stringify(obj) });
