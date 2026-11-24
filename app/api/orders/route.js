export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body || {};
    if (!customer?.name || !customer?.phone || !customer?.address || !Array.isArray(items) || !items.length) {
      return Response.json({ error: "กรุณากรอกข้อมูลและเลือกสินค้าให้ครบ" }, { status: 400 });
    }
    const endpoint = process.env.GOOGLE_SHEETS_WEB_APP_URL;
    if (!endpoint) return Response.json({ error: "ยังไม่ได้ตั้งค่า Google Sheets กรุณาติดตั้ง Web App URL ใน Vercel" }, { status: 503 });
    const payload = { customer, items, total, source: "Natural Soap Website" };
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), cache: "no-store", redirect: "follow" });
    if (!response.ok) throw new Error("Google Sheets ตอบกลับไม่สำเร็จ");
    const result = await response.json();
    if (!result.success) throw new Error(result.error || "บันทึกข้อมูลไม่สำเร็จ");
    return Response.json({ success: true, orderId: result.orderId });
  } catch (error) {
    return Response.json({ error: error.message || "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}