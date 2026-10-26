// ============================================================
// 数据源配置（双端部署用）
// ------------------------------------------------------------
// 本文件是前端唯一的数据源开关，支持两种后端：
//
// ① Supabase 端（GitHub Pages 部署用，当前线上）：
//    window.APP_CONFIG = {
//      backend: 'supabase',            // 缺省即 supabase
//      supabaseUrl: 'https://xxx.supabase.co',
//      supabaseKey: 'eyJhb...'
//    };
//
// ② 腾讯云 CloudBase PG 端（国内节点，手机端可达）：
//    window.APP_CONFIG = {
//      backend: 'cloudbase',
//      envId: 'xxxxxxxxxxxxxxxxxxxx',          // CloudBase 环境ID（PG模式）
//      publishableKey: 'eyJ...'                 // Publishable Key（对应 anon 角色）
//    };
//
// 修改后重新构建、部署即生效，无需改动任何业务代码。
// 说明：Publishable/anon key 属公开密钥，安全性由 RLS 策略保障。
// ============================================================
window.APP_CONFIG = {
  backend: 'supabase',
  supabaseUrl: 'https://vigzdhhrqjmbtwewgcrz.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ3pkaGhycWptYnR3ZXdnY3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDI2NjksImV4cCI6MjEwMjcxODY2OX0.JNw_f2j776kVcVBLbtmScXMs_KU5ZOeyockBIFbT8oU'
};
