// Natural Soap - Google Sheets order receiver
// Create a spreadsheet with tabs named Products, Orders, and OrderItems.
// Deploy this script as a Web App (Execute as: Me; access: Anyone).
function setupNaturalSoapSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = {
    Products: ["SKU","Product Name","Price (THB)","Stock","Image"],
    Orders: ["Order ID","Created At","Customer Name","Phone","Shipping Address","Note","Total (THB)","Status"],
    OrderItems: ["Order ID","SKU","Product Name","Unit Price","Quantity","Line Total"]
  };
  Object.keys(tabs).forEach(name => {
    let sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(tabs[name]);
  });
  const p = ss.getSheetByName("Products");
  if (p.getLastRow() < 2) p.getRange(2,1,2,5).setValues([
    ["SOAP-001","สบู่ข้าวโอ๊ต",129,100,"/images/oatmeal-soap.svg"],
    ["SOAP-002","สบู่ถ่านไม้ไผ่",149,100,"/images/charcoal-soap.svg"]
  ]);
}
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orders = ss.getSheetByName("Orders");
    const lines = ss.getSheetByName("OrderItems");
    if (!orders || !lines) throw new Error("กรุณารัน setupNaturalSoapSheets ก่อน");
    if (!data.customer || !data.items || !data.items.length) throw new Error("ข้อมูลคำสั่งซื้อไม่ครบ");
    const orderId = "NS" + Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyyMMdd-HHmmss") + "-" + Math.floor(100 + Math.random()*900);
    const now = new Date();
    orders.appendRow([orderId, now, data.customer.name, data.customer.phone, data.customer.address, data.customer.note || "", Number(data.total || 0), "รอตรวจสอบ"]);
    data.items.forEach(item => lines.appendRow([orderId, item.sku, item.name, Number(item.price), Number(item.qty), Number(item.price)*Number(item.qty)]));
    return ContentService.createTextOutput(JSON.stringify({success:true,orderId:orderId})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success:false,error:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet() {
  return ContentService.createTextOutput("Natural Soap order endpoint is ready.");
}