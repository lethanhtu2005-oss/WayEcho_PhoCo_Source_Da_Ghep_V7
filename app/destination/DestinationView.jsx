"use client";

import DestinationActions from "@/components/DestinationActions";
import ReportIssue from "@/components/ReportIssue";
import { articles } from "@/data/articles";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import DestinationCard from "@/components/DestinationCard";
import { getDestination, destinations } from "@/data/destinations";
import {
  SpeakerIcon, MapPinIcon, AccessibleIcon, CompassIcon, CalendarIcon, PhoneIcon,
} from "@/components/Icons";

function AccessRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 hc-border sm:grid-cols-[220px_1fr] sm:gap-5">
      <dt className="font-semibold">{label}</dt>
      <dd className="hc-muted text-ink-soft">{value}</dd>
    </div>
  );
}

function StatusPill({ label, value }) {
  const yes = String(value).trim().toLowerCase() === "có";
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#ead9c2] bg-[#fffdfa] px-4 py-3 text-sm shadow-sm">
      <span className="font-medium text-[#2b2b2b]">{label}</span>
      <span className={`font-bold ${yes ? "text-[#17944b]" : "text-[#e14d3d]"}`}>{yes ? "✓ Có" : "✕ Không"}</span>
    </div>
  );
}

function DestinationContent() {
  const params = useSearchParams();
  const slug = params.get("d");
  const d = getDestination(slug);
  const { speak } = useA11y();

  if (!slug) {
    return (
      <div className="container-page py-10">
        <p className="font-semibold text-accent-dark">Old Quarter Destinations</p>
        <h1 className="mt-1 text-4xl sm:text-5xl">Điểm đến Phố cổ Hà Nội</h1>
        <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Tổng hợp các điểm đến nổi bật tại khu Phố cổ và vùng trung tâm lân cận, kèm ảnh có thông tin nguồn tham chiếu và dữ liệu tiếp cận tham khảo để duyệt giao diện.</p>
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{destinations.map((item) => <DestinationCard key={item.slug} d={item} />)}</div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="container-page py-16" role="alert">
        <h1 className="text-3xl">Không tìm thấy điểm đến</h1>
        <p className="hc-muted mt-3 text-lg text-ink-soft">Đường dẫn không khớp với địa điểm nào trong dữ liệu WayEcho.</p>
        <Link href="/destination" className="btn-primary mt-5">Xem danh sách điểm đến</Link>
      </div>
    );
  }

  const accessRows = [
    ["Phù hợp người mù", d.access.blind],
    ["Phù hợp nhìn kém", d.access.lowVision],
    ["Nhân viên hỗ trợ", d.access.staff],
    ["Audio guide", d.access.audio],
    ["Thang máy", d.access.elevator],
    ["Lối không bậc", d.access.stepFree],
    ["Chữ nổi Braille", d.access.braille],
  ];

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · <Link href="/destination" className="hover:underline">Điểm đến</Link> ·{" "}
        <MapPinIcon size={14} className="inline align-[-2px]" /> {d.area}
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <figure>
          <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-surface-alt shadow-card">
            <VerifiedImage src={d.image} fallback={d.imageFallback} alt={d.alt} priority className="h-full w-full object-cover" />
          </div>
        </figure>

        <div>
          <span className="chip hc-surface hc-border bg-primary font-bold">
            <AccessibleIcon size={16} /> {d.access.level}
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl">{d.name}</h1>
          <p className="mt-2 flex items-start gap-2 text-ink-soft hc-muted"><MapPinIcon size={18} className="mt-1 shrink-0" /> {d.address}</p>
          <p className="hc-muted mt-3 text-lg text-ink-soft">{d.summary}</p>

          <button type="button" onClick={() => speak(d.audio)} className="btn-primary mt-5 text-lg">
            <SpeakerIcon size={22} /> Nghe mô tả bằng giọng nói
          </button>

          <DestinationActions destination={d} />
          <ReportIssue itemId={d.slug} itemName={d.name} />

          <div className="mt-4 rounded-2xl border border-line bg-surface-alt p-4 hc-surface hc-border">
            <p className="text-sm font-semibold text-ink-soft hc-muted">Mô tả âm thanh</p>
            <p className="mt-1 text-lg">{d.audio}</p>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_.85fr]" aria-labelledby="access-heading">
        <div>
          <h2 id="access-heading" className="text-3xl">Thông tin tiếp cận</h2>
          <dl className="mt-4">
            <AccessRow label="Mức độ tiếp cận" value={d.access.level} />
            <AccessRow label="Ghi chú tiếp cận" value={d.access.note} />
            <AccessRow label="Khu vực" value={d.area} />
            <AccessRow label="Giá tham khảo" value={d.visit.price} />
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {accessRows.map(([label, value]) => <StatusPill key={label} label={label} value={value} />)}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-[#fffaf3] p-4">
            <p className="font-semibold">Ghi chú thêm</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{d.access.status}</p>
          </div>
        </div>

        <aside className="rounded-[18px] border border-line bg-white p-5 shadow-card hc-surface hc-border" aria-labelledby="visit-heading">
          <h2 id="visit-heading" className="text-2xl">Thông tin địa điểm</h2>
          <dl className="mt-3 space-y-3">
            <div><dt className="font-semibold">Giờ tham quan</dt><dd className="hc-muted text-ink-soft">{d.visit.hours}</dd></div>
            <div><dt className="font-semibold">Kiểm tra dữ liệu</dt><dd className="hc-muted text-ink-soft">{d.checkedAt}</dd></div>
          </dl>
          {d.facts.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-soft hc-muted">
              {d.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          {d.sources.length > 0 && (
            <div className="mt-5 border-t border-line pt-4 hc-border">
              <p className="font-semibold">Nguồn tham khảo</p>
              <ul className="mt-2 space-y-2 text-sm">
                {d.sources.map((s) => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-accent-dark underline">{s.label}</a></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-8 max-w-3xl">
        <h2 className="text-3xl">Trước khi đến</h2>
        <p className="mt-3">Bạn có thể nghe mô tả trước, lưu địa điểm vào chuyến đi và đọc thêm các bài cẩm nang liên quan. Khi lên lịch trình thực tế, nên kiểm tra giờ mở cửa và điều kiện di chuyển vào thời điểm bạn dự định ghé thăm.</p>
        <h3 className="mt-5 text-2xl">Cẩm nang liên quan</h3>
        <ul className="mt-3 space-y-2">
          {articles.filter((a) => a.destinationSlugs.includes(d.slug)).map((a) => <li key={a.slug}><Link className="underline" href={`/articles/${a.slug}`}>{a.title}</Link></li>)}
        </ul>
        <Link className="mt-4 inline-block underline" href="/services/guide-dogs">Thông tin về chó dẫn đường</Link>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/booking?item=${d.slug}`} className="btn-primary text-lg"><CalendarIcon size={22} /> Tạo yêu cầu / đặt dịch vụ</Link>
        <Link href={`/navigation?to=${d.slug}`} className="btn-ghost hc-border text-lg"><CompassIcon size={22} /> Mở bản đồ demo</Link>
        <Link href="/help" className="btn-ghost hc-border text-lg"><PhoneIcon size={22} /> Thông tin hỗ trợ</Link>
      </div>

      <section className="mt-14" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-2xl">Điểm đến khác</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.filter((x) => x.slug !== d.slug).slice(0, 3).map((x) => (
            <li key={x.slug}>
              <Link href={`/destination?d=${x.slug}`} className="card hc-surface hc-border block h-full overflow-hidden border border-line hover:shadow-card-hover">
                <VerifiedImage src={x.image} fallback={x.imageFallback} alt={x.alt} className="h-36 w-full object-cover" />
                <span className="block p-4 text-lg font-semibold">{x.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function DestinationView() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <DestinationContent />
    </Suspense>
  );
}
