# WayEcho V26 - Kiem tra GitHub / Vercel (2026-11-03)

## Ket qua da kiem tra
- `node --test tests/*.test.mjs`: PASS 70/70.
- Source co `package.json`, `package-lock.json`, `next.config.mjs`, `.gitignore`, `.env.example`.
- Chua xac nhan `next build`: buoc `npm ci` trong moi truong kiem tra bi timeout. Khong duoc tuyen bo build/deploy thanh cong.
- Chua co browser E2E test toan bo customer -> partner -> admin.

## Loi kien truc chan demo lien thong tren Vercel
1. `lib/store.js` mac dinh `memory` khi co `VERCEL`: thay doi booking, yeu cau, review, escrow, SOS/inquiries... co the mat khi lambda restart va khong dong bo giua instances. Bat buoc thay bang Postgres/Neon/Supabase/Vercel Postgres (hoac mot backend persistent tu quan), giao dich atomic, migrate data.
2. `lib/rideDemo.js` luu localStorage: booking xe chi hien thi giua tabs cung mot trinh duyet, khong dong bo client va partner khac may. Can database va API + role authorization, event simulator gia lap phia doi tac.
3. `lib/escrowDemo.js` luu localStorage: khong dung de mo phong giao dich lien thiet bi, tuyet doi khong su dung tien that.
4. `app/api/consultation/route.js`: webcam/WebRTC can signaling + TURN + auth + permission, phai test ket noi giua hai thiet bi.
5. `app/api/ai-assistant/route.js`: chi hoat dong voi OPENAI_API_KEY; dung gioi han demo, khong huong dan di chuyen.
6. Phai tao `WAYECHO_USERS` voi password hashes va `WAYECHO_SESSION_SECRET`; khong commit `.env.local`.
7. Du lieu co so, taxi, an toan va so tu van vien la demo; thong bao ro tren UI.

## Dua source len GitHub
1. Giai nen ZIP, vao thu muc `WayEcho_Merged_Final` (thu muc chua `package.json`).
2. Tao repo moi, commit NOI DUNG thu muc nay vao ROOT repo, khong commit thu muc cha bao ngoai va khong commit `.env`.
3. `npm ci && npm run test && npm run build` tren may local/CI. Sua loi cho den khi pass, sau do moi deploy.
4. Import GitHub repo vao Vercel, Framework Preset `Next.js`, Root Directory `./`, Build Command `npm run build`.
5. Vercel Environment Variables: `WAYECHO_SESSION_SECRET` (>=32 chars), `WAYECHO_USERS` (JSON mang account hashed), `NEXT_PUBLIC_SITE_URL` (domain ban chinh), `OPENAI_API_KEY` neu dung AI Camera. Khong nhap khoa bi mat vao `NEXT_PUBLIC_`.
6. Preview deploy: test customer -> login guide -> partner business -> advisor -> admin, booking, quyen truy cap, logout; test tren 2 browser/may rieng. Nhung luong can shared DB se KHONG on dinh voi memory; khong goi la production.
7. Sau khi co database persistent moi bat `WAYECHO_INQUIRIES_ENABLED=1` cho tiep nhan dang ky.

## Tinh trang
- Upload/build deployment: CHUA XAC NHAN.
- 70/70 unit tests: DA XAC NHAN.
- Multi-device data persistence & end-to-end: CHUA DAT.
- Code van co the demo tren 1 browser, nhung khong dam bao demo lien thong tren Vercel.
