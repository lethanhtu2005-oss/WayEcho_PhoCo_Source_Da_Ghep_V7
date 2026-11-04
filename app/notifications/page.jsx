"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useA11y } from "@/components/A11yProvider";
import {
  CheckIcon,
  CalendarIcon,
  AccessibleIcon,
  SpeakerIcon,
  PhoneIcon,
  MapPinIcon,
} from "@/components/Icons";

const ICON = {
  request_result: AccessibleIcon,
  new_booking: CalendarIcon,
  info: CheckIcon,
  warning: AccessibleIcon,
  escrow: CheckIcon,
  device: SpeakerIcon,
};

// Dữ liệu cảnh báo thực địa & hỗ trợ di chuyển tiếp cận thời gian thực
const FIELD_ALERTS = [
  {
    id: "alert-1",
    category: "safety",
    severity: "urgent",
    timeAgo: "15 phút trước",
    distance: "Cách bạn 180m",
    title: "Cảnh báo chướng ngại vật: Thi công đào cáp ngầm tại ngã tư Hàng Buồm - Hàng Ngang",
    description: "Vỉa hè phía số chẵn bị dựng hàng rào tôn tạm thời, vạch gạch xúc giác (tactile paving) bị cắt đứt hoàn toàn khoảng 40m. Âm thanh cảnh báo rung đa hướng đã được phát tới gậy WayEcho Wand.",
    routeAlternative: "Rẽ phải vào Ngõ Gạch (lòng đường êm, xe máy lưu thông chậm), đi thẳng 90m rồi băng qua Hàng Ngang tại vạch nổi có loa âm thanh định vị.",
    actionLink: "/navigation",
    actionLabel: "Mở Bản đồ âm thanh 3D tránh chướng ngại",
    reportLink: "/review",
    reportLabel: "Báo cáo thực địa đã xong",
    read: false,
  },
  {
    id: "alert-2",
    category: "trip",
    severity: "success",
    timeAgo: "1 giờ trước",
    title: "Xác nhận ghép đôi Guide thành công: Tour Hồn Xưa 36 Phố Phường (#WE-HC36)",
    description: "Tiền đặt cọc 300.000 VNĐ đang được giữ an toàn tại hợp đồng Escrow WayEcho và chỉ thanh toán sau khi bạn xác nhận hoàn thành tour an toàn.",
    guide: {
      name: "Nguyễn Minh Hoàng",
      avatar: "NH",
      badge: "Thẻ Xanh Di Sản AAA • Đã tập huấn trợ thị",
      time: "08:30 sáng mai (15/10)",
      location: "Trạm 28 Hàng Buồm",
      phone: "0988567899",
    },
    actionLink: "/my-booking",
    actionLabel: "Xem hợp đồng Escrow & Lịch trình",
    read: false,
  },
  {
    id: "alert-3",
    category: "device",
    severity: "warning",
    timeAgo: "3 giờ trước",
    title: "Gậy thông minh WayEcho Wand: Cần sạc pin & Cập nhật firmware v2.4",
    batteryLevel: 22,
    description: "Bản nâng cấp v2.4 tăng cường phân biệt âm thanh xe máy điện thế hệ mới trên các phố đi bộ. Bạn có thể đổi pin dự phòng hoặc sạc nhanh 15 phút tại Trạm thường trực 28 Hàng Buồm (mở cửa 24/7).",
    actionLink: "/navigation",
    actionLabel: "Dẫn đường âm thanh tới Trạm sạc 28 Hàng Buồm",
    read: false,
  },
  {
    id: "alert-4",
    category: "trip",
    severity: "info",
    timeAgo: "Hôm qua lúc 17:40",
    title: "Nhắc nhở hoàn tất đánh giá để giải ngân Escrow cho Hướng dẫn viên",
    description: 'Tour "Tiếng Chuông & Nhịp Đập Phố Bạc" đã kết thúc an toàn. Hãy gửi phản hồi xúc giác & cảm nhận âm thanh để hệ thống giải phóng thanh toán 300.000 VNĐ cho Guide Trần Lan Anh và tặng bạn +25 Điểm Tín Nhiệm du khách.',
    actionLink: "/review",
    actionLabel: "Đánh giá bằng giọng nói hoặc phím số",
    read: true,
  },
  {
    id: "alert-5",
    category: "community",
    severity: "info",
    timeAgo: "5 ngày trước",
    title: "Bản đồ âm thanh Phố Cổ đã cập nhật 12 mẫu tiếng rao cổ và chuông gió",
    description: "Đội ngũ tình nguyện viên cộng đồng khiếm thị Hoàn Kiếm vừa hoàn tất bản ghi âm Binaural 3D của tiếng búa đập thiếc phố Hàng Thiếc và tiếng kéo cắt kẹo kéo chợ Đồng Xuân. Bạn có thể nghe thử trước khi bắt đầu hành trình tiếp theo.",
    actionLink: "/navigation",
    actionLabel: "Mở Trình phát Âm thanh Di sản",
    read: true,
  },
];

export default function NotificationsPage() {
  const { speak } = useA11y();
  const [serverItems, setServerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [allRead, setAllRead] = useState(false);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [hapticLevel, setHapticLevel] = useState(80);
  const [autoTTS, setAutoTTS] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Nạp thông báo từ server API (bắt buộc giữ api.listNotifications() theo kiểm thử)
  useEffect(() => {
    api
      .listNotifications()
      .then(setServerItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Phím tắt bàn phím tiện ích trợ năng (Alt + R, Alt + M, Alt + F)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.altKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        readLatestAlert();
      }
      if (e.altKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        markAllAsRead();
      }
      if (e.altKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        const tabEl = document.querySelector('[role="tab"]');
        if (tabEl) tabEl.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [serverItems]);

  function triggerToast(text) {
    setToastMessage(text);
    speak(text);
    setTimeout(() => setToastMessage(""), 4500);
  }

  function readLatestAlert() {
    if (serverItems.length > 0) {
      triggerToast(`Thông báo mới nhất: ${serverItems[0].message}`);
    } else {
      triggerToast("Cảnh báo khẩn cấp: Thi công cáp ngầm tại ngã tư Hàng Buồm - Hàng Ngang cách bạn 180 mét. Vỉa hè số chẵn bị gián đoạn.");
    }
  }

  function markAllAsRead() {
    setAllRead(true);
    triggerToast("Đã đánh dấu tất cả thông báo là đã đọc. Không còn thông báo khẩn cấp tồn đọng.");
  }

  function testHapticVibrate() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    triggerToast("Đã gửi tín hiệu rung kép đến gậy thông minh WayEcho Wand. Kết nối Bluetooth hoạt động tốt.");
  }

  // Lọc thông báo kết hợp server + cảnh báo thực địa
  const filteredAlerts = useMemo(() => {
    return FIELD_ALERTS.filter((item) => {
      if (tab === "all") return true;
      if (tab === "safety") return item.category === "safety";
      if (tab === "trip") return item.category === "trip";
      if (tab === "device") return item.category === "device";
      if (tab === "community") return item.category === "community";
      return true;
    });
  }, [tab]);

  const unreadCount = allRead ? 0 : 3 + (serverItems.length > 0 ? 1 : 0);

  return (
    <div className="relative w-full min-h-screen bg-surface overflow-hidden">
      {/* 3D Ambient Orbs */}
      <div className="bubble-orb-amber -top-24 -left-20 w-80 h-80 opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="bubble-orb-glass top-96 -right-24 w-96 h-96 opacity-70 pointer-events-none" aria-hidden="true" />

      {/* Accessibility Announcement & Status Bar (Harmonized Brand Brown #352016) */}
      <div
        aria-label="Phím tắt trợ năng và trạng thái âm thanh"
        className="w-full bg-[#352016] text-[#fff2e7] border-b border-[#4f3223] px-4 py-3 relative z-10"
        role="region"
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#452a1d] text-[#ffd39a] border border-[#f8ae38]/50 font-bold px-2.5 py-1 rounded-full text-xs tracking-wide">
              <span>● Spatial Audio ON</span>
            </span>
            <span className="hidden md:inline text-[#e5d2c3]">
              Hệ thống phát âm báo định hướng theo vị trí vật cản thực tế quanh Phố Cổ
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[#e5d2c3]">
            <span className="font-bold text-white">Phím tắt:</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-[#452a1d] text-[#f8ae38] font-bold border border-[#6b4532]">Alt + R</kbd>
            <span>Đọc to</span>
            <span className="opacity-40">|</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-[#452a1d] text-[#f8ae38] font-bold border border-[#6b4532]">Alt + M</kbd>
            <span>Đọc hết</span>
            <span className="opacity-40">|</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-[#452a1d] text-[#f8ae38] font-bold border border-[#6b4532]">Alt + F</kbd>
            <span>Bộ lọc</span>
          </div>
        </div>
      </div>

      <main className="container-page py-8 space-y-8 relative z-10">
        {/* Breadcrumb & Unread indicator */}
        <nav aria-label="Đường dẫn điều hướng" className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <ol className="flex items-center gap-2 text-ink-soft">
            <li>
              <Link href="/" className="hover:underline flex items-center gap-1">
                <span>🏠 Trang chủ</span>
              </Link>
            </li>
            <li className="opacity-50">/</li>
            <li aria-current="page" className="font-bold text-ink">
              Trung tâm Thông báo & Cảnh báo Trợ năng
            </li>
          </ol>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold border border-red-200">
              <span className={`h-2 w-2 rounded-full ${unreadCount > 0 ? "bg-red-600 animate-ping" : "bg-gray-400"}`} />
              <span>{unreadCount} Cảnh báo mới</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
              ✓ Chuẩn WCAG 2.2 AAA
            </span>
          </div>
        </nav>

        {/* 3D Liquid Glass Banner */}
        <div className="glass-liquid-warm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hc-surface hc-border">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbb84d] to-[#ee9e20] text-[#212529] shadow-lg shadow-[#f8ae38]/25 border border-white/60">
              <SpeakerIcon size={32} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#212529]">
                Trung Tâm Cảnh Báo Thính Giác & Thực Địa
              </h1>
              <p className="text-sm text-ink-soft mt-1 flex items-center gap-1.5">
                <MapPinIcon size={16} className="text-[#d86927]" />
                <span>Tiểu khu Hàng Buồm - Hàng Gai - Ô Quan Chưởng (Hoàn Kiếm, Hà Nội)</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={readLatestAlert}
              className="btn-ghost hc-border !min-h-[46px] rounded-2xl flex items-center gap-2 text-sm font-semibold bg-white/70 backdrop-blur-md hover:bg-white"
            >
              <SpeakerIcon size={18} />
              <span>Đọc to mới nhất (Alt + R)</span>
            </button>
            <button
              type="button"
              onClick={markAllAsRead}
              className="btn-3d px-5 py-3 text-sm flex items-center gap-2 cursor-pointer"
            >
              <CheckIcon size={18} />
              <span>Đánh dấu đã đọc tất cả</span>
            </button>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-soft">
            <span>Lọc theo mục đích trợ năng (Alt + F)</span>
            <span>Hiển thị {filteredAlerts.length} mục hoạt động</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "all"}
              onClick={() => setTab("all")}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                tab === "all"
                  ? "bg-[#352016] text-white shadow-md border border-[#352016]"
                  : "glass-liquid text-ink hover:bg-white hover:border-[#f8ae38]"
              }`}
            >
              <span>Tất cả</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-ink font-bold">12</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "safety"}
              onClick={() => setTab("safety")}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                tab === "safety"
                  ? "bg-[#352016] text-white shadow-md border border-[#352016]"
                  : "glass-liquid text-ink hover:bg-white hover:border-[#f8ae38]"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <span>Cảnh báo an toàn & Thực địa</span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-900 font-bold">1</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "trip"}
              onClick={() => setTab("trip")}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                tab === "trip"
                  ? "bg-[#352016] text-white shadow-md border border-[#352016]"
                  : "glass-liquid text-ink hover:bg-white hover:border-[#f8ae38]"
              }`}
            >
              <span>🤝 Chuyến đi & Tour Escrow</span>
              <span className="rounded-full bg-[#fce9ca] px-2 py-0.5 text-xs text-[#773e17] font-bold">2</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "device"}
              onClick={() => setTab("device")}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                tab === "device"
                  ? "bg-[#352016] text-white shadow-md border border-[#352016]"
                  : "glass-liquid text-ink hover:bg-white hover:border-[#f8ae38]"
              }`}
            >
              <span>🦯 Thiết bị & Trợ năng</span>
              <span className="rounded-full bg-[#fce9ca] px-2 py-0.5 text-xs text-[#773e17] font-bold">1</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "community"}
              onClick={() => setTab("community")}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                tab === "community"
                  ? "bg-[#352016] text-white shadow-md border border-[#352016]"
                  : "glass-liquid text-ink hover:bg-white hover:border-[#f8ae38]"
              }`}
            >
              <span>📻 Tin cộng đồng & Khảo sát</span>
              <span className="rounded-full bg-[#fce9ca] px-2 py-0.5 text-xs text-[#773e17] font-bold">1</span>
            </button>
          </div>
        </div>

        {/* Main Bento Layout: 8 cols stream + 4 cols sidebar */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Feed Stream (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Server Notifications Section */}
            {serverItems.length > 0 && (
              <section aria-labelledby="server-notifs-title" className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-line">
                  <h2 id="server-notifs-title" className="text-xl font-bold flex items-center gap-2 text-[#352016]">
                    <span>Cập Nhật Đặt Chỗ & Yêu Cầu Của Bạn</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 font-bold">Từ hệ thống</span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {serverItems.map((n) => {
                    const Icon = ICON[n.type] || CheckIcon;
                    return (
                      <article
                        key={n.id}
                        className="glass-liquid rounded-2xl p-5 card-3d hc-surface hc-border flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff2dc] to-[#ffe2b3] text-[#7a4c00] border border-[#f0d8b6]">
                            <Icon size={22} />
                          </span>
                          <div>
                            <p className="font-semibold text-ink text-base">{n.message}</p>
                            <span className="text-xs text-ink-soft">Hệ thống WayEcho xác thực</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speak(n.message)}
                          className="btn-ghost hc-border !min-h-[40px] !p-2 shrink-0 rounded-xl"
                          aria-label="Nghe thông báo bằng giọng nói"
                        >
                          <SpeakerIcon size={18} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Field Alerts Feed */}
            <section aria-label="Danh sách cảnh báo thực địa" className="space-y-5">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-primary" />
                <h2 className="text-xl font-bold text-[#352016]">Hôm Nay</h2>
                <div className="h-0.5 flex-1 bg-[#eedecb]" />
                <span className="text-xs font-bold text-ink-soft uppercase">Cập nhật thực địa</span>
              </div>

              {filteredAlerts.map((item) => (
                <article
                  key={item.id}
                  className="glass-liquid rounded-2xl p-6 card-3d hc-surface hc-border relative overflow-hidden space-y-4"
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-2.5 ${
                      item.severity === "urgent"
                        ? "bg-red-600"
                        : item.severity === "success"
                        ? "bg-emerald-600"
                        : item.severity === "warning"
                        ? "bg-[#f8ae38]"
                        : "bg-[#397ecb]"
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pl-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.severity === "urgent" && (
                          <span className="rounded-lg bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase shadow-sm">
                            Khẩn cấp
                          </span>
                        )}
                        {item.distance && (
                          <span className="rounded-lg bg-[#fff0df] border border-[#f0d8b6] px-2.5 py-0.5 text-xs text-[#773e17] font-semibold">
                            📍 {item.distance}
                          </span>
                        )}
                        {item.severity === "success" && (
                          <span className="rounded-lg bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-900 font-bold uppercase">
                            Ký quỹ Escrow An Toàn
                          </span>
                        )}
                        {item.category === "device" && (
                          <span className="rounded-lg bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs text-amber-950 font-bold uppercase">
                            Thiết bị trợ năng
                          </span>
                        )}
                        <span className="text-xs text-ink-soft">{item.timeAgo}</span>
                      </div>
                      <h3 className="text-lg font-bold text-ink leading-snug pt-1">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerToast(item.title + ". " + item.description)}
                      className="self-start sm:self-center rounded-xl bg-[#fff5e6] hover:bg-[#ffeed9] border border-[#eedecb] px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors text-[#54260e]"
                      title="Đọc to nội dung thông báo"
                    >
                      <SpeakerIcon size={16} />
                      <span>Nghe TTS</span>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="pl-3 text-sm text-ink-soft leading-relaxed">
                    {item.description}
                  </p>

                  {/* Battery Bar if device alert */}
                  {item.batteryLevel !== undefined && (
                    <div className="pl-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Pin gậy thông minh:</span>
                        <span className="text-[#a7420f]">{item.batteryLevel}% còn lại (khoảng 90 phút đi dạo)</span>
                      </div>
                      <div className="w-full bg-[#faecd7] h-3 rounded-full overflow-hidden border border-[#eedecb]">
                        <div className="bg-gradient-to-r from-[#f8ae38] to-[#d86927] h-full rounded-full" style={{ width: `${item.batteryLevel}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Guide Info Pill if trip alert */}
                  {item.guide && (
                    <div className="ml-3 rounded-2xl bg-gradient-to-br from-[#fffdf9] to-[#fff5e6] p-4 border border-[#eedecb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#f8ae38] to-[#d86927] text-white font-bold flex items-center justify-center text-sm shadow-md">
                          {item.guide.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-ink text-sm">Guide: {item.guide.name}</p>
                          <p className="text-emerald-800 font-semibold">{item.guide.badge}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-0.5 text-ink-soft">
                        <p>Hẹn: <strong className="text-ink">{item.guide.time}</strong></p>
                        <p>Điểm đón: {item.guide.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Route Alternative Callout if barrier */}
                  {item.routeAlternative && (
                    <div className="ml-3 rounded-2xl bg-[#fff8eb] p-4 border border-[#f0d8b6] text-xs text-[#7a4c00] space-y-1 shadow-sm">
                      <p className="font-bold flex items-center gap-1.5 text-[#d86927]">
                        <span>🧭 Lộ trình tránh đề xuất qua âm thanh 3D:</span>
                      </p>
                      <p className="leading-relaxed">{item.routeAlternative}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="pl-3 pt-1 flex flex-wrap items-center gap-3">
                    {item.actionLink && (
                      <Link
                        href={item.actionLink}
                        className="btn-3d !min-h-[42px] px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>{item.actionLabel}</span>
                      </Link>
                    )}
                    {item.reportLink && (
                      <Link
                        href={item.reportLink}
                        className="btn-ghost hc-border !min-h-[42px] rounded-xl text-xs flex items-center gap-1.5 bg-white/70"
                      >
                        <span>{item.reportLabel}</span>
                      </Link>
                    )}
                    {item.guide && (
                      <a
                        href={`tel:${item.guide.phone}`}
                        className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 px-3.5 py-2 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <PhoneIcon size={16} />
                        <span>Gọi Guide: {item.guide.phone}</span>
                      </a>
                    )}
                    {item.category === "device" && (
                      <button
                        type="button"
                        onClick={testHapticVibrate}
                        className="rounded-xl bg-[#fff0df] hover:bg-[#ffeed9] border border-[#eedecb] px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors text-[#54260e]"
                      >
                        <span>📳 Thử rung gậy haptic (Kiểm tra tín hiệu)</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>

          {/* Right Sidebar Controls & Station (4 cols) */}
          <aside aria-label="Bảng điều khiển trợ năng thông báo" className="lg:col-span-4 space-y-6">
            {/* Assistive Vibration & Audio Settings */}
            <div className="glass-liquid-warm rounded-3xl p-6 card-3d hc-surface hc-border space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-[#eedecb]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f8ae38] to-[#ee9e20] text-ink font-bold shadow-md">
                  ⚙️
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#352016] uppercase tracking-wider">Cài Đặt Cảnh Báo & Rung</h2>
                  <p className="text-xs text-ink-soft">Tùy biến phản hồi xúc giác</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Spatial 3D Audio Toggle */}
                <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
                  <div>
                    <span className="font-bold text-ink text-sm block">Âm thanh 3D định vị vật cản</span>
                    <span className="text-ink-soft">Phát tiếng còi cảnh báo theo hướng trái/phải</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={spatialAudio}
                    onChange={(e) => {
                      setSpatialAudio(e.target.checked);
                      triggerToast(e.target.checked ? "Đã bật âm thanh 3D định vị vật cản." : "Đã tắt âm thanh 3D.");
                    }}
                    className="h-5 w-5 mt-1 accent-[#f8ae38] rounded cursor-pointer shrink-0"
                  />
                </label>

                {/* Haptic Strength Slider */}
                <div className="space-y-1.5 pt-2 border-t border-[#eedecb]">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Cường độ rung gậy:</span>
                    <span className="text-[#d86927]">{hapticLevel >= 80 ? "Mạnh (80%)" : hapticLevel >= 40 ? "Vừa (40%)" : "Nhẹ (20%)"}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="20"
                    value={hapticLevel}
                    onChange={(e) => setHapticLevel(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#faecd7] rounded-lg appearance-none cursor-pointer accent-[#f8ae38]"
                  />
                  <div className="flex justify-between text-[11px] text-ink-soft">
                    <span>Nhẹ</span>
                    <span>Vừa</span>
                    <span>Mạnh (Khuyên dùng)</span>
                  </div>
                </div>

                {/* Auto TTS Readout Toggle */}
                <label className="flex items-start justify-between gap-3 cursor-pointer select-none pt-2 border-t border-[#eedecb]">
                  <div>
                    <span className="font-bold text-ink text-sm block">Tự động đọc to khi có nguy hiểm</span>
                    <span className="text-ink-soft">Lập tức đọc to bằng giọng tiếng Việt chuẩn</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTTS}
                    onChange={(e) => setAutoTTS(e.target.checked)}
                    className="h-5 w-5 mt-1 accent-[#f8ae38] rounded cursor-pointer shrink-0"
                  />
                </label>
              </div>
            </div>

            {/* Live Station & Emergency Hotline Card (WayEcho Brand Brown #352016) */}
            <div className="rounded-3xl bg-[#352016] text-[#fff2e7] p-6 shadow-xl border border-[#4f3223] space-y-4 relative overflow-hidden">
              <div className="bubble-orb-amber -right-10 -bottom-10 w-40 h-40 opacity-20 pointer-events-none" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#ffd39a] text-xs font-bold uppercase tracking-wider bg-[#452a1d] px-2.5 py-1 rounded-full border border-[#f8ae38]/30">
                  <span className="h-2 w-2 rounded-full bg-[#f8ae38] animate-pulse" />
                  Đang trực 24/7
                </span>
                <span className="text-xs text-[#e5d2c3]">Hoàn Kiếm, HN</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Trạm Trợ Năng Hiện Trường</h3>
                <p className="text-xs text-[#e5d2c3] mt-1.5 leading-relaxed">
                  Số 28 Hàng Buồm (Cách bạn 320m). Luôn có tình nguyện viên hỗ trợ tiếp cận, đổi gậy haptic và xe lăn địa hình phố cổ.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <a
                  href="tel:19008282"
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#bb2d25] hover:bg-[#9e241c] text-white font-bold text-sm shadow-lg transition-colors border border-white/20"
                >
                  <PhoneIcon size={20} />
                  <span>GỌI KHẨN CẤP: 1900 8282</span>
                </a>
                <p className="text-center text-[11px] text-[#e5d2c3]">Bấm phím 1 để gặp Điều hướng viên cứu trợ</p>
              </div>
            </div>

            {/* Quick Access Navigation Shortcuts */}
            <div className="glass-liquid rounded-3xl p-6 card-3d hc-surface hc-border space-y-3">
              <span className="text-xs font-bold text-[#352016] uppercase tracking-wider block">
                Lối tắt trợ năng thực địa
              </span>
              <div className="space-y-2 text-sm font-semibold">
                <Link
                  href="/review"
                  className="flex items-center justify-between rounded-xl bg-[#fff5e6] hover:bg-[#ffeed9] border border-[#eedecb] p-3 transition-colors text-ink"
                >
                  <span>⚠️ Gửi báo cáo rào cản mới</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/assistant"
                  className="flex items-center justify-between rounded-xl bg-[#fff5e6] hover:bg-[#ffeed9] border border-[#eedecb] p-3 transition-colors text-ink"
                >
                  <span>📷 Bật Camera AI nhận diện vật cản</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/navigation"
                  className="flex items-center justify-between rounded-xl bg-[#fff5e6] hover:bg-[#ffeed9] border border-[#eedecb] p-3 transition-colors text-ink"
                >
                  <span>🗺️ Bản đồ âm thanh trực quan</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/services/guides"
                  className="flex items-center justify-between rounded-xl bg-[#fff5e6] hover:bg-[#ffeed9] border border-[#eedecb] p-3 transition-colors text-ink"
                >
                  <span>🧭 Kết nối Guide đồng hành</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Audio Toast Feedback */}
        {toastMessage && (
          <aside
            aria-live="assertive"
            className="fixed bottom-6 right-6 max-w-md bg-[#2c1d14] text-white rounded-2xl p-4 shadow-2xl border border-[#f8ae38]/40 z-50 flex items-start gap-3 animate-fade-in"
          >
            <span className="flex h-9 w-9 rounded-full bg-gradient-to-br from-[#f8ae38] to-[#d86927] text-ink items-center justify-center shrink-0 font-bold shadow-md">
              <SpeakerIcon size={18} />
            </span>
            <div className="text-xs">
              <p className="font-bold text-[#f8ae38]">WayEcho Giọng Nói Trợ Năng:</p>
              <p className="mt-0.5 text-[#fff2e7]">{toastMessage}</p>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
