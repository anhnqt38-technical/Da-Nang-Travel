const paymentPanel = document.getElementById("paymentPanel");
const pageMessage = document.getElementById("pageMessage");
const paymentForm = document.getElementById("paymentForm");
const paymentAmount = document.getElementById("paymentAmount");
const amountError = document.getElementById("amountError");
const qrCode = document.getElementById("qrCode");
const qrMessage = document.getElementById("qrMessage");
const confirmPaymentButton = document.getElementById("confirmPaymentButton");
const bookingId = new URLSearchParams(window.location.search).get("booking");
const bookingStorageKey = "tourBookings";
let currentBooking = null;
let qrIsReady = false;
const fixedQrContent = "DANANGTRAVEL-DEMO|PAYMENT";

function readBookings() {
    const storedBookings = localStorage.getItem(bookingStorageKey);
    if (!storedBookings) {
        return [];
    }

    const bookings = JSON.parse(storedBookings);
    if (!Array.isArray(bookings)) {
        throw new Error("Dữ liệu đặt tour không hợp lệ.");
    }
    return bookings;
}

function showPageError(message) {
    pageMessage.textContent = message;
    paymentPanel.hidden = true;
}

function addSummaryItem(container, label, value) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value || "Chưa có thông tin";
    item.append(term, description);
    container.append(item);
}

function renderBooking(booking) {
    const summary = document.getElementById("bookingSummary");
    summary.replaceChildren();
    [
        ["Mã đơn", booking.id],
        ["Hành trình", booking.tour],
        ["Khách hàng", booking.customerName],
        ["Ngày khởi hành", booking.departureDate],
        ["Số khách", `${booking.guests} người`],
        ["Số điện thoại", booking.phone]
    ].forEach(([label, value]) => addSummaryItem(summary, label, value));

    document.getElementById("bookingStatus").textContent =
        booking.paymentStatus || booking.status || "Chờ thanh toán";
}

function updatePaymentAmount() {
    const amount = Number(paymentAmount.value);
    const validAmount = Number.isSafeInteger(amount) && amount > 0;
    amountError.textContent = validAmount || !paymentAmount.value
        ? ""
        : "Vui lòng nhập số tiền là số nguyên dương hợp lệ.";
    confirmPaymentButton.disabled = !validAmount || !qrIsReady;

    if (!validAmount) {
        qrMessage.textContent = "Mã QR demo cố định. Nhập số tiền hợp lệ để tiếp tục.";
    } else if (qrIsReady) {
        qrMessage.textContent =
            `Mã QR cố định không đổi. Số tiền mô phỏng: ${amount.toLocaleString("vi-VN")} VND.`;
    }
}

function createFixedQr() {
    if (typeof QRCode === "undefined") {
        qrMessage.textContent = "Không tải được công cụ tạo mã QR. Hãy kiểm tra kết nối rồi tải lại trang.";
        return;
    }

    try {
        new QRCode(qrCode, {
            text: fixedQrContent,
            width: 160,
            height: 160,
            correctLevel: QRCode.CorrectLevel.M
        });
        qrIsReady = true;
        updatePaymentAmount();
    } catch (error) {
        qrMessage.textContent = "Không thể tạo mã QR demo. Vui lòng thử lại.";
    }
}

if (!bookingId) {
    showPageError("Không tìm thấy mã đơn đặt tour. Hãy gửi yêu cầu đặt tour trước khi thanh toán.");
} else {
    try {
        currentBooking = readBookings().find((booking) => booking && booking.id === bookingId);
        if (!currentBooking) {
            showPageError("Không tìm thấy đơn đặt tour này. Vui lòng kiểm tra lại mã đơn.");
        } else {
            paymentPanel.hidden = false;
            renderBooking(currentBooking);

            if (currentBooking.paymentStatus === "Đã thanh toán (mô phỏng)") {
                document.getElementById("paidNotice").textContent =
                    `Đơn đã được xác nhận thanh toán mô phỏng ${Number(currentBooking.paymentAmount).toLocaleString("vi-VN")} VND. Không có giao dịch ngân hàng thật.`;
                document.getElementById("paidNotice").hidden = false;
                paymentForm.hidden = true;
            } else {
                createFixedQr();
            }
        }
    } catch (error) {
        showPageError("Không thể đọc đơn đặt tour từ bộ nhớ trình duyệt. Vui lòng kiểm tra bộ nhớ và tải lại trang.");
    }
}

paymentAmount.addEventListener("input", updatePaymentAmount);

paymentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    amountError.textContent = "";

    const amount = Number(paymentAmount.value);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
        amountError.textContent = "Vui lòng nhập số tiền là số nguyên dương hợp lệ.";
        return;
    }
    if (!qrIsReady) {
        qrMessage.textContent = "Chưa tạo được mã QR demo. Vui lòng kiểm tra lại số tiền và thử lại.";
        return;
    }
    if (!currentBooking || currentBooking.status === "Đã hủy") {
        showPageError("Đơn đặt tour không còn khả dụng để thanh toán.");
        return;
    }

    try {
        const bookings = readBookings();
        const booking = bookings.find((item) => item && item.id === bookingId);
        if (!booking || booking.status === "Đã hủy") {
            showPageError("Đơn đặt tour không còn khả dụng để thanh toán.");
            return;
        }

        booking.paymentAmount = amount;
        booking.paymentStatus = "Đã thanh toán (mô phỏng)";
        booking.status = "Đã xác nhận";
        localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));

        currentBooking = booking;
        renderBooking(booking);
        document.getElementById("paidNotice").textContent =
            `Đã xác nhận thanh toán mô phỏng ${amount.toLocaleString("vi-VN")} VND. Đây chỉ là bản demo, không có giao dịch ngân hàng thật.`;
        document.getElementById("paidNotice").hidden = false;
        paymentForm.hidden = true;
    } catch (error) {
        pageMessage.textContent = "Không thể lưu xác nhận thanh toán. Vui lòng kiểm tra bộ nhớ trình duyệt và thử lại.";
    }
});