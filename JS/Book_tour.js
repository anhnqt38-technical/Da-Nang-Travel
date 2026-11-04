// Nhận tour được chọn từ trang Journey.html qua URL.
const tourSelect = document.getElementById("tour");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const bookingSubmitButton = bookingForm?.querySelector('button[type="submit"]');
const departureDate = document.getElementById("departureDate");
const guestsInput = document.getElementById("guests");
const totalPrice = document.getElementById("totalPrice");
const bookingList = document.getElementById("bookingList");
const bookingListMessage = document.getElementById("bookingListMessage");
const bookingLookupForm = document.getElementById("bookingLookupForm");
const lookupPhone = document.getElementById("lookupPhone");
const bookingStorageKey = "tourBookings";
const lastPhoneKey = "lastBookingPhone";
let searchedPhone = "";
let bookingSubmissionLocked = false;

const params = new URLSearchParams(window.location.search);
const selectedTour = params.get("tour");

if (selectedTour && tourSelect) {
    tourSelect.value = selectedTour;
}

if (departureDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    departureDate.min = localToday;
}

function calculatePrice() {
    if (!tourSelect || !guestsInput || !totalPrice) {
        return;
    }

    const selectedOption = tourSelect.options[tourSelect.selectedIndex];
    const price = Number(selectedOption.dataset.price) || 0;
    const guests = Math.max(1, Number(guestsInput.value) || 1);
    totalPrice.textContent = `${(price * guests).toLocaleString("vi-VN")} VNĐ`;
}

if (tourSelect && guestsInput) {
    tourSelect.addEventListener("change", calculatePrice);
    guestsInput.addEventListener("input", calculatePrice);
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
    bookingListMessage.textContent = "Không thể đọc hoặc lưu danh sách đặt tour. Vui lòng kiểm tra bộ nhớ trình duyệt và thử lại.";
    bookingMessage.textContent = error.message;
    bookingMessage.style.color = "#c44b36";
}

function requireAccountForBooking() {
    let username;
    let isLoggedIn;

    try {
        username = localStorage.getItem("daNangUsername");
        isLoggedIn = localStorage.getItem("daNangLoggedIn") === "true";
    } catch (error) {
        console.error(error);
        bookingMessage.textContent =
            "Không thể kiểm tra tài khoản. Vui lòng bật bộ nhớ trình duyệt rồi thử lại.";
        bookingMessage.style.color = "#c44b36";
        return false;
    }

    if (username && isLoggedIn) {
        return true;
    }

    bookingMessage.replaceChildren();
    bookingMessage.style.color = "#c44b36";

    if (!username) {
        bookingMessage.append(
            document.createTextNode("Bạn cần đăng ký tài khoản trước khi đặt tour. ")
        );
        const registerLink = document.createElement("a");
        registerLink.href = "Dangky.html";
        registerLink.textContent = "Đăng ký ngay";
        bookingMessage.append(registerLink, document.createTextNode(" hoặc "));
    } else {
        bookingMessage.append(
            document.createTextNode("Bạn đã có tài khoản nhưng chưa đăng nhập. ")
        );
    }

    const loginLink = document.createElement("a");
    loginLink.href = "Dangnhap.html";
    loginLink.textContent = "Đăng nhập";
    bookingMessage.append(loginLink, document.createTextNode(" để tiếp tục đặt tour."));
    return false;
}

// Báo cho khách khi admin đã duyệt hoặc từ chối đơn (mỗi đơn chỉ báo một lần).
function notifyReviewedBookings() {
    try {
        const phones = [localStorage.getItem(lastPhoneKey), searchedPhone]
            .map(normalizePhone)
            .filter(Boolean);
        if (phones.length === 0) {
            return;
        }

        const bookings = readBookings();
        const toNotify = bookings.filter((booking) =>
            booking.reviewedAt && booking.notified === false &&
            phones.includes(normalizePhone(booking.phone)) &&
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
                    `Số khách: ${booking.guests}\n\n` +
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

        if (searchedPhone) {
            renderBookingList();
        }

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

function renderBookingList() {
    if (!bookingList || !bookingListMessage) {
        return;
    }

    try {
        const bookings = readBookings().filter((booking) =>
            normalizePhone(booking.phone) === searchedPhone
        );
        bookingList.replaceChildren();

        if (bookings.length === 0) {
            bookingList.hidden = true;
            bookingListMessage.textContent = "Không tìm thấy đơn đặt tour với số điện thoại này.";
            return;
        }

        bookingList.hidden = false;
        bookingListMessage.textContent = `Tìm thấy ${bookings.length} đơn đặt tour.`;
        bookings.forEach((booking) => {
            const isCancelled = booking.status === "Đã hủy";
            const isRejected = booking.status === "Từ chối";
            const isPending = booking.status === "Chờ xác nhận";
            const card = document.createElement("article");
            card.className = "booking-item";

            const details = document.createElement("div");
            details.className = "booking-item-details";
            [
                ["Hành trình", booking.tour],
                ["Khách hàng", booking.customerName],
                ["Ngày khởi hành", formatDate(booking.departureDate)],
                ["Số điện thoại", booking.phone],
                ["Số khách", booking.guests]
            ].forEach(([label, value]) => {
                const line = document.createElement("p");
                const strong = document.createElement("strong");
                strong.textContent = `${label}: `;
                line.append(strong, document.createTextNode(value || "Chưa có thông tin"));
                details.append(line);
            });

            const status = document.createElement("p");
            status.className = `booking-status${isCancelled || isRejected ? " is-cancelled" : ""}`;
            status.textContent = `Trạng thái: ${booking.status}`;
            details.append(status);

            if (isRejected && booking.rejectReason) {
                const reason = document.createElement("p");
                reason.textContent = `Lý do từ chối: ${booking.rejectReason}`;
                details.append(reason);
            }

            if (booking.status === "Đã xác nhận") {
                const payment = document.createElement("p");
                payment.textContent = `Thanh toán: ${booking.paymentStatus || "Chưa thanh toán"}`;
                details.append(payment);
                if (booking.paymentStatus === "Đã đặt cọc" && booking.remainingDueDate) {
                    const due = document.createElement("p");
                    due.textContent = `Thanh toán phần còn lại trước ngày ${formatDate(booking.remainingDueDate)}`;
                    details.append(due);
                }
            }

            const actions = document.createElement("div");
            actions.className = "booking-item-actions";

            // Chỉ cho đổi số khách khi đơn còn chờ admin duyệt.
            if (isPending) {
                const guestControl = document.createElement("div");
                guestControl.className = "guest-control";

                const decreaseButton = document.createElement("button");
                decreaseButton.type = "button";
                decreaseButton.className = "btn-sua";
                decreaseButton.dataset.action = "decrease";
                decreaseButton.dataset.bookingId = booking.id;
                decreaseButton.textContent = "−";
                decreaseButton.setAttribute("aria-label", "Giảm một khách");
                decreaseButton.disabled = Number(booking.guests) <= 1;

                const increaseButton = document.createElement("button");
                increaseButton.type = "button";
                increaseButton.className = "btn-sua";
                increaseButton.dataset.action = "increase";
                increaseButton.dataset.bookingId = booking.id;
                increaseButton.textContent = "+";
                increaseButton.setAttribute("aria-label", "Thêm một khách");

                guestControl.append(
                    document.createTextNode("Điều chỉnh số khách: "),
                    decreaseButton,
                    increaseButton
                );
                actions.append(guestControl);
            }

            const isApproved = booking.status === "Đã xác nhận";
            if (isApproved && booking.paymentStatus !== "Đã thanh toán đủ") {
                const payLink = document.createElement("a");
                payLink.className = "btn-sua";
                payLink.href = `Thanhtoan.html?booking=${encodeURIComponent(booking.id)}`;
                payLink.textContent = booking.paymentStatus === "Đã đặt cọc"
                    ? "Thanh toán phần còn lại"
                    : "Thanh toán ngay";
                actions.append(payLink);
            }

            // Đơn đã thanh toán (cọc hoặc đủ) không cho khách tự hủy.
            if (isPending || (isApproved && !Number(booking.paidAmount))) {
                const cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.className = "btn-huy";
                cancelButton.dataset.action = "cancel";
                cancelButton.dataset.bookingId = booking.id;
                cancelButton.textContent = "Hủy đơn";
                actions.append(cancelButton);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn-huy";
            deleteButton.dataset.action = "delete";
            deleteButton.dataset.bookingId = booking.id;
            deleteButton.textContent = "Xóa yêu cầu";
            actions.append(deleteButton);

            card.append(details, actions);
            bookingList.append(card);
        });
    } catch (error) {
        showBookingError(error);
    }
}

if (bookingLookupForm) {
    bookingLookupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchedPhone = normalizePhone(lookupPhone.value);
        bookingList.replaceChildren();
        bookingList.hidden = true;

        if (!searchedPhone) {
            bookingListMessage.textContent = "Vui lòng nhập số điện thoại đã dùng khi đặt tour.";
            return;
        }

        renderBookingList();
        notifyReviewedBookings();
    });
}

if (bookingList) {
    bookingList.addEventListener("click", function(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) {
            return;
        }

        const confirmation = button.dataset.action === "delete"
            ? "Bạn có chắc chắn muốn xóa yêu cầu đặt tour này không? Thao tác này không thể hoàn tác."
            : "Bạn có chắc chắn muốn hủy đơn đặt tour này không?";
        if ((button.dataset.action === "cancel" || button.dataset.action === "delete") &&
            !confirm(confirmation)) {
            return;
        }

        try {
            const bookings = readBookings();
            const booking = bookings.find((item) => item.id === button.dataset.bookingId);
            if (!booking) {
                return;
            }

            if (button.dataset.action === "cancel") {
                if (booking.status === "Đã hủy") {
                    return;
                }
                booking.status = "Đã hủy";
                saveBookings(bookings);
            } else if (button.dataset.action === "delete") {
                saveBookings(bookings.filter((item) => item.id !== booking.id));
            } else {
                if (booking.status !== "Chờ xác nhận") {
                    return;
                }
                const guests = Number(booking.guests);
                booking.guests = button.dataset.action === "increase"
                    ? guests + 1
                    : Math.max(1, guests - 1);
                saveBookings(bookings);
            }

            renderBookingList();
        } catch (error) {
            showBookingError(error);
        }
    });
}

if (bookingForm) {
    bookingForm.addEventListener("input", function() {
        if (bookingSubmissionLocked) {
            bookingSubmissionLocked = false;
            if (bookingSubmitButton) {
                bookingSubmitButton.disabled = false;
            }
        }
    });

    bookingForm.addEventListener("change", function() {
        if (bookingSubmissionLocked) {
            bookingSubmissionLocked = false;
            if (bookingSubmitButton) {
                bookingSubmitButton.disabled = false;
            }
        }
    });

    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (bookingSubmissionLocked) {
            return;
        }

        if (!requireAccountForBooking()) {
            return;
        }

        const selectedOption = tourSelect.options[tourSelect.selectedIndex];
        const booking = {
            id: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tour: selectedOption.text.trim(),
            unitPrice: Number(selectedOption.dataset.price) || 0,
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            departureDate: departureDate.value,
            guests: Number(guestsInput.value),
            note: document.getElementById("note").value.trim(),
            createdAt: new Date().toISOString(),
            status: "Chờ xác nhận"
        };

        if (!tourSelect.value || !booking.customerName || !booking.phone || !booking.departureDate ||
            !Number.isInteger(booking.guests) || booking.guests < 1) {
            bookingMessage.textContent = "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.";
            bookingMessage.style.color = "#c44b36";
            return;
        }

        bookingSubmissionLocked = true;
        if (bookingSubmitButton) {
            bookingSubmitButton.disabled = true;
        }

        try {
            const bookings = readBookings();
            bookings.push(booking);
            saveBookings(bookings);
            localStorage.setItem(lastPhoneKey, booking.phone);

            bookingForm.reset();
            calculatePrice();
            bookingMessage.textContent = "✓ Gửi yêu cầu đặt tour thành công! Vui lòng chờ Đà Nẵng Travel xem xét và xác nhận đơn.";
            bookingMessage.style.color = "#0d8a7a";
        } catch (error) {
            bookingSubmissionLocked = false;
            if (bookingSubmitButton) {
                bookingSubmitButton.disabled = false;
            }
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