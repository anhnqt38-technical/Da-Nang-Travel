// Khi mở trang lên, hiển thị đơn hàng
document.addEventListener("DOMContentLoaded", function() {
    hienThiDonHang();
});

function hienThiDonHang() {
    let container = document.getElementById("danh-sach-don");

    // Lấy dữ liệu đơn hàng do bạn của bạn đặt (lưu qua localStorage)
    // Nếu chưa có, tạo mẫu 1 đơn để test giao diện
    let donHang = JSON.parse(localStorage.getItem("thongTinDatTour")) || {
        ten: "Nguyễn Văn A",
        sdt: "0905123456",
        hanhTrinh: "Đà Nẵng – Bà Nà – Hội An",
        soKhach: 2,
        trangthai: "Đã xác nhận"
    };

    container.innerHTML = `
        <div class="the-don">
            <p><strong>Khách hàng:</strong> ${donHang.ten}</p>
            <p><strong>Số điện thoại:</strong> ${donHang.sdt}</p>
            <p><strong>Hành trình:</strong> ${donHang.hanhTrinh}</p>
            <p><strong>Số lượng khách:</strong> <span id="so-khach-hien-tai">${donHang.soKhach}</span> người</p>
            <p><strong>Trạng thái:</strong> <span style="color: green; font-weight: bold;">${donHang.trangthai}</span></p>
            
            <div class="nut-bam">
                <button class="btn-sua" onclick="suaSoLuongKhach()">Chỉnh sửa / Thêm người</button>
                <button class="btn-huy" onclick="huyTour()">Hủy chuyến</button>
            </div>
        </div>
    `;
}

// 1. CHỨC NĂNG SỬA (Thêm bớt số lượng người đi)
function suaSoLuongKhach() {
    let soMoi = prompt("Nhập số lượng khách mới muốn thay đổi:");
    if (soMoi !== null && soMoi > 0) {
        let donHang = JSON.parse(localStorage.getItem("thongTinDatTour")) || { ten: "Nguyễn Văn A", sdt: "0905123456", hanhTrinh: "Đà Nẵng – Bà Nà – Hội An", soKhach: 2, trangthai: "Đã xác nhận" };

        donHang.soKhach = soMoi;
        localStorage.setItem("thongTinDatTour", JSON.stringify(donHang));

        alert("Cập nhật số lượng người thành công!");
        hienThiDonHang();
    }
}

// 2. CHỨC NĂNG HỦY CHUYẾN
function huyTour() {
    if (confirm("Bạn có chắc chắn muốn hủy chuyến tour này không?")) {
        let donHang = JSON.parse(localStorage.getItem("thongTinDatTour")) || { ten: "Nguyễn Văn A", sdt: "0905123456", hanhTrinh: "Đà Nẵng – Bà Nà – Hội An", soKhach: 2, trangthai: "Đã xác nhận" };

        donHang.trangthai = "Đã hủy";
        localStorage.setItem("thongTinDatTour", JSON.stringify(donHang));

        alert("Đã hủy tour thành công!");
        hienThiDonHang();
    }
}