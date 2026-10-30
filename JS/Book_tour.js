// Nhận tour được chọn từ trang Journey.html qua URL.
const tourSelect = document.getElementById("tour");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const departureDate = document.getElementById("departureDate");

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

if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const booking = {
            tour: tourSelect.options[tourSelect.selectedIndex].text,
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            departureDate: departureDate.value,
            guests: Number(document.getElementById("guests").value),
            note: document.getElementById("note").value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!booking.customerName || !booking.phone || !booking.departureDate || !booking.guests) {
            bookingMessage.textContent = "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.";
            bookingMessage.style.color = "#c44b36";
            return;
        }

        try {
            const bookings = JSON.parse(localStorage.getItem("tourBookings") || "[]");
            bookings.push(booking);
            localStorage.setItem("tourBookings", JSON.stringify(bookings));

            bookingForm.reset();
            bookingMessage.textContent = "✓ Gửi yêu cầu đặt tour thành công! Đà Nẵng Travel sẽ liên hệ với bạn để xác nhận.";
            bookingMessage.style.color = "#0d8a7a";
        } catch (error) {
            bookingMessage.textContent = "Không thể lưu yêu cầu đặt tour. Vui lòng thử lại trên trình duyệt.";
            bookingMessage.style.color = "#c44b36";
        }
    });
}
