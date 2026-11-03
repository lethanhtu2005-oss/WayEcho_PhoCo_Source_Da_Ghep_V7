"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CatalogCard from "@/components/CatalogCard";
import { CATEGORIES, byCategory, catLabel } from "@/data/catalog";
import { itemA11y, A11Y_FILTERS } from "@/data/businesses";

function ExploreContent() {
  const params = useSearchParams();
  const requestedCat = params.get("cat") || "destination";
  const cat = CATEGORIES.some(c=>c.id === requestedCat) ? requestedCat : "destination";
  const [filters, setFilters] = useState({});
  const [dataMode, setDataMode] = useState("demo");

  const active = Object.keys(filters).filter((k) => filters[k]);
  const items = byCategory(cat).filter((it) => {
    if (active.length === 0) return true;
    const a = itemA11y(it, { mode: dataMode });
    return active.every((k) => a[k]);
  });

  function toggle(k) {
    setFilters((f) => ({ ...f, [k]: !f[k] }));
  }

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · Khám phá
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Khám phá {catLabel(cat)}</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
        Mỗi mục hiển thị trạng thái dữ liệu tiếp cận. Danh sách tập trung vào Phố cổ Hà Nội. Tên và địa chỉ cơ sở tham khảo từ nguồn công khai; ảnh minh họa không thay thế ảnh cơ sở đã xác minh. Đặt chỗ và dữ liệu trợ năng đang ở chế độ DEMO. Chọn danh mục:
      </p>

      <div className="mt-4 flex flex-wrap gap-3"><Link href="/articles" className="btn-ghost hc-border">Cẩm nang</Link><Link href="/services/guide-dogs" className="btn-ghost hc-border">Chó dẫn đường</Link><Link href="/services/guides" className="btn-ghost hc-border">Guide & Assistant — DEMO</Link><Link href="/profile" className="btn-ghost hc-border">Nhu cầu tiếp cận</Link><Link href="/sos" className="btn-ghost hc-border">SOS — DEMO</Link></div>
      {requestedCat !== cat && <p role="status" className="mt-3">Danh mục không tồn tại; đang hiển thị điểm đến.</p>}
      {/* Tabs danh mục */}
      <nav aria-label="Danh mục" className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/explore?cat=${c.id}`}
            aria-current={c.id === cat ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center rounded-pill px-4 text-sm font-semibold transition-colors ${
              c.id === cat ? "bg-primary text-ink" : "border border-line bg-white text-ink hover:bg-surface-alt hc-surface hc-border"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="mt-5 rounded-2xl border border-amber-300 bg-[#fff9ed] p-4">
        <p className="font-semibold">Độ tin cậy của dữ liệu trợ năng</p>
        <p className="mt-1 text-sm text-ink-soft">Mặc định chỉ hiện dịch vụ có bằng chứng xác minh theo từng tiêu chí. Chế độ minh họa giúp thử giao diện và không khẳng định khả năng tiếp cận thực tế.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" aria-pressed={dataMode === "verified"} onClick={() => setDataMode("verified")} className={`min-h-11 rounded-full px-4 font-semibold ${dataMode === "verified" ? "bg-primary" : "border border-line bg-white"}`}>Đã xác minh</button>
          <button type="button" aria-pressed={dataMode === "demo"} onClick={() => setDataMode("demo")} className={`min-h-11 rounded-full px-4 font-semibold ${dataMode === "demo" ? "bg-primary" : "border border-line bg-white"}`}>Dữ liệu minh họa</button>
        </div>
      </div>
      {/* Bộ lọc accessibility */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-4 hc-surface hc-border" role="group" aria-label="Lọc theo khả năng tiếp cận">
        <p className="mb-2 text-sm font-semibold text-ink-soft hc-muted">Lọc theo khả năng tiếp cận</p>
        <div className="flex flex-wrap gap-2">
          {A11Y_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              aria-pressed={!!filters[f.key]}
              className={`inline-flex min-h-[40px] items-center rounded-pill px-3 text-sm font-semibold transition-colors ${
                filters[f.key] ? "bg-primary text-ink" : "border border-line bg-surface-alt text-ink hover:bg-white hc-surface hc-border"
              }`}
            >
              {f.label.replace(" (đã xác minh)", "")}
            </button>
          ))}
          {active.length > 0 && (
            <button type="button" onClick={() => setFilters({})} className="inline-flex min-h-[40px] items-center px-3 text-sm font-semibold text-accent-dark hover:underline">
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-2xl" aria-live="polite">{items.length} kết quả · {dataMode === "verified" ? "Đã xác minh" : "Dữ liệu minh họa"}</h2>
      {items.length === 0 ? (
        <p className="hc-muted mt-4 text-ink-soft">Chưa có dịch vụ nào đáp ứng đồng thời các tiêu chí ở chế độ này. Nếu cần thử giao diện, chuyển sang Dữ liệu minh họa; không coi đây là dữ liệu đã khảo sát.</p>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => <CatalogCard key={it.id} item={it} />)}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <ExploreContent />
    </Suspense>
  );
}
