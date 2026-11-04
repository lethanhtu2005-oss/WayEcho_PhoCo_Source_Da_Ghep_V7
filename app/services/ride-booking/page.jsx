'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {RIDE_PROVIDERS,RIDE_STATUS,speakVietnamese} from '@/lib/rideDemo';

const input='mt-2 min-h-12 w-full rounded-xl border border-[#d9bea5] bg-white px-4 py-3 text-[#302218]';

export default function RideBooking(){
 const [form,setForm]=useState({pickup:'87 Mã Mây, Hàng Buồm',destination:'Chợ Đồng Xuân, Hoàn Kiếm',provider:'grab-demo',vehicle:'electric',notes:'Có gậy dò; xin gọi khi đến điểm hẹn đón.',consent:true});
 const [rides,setRides]=useState([]);const [error,setError]=useState('');const [notice,setNotice]=useState('');const [voice,setVoice]=useState(false);

 useEffect(()=>{
  let live=true;
  const refresh=async()=>{
   try{
    const res=await fetch('/api/ride-demo',{cache:'no-store'});
    const data=await res.json();
    if(!res.ok)throw Error(data.error||'Không tải được chuyến');
    if(live)setRides(data);
   }catch(e){if(live)setError(e.message)}
  };
  refresh();
  const timer=setInterval(refresh,4000);
  const onFocus=()=>refresh();
  window.addEventListener('focus',onFocus);
  return()=>{live=false;clearInterval(timer);window.removeEventListener('focus',onFocus)}
 },[]);

 const set=(k,v)=>setForm(f=>({...f,[k]:v}));
 const say=s=>{setNotice(s);if(voice&&!speakVietnamese(s))setNotice(s+' Thiết bị chưa có giọng đọc tiếng Việt, vui lòng sử dụng trình đọc màn hình.');};

 const make=async()=>{
  try{
   if(!form.consent)throw Error('Bạn cần đồng ý tạo chuyến đi mô phỏng.');
   const res=await fetch('/api/ride-demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
   const ride=await res.json();
   if(!res.ok)throw Error(ride.error||'Không tạo được yêu cầu.');
   setRides(r=>[ride,...r]);
   setError('');
   say('Đã tạo yêu cầu đặt xe mô phỏng. Mã chuyến '+ride.id+'. Chờ xử lý mô phỏng.');
  }catch(e){setError(e.message)}
 };

 const mic=field=>{
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){setError('Trình duyệt chưa hỗ trợ nhập bằng giọng nói. Bạn có thể gõ hoặc dùng trình đọc màn hình.');return}
  const rec=new Recognition();
  rec.lang='vi-VN';
  rec.onresult=e=>set(field,e.results[0][0].transcript);
  rec.onerror=()=>setError('Không nhận được giọng nói. Hãy kiểm tra quyền micro.');
  rec.start();
 };

 const vehicles = [
  { id: 'electric', name: 'Xe điện Du lịch Phố Cổ', price: '35.000đ', icon: '🛺', desc: 'Rộng rãi, sàn phẳng gập dốc cho xe lăn & gậy dò, chuông âm học chậm an toàn' },
  { id: 'car', name: 'Ô tô 4 chỗ Tiếp Cận', price: '45.000đ', icon: '🚗', desc: 'Cốp rộng đón chó dẫn đường & gậy gập, tài xế dìu qua vỉa hè gồ ghề' },
  { id: 'motorbike', name: 'Xe máy Đồng Hành', price: '25.000đ', icon: '🛵', desc: 'Đai an toàn kép, mũ bảo hiểm trợ thính, di chuyển linh hoạt ngõ hẹp' }
 ];

 return (
  <main className="container-page py-10 space-y-8">
   <nav className="text-sm">
    <Link href="/" className="underline">Trang chủ</Link> / <Link href="/explore?cat=transport" className="underline">Dịch vụ</Link> / Di chuyển
   </nav>

   <div className="max-w-4xl space-y-3">
    <span className="rounded-full bg-[#fff0d5] px-4 py-2 text-sm font-bold text-[#a65220]">
     WayEcho · Trung tâm điều phối mô phỏng
    </span>
    <h1 className="mt-5 font-serif text-4xl sm:text-5xl font-bold text-[#4a2818]">
     Đặt Xe & Hỗ Trợ Di Chuyển Tiếp Cận Phố Cổ
    </h1>
    <p className="text-lg text-ink-soft">
     Thử toàn bộ quy trình đặt xe, nhận tài xế, theo dõi chuyến và hỗ trợ trợ năng trong WayEcho.
    </p>
    <p role="note" className="mt-4 rounded-xl border border-orange-300 bg-orange-50 p-4 font-semibold text-orange-950">
     CHỈ LÀ MÔ PHỎNG PHỤC VỤ HỌC TẬP. Grab, be, Xanh SM không kết nối, không nhận đơn, không có xe hoặc tài xế thật. Không phát sinh thanh toán.
    </p>
   </div>

   {/* Vehicle Selector Cards */}
   <div className="grid gap-4 sm:grid-cols-3">
    {vehicles.map(v => (
     <button
      key={v.id}
      type="button"
      onClick={() => set('vehicle', v.id)}
      className={`rounded-2xl p-5 text-left border transition-all ${
       form.vehicle === v.id
        ? 'border-primary bg-amber-50/70 shadow-md ring-2 ring-primary'
        : 'border-line bg-white hover:bg-slate-50'
      }`}
     >
      <div className="text-3xl mb-2">{v.icon}</div>
      <div className="flex items-center justify-between">
       <span className="font-bold text-ink">{v.name}</span>
       <span className="text-xs font-bold text-primary">{v.price}</span>
      </div>
      <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{v.desc}</p>
     </button>
    ))}
   </div>

   <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
    {/* Form Booking */}
    <section className="rounded-3xl border border-[#e9d4c0] bg-[#fff9f0] p-6 shadow-card space-y-4">
     <h2 className="font-serif text-2xl font-bold">Tạo chuyến đi thử nghiệm</h2>

     <label className="block font-semibold">
      Điểm đón
      <div className="flex gap-2">
       <input aria-label="Điểm đón" className={input} value={form.pickup} onChange={e=>set('pickup',e.target.value)} placeholder="Ví dụ: 87 Mã Mây"/>
       <button className="mt-2 rounded-xl bg-white px-4 border border-line" type="button" aria-label="Nói điểm đón" onClick={()=>mic('pickup')}>🎙</button>
      </div>
     </label>

     <label className="block font-semibold">
      Điểm đến
      <div className="flex gap-2">
       <input aria-label="Điểm đến" className={input} value={form.destination} onChange={e=>set('destination',e.target.value)} placeholder="Ví dụ: Chợ Đồng Xuân"/>
       <button className="mt-2 rounded-xl bg-white px-4 border border-line" type="button" aria-label="Nói điểm đến" onClick={()=>mic('destination')}>🎙</button>
      </div>
     </label>

     <label className="block font-semibold">
      Chọn đối tác mô phỏng
      <select className={input} value={form.provider} onChange={e=>set('provider',e.target.value)}>
       {RIDE_PROVIDERS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
     </label>

     <label className="block font-semibold">
      Loại phương tiện
      <select className={input} value={form.vehicle} onChange={e=>set('vehicle',e.target.value)}>
       <option value="electric">Xe điện du lịch Phố Cổ (Sàn dốc gập)</option>
       <option value="car">Ô tô 4 chỗ (Đón chó dẫn đường)</option>
       <option value="motorbike">Xe máy đồng hành (Đai an toàn)</option>
      </select>
     </label>

     <label className="block font-semibold">
      Nhu cầu trợ năng
      <textarea className={input} rows={3} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Ví dụ: Có gậy dò; mong tài xế gọi khi đến điểm đón. Không mặc định tài xế có thể hỗ trợ."/>
     </label>

     <label className="flex items-start gap-3 text-sm">
      <input className="mt-1 h-5 w-5 accent-[#f8ae38]" type="checkbox" checked={form.consent} onChange={e=>set('consent',e.target.checked)}/>
      <span>Tôi hiểu đây chỉ là chuyến xe giả lập, đồng ý gửi thông tin mô phỏng lên máy chủ thử nghiệm. Không nhập dữ liệu cá nhân thật.</span>
     </label>

     <label className="flex items-center gap-3 text-sm">
      <input type="checkbox" checked={voice} onChange={e=>setVoice(e.target.checked)}/>
      <span>Tự đọc thông báo bằng giọng tiếng Việt (khi thiết bị hỗ trợ)</span>
     </label>

     <button className="btn-primary w-full min-h-12" type="button" onClick={make}>
      Xác nhận tạo chuyến DEMO
     </button>

     {error&&<p role="alert" className="mt-3 text-red-800">{error}</p>}
     {notice&&<p role="status" className="mt-3 text-green-900">{notice}</p>}
    </section>

    {/* Live Simulated Rides Tracker */}
    <section className="rounded-3xl border border-[#e9d4c0] bg-white p-6 shadow-card space-y-4">
     <div className="flex items-center justify-between">
      <h2 className="font-serif text-2xl font-bold">Theo dõi chuyến xe</h2>
      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
       <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Radar GPS
      </span>
     </div>

     <p className="text-sm text-ink-soft">
      Trạng thái được tải từ API máy chủ; cập nhật khi có thay đổi, nếu hai thiết bị cùng kết nối tới một instance máy chủ demo.
     </p>

     <div className="mt-5 space-y-4" aria-live="polite">
      {rides.length===0?(
       <p className="rounded-xl bg-[#fff8ed] p-4 text-sm">Chưa có yêu cầu đặt xe demo. Hãy tạo một chuyến bên cạnh để theo dõi mô phỏng.</p>
      ):(
       rides.map(r=>(
        <div key={r.id} className="rounded-2xl border border-[#efdac2] p-4 space-y-2 bg-[#fffdfa]">
         <div className="flex items-center justify-between">
          <p className="font-bold text-[#a45119]">{r.id} · {RIDE_STATUS[r.status]}</p>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold uppercase">
           {r.status}
          </span>
         </div>
         <p className="text-sm font-semibold">{r.pickup} → {r.destination}</p>
         <p className="text-xs text-ink-soft">Đối tác: {RIDE_PROVIDERS.find(p=>p.id===r.provider)?.name}</p>

         {r.driver&&(
          <div className="rounded-xl bg-[#fff7e8] p-3 text-sm space-y-1 border border-amber-200/60">
           <p className="font-bold text-ink">Tài xế giả lập: {r.driver.name} · {r.driver.plate}</p>
           <p className="text-xs text-emerald-800">Đã kích hoạt chế độ hỗ trợ tiếp cận (gọi điện thoại trước khi đến).</p>
          </div>
         )}

         {r.status==='completed'&& (
          <div className="pt-2 border-t border-line space-y-2">
           <p className="text-sm text-ink-soft">Chuyến đã kết thúc theo mô phỏng. WayEcho không xác minh an toàn vị trí xuống xe.</p>
           <label className="block text-sm font-semibold">
            Đánh giá hỗ trợ
            <select
             className={input}
             defaultValue=""
             onChange={async e=>{
              if(!e.target.value)return;
              try{
               const res=await fetch('/api/ride-demo',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:r.id,feedback:e.target.value})});
               const result=await res.json();
               if(!res.ok)throw Error(result.error);
               setRides(xs=>xs.map(x=>x.id===r.id?result:x));
              }catch(err){setError(err.message)}
             }}
            >
             <option value="">Chọn đánh giá</option>
             <option value="good">Tốt</option>
             <option value="improve">Cần cải thiện</option>
            </select>
           </label>
           <Link href="/contact" className="mt-2 inline-block underline text-sm text-primary">
            Liên hệ tư vấn viên nếu cần hỗ trợ
           </Link>
          </div>
         )}
        </div>
       ))
      )}
     </div>

     <p className="mt-6 text-xs text-ink-soft">
      Việc điều phối chỉ thực hiện trong cổng quản trị demo riêng. Khách chỉ theo dõi trạng thái chuyến của mình tại đây.
     </p>
    </section>
   </div>

   {/* External official app handoff */}
   <section className="mt-8 rounded-3xl border border-[#e6d0b9] bg-white p-6 space-y-4">
    <h2 className="font-serif text-2xl font-bold">Lựa chọn chuyển sang ứng dụng thật (ngoài mô phỏng)</h2>
    <p className="text-sm text-ink-soft">
     Mở website đối tác không đồng nghĩa đặt xe thành công. Đặt xe thật, giá và thanh toán do đối tác xác nhận.
    </p>

    <button
     type="button"
     className="rounded-full border border-[#bf773d] px-5 py-3 font-semibold hover:bg-amber-50 transition-colors"
     onClick={async()=>{
      const content=`Điểm đón: ${form.pickup||'Chưa nhập'}\nĐiểm đến: ${form.destination||'Chưa nhập'}\nGhi chú: ${form.notes||'Không có'}`;
      try{
       await navigator.clipboard.writeText(content);
       setNotice('Đã sao chép thông tin để tự nhập tại ứng dụng đối tác.');
      }catch{
       setError('Không thể sao chép trên trình duyệt này.');
      }
     }}
    >
     Sao chép thông tin chuyến xe
    </button>

    <div className="flex flex-wrap gap-3 pt-2">
     <a href="https://www.grab.com/vn/transport/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#fff2dd] px-5 py-3 font-semibold hover:bg-[#ffe6c0] transition-colors">
      Mở Grab ↗
     </a>
     <a href="https://be.com.vn/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#fff2dd] px-5 py-3 font-semibold hover:bg-[#ffe6c0] transition-colors">
      Mở be ↗
     </a>
     <a href="https://www.xanhsm.com/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#fff2dd] px-5 py-3 font-semibold hover:bg-[#ffe6c0] transition-colors">
      Mở Xanh SM ↗
     </a>
    </div>
   </section>

   <div className="rounded-2xl bg-[#fff3df] p-5 text-sm leading-7 text-[#7a4c00]">
    <strong>Giới hạn an toàn:</strong> WayEcho không hướng dẫn người khiếm thị rẽ hoặc vượt đường bằng AI. Mọi thông tin tài xế, biển số và trạng thái đều giả lập. Nếu thực sự di chuyển, hãy sử dụng gậy dò đường và yêu cầu người hỗ trợ đáng tin cậy khi cần.
   </div>
  </main>
 );
}
