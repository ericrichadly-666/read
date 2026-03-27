/*
番茄小说 2026.03.27 去广告+段评修复版
*/
let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 1. 白名单：遇到这些关键词（评论、段评、用户），绝对不动
const whiteList = ["comment", "paragraph", "ugc", "reply", "user", "author", "forum"];

function cleanAd(data) {
    // 移除了容易误伤的 extra, reward 等通用词汇
    const adKeys = ["ad_info", "video_ad", "pangle", "splash", "ad_config", "interstitial", "report_ad", "click_url", "ad_v2"];
    
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (isAd(data[i])) data.splice(i, 1);
            else cleanAd(data[i]);
        }
    } else if (data && typeof data === 'object') {
        for (let key in data) {
            // 【关键修复】如果键名在白名单里，直接跳过，保护段评
            if (whiteList.some(w => key.toLowerCase().includes(w))) {
                continue;
            }
            if (adKeys.some(k => key.toLowerCase().includes(k)) || isAd(data[key])) {
                delete data[key];
            } else {
                cleanAd(data[key]);
            }
        }
    }
}

// 2. 精准打击：只有明确标记为广告的值才删除
function isAd(val) {
    if (!val || typeof val !== 'object') return false;
    let s = JSON.stringify(val).toLowerCase();
    // 必须是真实的广告标志才杀，防止误伤带有 is_ad:false 的正常配置
    return s.includes('"is_ad":1') || s.includes('"is_ad":true') || s.includes("pangle") || s.includes("ad/params");
}

// 3. 基础参数锁定
if (obj.data) {
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    if (obj.data.settings) {
        obj.data.settings.no_ad = true;
        obj.data.settings.is_vip = true;
    }
    // 仅定点清除章节内的广告信息
    if (obj.data.chapter_info && obj.data.chapter_info.ad_info) {
        delete obj.data.chapter_info.ad_info;
    }
}

cleanAd(obj);
$done({ body: JSON.stringify(obj) });
