function toggleRoute(button) {
    const routeId = button.dataset.routeTarget;
    const selectedRoute = document.getElementById(routeId);
    if (!selectedRoute) return;

    const isOpening = selectedRoute.hidden;

    document.querySelectorAll(".route-details").forEach((route) => {
        route.hidden = true;
    });

    document.querySelectorAll(".journey-button").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const arrow = btn.querySelector(".button-arrow");
        if (arrow) arrow.textContent = "↗";
    });

    if (isOpening) {
        selectedRoute.hidden = false;
        button.setAttribute("aria-expanded", "true");
        const arrow = button.querySelector(".button-arrow");
        if (arrow) arrow.textContent = "↘";

        setTimeout(() => {
            selectedRoute.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    }
}

const form = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

let reviews = [];

try {
    reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
} catch (error) {
    reviews = [];
}

function showReviews() {
    if (!reviewList) return;

    reviewList.innerHTML = "";

    if (!reviews.length) {
        reviewList.textContent = "Chưa có bình luận nào.";
        return;
    }

    reviews.forEach((review) => {
        const item = document.createElement("div");
        item.className = "review-item";

        const name = document.createElement("h4");
        name.textContent = review.name;

        const rating = document.createElement("p");
        rating.textContent = "Đánh giá: " + "★".repeat(Number(review.rating || 0));

        const comment = document.createElement("p");
        comment.textContent = review.comment;

        item.append(name, rating, comment);
        reviewList.appendChild(item);
    });
}

document.querySelectorAll("[data-route-target]").forEach((button) => {
    button.addEventListener("click", () => toggleRoute(button));
});

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const rating = Number(document.getElementById("rating").value);
        const comment = document.getElementById("comment").value.trim();

        if (!name || !comment) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        reviews.unshift({ name, rating, comment });

        try {
            localStorage.setItem("reviews", JSON.stringify(reviews));
        } catch (error) {
            reviews.shift();
            alert("Không thể lưu bình luận!");
            return;
        }

        showReviews();
        form.reset();
    });
}

showReviews();