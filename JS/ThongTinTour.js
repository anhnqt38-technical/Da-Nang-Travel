const tourDetails = document.getElementById("tourDetails");
const priceByTour = {
    "Đà Nẵng – Bà Nà – Hội An (3 ngày 2 đêm)": { adult: 3500000, child: 1500000 },
    "Một ngày ở Đà Nẵng": { adult: 1500000, child: 700000 },
    "Hẹn hò cùng phố cổ Hội An": { adult: 1800000, child: 1000000 }
};

function showTourNotice(message, includeLoginLink = false) {
    const notice = document.createElement("p");
    notice.className = "account-notice";
    notice.append(document.createTextNode(message));

    if (includeLoginLink) {
        const loginLink = document.createElement("a");
        loginLink.href = "Dangnhap.html";
        loginLink.textContent = "Đăng nhập";
        notice.append(document.createTextNode(" "), loginLink, document.createTextNode(" để xem các tour đã đặt."));
    }

    tourDetails.replaceChildren(notice);
}

function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
}

function formatDate(value) {
    if (!value) {
        return "Chưa có thông tin";
    }

    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
}

function appendTourLine(card, label, value) {
    const line = document.createElement("p");
    const labelElement = document.createElement("strong");
    labelElement.textContent = `${label}: `;
    line.append(labelElement, document.createTextNode(value || "Chưa có thông tin"));
    card.append(line);
}

function formatMoney(value) {
    return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
}

function getBookingAmounts(booking) {
    const tourPrice = priceByTour[booking.tour] || {};
    const adultUnitPrice = Number(booking.adultUnitPrice) ||
        Number(booking.unitPrice) || tourPrice.adult || 0;
    const childUnitPrice = Number(booking.childUnitPrice) || tourPrice.child || 0;
    const adultGuests = booking.adultGuests === undefined
        ? Number(booking.guests || 1)
        : Number(booking.adultGuests);
    const childGuests = Number(booking.childGuests) || 0;
    const total = adultUnitPrice * adultGuests + childUnitPrice * childGuests;
    const paid = Math.max(0, Number(booking.paidAmount) || 0);
    const remaining = Math.max(0, total - paid);
    return { adultGuests, childGuests, adultUnitPrice, childUnitPrice, total, paid, remaining };
}

function renderPaymentInfo(card, booking, amounts) {
    if (booking.status !== "Đã xác nhận") {
        return;
    }

    const { total, paid, remaining } = amounts;

    if (total > 0 && remaining === 0) {
        appendTourLine(card, "Thanh toán", `Đã thanh toán đủ ${formatMoney(total)}`);
        return;
    }

    const paymentNotice = document.createElement("p");
    paymentNotice.className = "tour-payment-notice";
    if (paid > 0 && total > 0) {
        const dueDate = booking.remainingDueDate
            ? ` Hạn thanh toán: ${formatDate(booking.remainingDueDate)}.`
            : "";
        paymentNotice.textContent =
            `Gói tour của bạn đã được đặt cọc một nửa (${formatMoney(paid)}). ` +
            `Số tiền còn phải thanh toán là ${formatMoney(remaining)}.${dueDate}`;
    } else {
        paymentNotice.textContent = booking.paymentStatus
            ? `Trạng thái thanh toán: ${booking.paymentStatus}.`
            : "Tour đã được xác nhận. Bạn chưa thanh toán cho đơn này.";
    }
    card.append(paymentNotice);

    if (booking.id) {
        const paymentLink = document.createElement("a");
        paymentLink.className = "tour-payment-link";
        paymentLink.href = `Thanhtoan.html?booking=${encodeURIComponent(booking.id)}`;
        paymentLink.textContent = paid > 0
            ? "Thanh toán phần còn lại"
            : "Thanh toán";
        card.append(paymentLink);
    }
}

try {
    const isLoggedIn = localStorage.getItem("daNangLoggedIn") === "true";
    const phone = normalizePhone(localStorage.getItem("daNangPhone"));

    if (!isLoggedIn || !phone) {
        showTourNotice("Bạn cần đăng nhập để xem thông tin tour.", true);
    } else {
        const savedBookings = localStorage.getItem("tourBookings");
        const bookings = savedBookings ? JSON.parse(savedBookings) : [];

        if (!Array.isArray(bookings)) {
            throw new Error("Dữ liệu đặt tour không hợp lệ.");
        }

        const matchingBookings = bookings.filter((booking) =>
            booking && typeof booking === "object" &&
            normalizePhone(booking.phone) === phone
        );

        if (matchingBookings.length === 0) {
            showTourNotice("Bạn chưa có đơn đặt tour nào. Hãy khám phá các hành trình và đặt tour phù hợp.");
        } else {
            matchingBookings.forEach((booking) => {
                const card = document.createElement("article");
                card.className = "tour-card";
                const title = document.createElement("h2");
                title.textContent = booking.tour || "Tour chưa có tên";
                card.append(title);

                appendTourLine(card, "Ngày khởi hành", formatDate(booking.departureDate));
                const amounts = getBookingAmounts(booking);
                appendTourLine(card, "Người lớn", `${amounts.adultGuests} người`);
                appendTourLine(card, "Trẻ em", `${amounts.childGuests} người`);
                appendTourLine(card, "Khách hàng", booking.customerName);
                appendTourLine(card, "Trạng thái", booking.status || "Chờ xác nhận");

                if (amounts.total > 0) {
                    appendTourLine(card, "Tổng tiền", formatMoney(amounts.total));
                }

                if (booking.paymentStatus) {
                    appendTourLine(card, "Thanh toán", booking.paymentStatus);
                }
                if (booking.note) {
                    appendTourLine(card, "Yêu cầu thêm", booking.note);
                }
                renderPaymentInfo(card, booking, amounts);

                tourDetails.append(card);
            });
        }
    }
} catch (error) {
    console.error(error);
    showTourNotice("Không thể đọc thông tin đặt tour. Dữ liệu lưu trên trình duyệt có thể bị lỗi.");
}
