/*
番茄小说全量去广告脚本 - 2026-03-27 增强版
*/

let body = $response.body;
if (!body) $done({});
let obj = JSON.parse(body);

// 1. 核心广告配置清理 (针对 api/ad/v1/config, api/ad/v2/config)
if (obj.data) {
    // 基础开关
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.is_login = true;
    
    // 广告配置字段全置空
    if (obj.data.ad_config) obj.data.ad_config = {};
    if (obj.data.video_ad) obj.data.video_ad = {};
    if (obj.data.extra) delete obj.data.extra;
    
    // 2. 章节净化 (解决阅读页插屏广告)
    if (obj.data.chapter_info) {
        delete obj.data.chapter_info.ad_info;
        delete obj.data.chapter_info.pangle_ad;
        delete obj.data.chapter_info.custom_ad;
    }
    
    // 3. 激励任务与弹窗清理
    if (obj.data.reward_info) obj.data.reward_info = {};
    if (obj.data.dialog_info) obj.data.dialog_info = {};
}

// 4. 针对直接下发的广告信息流
if (obj.ad_info) obj.ad_info = null;
if (obj.pangle_ad) obj.pangle_ad = null;

$done({ body: JSON.stringify(obj) });
