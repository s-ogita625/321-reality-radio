-- =============================================================
--  321 REALITY ラジオ — 初期データ（仮案）
--  schema.sql を実行したあとに、このファイルを SQL Editor で実行すると
--  現在のサンプルデータが Supabase に投入されます（任意）。
-- =============================================================

-- 放送予定
insert into public.broadcasts (id, episode, date, start_time, end_time, title, platform, hosts, guests, thumbnail, url, description, status) values
('ep-001','新パーソナリティ初回','2026-01-30','21:00','22:00','新生『321 REALITY ラジオ』スタート！4人の初顔合わせSP','REALITY','{riu,neru,kurumi,miru}','{}','/thumbnails/ep-001.svg','https://youtube.com/','新パーソナリティ4人が初集結。自己紹介から番組のこれからまで、たっぷり1時間お届けする記念すべき初回放送。','upcoming'),
('ep-002','第2回','2026-02-06','21:00','22:00','リスナーお便り大募集SP 〜はじめましての悩み相談〜','REALITY','{neru,kurumi}','{}',null,'https://youtube.com/','届いたお便りに新パーソナリティが全力で回答。','upcoming'),
('ep-003','第3回','2026-02-13','21:00','22:00','ゲスト回・第一弾！ひみつのゲストをお迎えして','REALITY','{riu,miru}','{ゲスト調整中}',null,'https://youtube.com/','記念すべき初ゲスト回。お楽しみに。','upcoming')
on conflict (id) do nothing;

-- 過去アーカイブ
insert into public.archives (id, episode, date, title, thumbnail, url, hosts, guests, summary, duration) values
('ep-012','第12回','2026-01-16','2026年の抱負を語る回 〜今年こそ叶えたいこと〜','/thumbnails/placeholder-1.svg','https://youtube.com/','{riu,kurumi}','{藤堂レン}','新年一発目。今年の目標と番組のこれからについて熱く語った回。','58:42'),
('ep-011','第11回','2026-01-09','新春お便りスペシャル 〜年末年始エピソード大放出〜','/thumbnails/placeholder-2.svg','https://youtube.com/','{neru,miru}','{夜空かなで}','リスナーから届いた年末年始エピソードを一挙紹介。','61:05'),
('ep-010','第10回','2025-12-19','番組ロゴができるまで 〜クリエイター裏話回〜','/thumbnails/placeholder-3.svg','https://youtube.com/','{riu,neru,kurumi,miru}','{天野ひかり}','番組ビジュアルを手がけたイラストレーターを招いた制作秘話回。','55:18')
on conflict (id) do nothing;

-- 過去ゲスト
insert into public.guests (id, name, role, bio, appearances, link) values
('guest-001','夜空かなで','VTuber / 321 inc.','歌系ライバー。番組テーマソングを担当。透明感のある歌声で番組を彩った。','{第8回,第11回}','https://x.com/'),
('guest-002','天野ひかり','イラストレーター','番組ロゴ・サムネイルを手がけるクリエイター。制作秘話を語った。','{第10回}','https://x.com/'),
('guest-003','藤堂レン','ゲーム配信者 / 321 inc.','ゲーム実況で人気のライバー。深夜テンションのトークで大盛り上がり。','{第9回,第12回}','https://x.com/')
on conflict (id) do nothing;

-- サイト設定（単一行）
insert into public.site_settings (id, name, tagline, description, company, regular_slot, platform, mail_form_url, socials) values
(1,'321 REALITY ラジオ','REALITYから、リアルな声を。',
 '321 inc. 所属ライバーがお届けする公式ラジオ番組『321 REALITY ラジオ』。毎週金曜よる21時、トーク・お便り・ゲストコーナーでREALITYのリアルをお届けします。',
 '321 inc. — LIVER MANAGEMENT','毎週金曜 21:00 - 22:00','REALITY','https://forms.gle/',
 '[{"label":"X (Twitter)","url":"https://x.com/"},{"label":"YouTube","url":"https://youtube.com/"},{"label":"REALITY","url":"https://reality.app/"},{"label":"321 inc.","url":"https://321.inc/"}]'::jsonb)
on conflict (id) do nothing;
