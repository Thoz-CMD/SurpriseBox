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

// รับค่าจาก Local Storage
const selectedProductImage = localStorage.getItem('selectedProductImage'); // รับเส้นทางภาพ
const selectedProductName = localStorage.getItem('selectedProductName'); // รับชื่อสินค้า
const selectedProductPrice = parseFloat(localStorage.getItem('selectedProductPrice')); // รับราคาแล้วแปลงเป็น float
const stockQuantity = parseInt(localStorage.getItem('selectedProductStock')); // รับจำนวนสินค้าคงเหลือแล้วแปลงเป็น integer

// แสดงข้อมูลในหน้า Payment
document.getElementById('selected-product-image').src = selectedProductImage; // แสดงภาพสินค้าที่เลือก
document.getElementById('product-name').innerText = selectedProductName; // แสดงชื่อสินค้า
document.getElementById('product-price').innerText = selectedProductPrice + ' ฿'; // แสดงราคา
document.getElementById('stock-quantity').innerText = stockQuantity; // แสดงจำนวนสินค้าคงเหลือ

// ตรวจสอบจำนวนสินค้าคงเหลือ
if (stockQuantity <= 0) {
    alert("สินค้าหมดแล้ว ไม่สามารถทำรายการชำระเงินได้"); // แจ้งเตือนหากสินค้าหมด
    document.getElementById('confirmBtn').disabled = true; // ปิดการใช้งานปุ่มยืนยัน
} else {
    document.getElementById('confirmBtn').disabled = false; // เปิดการใช้งานปุ่มยืนยัน
}

// ตั้งค่าเริ่มต้นของจำนวนสินค้า
let quantity = 1; // จำนวนเริ่มต้นของสินค้า
const quantityElement = document.getElementById('quantity'); // อ้างอิงถึง element ที่แสดงจำนวน
const productPriceElement = document.getElementById('product-price'); // อ้างอิงถึง element ที่แสดงราคา
const totalPriceElement = document.getElementById('totalPrice'); // อ้างอิงถึง element ที่แสดงยอดรวม
let totalPrice = selectedProductPrice * quantity; // คำนวณยอดรวม
totalPriceElement.innerText = totalPrice; // แสดงยอดรวม

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
