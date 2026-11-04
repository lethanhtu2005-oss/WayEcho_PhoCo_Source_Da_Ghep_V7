"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { navigationTarget, validCoordinates } from "@/lib/navigationTarget";
import dynamic from "next/dynamic";
import { useA11y } from "@/components/A11yProvider";
import { destinations } from "@/data/destinations";
import { culturalEvents } from "@/data/culturalEvents";
import VoiceDistanceFinder from "@/components/VoiceDistanceFinder";
import { CompassIcon, SpeakerIcon, MapPinIcon } from "@/components/Icons";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#faf9f3] text-[#665b50]">
      Đang tải bản đồ văn hóa đa giác quan…
    </div>
  )
});

// Tuyến minh họa giao diện điều hướng âm thanh
const ROUTE = [
  [21.0369, 105.8539], // 28 Hàng Buồm
  [21.0363, 105.8537], // 87 Mã Mây
  [21.0348, 105.8528]  // 42 Hàng Bạc
];

const STEPS = [
  {
    d: "Xuất phát tại Trạm Điều Phối 28 Hàng Buồm (Đền Quan Đế). Điểm hẹn có tình nguyện viên hỗ trợ mượn gậy và tai nghe.",
    meta: "Điểm xuất phát tiếp cận chuẩn",
    hazard: false
  },
  {
    d: "Di chuyển thẳng 60m theo hướng 12 giờ dọc vỉa hè Hàng Buồm. Chú ý dải gạch xúc giác dẫn hướng sát mép hiên nhà.",
    meta: "Đoạn đường có vỉa hè lát đá",
    hazard: false
  },
  {
    d: "Qua ngã ba Hàng Buồm – Mã Mây: Dừng lại 1 nhịp lắng nghe âm thanh giao thông hoặc nhờ TNV hỗ trợ sang đường.",
    meta: "Nút giao đông xe máy — Ưu tiên an toàn",
    hazard: true
  },
  {
    d: "Tới Nhà cổ 87 Mã Mây (bên tay phải theo hướng 3 giờ). Cửa vào có cầu dốc gỗ và nhân viên đón tiếp.",
    meta: "Điểm đến: Di tích kiến trúc gỗ thế kỷ 19",
    hazard: false
  }
];

function NavigationContent() {
  const params = useSearchParams();
  const to = params.get("to");
  const target = navigationTarget(to, destinations);
  const { speak } = useA11y();
  const [activeStep, setActiveStep] = useState(0);

  // 3-Layer Filter State
  const [showDestinations, setShowDestinations] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showServices, setShowServices] = useState(true);

  // Layer 1 Points: Cultural Destinations
  const destPoints = useMemo(() => {
    return destinations
      .filter((d) => validCoordinates(d.coordinates))
      .map((d) => ({
        id: `dest-${d.slug}`,
        name: `🏛️ ${d.name}`,
        lat: d.coordinates.lat,
        lng: d.coordinates.lng,
        level: d.access.level,
        color: "#c75c13", // Amber brown for destinations
        href: `/destination?d=${d.slug}`,
        category: "Điểm đến văn hóa"
      }));
  }, []);

  // Layer 2 Points: Cultural Events
  const eventPoints = useMemo(() => {
    return culturalEvents
      .filter((ev) => ev.coordinates && ev.coordinates.lat)
      .map((ev) => ({
        id: `event-${ev.id}`,
        name: `🎭 ${ev.title}`,
        lat: ev.coordinates.lat,
        lng: ev.coordinates.lng,
        level: "Sự kiện văn hóa",
        color: "#0d9488", // Teal for cultural events
        href: `/destination?d=${ev.destinationSlug}`,
        category: "Sự kiện văn hóa"
      }));
  }, []);

  // Layer 3 Points: Accessible Services & Stations
  const servicePoints = useMemo(() => {
    return [
      {
        id: "svc-station-28",
        name: "🤝 Trạm Tình Nguyện Viên 28 Hàng Buồm",
        lat: 21.0369,
        lng: 105.8539,
        level: "Rất dễ tiếp cận",
        color: "#16a34a", // Green for support stations
        href: "/volunteer",
        category: "Trạm dịch vụ & Hỗ trợ"
      },
      {
        id: "svc-tour-hub",
        name: "🧭 Điểm Khởi Hành Tour Sighted Guide (50 Đào Duy Từ)",
        lat: 21.0361,
        lng: 105.8529,
        level: "Rất dễ tiếp cận",
        color: "#16a34a",
        href: "/item?id=pho-co-guide-tour",
        category: "Dịch vụ tour tiếp cận"
      }
    ];
  }, []);

  // Combined Active Points
  const combinedPoints = useMemo(() => {
    let pts = [];
    if (showDestinations) pts = pts.concat(destPoints);
    if (showEvents) pts = pts.concat(eventPoints);
    if (showServices) pts = pts.concat(servicePoints);
    return pts;
  }, [showDestinations, showEvents, showServices, destPoints, eventPoints, servicePoints]);

  function playStep(i) {
    setActiveStep(i);
    speak(`Bước ${i + 1}: ${STEPS[i].d}`);
  }

  function startGuide() {
    speak(
      "Bắt đầu lộ trình mẫu từ Trạm 28 Hàng Buồm sang Nhà Cổ 87 Mã Mây. Lưu ý: Đây là tuyến mô phỏng giao diện, hãy dùng gậy dò đường và chú ý âm thanh giao thông thực tế."
    );
    playStep(0);
  }

  return (
    <div className="container-page max-w-7xl mx-auto px-4 py-8 sm:py-12 text-[#212529]">
      {/* Top Breadcrumb */}
      <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 text-sm text-[#665b50] mb-3">
        <Link href="/" className="hover:text-[#c75c13]">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span className="font-bold text-[#c75c13]">Bản đồ văn hóa tiếp cận</span>
      </nav>

      {/* Title & Concept Header */}
      <div className="border-b border-[#ebd9c5] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ffedd5] px-3 py-1 text-xs font-bold text-[#9a3412] uppercase tracking-wider">
          <span>🗺️ BẢN ĐỒ VĂN HÓA 3 LỚP DỮ LIỆU</span>
          <span>•</span>
          <span>WCAG 2.2 AA</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-[#352016]">
          Bản Đồ Văn Hóa & Điều Hướng Âm Thanh
        </h1>
        <p className="mt-2 max-w-4xl text-base sm:text-lg text-[#554336] leading-relaxed">
          Tích hợp 3 lớp thông tin: <strong>Điểm đến di tích</strong>, <strong>Sự kiện văn hóa diễn ra</strong> và{" "}
          <strong>Dịch vụ hỗ trợ tiếp cận thực địa</strong> tại 36 Phố Phường Hà Nội.
          Hệ thống cung cấp tọa độ chuẩn, mô tả xúc giác và hướng dẫn âm thanh không rào cản.
        </p>
      </div>

      {/* Voice Distance Finder */}
      <div className="mt-6">
        <VoiceDistanceFinder initialTarget={to} />
      </div>

      {target.message && (
        <div role="status" className="mt-4 rounded-2xl bg-[#fff7e8] border border-[#f8ae38] p-4 text-[#8c5700]">
          {target.message}
        </div>
      )}

      {/* Multi-Layer Selector Toolbar */}
      <section aria-label="Bộ chọn lớp bản đồ" className="mt-6 rounded-3xl border border-[#ebd9c5] bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#352016]">Chọn Các Lớp Dữ Liệu Hiển Thị:</h2>
            <p className="text-xs text-[#665b50]">Bật tắt các lớp để lọc địa điểm trên bản đồ và trong danh sách đọc màn hình</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowDestinations(!showDestinations);
                speak(showDestinations ? "Đã ẩn lớp điểm đến văn hóa" : "Đã bật lớp 20 điểm đến văn hóa");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                showDestinations
                  ? "bg-[#c75c13] text-white shadow-xs"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span>🏛️ Lớp 1: Điểm đến ({destPoints.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEvents(!showEvents);
                speak(showEvents ? "Đã ẩn lớp sự kiện văn hóa" : "Đã bật lớp sự kiện văn hóa");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                showEvents
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span>🎭 Lớp 2: Sự kiện ({eventPoints.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowServices(!showServices);
                speak(showServices ? "Đã ẩn lớp dịch vụ tiếp cận" : "Đã bật lớp trạm dịch vụ tiếp cận");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                showServices
                  ? "bg-[#16a34a] text-white shadow-xs"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span>🤝 Lớp 3: Dịch vụ & Trạm ({servicePoints.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Map & Step-by-Step Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (7 cols): Leaflet Interactive Map */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            className="h-[440px] sm:h-[500px] overflow-hidden rounded-3xl border border-[#ebd9c5] shadow-sm relative"
            role="region"
            aria-label="Bản đồ OpenStreetMap đa lớp Phố Cổ Hà Nội"
          >
            <MapView
              points={combinedPoints}
              route={to ? [] : ROUTE}
              center={target.center || [21.0363, 105.8537]}
              zoom={target.zoom || 15}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#665b50]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-[#c75c13]" /> Điểm đến
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-[#0d9488]" /> Sự kiện
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-[#16a34a]" /> Trạm tiếp cận
              </span>
            </div>
            <span>Nền: OpenStreetMap · Tọa độ đã đối chiếu</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={startGuide}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f8ae38] hover:bg-[#e09f2f] text-[#212529] px-5 py-3 text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-amber-200"
            >
              <CompassIcon size={20} />
              <span>Nghe Hướng Dẫn Lộ Trình Mẫu</span>
            </button>

            <Link
              href="/sos"
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm font-bold hover:bg-red-100 transition-colors"
            >
              🚨 Trợ Giúp Khẩn Cấp (SOS)
            </Link>
          </div>

          {/* Safety Warning */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-[#78350f] leading-relaxed" role="alert">
            <strong>Nguyên tắc an toàn:</strong> Bản đồ hỗ trợ định vị không gian và cung cấp thông tin tiếp cận đã khảo sát. Hệ thống không thay thế việc dò đường bằng gậy trắng, chú ý âm thanh giao thông thực tế hoặc nhờ sự hỗ trợ của người dẫn đường khi qua các nút giao cắt đông đúc.
          </div>
        </div>

        {/* Right Column (5 cols): Step by Step Guide & Cultural Events Feed */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Voice Steps Section */}
          <section className="rounded-3xl border border-[#ebd9c5] bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#352016]">
              Lộ Trình Điều Hướng Mẫu
            </h2>
            <p className="mt-1 text-xs text-[#665b50]">
              Tuyến mẫu từ Trạm 28 Hàng Buồm sang Nhà Cổ 87 Mã Mây (Khoảng cách: 250m)
            </p>

            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => (
                <li
                  key={i}
                  className={`rounded-2xl border p-3.5 transition-all ${
                    activeStep === i
                      ? "border-[#f8ae38] bg-[#fffbf2]"
                      : "border-[#f0e7dd] bg-white hover:border-[#ebd9c5]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        s.hazard ? "bg-[#ea580c] text-white" : "bg-[#f8ae38] text-[#212529]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#352016]">{s.d}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#665b50]">
                        <MapPinIcon size={12} /> {s.meta}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playStep(i)}
                      className="p-2 rounded-xl text-[#c75c13] hover:bg-[#ffedd5] transition-colors"
                      aria-label={`Nghe đọc bước ${i + 1}`}
                    >
                      <SpeakerIcon size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Cultural Events Live Layer Showcase */}
          <section className="rounded-3xl border border-[#ebd9c5] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#f0e7dd]">
              <h3 className="text-lg font-bold text-[#352016]">
                Sự Kiện Văn Hóa Trong Lớp Bản Đồ
              </h3>
              <span className="rounded-full bg-[#f0fdfa] border border-[#99f6e4] px-2.5 py-0.5 text-xs font-bold text-[#0f766e]">
                {culturalEvents.length} sự kiện
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {culturalEvents.slice(0, 3).map((ev) => (
                <article key={ev.id} className="rounded-2xl bg-[#faf9f3] p-3.5 border border-[#f0e7dd] text-xs">
                  <span className="font-bold text-[#0d9488] uppercase text-[10px] tracking-wide">
                    {ev.category} • {ev.date}
                  </span>
                  <h4 className="mt-1 font-bold text-[#352016] text-sm">{ev.title}</h4>
                  <p className="mt-1 text-[#665b50] leading-relaxed line-clamp-2">
                    {ev.summary}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#ebd9c5]">
                    <span className="font-bold text-[#c75c13]">{ev.price}</span>
                    <Link
                      href={`/destination?d=${ev.destinationSlug}`}
                      className="font-bold text-[#0d9488] hover:underline"
                    >
                      Xem chi tiết điểm đến →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function NavigationPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-12 text-center text-[#665b50]">
          Đang chuẩn bị bản đồ văn hóa Phố Cổ…
        </div>
      }
    >
      <NavigationContent />
    </Suspense>
  );
}
