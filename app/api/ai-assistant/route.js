import {NextResponse} from "next/server";
export const runtime="nodejs";
export async function POST(request){
 try{
  const {question,image}=await request.json();
  if(typeof question!=="string"||question.length>1500|| (image && (typeof image!=="string"||image.length>2500000||!image.startsWith("data:image/jpeg;base64,"))))return NextResponse.json({error:"Dữ liệu yêu cầu không hợp lệ."},{status:400});
  if(/(chỉ đường|dẫn đường|đường nào|đi hướng nào|rẽ (trái|phải)|băng qua|qua đường|có an toàn|tránh (xe|vật cản)|đi tiếp|đi thẳng|lối nào)/i.test(question||""))return NextResponse.json({answer:"Tôi chỉ mô tả cảnh, không hướng dẫn di chuyển hay bảo đảm an toàn. Nếu cần đi, hãy dùng gậy để dò đường và nhờ người hỗ trợ phù hợp. Bạn có muốn kết nối với tư vấn viên WayEcho để hỏi thông tin lộ trình không?",consultantSuggested:true});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({answer:"Camera đã hoạt động, nhưng chức năng nhận diện hình ảnh chưa được kết nối với dịch vụ AI. Cần cấu hình khóa OPENAI_API_KEY trên máy chủ Vercel. Tôi không thể tự xác nhận vật thể hoặc địa điểm qua ảnh lúc này."},{status:503});
  const parts=[{type:"input_text",text:question||"Mô tả những gì nhìn thấy trong ảnh."}];
  if(image)parts.push({type:"input_image",image_url:image});
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.WAYECHO_VISION_MODEL||"gpt-4.1-mini",instructions:"Bạn là trợ lý WayEcho cho người khiếm thị tại Hà Nội. CHỈ trả lời bằng TIẾNG VIỆT tự nhiên. Mô tả đúng những gì nhìn thấy trong ảnh chụp, không tự nhận định chính xác người đang ở địa điểm nào chỉ từ cảnh chung. Nếu không chắc, nói rõ. TUYỆT ĐỐI KHÔNG CHỈ ĐƯỜNG: không chỉ rẽ, đi thẳng, di chuyển theo hướng nào, tránh vật cản, băng đường hoặc khẳng định lối an toàn dù khách yêu cầu. Chỉ mô tả sự vật và bố cục cảnh, nêu rõ chưa chắc chắn. Nếu khách muốn đi đâu, nói: Nếu bạn đi, hãy dùng gậy để dò đường; mô tả của tôi có thể sai. Hỏi khách có muốn kết nối tư vấn viên để tìm hiểu lộ trình hay nhờ hỗ trợ không. Không khẳng định có tư vấn viên trực tuyến khi chưa có kết nối. Trả lời ngắn gọn và hữu ích.",input:[{role:"user",content:parts}],max_output_tokens:350})});
  if(!response.ok)return NextResponse.json({error:"Dịch vụ AI đang không sẵn sàng. Hãy thử lại sau."},{status:502});
  const data=await response.json();const answer=(data.output||[]).flatMap(o=>o.content||[]).filter(c=>c.type==="output_text").map(c=>c.text).join(" ").trim();
  return NextResponse.json({answer:answer||"Chưa có kết quả mô tả. Vui lòng thử lại."});
 }catch{return NextResponse.json({error:"Không thể xử lý yêu cầu này."},{status:500});}
}
