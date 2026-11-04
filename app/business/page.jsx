"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useBusiness } from "@/components/BusinessShell";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getBusiness } from "@/data/businesses";
import { FACILITIES, FACILITY_STATUS, TRAINING } from "@/lib/businessProfile";
import { CalendarIcon, AccessibleIcon, StarIcon, BedIcon, HeadphonesIcon, CheckIcon, PhoneIcon, MapPinIcon } from "@/components/Icons";

const card = "rounded-[22px] border border-[#f1e8db] bg-white p-5 shadow-[0_8px_22px_rgba(44,32,18,.065)] hc-surface hc-border";
const money = (n) => new Intl.NumberFormat("vi-VN").format(n) + " đ";
const amount = (b) => Number(String(b.price || "").replace(/[^0-9]/g, "")) || 0;
const TABS = [["requests", "Yêu cầu cần duyệt"], ["guests", "Đặt chỗ đang chờ / xác nhận"], ["history", "Lịch sử đón tiếp"], ["facility", "Hồ sơ cơ sở vật chất"]];

function Stat({ icon: Icon, label, value, caption }) {
  return <article className="min-h-[150px] rounded-[22px] border border-[#f0e7dc] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(44,32,18,.07)] hc-surface hc-border">
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0d2] text-[#c77b12]"><Icon size={25} /></span>
    <p className="mt-3 text-sm font-bold text-[#1b2330]">{label}</p>
    <p className="mt-1 text-[28px] font-black leading-tight text-[#111827]" aria-live="polite">{value}</p>
    <p className="mt-1 text-xs text-[#73757a]">{caption}</p>
  </article>;
}

export default function BusinessDashboard() {
  const { businessId } = useBusiness();
  const biz = getBusiness(businessId);
  const { speak } = useA11y();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState("requests");
  const [busy, setBusy] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [lesson, setLesson] = useState("");

  useEffect(() => {
    let live = true;
    Promise.all([api.listBusinessBookings(businessId), api.listRequests(businessId), api.getBusinessProfile()])
      .then(([b, r, p]) => { if (live) { setBookings(Array.isArray(b) ? b : []); setRequests(Array.isArray(r) ? r : []); setProfile(p.profile); } })
      .catch((e) => { if (live) setError(e?.message || "Không tải được dữ liệu doanh nghiệp."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [businessId]);

  const waiting = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);
  const decided = requests.filter((r) => r.status !== "pending");
  const acceptedRate = decided.length ? Math.round((decided.filter((r) => r.status === "accepted").length / decided.length) * 100) + "%" : "—";
  const pendingBookings = bookings.filter((b) => ["pending", "confirmed"].includes(b.status));
  const doneBookings = bookings.filter((b) => !["pending", "confirmed"].includes(b.status));
  const held = pendingBookings.reduce((t, b) => t + amount(b), 0);
  const settled = bookings.filter((b) => b.status === "completed").reduce((t, b) => t + amount(b), 0);
  const declared = profile ? profile.facilities.filter((f) => f.status === "declared").length : 0;

  async function persist(next, okMsg) {
    setBusy("save"); setError(""); setNotice("");
    try { const r = await api.saveBusinessProfile(next); setProfile(r.profile); setNotice(okMsg); speak(okMsg); return true; }
    catch (e) { setError(e.message || "Chưa lưu được hồ sơ."); return false; } finally { setBusy(""); }
  }
  async function toggleOpen() { await persist({ ...profile, open: !profile.open }, profile.open ? "Đã chuyển sang tạm ngừng đón khách." : "Đã chuyển sang đang đón khách."); }
  async function decide(r, status) {
    setBusy(r.id); setError(""); setNotice("");
    try { const u = await api.updateRequest(r.id, status); setRequests((xs) => xs.map((x) => (x.id === r.id ? u : x))); setNotice(status === "accepted" ? "Đã chấp nhận yêu cầu hỗ trợ." : "Đã từ chối yêu cầu hỗ trợ."); }
    catch (e) { setError(e.message); } finally { setBusy(""); }
  }
  async function decideBooking(b, status) {
    setBusy(b.id); setError(""); setNotice("");
    try { await api.updateBooking(b.id, status); setBookings((xs) => xs.map((x) => (x.id === b.id ? { ...x, status } : x))); setNotice(status === "confirmed" ? "Đã xác nhận đặt chỗ." : "Đã từ chối đặt chỗ."); }
    catch (e) { setError(e.message); } finally { setBusy(""); }
  }
  async function toggleLesson(id) {
    const has = profile.training.includes(id);
    await persist({ ...profile, training: has ? profile.training.filter((x) => x !== id) : [...profile.training, id] }, has ? "Đã bỏ đánh dấu bài tập huấn." : "Đã ghi nhận hoàn thành bài tập huấn.");
  }
  function startEdit() { setDraft(JSON.parse(JSON.stringify(profile))); setEditing(true); setTab("facility"); }
  const setDraftField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const setFac = (key, patch) => setDraft((d) => ({ ...d, facilities: d.facilities.map((f) => (f.key === key ? { ...f, ...patch } : f)) }));
  async function saveDraft(e) { e.preventDefault(); if (await persist(draft, "Đã lưu hồ sơ cơ sở lên hệ thống (DEMO).")) setEditing(false); }

  if (loading) return <p role="status" className="container-page py-10 text-[#59606d]">Đang tải cổng doanh nghiệp…</p>;
  if (!profile) return <p role="alert" className="container-page py-10 text-red-800">{error || "Không tải được hồ sơ doanh nghiệp."}</p>;
  const input = "mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 hc-surface hc-border";

  return <main className="relative overflow-hidden bg-[#fffcf7] pb-20" aria-labelledby="business-dashboard-title">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#fff2da_0%,rgba(255,242,218,0)_100%)]" />
    <div className="container-page relative pt-8 sm:pt-10">
      <nav aria-label="Đường dẫn trang" className="text-sm text-[#7a5a2b]"><Link href="/" className="hover:underline">Trang chủ</Link> / <Link href="/partner" className="hover:underline">Cổng Đối Tác Liên Thông</Link> / <span aria-current="page" className="font-semibold text-[#3d2a10]">Cổng Doanh nghiệp</span></nav>

      <section className={`${card} mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-center`} aria-labelledby="business-dashboard-title">
        <div className="flex min-w-0 items-center gap-4">
          <img src={biz.logo} alt={`Ảnh minh họa cho ${profile.name}`} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h1 id="business-dashboard-title" className="text-2xl font-black text-[#161c27] sm:text-3xl">{profile.name}</h1><span className="rounded-full bg-[#fff0d2] px-3 py-0.5 text-xs font-bold text-[#8a540c]">#{businessId.toUpperCase()} · DEMO</span></div>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#60656e]"><MapPinIcon size={15} /> {profile.address || profile.area}{profile.hours ? ` · ${profile.hours}` : ""}</p>
            <p className="mt-2 inline-flex rounded-full bg-[#f3efe7] px-3 py-1 text-xs font-bold text-[#5c4a2e]">{declared}/{FACILITIES.length} hạng mục tiếp cận đã tự khai báo · chưa được WayEcho xác minh</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" role="switch" aria-checked={profile.open} onClick={toggleOpen} disabled={busy === "save"} className="flex min-h-[48px] items-center gap-3 rounded-full bg-[#f6f1e8] px-4 text-sm font-bold text-[#2a2118] disabled:opacity-60 hc-surface hc-border">
            <span aria-hidden="true" className={`h-3 w-3 rounded-full ${profile.open ? "bg-[#1b8a36]" : "bg-[#9a8f80]"}`} />{profile.open ? "Đang đón khách" : "Tạm ngừng đón khách"}
          </button>
          <button type="button" onClick={startEdit} className="inline-flex min-h-[48px] items-center rounded-full bg-[#ffb332] px-5 text-sm font-bold text-[#171b20] hover:bg-[#f5a421]">✎ Chỉnh sửa hồ sơ cơ sở</button>
          <a href="tel:19008282" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#b42318] px-5 text-sm font-bold text-white hover:bg-[#8f1d14]"><PhoneIcon size={17} /> SOS 1900 8282</a>
        </div>
      </section>

      {error && <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-900">{notice}</p>}

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        <Stat icon={CalendarIcon} label="Tổng đặt chỗ" value={bookings.length} caption="Đơn ghi nhận trong bản demo" />
        <Stat icon={AccessibleIcon} label="Yêu cầu chờ duyệt" value={waiting.length} caption="Cần cơ sở phản hồi" />
        <Stat icon={CheckIcon} label="Tỷ lệ chấp nhận yêu cầu" value={acceptedRate} caption={decided.length ? `Trên ${decided.length} yêu cầu đã xử lý` : "Chưa có yêu cầu nào được xử lý"} />
        <Stat icon={BedIcon} label="Dịch vụ đang quản lý" value={biz.items.length} caption="Thuộc hồ sơ doanh nghiệp này" />
      </div>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <div role="tablist" aria-label="Quản lý cơ sở" className="flex flex-wrap gap-2 rounded-full bg-[#f5eee1] p-1.5">
            {TABS.map(([id, label]) => <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={`min-h-[44px] rounded-full px-4 text-sm font-bold transition ${tab === id ? "bg-[#ffb332] text-[#171b20] shadow-sm" : "text-[#5c4a2e] hover:bg-[#ffe9c4]"}`}>{label}{id === "requests" && waiting.length > 0 && <span className="ml-2 rounded-full bg-[#171b20] px-2 py-0.5 text-[11px] text-[#ffb332]">{waiting.length}</span>}</button>)}
          </div>

          {tab === "requests" && <section className="space-y-4" aria-label="Yêu cầu hỗ trợ tiếp cận">
            {requests.length === 0 ? <div className={card}><p className="font-semibold text-[#2d3340]">Chưa có yêu cầu hỗ trợ nào.</p><p className="mt-1 text-sm text-[#60656e]">Khi khách đặt một dịch vụ của cơ sở và đồng ý chia sẻ yêu cầu tiếp cận, yêu cầu sẽ hiện ở đây để bạn chấp nhận hoặc từ chối.</p><Link href="/explore?cat=accommodation" className="btn-ghost hc-border mt-4 inline-flex">Thử đặt ở phía khách →</Link></div>
              : requests.map((r) => <article key={r.id} className={card}>
                <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#fff0d2] px-3 py-1 text-xs font-bold text-[#8a540c]">#{String(r.id).slice(-6).toUpperCase()}</span><span className="text-lg font-bold text-[#171e2a]">{r.itemName}</span></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${r.status === "pending" ? "bg-amber-100 text-amber-900" : r.status === "accepted" ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>{r.status === "pending" ? "Đang chờ" : r.status === "accepted" ? "Đã chấp nhận" : "Đã từ chối"}</span></div>
                <div className="mt-3 rounded-xl bg-[#fff8ec] p-4"><p className="flex items-center gap-2 text-xs font-bold text-[#6b4a14]"><AccessibleIcon size={16} /> Yêu cầu tiếp cận khách đã chia sẻ</p><p className="mt-2 text-sm leading-6 text-[#343945]">“{r.content}”</p></div>
                {r.status === "pending" && <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy === r.id} onClick={() => decide(r, "accepted")} className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#ffb332] px-5 text-sm font-bold text-[#171b20] hover:bg-[#f5a421] disabled:opacity-60"><CheckIcon size={18} /> Chấp nhận</button><button type="button" disabled={busy === r.id} onClick={() => decide(r, "rejected")} className="inline-flex min-h-[46px] items-center rounded-full bg-[#f5eee1] px-5 text-sm font-bold text-[#2a2118] hover:bg-[#ffe9c4] disabled:opacity-60">Từ chối</button></div>}
              </article>)}
          </section>}

          {tab === "guests" && <section className="space-y-4" aria-label="Đặt chỗ đang chờ">
            {pendingBookings.length === 0 ? <div className={card}><p className="font-semibold text-[#2d3340]">Không có đặt chỗ nào đang chờ.</p></div> : pendingBookings.map((b) => <article key={b.id} className={card}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-lg font-bold text-[#171e2a]">{b.itemName}</p><p className="text-sm text-[#60656e]">{b.date} · {b.time} · {b.guests} khách · {b.price || "Giá demo"}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{b.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}</span></div>
              {b.status === "pending" && <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy === b.id} onClick={() => decideBooking(b, "confirmed")} className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#ffb332] px-5 text-sm font-bold text-[#171b20] hover:bg-[#f5a421] disabled:opacity-60"><CheckIcon size={18} /> Xác nhận</button><button type="button" disabled={busy === b.id} onClick={() => decideBooking(b, "rejected")} className="inline-flex min-h-[46px] items-center rounded-full bg-[#f5eee1] px-5 text-sm font-bold text-[#2a2118] hover:bg-[#ffe9c4] disabled:opacity-60">Từ chối</button></div>}</article>)}
          </section>}

          {tab === "history" && <section className={card} aria-label="Lịch sử đón tiếp">
            {doneBookings.length === 0 ? <p className="font-semibold text-[#2d3340]">Chưa có lịch sử đón tiếp.</p> : <ul className="divide-y divide-[#f0ece6]">{doneBookings.map((b) => <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="text-sm font-semibold text-[#343945]">{b.itemName} · {b.date}</span><span className="rounded-full bg-[#f3efe7] px-3 py-1 text-xs font-bold text-[#5c4a2e]">{b.status === "completed" ? "Hoàn thành" : b.status === "rejected" ? "Đã từ chối" : b.status === "cancelled" ? "Đã hủy" : b.status}</span></li>)}</ul>}
          </section>}

          {tab === "facility" && <section className={card} aria-labelledby="facility-heading">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="facility-heading" className="text-xl font-black text-[#171e2a]">Hồ sơ cơ sở vật chất tiếp cận</h2><p className="mt-1 text-sm text-[#727780]">Cơ sở tự khai báo; WayEcho chưa xác minh. Chỉ ghi điều có thật và có thể kiểm chứng tại chỗ.</p></div>{!editing && <button type="button" onClick={startEdit} className="inline-flex min-h-[44px] items-center rounded-full bg-[#ffb332] px-5 text-sm font-bold text-[#171b20] hover:bg-[#f5a421]">✎ Chỉnh sửa</button>}</div>
            {editing && draft ? <form onSubmit={saveDraft} className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[["name", "Tên cơ sở"], ["address", "Địa chỉ"], ["phone", "Điện thoại"], ["hours", "Giờ hoạt động"]].map(([k, l]) => <div key={k}><label htmlFor={`bf-${k}`} className="block text-sm font-bold">{l}</label><input id={`bf-${k}`} value={draft[k]} onChange={(e) => setDraftField(k, e.target.value)} className={input} /></div>)}
              </div>
              <div><label htmlFor="bf-desc" className="block text-sm font-bold">Mô tả cơ sở</label><textarea id="bf-desc" rows={3} value={draft.desc} onChange={(e) => setDraftField("desc", e.target.value)} className={input} /></div>
              {FACILITIES.map((f) => { const v = draft.facilities.find((x) => x.key === f.key); return <fieldset key={f.key} className="rounded-2xl border border-[#efe3cf] p-4"><legend className="px-2 font-bold text-[#171e2a]">{f.title}</legend><label htmlFor={`bf-${f.key}`} className="block text-xs text-[#727780]">{f.hint}</label><textarea id={`bf-${f.key}`} rows={2} value={v.detail} onChange={(e) => setFac(f.key, { detail: e.target.value })} className={input} /><label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={v.status === "declared"} onChange={(e) => setFac(f.key, { status: e.target.checked ? "declared" : "unverified" })} className="h-5 w-5 accent-[#f8ae38]" /> Tôi xác nhận thông tin này là đúng thực tế (tự khai báo)</label></fieldset>; })}
              <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy === "save"} className="btn-primary disabled:opacity-60">{busy === "save" ? "Đang lưu…" : "Lưu & đẩy lên hệ thống"}</button><button type="button" onClick={() => setEditing(false)} className="btn-ghost hc-border">Hủy</button></div>
            </form> : <div className="mt-5 grid gap-4 md:grid-cols-2">{FACILITIES.map((f) => { const v = profile.facilities.find((x) => x.key === f.key); return <div key={f.key} className="flex flex-col justify-between gap-3 rounded-2xl bg-[#fff8ec] p-4"><div><p className="font-bold text-[#171e2a]">{f.title}</p><p className="mt-1 text-sm text-[#4b525d]">{v.detail || "Chưa có thông tin. Bấm “Chỉnh sửa” để bổ sung."}</p></div><span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${v.status === "declared" ? "bg-green-100 text-green-900" : "bg-[#f3efe7] text-[#5c4a2e]"}`}>{FACILITY_STATUS[v.status]}</span></div>; })}</div>}
            {profile.updatedAt && !editing && <p className="mt-4 text-xs text-[#8b7b67]">Cập nhật lần cuối: {new Date(profile.updatedAt).toLocaleString("vi-VN")}</p>}
          </section>}
        </div>

        <aside className="space-y-5" aria-label="Vận hành">
          <section className={card} aria-labelledby="dispatch-heading"><h2 id="dispatch-heading" className="flex items-center gap-2 text-lg font-black text-[#171e2a]"><HeadphonesIcon size={22} /> Trực ban điều phối Phố cổ</h2>
            <dl className="mt-4 space-y-2 rounded-xl bg-[#fff8ec] p-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-[#727780]">Trạm phản ứng nhanh</dt><dd className="font-bold">28 Hàng Buồm</dd></div><div className="flex justify-between gap-3"><dt className="text-[#727780]">Hotline đối tác</dt><dd className="font-bold text-[#b42318]">1900 8282</dd></div></dl>
            <a href="tel:19008282" className="mt-4 flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#ffb332] px-5 text-sm font-bold text-[#171b20] hover:bg-[#f5a421]"><PhoneIcon size={18} /> Gọi trạm điều phối</a>
            <Link href="/sos" className="mt-3 flex min-h-[46px] items-center justify-center rounded-full bg-[#f5eee1] px-5 text-sm font-bold text-[#2a2118] hover:bg-[#ffe9c4]">Mở trang SOS</Link>
          </section>
          <section className={card} aria-labelledby="escrow-heading"><div className="flex items-center justify-between gap-2"><h2 id="escrow-heading" className="text-lg font-black text-[#171e2a]">Ví ký quỹ Escrow</h2><span className="rounded bg-[#f3efe7] px-2 py-0.5 text-[11px] font-bold text-[#5c4a2e]">DEMO</span></div>
            <div className="mt-4 space-y-3"><div className="rounded-xl bg-[#fff8ec] p-4"><p className="text-xs text-[#727780]">Đã đối soát (đơn hoàn thành)</p><p className="text-2xl font-black text-[#171e2a]">{money(settled)}</p></div><div className="flex items-center justify-between rounded-xl bg-[#f6f1e8] p-3"><div><p className="text-xs text-[#727780]">Đang giữ ký quỹ theo đơn</p><p className="font-bold">{money(held)}</p></div><span aria-hidden="true">🔒</span></div></div>
            <p className="mt-3 text-xs leading-5 text-[#8b7b67]">Tính từ giá các đặt chỗ trong bản demo, không có tiền thật và chưa nối ngân hàng.</p></section>
          <section className={card} aria-labelledby="training-heading"><div className="flex items-center justify-between gap-2"><h2 id="training-heading" className="text-lg font-black text-[#171e2a]">Tập huấn kỹ năng trợ năng</h2><span className="rounded-full bg-[#fff0d2] px-2.5 py-0.5 text-xs font-bold text-[#8a540c]">{profile.training.length}/{TRAINING.length}</span></div>
            <ul className="mt-4 space-y-2">{TRAINING.map((t, i) => { const done = profile.training.includes(t.id); return <li key={t.id} className="rounded-xl bg-[#fff8ec]"><button type="button" aria-expanded={lesson === t.id} onClick={() => setLesson(lesson === t.id ? "" : t.id)} className="flex min-h-[48px] w-full items-center gap-3 px-3 text-left"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-[#1b8a36] text-white" : "bg-[#ffb332] text-[#171b20]"}`}>{done ? "✓" : i + 1}</span><span className="text-sm font-semibold text-[#2d3340]">{t.title}</span></button>
              {lesson === t.id && <div className="px-3 pb-3 text-sm leading-6 text-[#4b525d]"><p>{t.note}</p><button type="button" onClick={() => toggleLesson(t.id)} disabled={busy === "save"} className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-[#ffb332] px-4 text-sm font-bold text-[#171b20] hover:bg-[#f5a421] disabled:opacity-60">{done ? "Bỏ đánh dấu" : "Đánh dấu đã hoàn thành"}</button></div>}</li>; })}</ul></section>
          <nav className={card} aria-label="Thao tác nhanh"><h2 className="text-lg font-black text-[#171e2a]">Thao tác nhanh</h2><div className="mt-4 flex flex-col gap-3">{[["/business/services", "Quản lý dịch vụ"], ["/business/bookings", "Lịch đặt chỗ"], ["/business/reviews", "Đánh giá của khách"], ["/business/profile", "Hồ sơ doanh nghiệp"]].map(([h, l]) => <Link key={h} href={h} className="flex min-h-[46px] items-center rounded-xl bg-[#fff5e7] px-4 text-sm font-bold text-[#262c35] hover:bg-[#ffecd0]">{l} →</Link>)}</div></nav>
        </aside>
      </div>
    </div>
  </main>;
}
