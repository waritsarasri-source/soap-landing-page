"use client";
import { useMemo, useState } from "react";
const products = [
 {sku:"SOAP-001",name:"สบู่ข้าวโอ๊ต",en:"Oatmeal Gentle Bar",price:129,desc:"สัมผัสละมุนด้วยข้าวโอ๊ต เหมาะสำหรับการดูแลผิวในทุกวัน",image:"/images/oatmeal-soap.svg",tag:"GENTLE CARE"},
 {sku:"SOAP-002",name:"สบู่ถ่านไม้ไผ่",en:"Bamboo Charcoal Bar",price:149,desc:"สบู่ถ่านไม้ไผ่สำหรับวันที่ต้องการความรู้สึกสะอาดสดชื่น",image:"/images/charcoal-soap.svg",tag:"DEEP CLEAN"}
];
export default function Home(){
 const [cart,setCart]=useState({});
 const [showCheckout,setShowCheckout]=useState(false);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [form,setForm]=useState({name:"",phone:"",address:"",note:""});
 const items=useMemo(()=>products.filter(p=>cart[p.sku]>0).map(p=>({...p,qty:cart[p.sku]})),[cart]);
 const total=items.reduce((s,p)=>s+p.price*p.qty,0);
 const count=items.reduce((s,p)=>s+p.qty,0);
 const add=(sku)=>setCart(c=>({...c,[sku]:(c[sku]||0)+1}));
 const change=(sku,delta)=>setCart(c=>({...c,[sku]:Math.max(0,(c[sku]||0)+delta)}));
 async function submit(e){
  e.preventDefault(); if(!items.length)return;
  setBusy(true);setNotice("");
  try{
   const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:form,items:items.map(({sku,name,price,qty})=>({sku,name,price,qty})),total})});
   const data=await res.json(); if(!res.ok)throw new Error(data.error||"ไม่สามารถบันทึกคำสั่งซื้อได้");
   setNotice("สั่งซื้อสำเร็จ! เลขที่คำสั่งซื้อ "+data.orderId);setCart({});setForm({name:"",phone:"",address:"",note:""});setShowCheckout(false);
  }catch(err){setNotice(err.message+" — โปรดตรวจสอบการตั้งค่า Google Sheets");}
  finally{setBusy(false);}
 }
 return <main>
  <div className="announcement">NATURAL CARE, EVERY DAY · ส่งต่อความอ่อนโยนให้ผิวคุณ</div>
  <header className="nav wrap"><a className="brand" href="#">natural<span>soap.</span></a><nav><a href="#products">สินค้า</a><a href="#story">เรื่องราวของเรา</a><a href="#contact">ติดต่อ</a></nav><button className="cartBtn" onClick={()=>setShowCheckout(true)}>ตะกร้า ({count})</button></header>
  <section className="hero wrap"><div className="heroCopy"><p className="eyebrow">SIMPLE • NATURAL • KIND</p><h1>ความเรียบง่าย<br/>ที่ดีต่อผิว<span>.</span></h1><p className="lead">เติมเต็มช่วงเวลาดูแลตัวเอง ด้วยสบู่ที่คัดสรรส่วนผสมอย่างใส่ใจ ให้ทุกวันเป็นวันสบาย ๆ ของผิว</p><a className="primary" href="#products">เลือกชมสินค้า <span>↗</span></a><div className="heroNote">THOUGHTFULLY MADE · EVERYDAY ESSENTIALS</div></div><div className="heroVisual"><img src="/images/oatmeal-soap.svg" alt="สบู่ข้าวโอ๊ต Natural Soap"/><div className="roundStamp">PURE<br/> & SIMPLE</div></div></section>
  <section className="values"><div className="wrap valueGrid"><div><b>01</b><span>เรียบง่ายและใส่ใจ</span></div><div><b>02</b><span>เลือกใช้ในทุกวัน</span></div><div><b>03</b><span>ดูแลตัวเองอย่างอ่อนโยน</span></div></div></section>
  <section id="products" className="products wrap"><div className="sectionHead"><div><p className="eyebrow">OUR COLLECTION</p><h2>เลือกสิ่งที่ใช่สำหรับคุณ</h2></div><p>Small rituals, softer days.</p></div><div className="productGrid">{products.map(p=><article className="product" key={p.sku}><div className="productImage"><span className="tag">{p.tag}</span><img src={p.image} alt={p.name}/></div><div className="productInfo"><div><h3>{p.name}</h3><p>{p.en}</p></div><strong>฿{p.price}</strong></div><p className="desc">{p.desc}</p><button className="addBtn" onClick={()=>add(p.sku)}>เพิ่มลงตะกร้า <span>＋</span></button><small>{p.sku}</small></article>)}</div></section>
  <section id="story" className="story"><div className="wrap storyInner"><p className="eyebrow">A LITTLE MORE NATURAL</p><h2>ดูแลตัวเอง<br/>ในแบบที่เรียบง่าย</h2><p>เราเชื่อว่าการดูแลตัวเองไม่จำเป็นต้องซับซ้อน เริ่มต้นจากสิ่งเล็ก ๆ ที่เลือกใช้ในทุกวัน</p><a href="#products">ค้นพบคอลเลกชัน <span>→</span></a></div></section>
  <footer id="contact" className="footer wrap"><a className="brand" href="#">natural<span>soap.</span></a><p>Simple care for everyday living.</p><small>© 2026 Natural Soap. Sample storefront.</small></footer>
  {notice&&<div className="toast" role="status">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
  {showCheckout&&<div className="overlay" onClick={()=>setShowCheckout(false)}><section className="checkout" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowCheckout(false)}>×</button><p className="eyebrow">YOUR ORDER</p><h2>ตะกร้าสินค้า</h2>{items.length===0?<p className="empty">ยังไม่มีสินค้าในตะกร้า</p>:<>{items.map(p=><div className="cartLine" key={p.sku}><div><b>{p.name}</b><small>{p.sku} · ฿{p.price}</small></div><div className="qty"><button onClick={()=>change(p.sku,-1)}>−</button>{p.qty}<button onClick={()=>change(p.sku,1)}>＋</button></div><b>฿{p.qty*p.price}</b></div>)}<div className="total"><span>ยอดรวมสินค้า</span><b>฿{total.toLocaleString("th-TH")}</b></div><p className="shippingHint">ค่าจัดส่งจะแจ้งให้ทราบภายหลัง</p><form onSubmit={submit} className="orderForm"><label>ชื่อผู้รับ<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อ-นามสกุล"/></label><label>เบอร์โทรศัพท์<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08X-XXX-XXXX"/></label><label>ที่อยู่จัดส่ง<textarea required rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"/></label><label>หมายเหตุ (ถ้ามี)<input value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></label><button className="primary full" disabled={busy}>{busy?"กำลังบันทึก...":"ยืนยันคำสั่งซื้อ · ฿"+total.toLocaleString("th-TH")}</button></form></>}</section></div>}
 </main>;
}