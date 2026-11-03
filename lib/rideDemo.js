export const RIDE_KEY = 'wayecho_ride_demo_v24';
export const RIDE_PROVIDERS = [{id:'grab-demo',name:'Grab – mô phỏng'},{id:'be-demo',name:'be – mô phỏng'},{id:'xanh-demo',name:'Xanh SM – mô phỏng'}];
export const RIDE_STATUS = {requested:'Đã gửi yêu cầu',assigned:'Đã có tài xế',arrived:'Tài xế đã đến điểm đón',in_progress:'Đang trong chuyến',completed:'Chuyến đi đã kết thúc',cancelled:'Đã hủy'};
const NEXT = {requested:['assigned','cancelled'], assigned:['arrived','cancelled'], arrived:['in_progress','cancelled'], in_progress:['completed'], completed:[], cancelled:[]};
export const DEMO_DRIVERS=[{name:'Nguyễn Văn Minh (demo)',plate:'29A-123.45 (demo)',vehicle:'Ô tô 4 chỗ (demo)'},{name:'Trần Quốc Huy (demo)',plate:'29B-456.78 (demo)',vehicle:'Ô tô 4 chỗ (demo)'},{name:'Lê Thu Hà (demo)',plate:'29C-888.66 (demo)',vehicle:'Xe điện (demo)'}];
export function newRide(data, id=`WX-${Date.now().toString(36).toUpperCase()}`){
 if(!data.pickup?.trim() || !data.destination?.trim()) throw Error('Cần nhập điểm đón và điểm đến.');
 if(!RIDE_PROVIDERS.some(p=>p.id===data.provider)) throw Error('Chọn một đối tác mô phỏng.');
 return {id,provider:data.provider,pickup:data.pickup.trim(),destination:data.destination.trim(),vehicle:data.vehicle||'car',notes:data.notes||'',consent:Boolean(data.consent),status:'requested',driver:null,payment:'not_confirmed',events:[{status:'requested',time:new Date().toISOString()}],createdAt:new Date().toISOString(),feedback:null};
}
export function advanceRide(ride,to){if(!(NEXT[ride.status]||[]).includes(to)) throw Error('Chuyển trạng thái không hợp lệ.');const result={...ride,status:to,events:[...ride.events,{status:to,time:new Date().toISOString()}]};if(to==='assigned')result.driver=DEMO_DRIVERS[RIDE_PROVIDERS.findIndex(p=>p.id===ride.provider)]||DEMO_DRIVERS[0];return result;}
export function getRides(){if(typeof window==='undefined')return [];try{return JSON.parse(window.localStorage.getItem(RIDE_KEY)||'[]')}catch{return []}}
export function saveRides(rides){if(typeof window!=='undefined'){window.localStorage.setItem(RIDE_KEY,JSON.stringify(rides));window.dispatchEvent(new Event('wayecho-rides-changed'));}return rides;}
export function updateRide(id,fn){const all=getRides();const i=all.findIndex(x=>x.id===id);if(i<0)throw Error('Không tìm thấy chuyến xe.');all[i]=fn(all[i]);saveRides(all);return all[i];}
export function speakVietnamese(message){if(typeof window==='undefined'||!('speechSynthesis'in window))return false;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang?.toLowerCase().startsWith('vi'));if(!voice)return false;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(message);u.lang='vi-VN';u.voice=voice;u.rate=.92;window.speechSynthesis.speak(u);return true;}
