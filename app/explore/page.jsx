"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CatalogCard from "@/components/CatalogCard";
import { SERVICE_CONFIG, LEVEL_ALL, levelOptions, filterByLevel } from "@/data/serviceDiscovery";
import { CATEGORIES, byCategory, catLabel } from "@/data/catalog";
import { itemA11y, A11Y_FILTERS } from "@/data/businesses";

function ExploreContent() {
  const params = useSearchParams();
  const requestedCat = params.get("cat") || "destination";
  const cat = CATEGORIES.some(c=>c.id === requestedCat) ? requestedCat : "destination";
  const [filters, setFilters] = useState({});
  const [dataMode, setDataMode] = useState("demo");
  const [level, setLevel] = useState(LEVEL_ALL);
  const cfg = SERVICE_CONFIG[cat];

  const active = Object.keys(filters).filter((k) => filters[k]);
  const catItems = byCategory(cat);
  const levels = levelOptions(catItems);
  const items = filterByLevel(catItems, level).filter((it) => {
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
      <h1 className="mt-2 text-4xl sm:text-5xl">{cfg.title}</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">{cfg.intro} Thông tin tiếp cận chỉ mang tính tham khảo, chưa thay thế khảo sát tại chỗ.</p>

      {requestedCat !== cat && <p role="status" className="mt-3">Danh mục không tồn tại; đang hiển thị điểm đến.</p>}
      {/* Tabs danh mục */}
      <nav aria-label="Danh mục" className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/explore?cat=${c.id}`}
            aria-current={c.id === cat ? "page" : undefined}
            onClick={() => setLevel(LEVEL_ALL)}
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
        {levels.length > 1 && (
          <label className="mb-3 flex flex-wrap items-center gap-2 font-semibold">
            <span>Mức độ tiếp cận</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="min-h-[44px] rounded-xl border border-line bg-white px-3 hc-surface hc-border">
              <option value={LEVEL_ALL}>Mọi mức độ tiếp cận</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        )}
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
          {(active.length > 0 || level !== LEVEL_ALL) && (
            <button type="button" onClick={() => { setFilters({}); setLevel(LEVEL_ALL); }} className="inline-flex min-h-[40px] items-center px-3 text-sm font-semibold text-accent-dark hover:underline">
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-2xl" aria-live="polite">{items.length} kết quả · {dataMode === "verified" ? "Đã xác minh" : "Dữ liệu minh họa"}</h2>
      {items.length === 0 ? (
        <p className="hc-muted mt-4 text-ink-soft">Chưa có dịch vụ nào đáp ứng đồng thời các tiêu chí ở chế độ này. Nếu cần thử giao diện, chuyển sang Dữ liệu minh họa; không coi đây là dữ liệu đã khảo sát.</p>
      ) : (
        <div className="mt-4 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
