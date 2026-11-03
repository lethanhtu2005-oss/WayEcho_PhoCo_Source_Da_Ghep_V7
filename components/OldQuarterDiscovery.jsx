"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VerifiedImage from "./VerifiedImage";
import { discoveryPlaces, discoveryCategories, accessLevels, filterDiscovery } from "@/data/oldQuarterDiscovery";

const BADGE = { good: "bg-[#dff5ea] text-[#0b5a3a]", medium: "bg-[#fff1bf] text-[#7a4d00]", assist: "bg-[#ffe1d6] text-[#8a2c0c]" };

export default function OldQuarterDiscovery() {
  const [category, setCategory] = useState("Tất cả");
  const [level, setLevel] = useState("all");
  const [speaking, setSpeaking] = useState("");
  const [message, setMessage] = useState("");
  const list = filterDiscovery(discoveryPlaces, category, level);

  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch {} }, []);

  function toggleSpeech(p) {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth) { setMessage("Trình duyệt này chưa hỗ trợ đọc mô tả."); return; }
    if (speaking === p.id) { synth.cancel(); setSpeaking(""); setMessage("Đã dừng đọc."); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${p.title}. ${p.desc} ${p.notes.join(". ")}.`);
    u.lang = "vi-VN";
    u.onend = () => setSpeaking("");
    setSpeaking(p.id);
    setMessage(`Đang đọc mô tả ${p.title}.`);
    synth.speak(u);
  }

  return (
    <section className="py-12" aria-labelledby="discovery-heading">
      <div className="container-page">
        <h2 id="discovery-heading" className="text-4xl">Khám phá theo mức độ tiếp cận</h2>
        <p className="mt-1 text-ink-soft hc-muted">Lọc điểm đến Phố cổ theo loại hình và mức độ tiếp cận. Thông tin mang tính tham khảo (DEMO), chưa xác minh tại chỗ; ảnh là ảnh minh họa.</p>

        <div className="mt-5 flex flex-wrap items-center gap-3" role="group" aria-label="Bộ lọc điểm đến">
          <div className="flex flex-wrap gap-2">
            {discoveryCategories.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
                className={`min-h-[44px] rounded-full border px-4 font-semibold hc-border ${category === c ? "border-[#ef6d28] bg-[#fff2e9] text-[#8a3510]" : "border-line bg-white hc-surface"}`}>{c}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 font-semibold">
            <span>Mức độ tiếp cận</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="min-h-[44px] rounded-xl border border-line bg-white px-3 hc-surface hc-border">
              {accessLevels.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm hc-muted" role="status" aria-live="polite">{`Hiển thị ${list.length} điểm đến. ${message}`}</p>

        <div className="mt-4 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-card hc-surface hc-border">
              <VerifiedImage src={p.image} fallback="/assets/images/location-image-unavailable.svg" alt={p.alt} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-bold hc-muted">{p.category}</p>
                <h3 className="mt-1 text-[22px] leading-tight">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft hc-muted">⌖ {p.address}</p>
                <p className={`mt-3 inline-flex self-start rounded-full px-3 py-1.5 text-xs font-bold ${BADGE[p.level]}`}>{p.levelLabel} · chưa xác minh</p>
                <p className="mt-3 text-sm leading-6">{p.desc}</p>
                <ul className="mt-3 grid gap-1 rounded-xl bg-[#fff9ed] p-3 text-sm hc-surface">
                  {p.notes.map((n) => <li key={n}>• {n}</li>)}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={speaking === p.id} onClick={() => toggleSpeech(p)} className="btn-primary min-h-[44px]">{speaking === p.id ? "Dừng đọc" : "Nghe mô tả"}</button>
                  <Link href="/destination" className="btn-ghost hc-border min-h-[44px]">Xem chi tiết</Link>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/navigation" className="btn-ghost hc-border min-h-[44px]">Chỉ đường</Link>
                  <Link href="/my-trip" className="btn-ghost hc-border min-h-[44px]">Thêm vào chuyến đi</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {list.length === 0 && <p className="mt-6 rounded-xl border border-line p-4">Chưa có điểm đến phù hợp bộ lọc. Hãy chọn mức độ khác.</p>}
      </div>
    </section>
  );
}
