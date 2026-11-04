"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGuide, DEMO_GUIDE_ID, guideAssignments } from "@/data/guides";
import { CalendarIcon, StarIcon, AccessibleIcon, CheckIcon, MapPinIcon } from "@/components/Icons";
import { useA11y } from "@/components/A11yProvider";

export default function GuideDashboard() {
  const g = getGuide(DEMO_GUIDE_ID);
  const { speak } = useA11y();
  const [items, setItems] = useState(guideAssignments);
  const [isOnline, setIsOnline] = useState(true);
  const [activeTourAudio, setActiveTourAudio] = useState(false);
  const pending = items.filter((a) => a.status === "pending").length;

  const stats = [
    { icon: CalendarIcon, num: items.length, label: "Lịch hỗ trợ", detail: "2 ca hôm nay" },
    { icon: AccessibleIcon, num: pending, label: "Chờ xác nhận", detail: "1 yêu cầu mới" },
    { icon: StarIcon, num: g.rating ?? "4.95", label: "Đánh giá trung bình", detail: "48 lượt đánh giá" },
  ];

  function toggleOnline() {
    const nextState = !isOnline;
    setIsOnline(nextState);
    speak(
      nextState
        ? "Bạn đã chuyển sang chế độ trực tuyến: Sẵn sàng nhận tour và ca đồng hành."
        : "Bạn đã chuyển sang chế độ tạm nghỉ: Tạm dừng nhận tour mới."
    );
  }

  function accept(id) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "accepted" } : item));
    speak("Đã xác nhận nhận lịch tour tiếp cận. Hệ thống đã gửi thông báo đến du khách.");
  }

  return (
    <div className="container-page py-8 sm:py-10 text-[#212529]">
      {/* Header with Live Status Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebd9c5]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffedd5] px-3 py-0.5 text-xs font-bold text-[#9a3412]">
            <span>🧭 SIGHTED GUIDE WORKSPACE</span>
            <span>•</span>
            <span>PHỐ CỔ HÀ NỘI</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold text-[#352016]">
            Tổng Quan Hướng Dẫn Viên
          </h1>
          <p className="hc-muted mt-1 text-sm sm:text-base text-ink-soft">
            Xin chào, <strong>Lê Thanh Tú</strong> (Mã HDV: WE-G104) • Chứng chỉ WBU Cấp độ 2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleOnline}
            aria-pressed={isOnline}
            className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition-all focus:ring-4 ${
              isOnline
                ? "bg-[#16a34a] text-white hover:bg-[#15803d] focus:ring-green-200"
                : "bg-[#e5e7eb] text-[#374151] hover:bg-[#d1d5db] focus:ring-gray-300"
            }`}
          >
            <span className={`h-3 w-3 rounded-full ${isOnline ? "bg-white animate-ping" : "bg-gray-500"}`} />
            <span>{isOnline ? "Đang nhận tour (Trực tuyến)" : "Tạm nghỉ nhận tour"}</span>
          </button>

          <Link
            href="/partner"
            className="rounded-2xl border border-[#ebd9c5] bg-white px-4 py-3 text-sm font-semibold text-[#554336] hover:bg-[#fbfaf4]"
          >
            Cổng đối tác
          </Link>
        </div>
      </div>

      {/* Escrow Financial Trust Banner */}
      <section className="mt-6 rounded-3xl border border-[#ebd9c5] bg-[#fffbf2] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f8ae38] text-2xl text-[#212529] font-black">
              🔒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c75c13]">
                  Bảo Hộ Ký Quỹ Escrow Minh Bạch
                </span>
                <span className="rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-[11px] font-bold">
                  Điểm Tín Nhiệm: 99.4/100
                </span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-[#352016]">
                Số dư ký quỹ tạm giữ an toàn: 1.850.000 VNĐ
              </h2>
              <p className="mt-0.5 text-xs text-[#665b50]">
                Khoản tiền được tự động giải ngân sau 24h kể từ khi du khách hoàn thành tour mà không có khiếu nại.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/escrow"
              className="rounded-xl border border-[#c75c13] bg-white px-3.5 py-2 text-xs font-bold text-[#c75c13] hover:bg-[#ffedd5] transition-colors"
            >
              Xem sổ cái Escrow →
            </Link>
          </div>
        </div>
      </section>

      {/* Active Tour Live Dispatch Card */}
      <section className="mt-6 rounded-3xl border border-[#f8ae38] bg-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#f8ae38] text-[#212529] px-4 py-1 rounded-bl-2xl text-xs font-black uppercase tracking-wider">
          Tour đang diễn ra hôm nay
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#0d9488] uppercase tracking-wide">
                MÃ TOUR #WE-HC36
              </span>
              <span className="text-xs text-[#665b50]">• 08:30 – 11:30 (Đang diễn ra)</span>
            </div>

            <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#352016]">
              Hành Trình Di Sản Xúc Giác & Thảo Mộc 36 Phố Phường
            </h3>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-[#554336]">
              <div className="rounded-xl bg-[#faf9f3] p-3 border border-[#f0e7dd]">
                <p className="font-bold text-[#352016]">👤 Du khách: Cô Thu Hà (58 tuổi)</p>
                <p className="mt-1 text-[#665b50]">Hồ sơ: Khiếm thị hoàn toàn (B1), sử dụng gậy trắng, thính lực rất tốt.</p>
                <p className="mt-1 font-semibold text-[#0d9488]">Yêu cầu: Hỗ trợ mô tả xúc giác chi tiết tại 87 Mã Mây & Đình Kim Ngân.</p>
              </div>

              <div className="rounded-xl bg-[#faf9f3] p-3 border border-[#f0e7dd]">
                <p className="font-bold text-[#352016]">📍 Lộ trình tiếp theo:</p>
                <p className="mt-1 text-[#665b50]">87 Mã Mây → Rẽ phải sang 42 Hàng Bạc → Nghỉ chân tại Cà phê Cộng Hàng Buồm.</p>
                <p className="mt-1 font-semibold text-[#c75c13]">Cảnh báo rào cản: Vỉa hè Hàng Bạc có xe máy đỗ mép ngã ba Đinh Liệt.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTourAudio(!activeTourAudio);
                speak(activeTourAudio ? "Đã tắt phát thanh hướng dẫn." : "Đang phát thuyết minh âm thanh định vị binaural 3D.");
              }}
              className="rounded-xl bg-[#352016] hover:bg-[#212529] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors"
            >
              {activeTourAudio ? "⏹ Dừng thuyết minh âm thanh" : "▶ Bật thuyết minh Binaural 3D"}
            </button>

            <a
              href="tel:0912345678"
              className="rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2.5 text-xs font-bold text-center shadow-xs transition-colors"
            >
              📞 Gọi nhanh cho khách (0912 xxx 678)
            </a>

            <Link
              href="/sos"
              className="rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 text-xs font-bold text-center transition-colors"
            >
              🚨 Báo sự cố khẩn cấp
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section aria-label="Thống kê Guide" className="mt-7 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card hc-surface hc-border p-5 sm:p-6 bg-white rounded-3xl border border-[#ebd9c5]">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8ae38] text-ink font-bold">
                <stat.icon size={23} />
              </span>
              <span className="text-xs font-bold text-[#0d9488] bg-[#f0fdfa] border border-[#99f6e4] px-2 py-0.5 rounded-full">
                {stat.detail}
              </span>
            </div>
            <p className="mt-3 font-display text-4xl font-extrabold text-[#352016]">{stat.num}</p>
            <p className="hc-muted text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Upcoming Assignments Section */}
      <section className="mt-8" aria-labelledby="upcoming-title">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#ebd9c5]">
          <div>
            <h2 id="upcoming-title" className="text-2xl font-bold text-[#352016]">Lịch Đồng Hành Sắp Tới</h2>
            <p className="text-xs text-[#665b50]">Quản lý xác nhận yêu cầu tour và liên hệ chuẩn bị trước giờ khởi hành</p>
          </div>
          <Link href="/guide/schedule" className="text-sm font-semibold text-[#1267a5] hover:underline">
            Xem toàn bộ lịch →
          </Link>
        </div>

        <ul className="mt-5 space-y-3">
          {items.map((a) => (
            <li key={a.id} className="card hc-surface hc-border overflow-hidden p-4 sm:p-5 bg-white rounded-3xl border border-[#ebd9c5] shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="relative hidden h-24 w-36 shrink-0 overflow-hidden rounded-2xl sm:block bg-[#faf9f3]">
                    <Image src={a.image} alt={a.imageAlt} fill sizes="144px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-[#352016]">{a.service}</p>
                    <p className="hc-muted mt-1 text-sm text-ink-soft font-medium">Khách: {a.traveler}</p>
                    <div className="hc-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                      <span className="inline-flex items-center gap-1"><CalendarIcon size={14} /> {a.date}</span>
                      <span>{a.period} {a.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPinIcon size={14} /> {a.location}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {a.accessibility.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#fff1dd] px-2.5 py-0.5 text-xs font-semibold text-[#b75a12]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {a.status === "accepted" ? "Đã nhận ca" : "Chờ bạn duyệt"}
                  </span>
                  <Link href={`/guide/bookings#${a.id}`} className="rounded-xl border border-[#ebd9c5] bg-[#faf9f3] px-3.5 py-2 text-xs font-bold text-[#554336] hover:bg-[#f0e7dd]">
                    Xem chi tiết
                  </Link>
                  {a.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => accept(a.id)}
                      className="rounded-xl bg-[#f8ae38] hover:bg-[#e09f2f] text-[#212529] px-4 py-2 text-xs font-bold shadow-xs transition-all"
                    >
                      <CheckIcon size={16} /> Xác nhận tour
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Real-Time Barrier Radar from Volunteers */}
      <section className="mt-8 rounded-3xl border border-[#ebd9c5] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#f0e7dd]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📡</span>
            <div>
              <h3 className="text-lg font-bold text-[#352016]">Radar Rào Cản Thực Địa 36 Phố Phường</h3>
              <p className="text-xs text-[#665b50]">Dữ liệu cập nhật liên tục từ Tình nguyện viên và cộng đồng</p>
            </div>
          </div>
          <Link href="/volunteer#audit-feed" className="text-xs font-bold text-[#0d9488] hover:underline">
            Xem Trạm TNV 28 Hàng Buồm →
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl bg-[#faf9f3] p-4 border border-[#f0e7dd]">
            <span className="font-bold text-[#b91c1c]">⚠️ Hàng Buồm - Đào Duy Từ</span>
            <p className="mt-1 text-[#554336]">Xe máy đỗ choán dải gạch xúc giác. Hướng dẫn viên nên cho khách đi sát lề trong phía cửa hàng.</p>
          </div>
          <div className="rounded-2xl bg-[#faf9f3] p-4 border border-[#f0e7dd]">
            <span className="font-bold text-[#c75c13]">⚠️ 38 Hàng Đào (Đình Đồng Lạc)</span>
            <p className="mt-1 text-[#554336]">Bậc tam cấp bị sứt mép gạch. Đã dán băng phản quang, cần nhắc khách bước dài hơn bình thường.</p>
          </div>
          <div className="rounded-2xl bg-[#faf9f3] p-4 border border-[#f0e7dd]">
            <span className="font-bold text-[#16a34a]">✓ 87 Mã Mây (Nhà Cổ)</span>
            <p className="mt-1 text-[#554336]">Cầu dốc gỗ tạm thời đã được kê tại sảnh chính. Lối vào thuận tiện cho gậy dò đường.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
