"use client";
import { useState } from "react";
import { safeNext } from "@/lib/redirect";
export default function LoginForm({ portal = "all" }) {
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(event) {
    event.preventDefault();setBusy(true);setError("");
    const form=new FormData(event.currentTarget);
    try {
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password"),allowedRoles:portal === "partner" ? ["guide","business"] : portal === "internal" ? ["admin","advisor"] : portal === "traveler" ? ["traveler"] : undefined})});
      const body=await res.json(); if(!res.ok)throw Error(body.error);
      const fallback={admin:"/admin",advisor:"/admin/consultation",business:"/business",guide:"/guide",traveler:"/profile"}[body.role];
      if (portal === "traveler" && body.role !== "traveler") throw Error("Đây không phải tài khoản Khách hàng.");
      if (portal === "partner" && !["business","guide"].includes(body.role)) throw Error("Đây không phải tài khoản Đối tác / Guide.");
      if (portal === "internal" && !["admin","advisor"].includes(body.role)) throw Error("Đây không phải tài khoản nội bộ WayEcho.");
      window.location.assign(safeNext(new URLSearchParams(window.location.search).get("next"),fallback));
    }catch(e){setError(e.message || "Không đăng nhập được. Hãy thử lại.");}finally{setBusy(false);}
  }
  async function demoLoginAs(role, defaultEmail = `${role}@demo.wayecho.vn`) {
    setBusy(true); setError("");
    try {
      const allowedRoles = portal === "partner" ? ["guide","business"] : portal === "internal" ? ["admin","advisor"] : portal === "traveler" ? ["traveler"] : undefined;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: defaultEmail,
          password: "demo",
          requiredRole: role,
          allowedRoles
        })
      });
      const body = await res.json();
      if (!res.ok) throw Error(body.error);
      const fallback = { admin: "/admin", advisor: "/admin/consultation", business: "/business", guide: "/guide", traveler: "/profile" }[body.role];
      window.location.assign(safeNext(new URLSearchParams(window.location.search).get("next"), fallback));
    } catch(e) {
      setError(e.message || "Không đăng nhập được. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-5 rounded-2xl bg-amber-50/80 p-4 border border-amber-200/70 text-sm text-[#7a4c00]">
        <div className="flex items-center gap-2 font-bold mb-1">
          <span className="flex h-2 w-2 rounded-full bg-[#f8ae38] animate-ping" />
          <span>Chế độ mô phỏng đăng nhập (Demo):</span>
        </div>
        <p className="text-xs text-[#8c5700]">Bạn có thể nhập bất kỳ tên/mật khẩu nào để trải nghiệm, hoặc bấm một chạm vào các vai trò bên dưới:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(!portal || portal === "all" || portal === "traveler") && (
            <button
              type="button"
              onClick={() => demoLoginAs("traveler", "khachhang@demo.vn")}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#8c5700] border border-amber-300 hover:bg-amber-100 shadow-sm transition-all"
            >
              👤 Khách hàng (Traveler)
            </button>
          )}
          {(!portal || portal === "all" || portal === "partner") && (
            <>
              <button
                type="button"
                onClick={() => demoLoginAs("guide", "guide1@demo.vn")}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#8c5700] border border-amber-300 hover:bg-amber-100 shadow-sm transition-all"
              >
                🧭 Hướng dẫn viên (Guide)
              </button>
              <button
                type="button"
                onClick={() => demoLoginAs("business", "khachsan@demo.vn")}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#8c5700] border border-amber-300 hover:bg-amber-100 shadow-sm transition-all"
              >
                🏨 Doanh nghiệp (Business)
              </button>
            </>
          )}
          {(!portal || portal === "all" || portal === "internal") && (
            <>
              <button
                type="button"
                onClick={() => demoLoginAs("admin", "admin@demo.vn")}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#8c5700] border border-amber-300 hover:bg-amber-100 shadow-sm transition-all"
              >
                ⚙️ Quản trị viên (Admin)
              </button>
              <button
                type="button"
                onClick={() => demoLoginAs("advisor", "tuvan@demo.vn")}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#8c5700] border border-amber-300 hover:bg-amber-100 shadow-sm transition-all"
              >
                🎧 Tư vấn viên (Staff)
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block font-semibold">Tài khoản / Email (nhập tự do)</label>
          <input
            id="login-email"
            name="email"
            defaultValue="demo@wayecho.vn"
            type="text"
            autoComplete="username"
            className="mt-2 w-full rounded-xl border border-line p-3"
            placeholder="Nhập tên đăng nhập hoặc email bất kỳ..."
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block font-semibold">Mật khẩu (nhập tự do)</label>
          <input
            id="login-password"
            name="password"
            defaultValue="demo123"
            type="text"
            autoComplete="current-password"
            maxLength={256}
            className="mt-2 w-full rounded-xl border border-line p-3"
            placeholder="Nhập mật khẩu bất kỳ..."
          />
        </div>
        {error && <p role="alert" className="text-red-800">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Đang đăng nhập…" : "Đăng nhập mô phỏng"}
        </button>
      </form>
    </div>
  );
}
