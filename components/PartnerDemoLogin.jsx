"use client";
import { useState } from "react";
import Link from "next/link";

const ROLES = [
  { id: "guide", title: "Hướng dẫn viên", detail: "Nhận tour và theo dõi lịch điều phối.", icon: "🧭" },
  { id: "volunteer", title: "Tình nguyện viên", detail: "Hỗ trợ di chuyển và tiếp cận.", icon: "🤝" },
  { id: "business", title: "Đối tác di sản", detail: "Xem quy trình tiếp nhận yêu cầu.", icon: "🏛️" },
];

export default function PartnerDemoLogin() {
  const [role, setRole] = useState("guide");
  const [displayName, setDisplayName] = useState("");
  function enterDemo(event) {
    event.preventDefault();
    const params = new URLSearchParams({ role, name: displayName.trim() || "Người tham gia demo" });
    window.location.assign("/partner/demo?" + params.toString());
  }
  return <div className="container-page py-10 sm:py-14">
    <nav aria-label="Đường dẫn" className="mb-6 text-sm text-ink-soft"><Link href="/">Trang chủ</Link> / <Link href="/partner">Đối tác</Link> / <span aria-current="page">Minh họa đăng nhập</span></nav>
    <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line bg-white shadow-card hc-surface hc-border">
      <div className="bg-[#243447] p-6 text-white sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-amber-300">WayEcho · Partner experience</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Cổng điều phối đối tác</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">Màn hình minh họa trải nghiệm dành cho hướng dẫn viên, tình nguyện viên và đối tác di sản. Không cần tài khoản hoặc mật khẩu.</p>
      </div>
      <form onSubmit={enterDemo} className="space-y-6 p-6 sm:p-9">
        <fieldset>
          <legend className="text-lg font-bold">1. Chọn vai trò minh họa</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {ROLES.map(item => <button key={item.id} type="button" aria-pressed={role === item.id} onClick={() => setRole(item.id)} className={`min-h-32 rounded-2xl border-2 p-4 text-left transition ${role === item.id ? "border-primary bg-amber-50" : "border-line bg-surface"}`}>
              <span className="text-2xl" aria-hidden="true">{item.icon}</span><span className="mt-2 block font-bold">{item.title}</span><span className="mt-1 block text-xs leading-5 text-ink-soft">{item.detail}</span>
            </button>)}
          </div>
        </fieldset>
        <div>
          <label htmlFor="demo-name" className="block font-bold">2. Tên hiển thị (không bắt buộc)</label>
          <input id="demo-name" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={60} placeholder="Nhập tên bất kỳ hoặc để trống" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 py-3 hc-surface hc-border" />
          <p className="mt-2 text-xs text-ink-soft">Thông tin chỉ dùng để hiển thị trong màn hình demo, không tạo tài khoản và không lưu thành hồ sơ.</p>
        </div>
        <button type="submit" className="btn-primary w-full justify-center text-base">Vào bản minh họa một chạm →</button>
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Lưu ý:</strong> Đây không phải đăng nhập xác thực và không cấp quyền truy cập khu vực quản trị thật. Các trang /admin, /guide và /business vẫn giữ nguyên cơ chế bảo vệ tài khoản phía máy chủ.</div>
      </form>
    </section>
  </div>;
}
