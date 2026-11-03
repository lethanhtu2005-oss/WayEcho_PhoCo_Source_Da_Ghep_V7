import {secured,fail,json} from "@/lib/auth";
import {list,transaction,insert} from "@/lib/store";
import {newRide,advanceRide,RIDE_PROVIDERS} from "@/lib/rideDemo";
export const dynamic="force-dynamic";
// This is a mock transport provider. No real ride or payment is made.
export const GET=secured(async(req,user)=>{
 const rows=await list("rides");
 return json(user.role==="admin" ? rows : rows.filter(r=>r.ownerId===user.id));
},["traveler","admin"],{guest:true});
export const POST=secured(async(req,user)=>{
 if(user.role!=="traveler")fail(403,"Chỉ khách hàng tạo yêu cầu đặt xe.");
 const body=await req.json().catch(()=>fail(400,"Dữ liệu JSON không hợp lệ."));
 if(body?.consent!==true)fail(400,"Cần xác nhận đây chỉ là yêu cầu mô phỏng.");
 for(const k of ["pickup","destination","notes"]){if(typeof body[k]!=="string" || body[k].length>400)fail(400,"Dữ liệu đặt xe không hợp lệ.");}
 if(!["car","motorbike","electric"].includes(body.vehicle))fail(400,"Loại phương tiện không hợp lệ.");
 const ride=newRide(body);
 const record=await transaction(db=>insert(db,"rides",{...ride,ownerId:user.id,isDemo:true}));
 return json(record,201);
},["traveler"],{guest:true});
export const PATCH=secured(async(req,user)=>{
 if(user.role!=="admin")fail(403,"Chỉ người điều hành mô phỏng được đổi trạng thái.");
 const body=await req.json().catch(()=>fail(400,"Dữ liệu JSON không hợp lệ."));
 if(typeof body?.id!=="string"||typeof body?.status!=="string")fail(400,"Thiếu mã chuyến hoặc trạng thái.");
 const record=await transaction(db=>{
  const ride=db.rides.find(r=>r.id===body.id);if(!ride)fail(404,"Không tìm thấy chuyến xe.");
  Object.assign(ride,advanceRide(ride,body.status));ride.updatedAt=new Date().toISOString();return ride;
 });return json(record);
},["admin"]);
export const PUT=secured(async(req,user)=>{
 if(user.role!=="traveler")fail(403,"Không được đánh giá thay khách.");
 const body=await req.json().catch(()=>fail(400,"Dữ liệu JSON không hợp lệ."));
 if(!["good","improve"].includes(body?.feedback))fail(400,"Đánh giá không hợp lệ.");
 const record=await transaction(db=>{
  const ride=db.rides.find(r=>r.id===body.id && r.ownerId===user.id);
  if(!ride)fail(404,"Không có quyền xem chuyến này.");
  if(ride.status!=="completed")fail(409,"Chuyến chưa kết thúc.");
  ride.feedback=body.feedback;ride.updatedAt=new Date().toISOString();return ride;
 });return json(record);
},["traveler"],{guest:true});
