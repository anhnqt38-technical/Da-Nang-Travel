
const places = [
    {
        id: 1,
        name: "Khám phá Đà Nẵng",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiVQjH65Kbcl9mBD9W5xmlEDm9SEK2-mccDn59X3NLZQ&s=10",
        description: "Thành phố biển xinh đẹp với những cây cầu nổi tiếng."
    },
    {
        id: 2,
        name: "Bà Nà Hills",
        image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-16.jpg",
        description: "Khám phá Cầu Vàng và khung cảnh núi non tuyệt đẹp."
    },
    {
        id: 3,
        name: "Cầu Rồng",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCFcJZfM6Fb5iPTVYnAvN6G_XOIz4moc_UyGx-xj85R3zhHQUUZvUotM8&s=10",
        description: "Biểu tượng nổi bật của Đà Nẵng, lung linh về đêm."
    },
    {
        id: 4,
        name: "Biển Mỹ Khê",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSOUwkkP0meTTificWP-U-4MmCsi0z2qk6PWwteOISFwcPicPWglu1X0s&s=10",
        description: "Bãi biển nổi tiếng với làn nước trong xanh."
    },
    {
        id: 5,
        name: "Ngũ Hành Sơn",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwhPPascq6s35Cw5DtYiHkX7c5Uu5JUKPqTQrDUhb8eno29vWR1_-sZKA&s=10",
        description: "Địa điểm du lịch với núi đá và hang động độc đáo."
    }
];

const slides = document.getElementById("slides");

let index = 0;

// Hiển thị dữ liệu từ mảng
function hienThiAnh() {
    slides.innerHTML = places.map(place => `
        <div class="slide" id="slide-${place.id}">
            <img src="${place.image}" alt="${place.name}">

            <div class="description">
                <h2>${place.name}</h2>
                <p>${place.description}</p>
            </div>
        </div>
    `).join("");

    // Nhân đôi ảnh đầu tiên để vòng lặp mượt
    const firstSlide = slides.firstElementChild.cloneNode(true);
    firstSlide.id = "slide-clone";
    slides.appendChild(firstSlide);
}

// Chuyển ảnh
function chuyenAnh() {
    index++;

    slides.style.transition = "transform 0.8s ease-in-out";
    slides.style.transform = `translateX(-${index * 100}%)`;

    // Nếu tới ảnh đầu tiên được nhân đôi
    if (index === places.length) {
        setTimeout(() => {
            slides.style.transition = "none";
            index = 0;
            slides.style.transform = "translateX(0)";

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    slides.style.transition =
                        "transform 0.8s ease-in-out";
                });
            });
        }, 800);
    }
}

hienThiAnh();

setInterval(chuyenAnh, 3800);



// 8 ảnh 
const diadiemhot = [
    {
        id: "dinh-ban-co",
        ten: "Đỉnh Bàn Cờ",
        anh: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600",
        mota: "Đỉnh Bàn Cờ là điểm tham quan nổi tiếng trên bán đảo Sơn Trà, Đà Nẵng, có cảnh núi non và tầm nhìn rộng ra thành phố.",
        vitri: "Bán đảo Sơn Trà, thành phố Đà Nẵng."
    },
    {
        id: "cau-rong",
        ten: "Cầu Rồng",
        anh: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600",
        mota: "Cầu Rồng là công trình kiến trúc nổi bật bắc qua sông Hàn. Cây cầu nổi tiếng với hình dáng rồng và hoạt động phun lửa, phun nước vào những dịp nhất định.",
        vitri: "Bắc qua sông Hàn, thành phố Đà Nẵng."
    },
    {
        id: "ba-na-hills",
        ten: "Bà Nà Hills",
        anh: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=600",
        mota: "Bà Nà Hills là khu du lịch trên núi với khí hậu mát mẻ, cảnh quan thiên nhiên, công trình kiến trúc và Cầu Vàng nổi tiếng.",
        vitri: "Khu vực núi Bà Nà, thành phố Đà Nẵng."
    },
    {
        id: "cau-song-han",
        ten: "Cầu Sông Hàn",
        anh: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600",
        mota: "Cầu Sông Hàn là một biểu tượng của Đà Nẵng, nổi bật với thiết kế cầu quay và vị trí kết nối hai bờ sông Hàn.",
        vitri: "Trung tâm thành phố Đà Nẵng."
    },
    {
        id: "non-nuoc",
        ten: "Non Nước",
        anh: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
        mota: "Khu vực Non Nước nổi tiếng với bãi biển, cảnh quan ven biển và làng nghề điêu khắc đá mỹ nghệ truyền thống.",
        vitri: "Khu vực Ngũ Hành Sơn, thành phố Đà Nẵng."
    },
    {
        id: "bien-my-khe",
        ten: "Biển Mỹ Khê",
        anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        mota: "Biển Mỹ Khê thu hút du khách với bãi cát dài, làn nước biển xanh và nhiều hoạt động vui chơi, nghỉ dưỡng.",
        vitri: "Ven biển thành phố Đà Nẵng."
    },
    {
        id: "ban-dao-son-tra",
        ten: "Bán đảo Sơn Trà",
        anh: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600",
        mota: "Bán đảo Sơn Trà có hệ sinh thái phong phú, rừng tự nhiên, đường ven biển và nhiều điểm ngắm cảnh đẹp.",
        vitri: "Phía đông bắc thành phố Đà Nẵng."
    },
    {
        id: "pho-co-hoi-an",
        ten: "Phố Cổ Hội An",
        anh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600",
        mota: "Phố cổ Hội An nổi tiếng với những ngôi nhà cổ, đèn lồng nhiều màu sắc, các con phố nhỏ và nét văn hóa truyền thống.",
        vitri: "Thành phố Hội An, Đà Nẵng."
    }
];



const placeGrid = document.getElementById("placeGrid");
const toggleButton = document.getElementById("toggleButton");

if (placeGrid && toggleButton) {

    // Duyệt mảng và tạo 8 thẻ địa điểm
    for (let i = 0; i < diadiemhot.length; i++) {

        const dd = diadiemhot[i];

        const the = document.createElement("a");

        // Nhấn thẻ sẽ mở đúng địa điểm ở trang chi tiết
        the.href = "diadiem.html#" + dd.id;
        the.className = "place-card";

        // Ẩn 4 thẻ cuối khi mới mở trang
        if (i >= 4) {
            the.classList.add("hidden");
        }

        the.innerHTML = `
            <img src="${dd.anh}" alt="${dd.ten}">

            <div class="place-info">
                <h3>${dd.ten}</h3>
                <p>${dd.mota}</p>
            </div>
        `;

        placeGrid.appendChild(the);
    }

    // Xem thêm / Thu gọn
    toggleButton.addEventListener("click", function () {

        const cacThe = placeGrid.querySelectorAll(".place-card");
        const dangThuGon = placeGrid.querySelector(
            ".place-card.hidden"
        ) !== null;

        for (let i = 0; i < cacThe.length; i++) {

            if (dangThuGon) {
                // Hiện tất cả thẻ
                cacThe[i].classList.remove("hidden");
            } else if (i >= 4) {
                // Ẩn 4 thẻ cuối
                cacThe[i].classList.add("hidden");
            }
        }

        toggleButton.textContent = dangThuGon
            ? "Thu gọn"
            : "Xem thêm";
    });
}

// nội dung trang chi tiết

const detailList = document.getElementById("detailList");

if (detailList) {

    // Duyệt mảng để tạo nội dung chi tiết cho 8 địa điểm
    for (let i = 0; i < diadiemhot.length; i++) {

        const dd = diadiemhot[i];

        const chiTiet = document.createElement("section");

        chiTiet.className = "detail-item";
        chiTiet.id = dd.id;

        chiTiet.innerHTML = `
            <img src="${dd.anh}" alt="${dd.ten}">

            <div class="detail-info">
                <h2>${dd.ten}</h2>

                <p>${dd.mota}</p>

                <p><strong>Vị trí:</strong> ${dd.vitri}</p>

                <a href="nhap.html" class="back-link">
                    ← Quay lại danh sách địa điểm
                </a>
            </div>
        `;

        detailList.appendChild(chiTiet);
    }


    const maDiaDiem = decodeURIComponent(
        window.location.hash.slice(1)
    );

    if (maDiaDiem) {
        const diaDiemDuocChon = document.getElementById(maDiaDiem);

        if (diaDiemDuocChon) {
            diaDiemDuocChon.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }
}
