const paymentPanel = document.getElementById("paymentPanel");
const pageMessage = document.getElementById("pageMessage");
const paymentForm = document.getElementById("paymentForm");
const paymentOptions = document.getElementById("paymentOptions");
const paidNotice = document.getElementById("paidNotice");
const qrCode = document.getElementById("qrCode");
const qrMessage = document.getElementById("qrMessage");
const confirmPaymentButton = document.getElementById("confirmPaymentButton");
const bookingId = new URLSearchParams(window.location.search).get("booking");
const bookingStorageKey = "tourBookings";
const fixedQrContent = "DANANGTRAVEL-DEMO|PAYMENT";
const DAYS_BEFORE_TOUR = 3;   // Hạn thanh toán phần còn lại: trước ngày đi 3 ngày

// Dự phòng cho đơn cũ chưa lưu đơn giá
const priceByTour = {
    "Đà Nẵng – Bà Nà – Hội An (3 ngày 2 đêm)": { adult: 3500000, child: 1500000 },
    "Một ngày ở Đà Nẵng": { adult: 1500000, child: 700000 },
    "Hẹn hò cùng phố cổ Hội An": { adult: 1800000, child: 1000000 }
};

let currentBooking = null;
let qrIsReady = false;

/* ---------- Dữ liệu ---------- */
function readBookings() {
    const stored = localStorage.getItem(bookingStorageKey);
    if (!stored) return [];
    const bookings = JSON.parse(stored);
    if (!Array.isArray(bookings)) throw new Error("Dữ liệu đặt tour không hợp lệ.");
    return bookings;
}

function saveBookings(bookings) {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
}

function showPageError(message) {
    pageMessage.textContent = message;
    paymentPanel.hidden = true;
}

/* ---------- Tính tiền & hạn thanh toán ---------- */
function money(value) {
    return `${Number(value).toLocaleString("vi-VN")} VND`;
}

function parseLocalDate(value) {
    const [y, m, d] = String(value || "").split("-").map(Number);
    return y && m && d ? new Date(y, m - 1, d) : null;
}

function toIso(date) {
    const p = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function formatDate(date) {
    const p = (n) => String(n).padStart(2, "0");
    return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function getPaymentInfo(booking) {
    const tourPrice = priceByTour[booking.tour] || {};
    const adultUnitPrice = Number(booking.adultUnitPrice) ||
        Number(booking.unitPrice) || tourPrice.adult || 0;
    const childUnitPrice = Number(booking.childUnitPrice) || tourPrice.child || 0;
    const adultGuests = booking.adultGuests === undefined
        ? Number(booking.guests || 1)
        : Number(booking.adultGuests);
    const childGuests = Number(booking.childGuests) || 0;
    const total = adultUnitPrice * adultGuests + childUnitPrice * childGuests;
    const paid = Number(booking.paidAmount) || 0;
    const departure = parseLocalDate(booking.departureDate);
    const deadline = departure
        ? new Date(departure.getFullYear(), departure.getMonth(), departure.getDate() - DAYS_BEFORE_TOUR)
        : null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return {
        total,
        adultGuests,
        childGuests,
        paid,
        remaining: Math.max(0, total - paid),
        deposit: Math.ceil(total / 2),
        deadline,
        fullyPaid: total > 0 && paid >= total,
        isRemainingStage: paid > 0 && paid < total,
        // Chỉ cho đặt cọc nếu còn kịp hạn thanh toán phần còn lại
        canDeposit: !deadline || today < deadline,
        overdue: !!deadline && today > deadline
    };
}

/* ---------- Hiển thị ---------- */
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

function renderBooking(booking, info) {
    const summary = document.getElementById("bookingSummary");
    summary.replaceChildren();
    const departure = parseLocalDate(booking.departureDate);
    const rows = [
        ["Mã đơn", booking.id],
        ["Hành trình", booking.tour],
        ["Khách hàng", booking.customerName],
        ["Ngày khởi hành", departure ? formatDate(departure) : booking.departureDate],
        ["Người lớn", `${info.adultGuests} người`],
        ["Trẻ em", `${info.childGuests} người`],
        ["Số điện thoại", booking.phone],
        ["Tổng tiền", money(info.total)],
        ["Đã thanh toán", money(info.paid)]
    ];
    if (info.paid > 0 && !info.fullyPaid) {
        rows.push(["Còn lại", money(info.remaining)]);
        if (info.deadline) rows.push(["Hạn thanh toán phần còn lại", formatDate(info.deadline)]);
    }
    rows.forEach(([label, value]) => addSummaryItem(summary, label, value));

    document.getElementById("bookingStatus").textContent =
        booking.paymentStatus || "Chưa thanh toán";
}

function makeOption(value, title, amount, note, disabled, checked) {
    const label = document.createElement("label");
    label.className = "option-card" + (disabled ? " is-disabled" : "");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "paymentOption";
    input.value = value;
    input.disabled = disabled;
    input.checked = checked;

    const body = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = title;
    const price = document.createElement("span");
    price.className = "option-amount";
    price.textContent = money(amount);
    const small = document.createElement("small");
    small.textContent = note;
    body.append(strong, price, small);

    label.append(input, body);
    return label;
}

function renderOptions(info) {
    paymentOptions.replaceChildren();
    const legend = document.createElement("legend");
    legend.textContent = info.isRemainingStage
        ? "Thanh toán phần còn lại"
        : "Chọn hình thức thanh toán";
    paymentOptions.append(legend);

    if (info.isRemainingStage) {
        paymentOptions.append(makeOption(
            "remaining", "Thanh toán phần còn lại", info.remaining,
            "Hoàn tất 50% còn lại của đơn.", false, true
        ));
        return;
    }

    const depositNote = info.canDeposit
        ? `Thanh toán 50% bây giờ. Phần còn lại ${money(info.total - info.deposit)} cần thanh toán trước ngày ${info.deadline ? formatDate(info.deadline) : "khởi hành"} (trước ngày đi ${DAYS_BEFORE_TOUR} ngày).`
        : `Không áp dụng vì đã quá sát ngày khởi hành (cần thanh toán đủ trước ${DAYS_BEFORE_TOUR} ngày). Vui lòng chọn thanh toán toàn bộ.`;

    paymentOptions.append(
        makeOption("deposit", "Thanh toán đặt cọc (50%)", info.deposit, depositNote, !info.canDeposit, false),
        makeOption("full", "Thanh toán toàn bộ", info.total, "Thanh toán 100% một lần, không cần thanh toán thêm.", false, false)
    );
}

function selectedAmount(info) {
    const checked = paymentForm.querySelector('input[name="paymentOption"]:checked');
    if (!checked) return null;
    if (checked.value === "deposit") return { type: "deposit", amount: info.deposit };
    if (checked.value === "full") return { type: "full", amount: info.total };
    return { type: "remaining", amount: info.remaining };
}

function updateSelection() {
    const info = getPaymentInfo(currentBooking);
    const choice = selectedAmount(info);
    confirmPaymentButton.disabled = !choice || info.total <= 0;
    qrMessage.textContent = choice
        ? `Số tiền cần chuyển: ${money(choice.amount)}. Mã QR cố định, không đổi theo số tiền.`
        : "Vui lòng chọn hình thức thanh toán.";
}

function createFixedQr() {
    if (qrIsReady) return;
    if (typeof QRCode === "undefined") {
        qrMessage.textContent = "Không tải được mã QR demo. Bạn vẫn có thể xác nhận thanh toán mô phỏng.";
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
    } catch (error) {
        qrMessage.textContent = "Không thể tạo mã QR demo. Vui lòng thử lại.";
    }
}

function refresh() {
    const info = getPaymentInfo(currentBooking);
    renderBooking(currentBooking, info);
    pageMessage.textContent = "";

    if (info.fullyPaid) {
        paidNotice.textContent =
            `Đã thanh toán đủ ${money(info.total)}. Cảm ơn bạn đã chọn Đà Nẵng Travel!`;
        paidNotice.hidden = false;
        paymentForm.hidden = true;
        return;
    }

    if (info.isRemainingStage) {
        paidNotice.textContent =
            `Đã đặt cọc ${money(info.paid)}. Còn lại ${money(info.remaining)}, thanh toán trước ngày ${info.deadline ? formatDate(info.deadline) : "khởi hành"}.`;
        paidNotice.hidden = false;

        if (info.overdue) {
            pageMessage.textContent =
                "Đã quá hạn thanh toán phần còn lại. Vui lòng liên hệ 0987654321 để được hỗ trợ.";
            paymentForm.hidden = true;
            return;
        }
    } else {
        paidNotice.hidden = true;
    }

    paymentForm.hidden = false;
    renderOptions(info);
    createFixedQr();
    updateSelection();
}

/* ---------- Khởi tạo ---------- */
if (!bookingId) {
    showPageError("Không tìm thấy mã đơn đặt tour. Hãy gửi yêu cầu đặt tour trước khi thanh toán.");
} else {
    try {
        currentBooking = readBookings().find((b) => b && b.id === bookingId);
        if (!currentBooking) {
            showPageError("Không tìm thấy đơn đặt tour này. Vui lòng kiểm tra lại mã đơn.");
        } else if (currentBooking.status === "Chờ xác nhận") {
            showPageError("Đơn của bạn đang chờ Đà Nẵng Travel duyệt. Bạn sẽ thanh toán được sau khi đơn được xác nhận.");
        } else if (currentBooking.status === "Từ chối" || currentBooking.status === "Đã hủy") {
            showPageError("Đơn đặt tour này không còn khả dụng để thanh toán.");
        } else {
            paymentPanel.hidden = false;
            refresh();
        }
    } catch (error) {
        showPageError("Không thể đọc đơn đặt tour từ bộ nhớ trình duyệt. Vui lòng kiểm tra bộ nhớ và tải lại trang.");
    }
}

paymentForm.addEventListener("change", updateSelection);

paymentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!currentBooking) return;

    try {
        const bookings = readBookings();
        const booking = bookings.find((b) => b && b.id === bookingId);
        if (!booking || booking.status !== "Đã xác nhận") {
            showPageError("Đơn đặt tour không còn khả dụng để thanh toán.");
            return;
        }

        const info = getPaymentInfo(booking);
        const choice = selectedAmount(info);
        if (!choice || info.total <= 0) return;
        if (choice.type === "deposit" && !info.canDeposit) return;

        const nowIso = new Date().toISOString();
        if (choice.type === "deposit") {
            booking.paidAmount = choice.amount;
            booking.paymentPlan = "deposit";
            booking.paymentStatus = "Đã đặt cọc";
            booking.depositPaidAt = nowIso;
            if (info.deadline) booking.remainingDueDate = toIso(info.deadline);
        } else {
            booking.paidAmount = info.total;
            booking.paymentPlan = booking.paymentPlan || "full";
            booking.paymentStatus = "Đã thanh toán đủ";
            booking.paidAt = nowIso;
        }

        saveBookings(bookings);
        currentBooking = booking;
        refresh();

        if (choice.type === "deposit") {
            alert(
                `✓ Đã ghi nhận đặt cọc ${money(choice.amount)}.\n\n` +
                `Số tiền còn lại cần thanh toán: ${money(info.total - choice.amount)}.` +
                (info.deadline
                    ? `\nHạn thanh toán: ${formatDate(info.deadline)}.`
                    : "") +
                "\n\nNhấn OK để về trang chủ. Nếu muốn thanh toán tiếp, hãy vào Thông tin tour và chọn \"Thanh toán phần còn lại\"."
            );
            window.location.href = "index.html";
            return;
        }

        alert(`✓ Đã thanh toán ${money(choice.amount)}. Cảm ơn bạn! Nhấn OK để về trang chủ.`);
        window.location.href = "index.html";
    } catch (error) {
        pageMessage.textContent = "Không thể lưu xác nhận thanh toán. Vui lòng kiểm tra bộ nhớ trình duyệt và thử lại.";
    }
});