// Nhận tour được chọn từ trang Journey.html qua URL.
const tourSelect = document.getElementById("tour");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const departureDate = document.getElementById("departureDate");
const adultGuestsInput = document.getElementById("adultGuests");
const childGuestsInput = document.getElementById("childGuests");
const totalPrice = document.getElementById("totalPrice");
const bookingStorageKey = "tourBookings";
const lastPhoneKey = "lastBookingPhone";

const params = new URLSearchParams(window.location.search);
const selectedTour = params.get("tour");

if (selectedTour && tourSelect) {
    tourSelect.value = selectedTour;
    if (tourSelect.value === selectedTour) {
        tourSelect.disabled = true;
    }
}

try {
    document.getElementById("customerName").value =
        localStorage.getItem("daNangUsername") || "";
    document.getElementById("phone").value =
        localStorage.getItem("daNangPhone") || "";
    document.getElementById("email").value =
        localStorage.getItem("daNangEmail") || "";
} catch (error) {
    bookingMessage.textContent = "Không thể đọc thông tin tài khoản đã đăng ký.";
    bookingMessage.style.color = "#c44b36";
}

if (departureDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    departureDate.min = localToday;
}

function calculatePrice() {
    if (!tourSelect || !adultGuestsInput || !childGuestsInput || !totalPrice) {
        return;
    }

    const selectedOption = tourSelect.options[tourSelect.selectedIndex];
    const adultPrice = Number(selectedOption.dataset.adultPrice) || 0;
    const childPrice = Number(selectedOption.dataset.childPrice) || 0;
    const adults = Math.max(0, Number(adultGuestsInput.value) || 0);
    const children = Math.max(0, Number(childGuestsInput.value) || 0);
    const total = adultPrice * adults + childPrice * children;
    totalPrice.textContent = `${total.toLocaleString("vi-VN")} VNĐ`;
}

if (tourSelect && adultGuestsInput && childGuestsInput) {
    tourSelect.addEventListener("change", calculatePrice);
    adultGuestsInput.addEventListener("input", calculatePrice);
    childGuestsInput.addEventListener("input", calculatePrice);
    calculatePrice();
}

function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
}

function formatDate(value) {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return y && m && d ? `${d}/${m}/${y}` : value;
}

function getGuestCounts(booking) {
    const adults = booking.adultGuests === undefined
        ? Number(booking.guests || 0)
        : Number(booking.adultGuests) || 0;
    const children = Number(booking.childGuests) || 0;
    return { adults, children };
}

function guestSummary(booking) {
    const guests = getGuestCounts(booking);
    return `${guests.adults} người lớn, ${guests.children} trẻ em`;
}

function readBookings() {
    const storedBookings = localStorage.getItem(bookingStorageKey);
    if (!storedBookings) {
        return [];
    }

    const bookings = JSON.parse(storedBookings);
    if (!Array.isArray(bookings)) {
        throw new Error("Dữ liệu đặt tour không hợp lệ.");
    }

    let needsSave = false;
    const normalizedBookings = bookings.map((booking) => {
        if (!booking || typeof booking !== "object") {
            throw new Error("Dữ liệu đặt tour không hợp lệ.");
        }

        if (!booking.id) {
            booking.id = `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            needsSave = true;
        }
        if (!booking.status) {
            booking.status = "Chờ xác nhận";
            needsSave = true;
        }
        return booking;
    });

    if (needsSave) {
        localStorage.setItem(bookingStorageKey, JSON.stringify(normalizedBookings));
    }
    return normalizedBookings;
}

function saveBookings(bookings) {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
}

function showBookingError(error) {
    bookingMessage.textContent =
        `Không thể lưu đơn đặt tour. Vui lòng kiểm tra bộ nhớ trình duyệt và thử lại. ${error.message}`;
    bookingMessage.style.color = "#c44b36";
}

// Báo cho khách khi admin đã duyệt hoặc từ chối đơn (mỗi đơn chỉ báo một lần).
function notifyReviewedBookings() {
    try {
        const phone = normalizePhone(localStorage.getItem(lastPhoneKey));
        if (!phone) {
            return;
        }

        const bookings = readBookings();
        const toNotify = bookings.filter((booking) =>
            booking.reviewedAt && booking.notified === false &&
            phone === normalizePhone(booking.phone) &&
            (booking.status === "Đã xác nhận" || booking.status === "Từ chối")
        );
        if (toNotify.length === 0) {
            return;
        }

        toNotify.forEach((booking) => {
            booking.notified = true;
        });
        saveBookings(bookings);

        toNotify.forEach((booking) => {
            if (booking.status === "Đã xác nhận") {
                alert(
                    "✓ Đơn đặt tour của bạn đã được xác nhận!\n\n" +
                    `Hành trình: ${booking.tour}\n` +
                    `Ngày khởi hành: ${formatDate(booking.departureDate)}\n` +
                    `Số khách: ${guestSummary(booking)}\n\n` +
                    "Cảm ơn bạn đã chọn Đà Nẵng Travel."
                );
            } else {
                alert(
                    "Rất tiếc, đơn đặt tour của bạn chưa được chấp nhận.\n\n" +
                    `Hành trình: ${booking.tour}\n` +
                    (booking.rejectReason ? `Lý do: ${booking.rejectReason}\n` : "") +
                    "\nVui lòng liên hệ 0987654321 để được hỗ trợ."
                );
            }
        });

        // Sau thông báo xác nhận, chuyển khách sang trang chọn đặt cọc / thanh toán toàn bộ.
        const needPayment = toNotify.find((booking) =>
            booking.status === "Đã xác nhận" && booking.paymentStatus !== "Đã thanh toán đủ");
        if (needPayment) {
            window.location.href = `Thanhtoan.html?booking=${encodeURIComponent(needPayment.id)}`;
        }
    } catch (error) {
        console.error(error);
    }
}

if (bookingForm) {
    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const selectedOption = tourSelect.options[tourSelect.selectedIndex];
        const adults = Number(adultGuestsInput.value);
        const children = Number(childGuestsInput.value);
        const booking = {
            id: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tour: selectedOption.text.trim(),
            unitPrice: Number(selectedOption.dataset.adultPrice) || 0,
            adultUnitPrice: Number(selectedOption.dataset.adultPrice) || 0,
            childUnitPrice: Number(selectedOption.dataset.childPrice) || 0,
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            departureDate: departureDate.value,
            adultGuests: adults,
            childGuests: children,
            guests: adults + children,
            createdAt: new Date().toISOString(),
            status: "Chờ xác nhận"
        };

        if (!tourSelect.value || !booking.customerName || !booking.phone || !booking.departureDate ||
            !Number.isInteger(adults) || adults < 0 ||
            !Number.isInteger(children) || children < 0 || adults + children < 1) {
            bookingMessage.textContent = "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.";
            bookingMessage.style.color = "#c44b36";
            return;
        }

        try {
            const bookings = readBookings();
            bookings.push(booking);
            saveBookings(bookings);
            localStorage.setItem(lastPhoneKey, booking.phone);

            bookingForm.reset();
            if (selectedTour && tourSelect.value !== selectedTour) {
                tourSelect.value = selectedTour;
            }
            calculatePrice();
            bookingMessage.textContent = "✓ Gửi yêu cầu đặt tour thành công! Vui lòng chờ Đà Nẵng Travel xem xét và xác nhận đơn.";
            bookingMessage.style.color = "#0d8a7a";
        } catch (error) {
            showBookingError(error);
        }
    });
}

// Kiểm tra thông báo khi mở trang, và khi admin duyệt đơn lúc trang đang mở ở tab khác.
notifyReviewedBookings();
window.addEventListener("storage", function(event) {
    if (event.key === bookingStorageKey) {
        notifyReviewedBookings();
    }
});