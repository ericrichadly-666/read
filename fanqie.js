// 2026-03-27 自制番茄小说净化脚本
let body = $response.body;
if (!body) $done({});

let obj = JSON.parse(body);

// 核心逻辑：修改数据体
if (obj.data) {
    // 1. 屏蔽核心广告配置（这是最关键的）
    if (obj.data.ad_config) {
        obj.data.ad_config = {};
    }
    
    // 2. 伪造免广告和 VIP 状态
    // 番茄通过这些字段判断是否展示广告
    obj.data.no_ad = true;
    obj.data.is_vip = true;
    obj.data.is_login = true;
    
    // 3. 屏蔽阅读页内的特定广告位
    if (obj.data.chapter_info) {
        // 清除章节信息中的广告埋点
        delete obj.data.chapter_info.ad_info;
    }
    
    // 4. 移除激励视频等限制（解锁看视频领奖励等弹窗）
    if (obj.data.video_ad) {
        obj.data.video_ad = {};
    }
}

$done({ body: JSON.stringify(obj) });
