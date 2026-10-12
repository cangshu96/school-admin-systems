// ============================================================
// 数据源配置（双端部署用）
// ------------------------------------------------------------
// 本文件是前端唯一的数据源开关：
//   · GitHub Pages 端：保持下方配置（Supabase 项目 A）
//   · 腾讯云 端：把 supabaseUrl / supabaseKey 换成新项目（项目 B）即可
// 修改后重新构建、部署即生效，无需改动任何业务代码。
// 说明：anon key 属公开密钥，安全性由 Supabase RLS 策略保障。
// ============================================================
window.APP_CONFIG = {
  supabaseUrl: 'https://vigzdhhrqjmbtwewgcrz.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ3pkaGhycWptYnR3ZXdnY3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDI2NjksImV4cCI6MjEwMjcxODY2OX0.JNw_f2j776kVcVBLbtmScXMs_KU5ZOeyockBIFbT8oU'
};
