import Link from "next/link";
import PartnerEnter from "@/components/PartnerEnter";
import { destinations } from "@/data/destinations";

export const metadata = {
  title: "Cổng Đối Tác Liên Thông · WayEcho Phố Cổ Hà Nội",
  description:
    "Không gian hợp tác liên thông dành cho Hướng dẫn viên, Tình nguyện viên cộng đồng và Doanh nghiệp tiếp cận tại Phố cổ Hà Nội."
};

const partnerRoles = [
  {
    id: "guide", role: "guide",
    title: "Hướng Dẫn Viên & Sighted Guide",
    badge: "Chuyên môn 1-1",
    icon: "🧭",
    color: "#f8ae38",
    desc: "Dành cho hướng dẫn viên có chứng chỉ, người dẫn đường thấu cảm được đào tạo chuẩn WBU. Quản lý lịch hỗ trợ, nhận ca tour tiếp cận, theo dõi ký quỹ Escrow và hồ sơ trợ năng của du khách.",
    features: [
      "Nhận tour & ca đồng hành âm thanh 1-1",
      "Xem hồ sơ tiếp cận & mức độ khiếm thị của khách",
      "Bảo vệ thu nhập qua cơ chế Ký quỹ Escrow",
      "Bản đồ cảnh báo rào cản vỉa hè theo thời gian thực"
    ],
    primaryAction: {
      label: "Vào cổng Hướng dẫn viên →",
      href: "/guide"
    },
    secondaryActions: [
      { label: "Xem lịch ca sắp tới", href: "/guide/schedule" },
    ]
  },
  {
    id: "volunteer", role: "guide",
    title: "Tình Nguyện Viên Phố Cổ",
    badge: "Cộng đồng hỗ trợ",
    icon: "🤝",
    color: "#0d9488",
    desc: "Dành cho các bạn trẻ, sinh viên và tình nguyện viên trực tại các trạm di sản Phố Cổ (28 Hàng Buồm, 87 Mã Mây). Đón khách khiếm thị qua đường, hỗ trợ định hướng tại chỗ và cập nhật rào cản vật lý.",
    features: [
      "Trực ca tại Trạm điều phối 28 Hàng Buồm",
      "Nhận yêu cầu hỗ trợ tức thời (Real-time feed)",
      "Khảo sát & báo cáo vật cản dải gạch xúc giác",
      "Túi sơ cấp cứu & mượn thiết bị trợ thị (Gậy, tai nghe)"
    ],
    primaryAction: {
      label: "Vào cổng Tình nguyện viên →",
      href: "/volunteer"
    },
    secondaryActions: [
      { label: "Quy chuẩn đồng hành WBU", href: "/volunteer#wbu-guidelines" },
      { label: "Bảng tin khảo sát rào cản", href: "/volunteer#audit-feed" },
    ]
  },
  {
    id: "business", role: "business",
    title: "Doanh Nghiệp & Điểm Đến Di Sản",
    badge: "Cơ sở tiếp cận",
    icon: "🏛️",
    color: "#825500",
    desc: "Dành cho ban quản lý di tích (đình, đền, nhà cổ), khách sạn, quán cà phê, nhà hàng và cơ sở văn hóa tại 36 Phố Phường. Minh bạch thông số tiếp cận thực tế và kết nối du khách.",
    features: [
      "Quản lý danh mục dịch vụ & đặt chỗ tiếp cận",
      "Công bố thông số lối dốc, bậc thềm, thực đơn âm thanh",
      "Nhận góp ý trải nghiệm thực tế từ người khiếm thị",
      "Gắn nhãn Đối tác Tiếp cận có kiểm định tại thực địa"
    ],
    primaryAction: {
      label: "Vào cổng Doanh nghiệp →",
      href: "/business"
    },
    secondaryActions: [
      { label: "Quản lý dịch vụ & tiếp cận", href: "/business/services" },
    ]
  }
];

export default function PartnerGateway() {
  return (
    <div className="min-h-screen bg-[#faf9f3] py-10 sm:py-14 text-[#212529]">
      <div className="container-page max-w-6xl mx-auto px-4">
        {/* Breadcrumb & Portal Identifier */}
        <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 text-sm text-[#665b50] mb-4">
          <Link href="/" className="hover:text-[#c75c13] transition-colors">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span className="font-bold text-[#c75c13]">Cổng Đối Tác Liên Thông</span>
        </nav>

        {/* Top Header */}
        <div className="border-b border-[#ebd9c5] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffedd5] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9a3412]">
            <span>🌐 WAYECHO PARTNER NETWORK</span>
            <span>•</span>
            <span>HÀ NỘI 36 PHỐ PHƯỜNG</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#352016] sm:text-5xl">
            Cổng Đối Tác Liên Thông
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-[#554336] leading-relaxed">
            Hệ sinh thái liên thông giữa <strong>Hướng dẫn viên chuyên nghiệp</strong>,{" "}
            <strong>Tình nguyện viên hỗ trợ thực địa</strong> và <strong>Doanh nghiệp di tích văn hóa</strong>.
            Cùng nhau xây dựng không gian du lịch tiếp cận không rào cản cho người khiếm thị tại Phố Cổ Hà Nội.
          </p>

          {/* Quick stats / trust banner */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#ebd9c5] bg-white p-4 shadow-sm">
              <span className="text-2xl font-black text-[#c75c13]">DEMO</span>
              <p className="mt-1 text-xs font-medium text-[#665b50]">Cổng minh họa, chưa có đối tác thật được xác minh</p>
            </div>
            <div className="rounded-2xl border border-[#ebd9c5] bg-white p-4 shadow-sm">
              <span className="text-2xl font-black text-[#0d9488]">2 Trạm</span>
              <p className="mt-1 text-xs font-medium text-[#665b50]">Dự kiến: 28 Hàng Buồm & 87 Mã Mây (minh họa)</p>
            </div>
            <div className="rounded-2xl border border-[#ebd9c5] bg-white p-4 shadow-sm">
              <span className="text-2xl font-black text-[#825500]">{destinations.length}</span>
              <p className="mt-1 text-xs font-medium text-[#665b50]">Điểm đến trong danh mục (thông tin tiếp cận chưa xác minh hết)</p>
            </div>
            <div className="rounded-2xl border border-[#ebd9c5] bg-white p-4 shadow-sm">
              <span className="text-2xl font-black text-[#c75c13]">Escrow</span>
              <p className="mt-1 text-xs font-medium text-[#665b50]">Ký quỹ mô phỏng, chưa có thanh toán thật</p>
            </div>
          </div>
        </div>

        {/* 3 Pillars Section */}
        <section aria-label="3 Nhóm Đối Tác WayEcho" className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#352016]">Chọn Cổng Làm Việc Của Bạn</h2>
              <p className="text-sm text-[#665b50]">Một cổng duy nhất: bấm vào nhóm của bạn để vào thẳng không gian làm việc. Đăng nhập chỉ mang tính minh họa, không cần tài khoản hay mật khẩu.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {partnerRoles.map((role) => (
              <article
                key={role.id}
                className="flex flex-col justify-between rounded-3xl border border-[#ebd9c5] bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Accent Top Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: role.color }}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-4xl" aria-hidden="true">{role.icon}</span>
                    <span className="rounded-full bg-[#faf9f3] border border-[#ebd9c5] px-3 py-1 text-xs font-bold text-[#554336]">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-[#352016] group-hover:text-[#c75c13] transition-colors">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#554336] leading-relaxed">
                    {role.desc}
                  </p>

                  <div className="mt-5 rounded-2xl bg-[#faf9f3] p-4 border border-[#f0e7dd]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8c5700]">Tính năng nổi bật:</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-[#4b5563]">
                      {role.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#0d9488] font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#f0e7dd]">
                  <PartnerEnter role={role.role} href={role.primaryAction.href} label={role.primaryAction.label} color={role.color} />

                  <div className="mt-3 flex flex-col gap-1.5">
                    {role.secondaryActions.map((sec, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sec.href}
                        className="text-xs text-[#554336] hover:text-[#c75c13] hover:underline flex items-center gap-1 py-1"
                      >
                        <span aria-hidden="true">›</span>
                        <span>{sec.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Dispatch & Operations Notice */}
        <section className="mt-10 rounded-3xl border border-[#ebd9c5] bg-[#fffbf2] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c75c13] uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                <span>Trạm Điều Phối Thực Địa Phố Cổ</span>
              </div>
              <h3 className="mt-1 text-xl font-bold text-[#352016]">
                Trạm Hỗ Trợ 28 Hàng Buồm & Trung Tâm Văn Hóa 87 Mã Mây
              </h3>
              <p className="mt-2 text-sm text-[#665b50] max-w-2xl leading-relaxed">
                Đội ngũ điều phối viên trực liên tục hỗ trợ kết nối giữa Hướng dẫn viên, Tình nguyện viên và Du khách.
                Nếu gặp chướng ngại vật phát sinh hoặc cần mượn thiết bị trợ thị khẩn cấp, vui lòng liên hệ trực tiếp trạm.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/partners/cooperate"
                className="rounded-xl border border-[#d66217] bg-white px-4 py-2.5 text-sm font-bold text-[#d66217] hover:bg-[#ffedd5] transition-colors"
              >
                📝 Đăng ký hợp tác
              </Link>
              <Link
                href="/sos"
                className="rounded-xl bg-[#dc2626] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b91c1c] transition-colors"
              >
                🚨 SOS Khẩn cấp
              </Link>
            </div>
          </div>
        </section>

        {/* Accessibility & Ethics Commitments */}
        <section className="mt-10 border-t border-[#ebd9c5] pt-8">
          <h3 className="text-lg font-bold text-[#352016]">Nguyên Tắc Làm Việc Cùng Người Khiếm Thị</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-[#554336]">
            <div className="rounded-2xl bg-white p-4 border border-[#ebd9c5]">
              <p className="font-bold text-[#352016]">1. Tôn Trọng Quyền Tự Chủ</p>
              <p className="mt-1 text-xs text-[#665b50]">
                Luôn hỏi ý kiến trước khi chạm hoặc dẫn dắt. Không kéo gậy trắng hay tự ý xốc nách khách.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#ebd9c5]">
              <p className="font-bold text-[#352016]">2. Mô Tả Bằng Vị Trí Kim Đồng Hồ</p>
              <p className="mt-1 text-xs text-[#665b50]">
                Sử dụng hướng chỉ 12 giờ (phía trước), 3 giờ (bên phải), 9 giờ (bên trái) để chỉ vị trí bậc thềm, cửa ra vào.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#ebd9c5]">
              <p className="font-bold text-[#352016]">3. Minh Bạch Thông Số Kỹ Thuật</p>
              <p className="mt-1 text-xs text-[#665b50]">
                Không nói &ldquo;dễ đi&rdquo; chung chung. Hãy nói rõ: có 2 bậc tam cấp cao 15cm, có gờ dốc tạm hay vỉa hè hẹp.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
