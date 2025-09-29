// ฟังก์ชันเลือกภาพสินค้าที่เลือก
function selectProductImage(imagePath, productName, price, stock) {
    // บันทึกข้อมูลสินค้าที่เลือกลงใน localStorage
    localStorage.setItem('selectedProductImage', imagePath); // บันทึกเส้นทางภาพ
    localStorage.setItem('selectedProductName', productName); // บันทึกชื่อสินค้า
    localStorage.setItem('selectedProductPrice', price); // บันทึกราคา
    localStorage.setItem('selectedProductStock', stock); // บันทึกจำนวนสินค้าคงเหลือ
    // นำทางไปยังหน้า payment.html
    window.location.href = 'payment.html'; // เปลี่ยนเส้นทางไปที่หน้า payment
}

// ตรวจสอบว่าเป็นหน้า payment หรือไม่ (ลด error เวลาสคริปต์ถูกรันบนหน้าอื่น)
const isPaymentPage = /payment\.html$/i.test(window.location.pathname);

// โหลดข้อมูลจาก Local Storage (อาจเป็น null หากผู้ใช้เข้ามาหน้า payment โดยตรง)
const selectedProductImage = localStorage.getItem('selectedProductImage') || ''; // รับเส้นทางภาพ
const selectedProductName = localStorage.getItem('selectedProductName') || '-'; // รับชื่อสินค้า
const selectedProductPriceRaw = localStorage.getItem('selectedProductPrice');
const stockQuantityRaw = localStorage.getItem('selectedProductStock');
const selectedProductPrice = selectedProductPriceRaw ? parseFloat(selectedProductPriceRaw) : 0; // ราคาเริ่มต้น 0 หากไม่มี
const stockQuantity = stockQuantityRaw ? parseInt(stockQuantityRaw) : 0; // สต็อก 0 หากไม่มี

// ทำงานเฉพาะเมื่อเป็นหน้า payment.html และ element มีอยู่จริง
if (isPaymentPage) {
    document.addEventListener('DOMContentLoaded', () => {
        const imgEl = document.getElementById('selected-product-image');
        const nameEl = document.getElementById('product-name');
        const priceEl = document.getElementById('product-price');
        const stockEl = document.getElementById('stock-quantity');
        const confirmBtnEl = document.getElementById('confirmBtn');
        const outOfStockMsgId = 'out-of-stock-msg';
        let msgEl = document.getElementById(outOfStockMsgId);
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.id = outOfStockMsgId;
            msgEl.style.color = 'red';
            msgEl.style.fontWeight = 'bold';
            const nameElPos = document.getElementById('product-name');
            if (nameElPos && nameElPos.parentElement) {
                nameElPos.parentElement.insertBefore(msgEl, nameElPos.nextSibling);
            }
        }
        // redirect ถ้าไม่มีข้อมูลสินค้าเลย (เข้าตรง ๆ)
        if (!selectedProductImage && selectedProductName === '-' && selectedProductPrice === 0) {
            msgEl.textContent = 'ยังไม่ได้เลือกสินค้า กำลังกลับไปหน้าเลือกสินค้า...';
            setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            return; // ไม่ต้องทำงานต่อ
        }
        if (imgEl && selectedProductImage) imgEl.src = selectedProductImage;
        if (nameEl) nameEl.innerText = selectedProductName;
        if (priceEl) priceEl.innerText = selectedProductPrice + ' ฿';
        if (stockEl) stockEl.innerText = stockQuantity;

        if (confirmBtnEl) {
            if (stockQuantity <= 0) {
                msgEl.textContent = 'สินค้าหมดแล้ว';
                confirmBtnEl.disabled = true;
            } else {
                msgEl.textContent = '';
                confirmBtnEl.disabled = false;
            }
        }
    });
}

// ตั้งค่าเริ่มต้นของจำนวนสินค้า
let quantity = 1; // จำนวนเริ่มต้นของสินค้า
const quantityElement = document.getElementById('quantity'); // อ้างอิงถึง element ที่แสดงจำนวน
const productPriceElement = document.getElementById('product-price'); // อ้างอิงถึง element ที่แสดงราคา
const totalPriceElement = document.getElementById('totalPrice'); // อ้างอิงถึง element ที่แสดงยอดรวม
let totalPrice = selectedProductPrice * quantity; // คำนวณยอดรวม
if (totalPriceElement) totalPriceElement.innerText = totalPrice; // แสดงยอดรวม (มีเงื่อนไขป้องกัน null)

// ฟังก์ชันเพิ่มจำนวนสินค้า
function increaseQuantity() {
    if (quantity < stockQuantity) { // ตรวจสอบว่าจำนวนไม่เกินสินค้าคงเหลือ
        quantity++; // เพิ่มจำนวนสินค้า
        updateQuantity(); // อัปเดตจำนวนและราคา
    } else if (stockQuantity <= 0) {
        alert("สินค้าหมดแล้ว ไม่สามารถเพิ่มจำนวนสินค้าได้"); // แจ้งเตือนหากสินค้าหมด
    }
}

// ฟังก์ชันลดจำนวนสินค้า
function decreaseQuantity() {
    if (quantity > 1) { // ป้องกันไม่ให้จำนวนลดต่ำกว่า 1
        quantity--; // ลดจำนวนสินค้า
        updateQuantity(); // อัปเดตจำนวนและราคา
    }
}

// ฟังก์ชันอัปเดตจำนวนสินค้าและราคา
function updateQuantity() {
    quantityElement.innerText = quantity; // อัปเดตการแสดงผลจำนวนสินค้า
    totalPrice = selectedProductPrice * quantity; // คำนวณยอดรวมใหม่
    productPriceElement.innerText = totalPrice + ' ฿'; // อัปเดตการแสดงผลราคาสินค้า
    totalPriceElement.innerText = totalPrice; // อัปเดตการแสดงผลยอดรวม
}

// แสดงป๊อปอัป
function showPopup() {
    if (stockQuantity > 0) { // ตรวจสอบว่าสินค้ามีในสต็อก
        document.getElementById('cashPopup').classList.add('show'); // แสดงป๊อปอัป
        updateQuantity(); // อัปเดตราคาในป๊อปอัป
    } else {
        alert("สินค้าหมดแล้ว ไม่สามารถทำรายการชำระเงินได้"); // แจ้งเตือนหากสินค้าหมด
    }
}

// ซ่อนป๊อปอัป
function closePopup() {
    document.getElementById('cashPopup').classList.remove('show'); // ซ่อนป๊อปอัป
    document.getElementById('insertedAmount').innerText = '0'; // เคลียร์จำนวนเงินที่ใส่
    document.getElementById('changeAmount').style.display = 'none'; // ซ่อนเงินทอน
    document.getElementById('confirmBtn').style.display = 'none'; // ซ่อนปุ่มยืนยัน
}

// ฟังก์ชันใส่เงิน
let insertedAmount = 0; // จำนวนเงินที่ใส่เริ่มต้น
function insertCash(amount) {
    insertedAmount += amount; // เพิ่มจำนวนเงินที่ใส่
    document.getElementById('insertedAmount').innerText = insertedAmount; // อัปเดตการแสดงผลจำนวนเงินที่ใส่
    checkPaymentStatus(); // ตรวจสอบสถานะการชำระเงิน
}

// ฟังก์ชันตรวจสอบสถานะการชำระเงิน
function checkPaymentStatus() {
    if (insertedAmount >= totalPrice) { // ตรวจสอบว่าจำนวนเงินที่ใส่เพียงพอหรือไม่
        const change = insertedAmount - totalPrice; // คำนวณเงินทอน
        document.getElementById('changeAmount').innerText = 'เงินทอน: ' + change + ' ฿'; // แสดงเงินทอน
        document.getElementById('changeAmount').style.display = 'block'; // แสดงเงินทอน
        document.getElementById('confirmBtn').style.display = 'block'; // แสดงปุ่มยืนยัน
    } else {
        document.getElementById('changeAmount').style.display = 'none'; // ซ่อนเงินทอน
        document.getElementById('confirmBtn').style.display = 'none'; // ซ่อนปุ่มยืนยัน
    }
}

// ฟังก์ชันยกเลิกการชำระเงิน
function cancelPayment() {
    insertedAmount = 0; // ตั้งค่าจำนวนเงินที่ใส่กลับเป็นศูนย์
    document.getElementById('insertedAmount').innerText = insertedAmount; // อัปเดตแสดงผลจำนวนเงินที่ใส่
    document.getElementById('confirmBtn').style.display = 'none'; // ซ่อนปุ่มยืนยัน
    closePopup(); // ปิดป๊อปอัป
}

// ฟังก์ชันยืนยันการชำระเงิน
function confirmPayment() {
    closePopup(); // ปิดป๊อปอัป
    window.location.href = "success.html"; // เปลี่ยนเส้นทางไปยังหน้า success
}

// ฟังก์ชันแสดงป๊อปอัปสำหรับ PromptPay
function showPromptPayPopup() {
    document.getElementById('promptPayPopup').classList.add('show'); // แสดงป๊อปอัปสำหรับ PromptPay
}

// ฟังก์ชันซ่อนป๊อปอัปสำหรับ PromptPay
function closePromptPayPopup() {
    document.getElementById('promptPayPopup').classList.remove('show'); // ซ่อนป๊อปอัปสำหรับ PromptPay
}

// ฟังก์ชันยืนยันการชำระเงิน PromptPay
function confirmPromptPayPayment() {
    closePromptPayPopup(); // ปิดป๊อปอัป
    window.location.href = "success.html"; // เปลี่ยนเส้นทางไปยังหน้า success
}
