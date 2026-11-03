"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useBusiness } from "@/components/BusinessShell";
import { api } from "@/lib/api";
import { getBusiness } from "@/data/businesses";
import { CalendarIcon, AccessibleIcon, StarIcon, BedIcon, HeadphonesIcon } from "@/components/Icons";

function bookingAmount(list) {
  return list.reduce((total, item) => total + (Number(String(item.price || "").replace(/[^0-9]/g, "")) || 0), 0);
}
function formatMoney(n) { return new Intl.NumberFormat("vi-VN").format(n) + " đ"; }

function Trend({ points, label }) {
  return <div className="we-biz-trend" role="img" aria-label={label}>
    <svg width="86" height="40" viewBox="0 0 86 40" aria-hidden="true" fill="none">
      <path d="M0 30C12 20 17 29 24 26S37 13 48 20 62 15 69 17 77 7 86 8" stroke="#f6aa2d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0 30C12 20 17 29 24 26S37 13 48 20 62 15 69 17 77 7 86 8V40H0Z" fill="#f6aa2d" opacity=".10" />
    </svg>
  </div>;
}

function DashboardCard({ icon: Icon, label, value, caption }) {
  return <article className="relative min-h-[166px] overflow-hidden rounded-[22px] border border-[#f0e7dc] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(44,32,18,.07)] sm:px-6">
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0d2] text-[#c77b12]"><Icon size={25}/></span>
    <p className="mt-3 text-sm font-bold text-[#1b2330]">{label}</p>
    <p className="mt-1 text-[29px] font-black leading-tight tracking-tight text-[#111827]" aria-live="polite">{value}</p>
    <p className="mt-1 text-xs text-[#73757a]">{caption}</p>
  </article>;
}

function ActivityIcon({ type }) {
  const Icon = type === "accessibility_request" ? HeadphonesIcon : CalendarIcon;
  return <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1db] text-[#d08013]"><Icon size={21}/></span>;
}

export default function BusinessDashboard() {
  const { businessId } = useBusiness();
  const biz = getBusiness(businessId);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.listBusinessBookings(businessId),
      api.listRequests(businessId),
      api.listNotifications({ role: "business", business: businessId }),
    ]).then(([b, r, n]) => {
      if (active) { setBookings(Array.isArray(b) ? b : []); setRequests(Array.isArray(r) ? r : []); setNotifs(Array.isArray(n) ? n : []); }
    }).catch(err => { if (active) setError(err?.message || "Không tải được dữ liệu doanh nghiệp."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [businessId]);

  const waiting = useMemo(() => requests.filter(r => r.status === "pending"), [requests]);
  const stats = [
    { icon: CalendarIcon, label: "Tổng đặt chỗ", value: bookings.length, caption: "Đơn ghi nhận trong bản demo" },
    { icon: AccessibleIcon, label: "Yêu cầu hỗ trợ chờ xử lý", value: waiting.length, caption: "Cần doanh nghiệp phản hồi" },
    { icon: StarIcon, label: "Giá trị booking ước tính", value: formatMoney(bookingAmount(bookings)), caption: "Giá trị hiển thị từ dữ liệu demo" },
    { icon: BedIcon, label: "Dịch vụ đã tạo", value: biz?.items?.length || 0, caption: "Dịch vụ thuộc hồ sơ hiện tại" },
  ];

  return <main className="relative overflow-hidden bg-[#fffcf7] pb-20" aria-labelledby="business-dashboard-title">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,#fff2da_0%,rgba(255,242,218,0)_100%)]"/>
    <div className="container-page relative pt-9 sm:pt-12">
      <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-[850px]">
          <div className="flex items-center gap-3"><span className="h-9 w-1.5 rounded-full bg-[#ffac2d]" aria-hidden="true"/><h1 id="business-dashboard-title" className="text-3xl font-black text-[#161c27] sm:text-4xl">Tổng quan doanh nghiệp</h1></div>
          <p className="mt-3 text-base leading-7 text-[#60656e]">Theo dõi hoạt động, quản lý dịch vụ và hỗ trợ khách hàng trên WayEcho.</p>
          <p className="mt-2 text-xs text-[#946c31]">Cổng demo của {biz?.name || "doanh nghiệp"}. Dữ liệu trong giao diện này chỉ phục vụ thử nghiệm.</p>
        </div>
        <Link href="/business/services" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#efd9b6] bg-white px-5 text-sm font-bold text-[#9e5916] hover:bg-[#fff3df]">Quản lý dịch vụ →</Link>
      </header>

      {error && <p role="alert" className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
      {loading ? <p role="status" className="rounded-xl bg-white p-5 text-[#59606d]">Đang tải dữ liệu doanh nghiệp…</p> : <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">{stats.map(s => <DashboardCard key={s.label} {...s}/>)}</div>
        <div className="mt-7 grid items-start gap-5 xl:grid-cols-[1fr_1.2fr_.8fr]">
          <section className="min-h-[340px] rounded-[22px] border border-[#f1e8db] bg-white p-5 shadow-[0_8px_22px_rgba(44,32,18,.065)]" aria-labelledby="recent-heading">
            <div className="flex items-center justify-between gap-3"><h2 id="recent-heading" className="text-xl font-black text-[#171e2a]">Hoạt động gần đây</h2><Link href="/business/bookings" className="text-sm font-bold text-[#1467a3] hover:underline">Xem tất cả →</Link></div>
            <p className="mt-2 text-sm text-[#727780]">Các cập nhật liên quan đến đặt chỗ, dịch vụ và hỗ trợ.</p>
            {notifs.length ? <ul className="mt-5 divide-y divide-[#f0ece6]">{notifs.slice(0,5).map(n => <li key={n.id} className="flex gap-3 py-3"><ActivityIcon type={n.type}/><span className="text-sm leading-6 text-[#424955]">{n.message}</span></li>)}</ul> : <div className="mt-7 flex min-h-28 flex-col justify-center rounded-2xl bg-[#fffaf2] p-5 text-sm text-[#6c6d73]"><p className="font-semibold text-[#323b4b]">Chưa có hoạt động gần đây</p><p className="mt-1">Thông báo mới sẽ xuất hiện ở đây khi có dữ liệu.</p></div>}
          </section>
          <div className="space-y-5">
            <section className="rounded-[22px] border border-[#f1e8db] bg-white p-5 shadow-[0_8px_22px_rgba(44,32,18,.065)]" aria-labelledby="support-heading">
              <div className="flex items-center justify-between gap-3"><h2 id="support-heading" className="text-xl font-black text-[#171e2a]">Yêu cầu hỗ trợ</h2><Link href="/business/requests" className="text-sm font-bold text-[#1467a3] hover:underline">Xử lý tất cả →</Link></div>
              <p className="mt-2 text-sm text-[#727780]">Các yêu cầu đang chờ bạn phản hồi hoặc xử lý.</p>
              {waiting.length ? <ul className="mt-4 divide-y divide-[#eee8de]">{waiting.slice(0,3).map((r,i) => <li key={r.id || i} className="flex items-center gap-3 py-3"><ActivityIcon type="accessibility_request"/><span className="min-w-0 flex-1 text-sm font-medium text-[#343945]">Yêu cầu hỗ trợ #{String(r.id || i+1).slice(-6)}</span><span className="rounded-full bg-[#fff0db] px-3 py-1 text-xs font-bold text-[#a85b11]">Chờ xử lý</span></li>)}</ul> : <p className="mt-5 rounded-xl bg-[#fffaf2] p-4 text-sm text-[#5f6671]">Không có yêu cầu nào đang chờ.</p>}
            </section>
            <section className="rounded-[22px] border border-[#f1e8db] bg-white p-5 shadow-[0_8px_22px_rgba(44,32,18,.065)]" aria-labelledby="service-heading">
              <h2 id="service-heading" className="text-xl font-black text-[#171e2a]">Hiệu quả dịch vụ</h2>
              <p className="mt-2 text-sm leading-6 text-[#727780]">Thông tin tổng hợp từ dữ liệu trong phiên demo.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#fff8ec] p-4"><p className="text-3xl font-black text-[#171e2a]">{biz?.items?.length || 0}</p><p className="mt-1 text-xs text-[#6e7480]">Dịch vụ đang quản lý</p></div>
                <div className="rounded-xl bg-[#fff8ec] p-4"><p className="text-3xl font-black text-[#171e2a]">{bookings.length}</p><p className="mt-1 text-xs text-[#6e7480]">Lượt đặt ghi nhận</p></div>
              </div>
              <p className="mt-4 text-xs leading-5 text-[#8b7b67]">Biểu đồ xu hướng và điểm đánh giá sẽ hiển thị khi có đủ dữ liệu thật; không tạo số liệu giả.</p>
            </section>
          </div>
          <aside className="rounded-[22px] border border-[#f1e8db] bg-white p-5 shadow-[0_8px_22px_rgba(44,32,18,.065)]" aria-labelledby="quick-heading">
            <h2 id="quick-heading" className="text-xl font-black text-[#171e2a]">Thao tác nhanh</h2>
            <p className="mt-2 text-sm leading-6 text-[#727780]">Thực hiện các tác vụ thường dùng để quản lý doanh nghiệp.</p>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Thao tác quản lý nhanh">
              {[{href:"/business/services",icon:"＋",label:"Thêm / quản lý dịch vụ",primary:true},{href:"/business/profile",icon:"✎",label:"Cập nhật thông tin"},{href:"/business/bookings",icon:"▦",label:"Xem lịch đặt chỗ"},{href:"/business/requests",icon:"☏",label:"Xử lý yêu cầu hỗ trợ"}].map(a => <Link key={a.href} href={a.href} className={`flex min-h-[49px] items-center gap-3 rounded-xl px-4 text-sm font-bold transition hover:-translate-y-0.5 ${a.primary ? "bg-[#ffb332] text-[#171b20] hover:bg-[#f5a421]" : "bg-[#fff5e7] text-[#262c35] hover:bg-[#ffecd0]"}`}><span aria-hidden="true" className="text-xl">{a.icon}</span><span className="flex-1">{a.label}</span><span aria-hidden="true">›</span></Link>)}
            </nav>
          </aside>
        </div>
      </>}
    </div>
  </main>;
}
