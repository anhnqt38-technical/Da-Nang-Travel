// Nhận tour được chọn từ trang Journey.html qua URL.
const tourSelect = document.getElementById("tour");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const departureDate = document.getElementById("departureDate");
const bookingList = document.getElementById("bookingList");
const bookingListMessage = document.getElementById("bookingListMessage");
const bookingLookupForm = document.getElementById("bookingLookupForm");
const lookupPhone = document.getElementById("lookupPhone");
const bookingStorageKey = "tourBookings";
let searchedPhone = "";

const params = new URLSearchParams(window.location.search);
const selectedTour = params.get("tour");

if (selectedTour && tourSelect) {
    tourSelect.value = selectedTour;
}

// Không cho khách chọn ngày khởi hành trong quá khứ.
if (departureDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    departureDate.min = localToday;
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
            booking.status = "Đã xác nhận";
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

function renderBookingList() {
    if (!bookingList || !bookingListMessage) {
        return;
    }

    try {
        const bookings = readBookings().filter((booking) =>
            String(booking.phone || "").replace(/\D/g, "") === searchedPhone
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
            const card = document.createElement("article");
            card.className = "booking-item";

            const details = document.createElement("div");
            details.className = "booking-item-details";
            [
                ["Hành trình", booking.tour],
                ["Khách hàng", booking.customerName],
                ["Ngày khởi hành", booking.departureDate],
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
            status.className = `booking-status${isCancelled ? " is-cancelled" : ""}`;
            status.textContent = `Trạng thái: ${booking.status || "Đã xác nhận"}`;
            details.append(status);

            const actions = document.createElement("div");
            actions.className = "booking-item-actions";

            if (!isCancelled) {
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
        searchedPhone = lookupPhone.value.trim().replace(/\D/g, "");
        bookingList.replaceChildren();
        bookingList.hidden = true;

        if (!searchedPhone) {
            bookingListMessage.textContent = "Vui lòng nhập số điện thoại đã dùng khi đặt tour.";
            return;
        }

        renderBookingList();
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
            } else if (button.dataset.action === "delete") {
                saveBookings(bookings.filter((item) => item.id !== booking.id));
            } else {
                if (booking.status === "Đã hủy") {
                    return;
                }
                const guests = Number(booking.guests);
                booking.guests = button.dataset.action === "increase"
                    ? guests + 1
                    : Math.max(1, guests - 1);
                saveBookings(bookings);
            }

            if (button.dataset.action === "cancel") {
                saveBookings(bookings);
            }
            renderBookingList();
        } catch (error) {
            showBookingError(error);
        }
    });
}

if (bookingForm) {
    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const booking = {
            id: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tour: tourSelect.options[tourSelect.selectedIndex].text,
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            departureDate: departureDate.value,
            guests: Number(document.getElementById("guests").value),
            note: document.getElementById("note").value.trim(),
            createdAt: new Date().toISOString(),
            status: "Đã xác nhận"
        };

        if (!booking.tour || !booking.customerName || !booking.phone || !booking.departureDate ||
            !Number.isInteger(booking.guests) || booking.guests < 1) {
            bookingMessage.textContent = "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.";
            bookingMessage.style.color = "#c44b36";
            return;
        }

        try {
            const bookings = readBookings();
            bookings.push(booking);
            saveBookings(bookings);

            bookingForm.reset();
            bookingMessage.textContent = "✓ Gửi yêu cầu đặt tour thành công! Đà Nẵng Travel sẽ liên hệ với bạn để xác nhận.";
            bookingMessage.style.color = "#0d8a7a";
        } catch (error) {
            showBookingError(error);
        }
    });
}