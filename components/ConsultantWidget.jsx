"use client";
import {useEffect,useRef,useState} from "react";
import {createRtc,signal,readVietnamese,hasVietnameseVoice} from "@/lib/consultationRtc";
const SHIFTS=[{start:6,end:14,name:"Lê Thanh Tú",phone:"0252688523"},{start:14,end:22,name:"Lê Anh Thái",phone:"0250255232"},{start:22,end:30,name:"Lê Anh Cường",phone:"0258931457"}];
function hanoiHour(){return Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',hourCycle:'h23'}).format(new Date()));}
function getPerson(){let h=hanoiHour();return SHIFTS.find(x=>h>=x.start&&h<x.end)||SHIFTS[2];}
export default function ConsultantWidget(){
 const [open,setOpen]=useState(false),[person,setPerson]=useState(null),[room,setRoom]=useState(''),[status,setStatus]=useState(''),[cameraOn,setCameraOn]=useState(false),[chat,setChat]=useState([]),[draft,setDraft]=useState(''),[voiceEnabled,setVoiceEnabled]=useState(true),[voiceWarn,setVoiceWarn]=useState(''),[micOn,setMicOn]=useState(false);
 const video=useRef(null),cam=useRef(null),mic=useRef(null),peer=useRef(null),channel=useRef(null),lastSeq=useRef(0),poller=useRef(null),ready=useRef(false);
 const speak=(text)=>{if(voiceEnabled&&!readVietnamese(text))setVoiceWarn('Thiết bị chưa có giọng đọc tiếng Việt. Nội dung vẫn hiển thị bằng chữ.');};
 const clean=()=>{clearInterval(poller.current);poller.current=null;ready.current=false;channel.current?.close();channel.current=null;peer.current?.close();peer.current=null;cam.current?.getTracks().forEach(t=>t.stop());cam.current=null;mic.current?.getTracks().forEach(t=>t.stop());mic.current=null;if(video.current)video.current.srcObject=null;setCameraOn(false);setMicOn(false);setRoom('');lastSeq.current=0;};
 useEffect(()=>{let tick=()=>setPerson(getPerson());tick();let t=setInterval(tick,60000);const handoff=e=>{setOpen(true);setDraft(e.detail?.message||'Tôi muốn trao đổi với tư vấn viên.');};window.addEventListener('wayecho:consultant',handoff);return()=>{clearInterval(t);window.removeEventListener('wayecho:consultant',handoff);clean();};},[]);
 useEffect(()=>{if(cameraOn&&video.current&&cam.current){video.current.srcObject=cam.current;video.current.play().catch(()=>{});}},[cameraOn,open]);
 const append=(role,text)=>{setChat(a=>[...a,{role,text}]);if(role==='advisor')speak(text);};
 function attach(pc,id){
  pc.onicecandidate=e=>{if(e.candidate)signal('send',id,'visitor',{type:'candidate',candidate:e.candidate.toJSON()}).catch(()=>{});};
  pc.onconnectionstatechange=()=>setStatus(pc.connectionState==='connected'?'Đã kết nối truyền hình ảnh và thoại với tư vấn viên.':`Trạng thái kết nối: ${pc.connectionState}`);
  const dc=pc.createDataChannel('messages');channel.current=dc;dc.onmessage=e=>{try{let m=JSON.parse(e.data);if(m.type==='chat')append('advisor',m.text);}catch{}};
 }
 async function start(){
  setStatus('Đang xin quyền camera…');
  try{
   if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Error('Camera cần HTTPS hoặc localhost và quyền sử dụng camera.');
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});cam.current=stream;setCameraOn(true);
   const {room:id}=await signal('create');setRoom(id);lastSeq.current=0;
   const pc=createRtc();peer.current=pc;attach(pc,id);stream.getTracks().forEach(t=>pc.addTrack(t,stream));pc.addTransceiver('audio',{direction:'sendrecv'});
   const offer=await pc.createOffer();await pc.setLocalDescription(offer);await signal('send',id,'visitor',{type:'offer',sdp:pc.localDescription});
   setStatus('Camera đã mở. Tư vấn viên cần nhập mã phiên tại cổng tư vấn để xem hình. Chưa có người nhận cho tới khi kết nối thành công.');
   poller.current=setInterval(async()=>{try{let res=await fetch(`/api/consultation?room=${id}&role=visitor&since=${lastSeq.current}`,{cache:'no-store'});if(!res.ok)throw Error('Phiên đã đóng');let x=await res.json();for(const e of x.events){lastSeq.current=Math.max(lastSeq.current,e.seq);if(e.payload.type==='answer'&&!ready.current){await pc.setRemoteDescription(e.payload.sdp);ready.current=true;}else if(e.payload.type==='candidate'){await pc.addIceCandidate(e.payload.candidate).catch(()=>{});}else if(e.payload.type==='chat')append('advisor',e.payload.text);else if(e.payload.type==='bye'){setStatus('Tư vấn viên đã kết thúc kết nối.');}}lastSeq.current=Math.max(lastSeq.current,x.seq);}catch(err){setStatus(err.message);}},1300);
  }catch(err){setStatus(err.message);clean();}
 }
 async function toggleMic(){try{if(mic.current){mic.current.getTracks().forEach(t=>t.stop());mic.current=null;const tx=peer.current?.getTransceivers().find(x=>x.receiver?.track?.kind==='audio');await tx?.sender.replaceTrack(null);setMicOn(false);return;}const s=await navigator.mediaDevices.getUserMedia({audio:true,video:false});mic.current=s;const tx=peer.current?.getTransceivers().find(x=>x.receiver?.track?.kind==='audio');if(!tx)throw Error('Không có kênh âm thanh');await tx.sender.replaceTrack(s.getAudioTracks()[0]);setMicOn(true);}catch{setStatus('Không truy cập được micro. Kiểm tra quyền sử dụng.');}}
 function send(){let text=draft.trim().slice(0,500);if(!text)return;if(channel.current?.readyState!=='open'){setStatus('Chưa có tư vấn viên kết nối. Tin nhắn chưa được gửi.');return;}channel.current.send(JSON.stringify({type:'chat',text}));append('visitor',text);setDraft('');}
 async function stop(){if(room)await signal('send',room,'visitor',{type:'bye'}).catch(()=>{});clean();setStatus('Đã ngừng chia sẻ camera.');}
 return <aside className="fixed bottom-[184px] right-4 z-[86] print:hidden md:bottom-[116px]">
 {open&&<section aria-label="Kết nối tư vấn viên WayEcho" className="mb-2 flex w-[min(390px,calc(100vw-2rem))] max-h-[min(78vh,730px)] flex-col overflow-hidden rounded-[22px] border border-[#e8d6b5] bg-[#fffaf1] shadow-2xl">
  <header className="flex items-center justify-between bg-[#fbb542] p-3"><div><strong>Tư vấn viên WayEcho</strong><p className="text-xs">{person?.name} · Số minh họa {person?.phone}</p></div><button aria-label="Đóng tư vấn viên" className="rounded-lg bg-white px-3 py-2" onClick={()=>{stop();setOpen(false);}}>✕</button></header>
  <div className="relative min-h-[210px] flex-1 bg-[#20282d]">
   {cameraOn?<video ref={video} muted autoPlay playsInline aria-label="Camera trực tiếp của bạn" className="absolute inset-0 h-full w-full object-cover"/>:<div className="flex h-[235px] flex-col items-center justify-center gap-2 text-center text-white"><span className="text-5xl">▣</span><p>Camera sẽ làm nền khi bạn cho phép</p></div>}
   <div className="pointer-events-none absolute left-3 right-3 top-3 rounded-xl bg-black/65 p-3 text-xs leading-5 text-white">Xin chào, tôi là {person?.name||'tư vấn viên WayEcho'}, rất vui được đồng hành cùng bạn. Chỉ mở camera khi bạn muốn chia sẻ hình ảnh. Người hỗ trợ sẽ nhìn thấy sau khi kết nối thành công.</div>
   <div className="absolute bottom-2 left-2 right-2 max-h-[110px] overflow-y-auto rounded-lg bg-black/65 p-2 text-xs text-white" aria-live="polite">{chat.slice(-3).map((m,i)=><p key={i}><b>{m.role==='advisor'?'Tư vấn viên':'Bạn'}: </b>{m.text}</p>)}</div>
  </div>
  <div className="space-y-2 p-3"><p className="text-xs" role="status">{status||'Chưa mở camera. Đây là phiên hỗ trợ thử nghiệm, chưa có nhân sự trực thật.'}</p>
   {!cameraOn?<button className="min-h-11 w-full rounded-xl bg-[#fbb542] font-bold" onClick={start}>Mở camera và tạo phiên hỗ trợ</button>:<><p className="rounded-lg bg-white p-2 text-xs">Mã phiên gửi cho tư vấn viên: <strong className="break-all">{room}</strong></p><div className="flex gap-2"><button className="min-h-11 flex-1 rounded-lg border bg-white" onClick={toggleMic}>{micOn?'Tắt thoại 🎙':'Bật thoại 🎙'}</button><button className="min-h-11 flex-1 rounded-lg bg-[#8f3922] text-white" onClick={stop}>Dừng chia sẻ</button></div></>}
   <div className="flex gap-2"><input aria-label="Nhập tin nhắn cho tư vấn viên" className="min-w-0 flex-1 rounded-lg border bg-white p-2" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Bạn muốn hỏi điều gì?"/><button onClick={send} className="rounded-lg bg-[#fbb542] px-3 font-bold">Gửi</button></div>
   <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={voiceEnabled} onChange={e=>setVoiceEnabled(e.target.checked)}/>Đọc tin nhắn tư vấn bằng tiếng Việt</label>{voiceWarn&&<p className="text-xs text-red-700">{voiceWarn}</p>}
   <p className="text-[11px] leading-4 text-neutral-600">AI không dẫn đường. Hãy dùng gậy dò đường và kỹ năng định hướng phù hợp; tư vấn viên cũng chỉ được hỗ trợ quan sát từ xa. Camera và thoại chỉ truyền khi có kết nối thực tế.</p>
  </div>
 </section>}
 <button className="ml-auto flex h-[66px] w-[70px] flex-col items-center justify-center rounded-full border-4 border-white bg-[#fff3e3] text-center font-bold shadow-xl" aria-expanded={open} onClick={()=>{if(open){stop();setOpen(false)}else setOpen(true)}}><span className="text-xl">☎</span><span className="text-[10px]">Tư vấn viên</span></button></aside>;
}
