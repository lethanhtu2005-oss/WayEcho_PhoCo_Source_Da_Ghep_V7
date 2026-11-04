import Link from "next/link";
import VolunteerShell from "@/components/VolunteerShell";

export const metadata = {
  title: "Trạm Tình Nguyện Viên Đồng Hành Phố Cổ · WayEcho",
  description:
    "Khu vực làm việc và điều phối trực ca dành cho tình nguyện viên hỗ trợ người khiếm thị tại 36 Phố Phường Hà Nội."
};

export default function VolunteerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#faf9f3] text-[#212529]">
      {/* Volunteer Sub-Header */}
      <header className="border-b border-[#ebd9c5] bg-white sticky top-0 z-30 shadow-xs">
        <div className="container-page max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/partner"
              className="flex items-center gap-1.5 text-xs font-bold text-[#c75c13] hover:underline"
            >
              <span>← Cổng đối tác</span>
            </Link>
            <span className="text-[#ebd9c5]">|</span>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0d9488] text-white font-bold text-sm shadow-xs">
                🤝
              </span>
              <div>
                <h1 className="text-sm font-bold text-[#352016] leading-tight">
                  Trạm Tình Nguyện Viên Phố Cổ
                </h1>
                <p className="text-[11px] text-[#665b50]">Trạm trực: 28 Hàng Buồm & 87 Mã Mây</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#f0fdfa] border border-[#99f6e4] px-2.5 py-1 text-xs font-bold text-[#0f766e]">
              <span className="h-2 w-2 rounded-full bg-[#14b8a6] animate-pulse" />
              Bộ đàm: Kênh 03
            </span>

            <Link
              href="/sos"
              className="inline-flex items-center gap-1 rounded-full bg-[#dc2626] text-white px-3 py-1 text-xs font-bold hover:bg-[#b91c1c] transition-colors"
            >
              <span>🚨 SOS</span>
              <span className="hidden md:inline">Khẩn cấp</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>
        <VolunteerShell>{children}</VolunteerShell>
      </main>
    </div>
  );
}
