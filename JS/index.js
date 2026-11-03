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
        image: "https://images2.thanhnien.vn/528068263637045248/2024/3/27/ban-sao-cua-sun-world-ba-na-hills-4-17115055398311570071595.jpg",
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

    const firstSlide = slides.firstElementChild.cloneNode(true);
    firstSlide.id = "slide-clone";
    slides.appendChild(firstSlide);
}

// Chuyển ảnh
function chuyenAnh() {
    index++;

    slides.style.transition = "transform 0.8s ease-in-out";
    slides.style.transform = `translateX(-${index * 100}%)`;

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

if (slides) {
    hienThiAnh();
    setInterval(chuyenAnh, 3800);
}

const diadiemhot = [
    {
        id: "dinh-ban-co",
        ten: "Đỉnh Bàn Cờ",
        anh: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600",
        mota: "Đỉnh Bàn Cờ là điểm tham quan nổi tiếng trên bán đảo Sơn Trà, Đà Nẵng, có cảnh núi non và tầm nhìn rộng ra thành phố.",
        vitri: "Bán đảo Sơn Trà, thành phố Đà Nẵng.",
        lichsu: "Đỉnh Bàn Cờ gắn với truyền thuyết hai tiên nhân chọn nơi này để nghỉ ngơi và đánh cờ. Trong khuôn viên có tượng các vị tiên đang ngồi trước bàn cờ, trở thành biểu tượng quen thuộc của địa điểm.",
        hoatdong: "Du khách có thể ngắm toàn cảnh biển, thành phố và bán đảo Sơn Trà. Đây là địa điểm thích hợp để chụp ảnh lúc bình minh, hoàng hôn hoặc ngắm thành phố lúc ánh đèn lên.",
        luuy: "Đường lên khá dốc và nhiều khúc cua; nên đi xe cẩn thận, mang theo nước uống và tránh leo núi khi thời tiết có mưa hoặc sương mù."
    },
    {
        id: "cau-rong",
        ten: "Cầu Rồng",
        anh: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600",
        mota: "Cầu Rồng là biểu tượng hiện đại của Đà Nẵng, bắc qua sông Hàn với thiết kế giống một con rồng đang bay hướng ra biển. Cầu khởi công năm 2009 và thông xe vào năm 2013.",
        vitri: "Bắc qua sông Hàn, nối quận Hải Châu và quận Sơn Trà, thành phố Đà Nẵng.",
        lichsu: "Cây cầu được xây dựng như một biểu tượng cho tinh thần phát triển năng động của thành phố. Hình dáng rồng lấy cảm hứng từ hình tượng rồng thời Lý - nơi biểu trưng cho quyền lực và thịnh vượng.",
        hoatdong: "Du khách có thể đi bộ ngắm cầu quanh khu vực bờ sông, xem phun lửa và phun nước vào cuối tuần. Khung cảnh trên cầu đặc biệt đẹp khi hệ thống đèn chiếu sáng được bật vào ban đêm.",
        luuy: "Chương trình phun lửa, phun nước thường diễn ra vào tối thứ Sáu, thứ Bảy và Chủ Nhật; nên kiểm tra lịch chính thức trước chuyến đi. Hãy đứng tránh hướng đầu cầu phun nước."
    },
    {
        id: "ba-na-hills",
        ten: "Bà Nà Hills",
        anh: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=600",
        mota: "Bà Nà Hills là khu du lịch nghỉ dưỡng trên núi với khí hậu quanh năm mát mẻ, phong cảnh rừng núi và kiến trúc mang phong cách châu Âu. Khu vực nổi tiếng nhất là Cầu Vàng được nâng đỡ bởi đôi bàn tay khổng lồ.",
        vitri: "Xã Hòa Ninh, huyện Hòa Vang, thành phố Đà Nẵng.",
        lichsu: "Bà Nà từng là nơi nghỉ mát của người Pháp từ đầu thế kỷ XX. Sau nhiều giai đoạn phát triển, khu vực này trở thành tổ hợp du lịch hiện đại cùng bảo tồn không gian kiến trúc và khí hậu đặc trưng.",
        hoatdong: "Du khách có thể trải nghiệm cáp treo, tham quan Cầu Vàng, Làng Pháp, khu vui chơi Fantasy Park và tận hưởng cảnh quan núi rừng. Có thể dành trọn một ngày để tham quan toàn khu.",
        luuy: "Nhiệt độ trên núi thường thấp hơn thành phố và có thể thay đổi nhanh. Nên mặc áo khoác nhẹ, mang ô hoặc áo mưa và đặt vé cáp treo trước vào mùa cao điểm."
    },
    {
        id: "cau-song-han",
        ten: "Cầu Sông Hàn",
        anh: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600",
        mota: "Cầu Sông Hàn là cầu quay đầu tiên của Việt Nam, nối hai bên bờ sông Hàn và là biểu tượng quen thuộc của thành phố Đà Nẵng. Khi về đêm, ánh đèn cùng dòng sông tạo nên khung cảnh rất đẹp.",
        vitri: "Đường Tôn Đức Thắng, quận Sơn Trà và quận Hải Châu, thành phố Đà Nẵng.",
        lichsu: "Cầu được khởi công vào năm 1998 và chính thức đưa vào sử dụng năm 2000. Đến nay, cầu còn được xem là niềm tự hào của người dân Đà Nẵng vì là công trình tự thiết kế và thi công.",
        hoatdong: "Du khách có thể đi bộ hoặc đi xe trên cầu, ngắm cảnh hai bên sông Hàn, khu phố đêm và các cây cầu khác. Khoảng thời gian cầu quay ban đêm là cơ hội để quan sát cơ cấu vận hành.",
        luuy: "Các phương tiện thường được chặn lại trong thời gian cầu quay. Nên đứng ở khu vực an toàn, không nhìn trực tiếp đèn pha xe và kiểm tra giờ quay từ lực lượng quản lý."
    },
    {
        id: "non-nuoc",
        ten: "Non Nước",
        anh: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
        mota: "Bãi biển Non Nước nằm dưới chân Ngũ Hành Sơn, nổi bật với bờ biển dài, nước trong và không gian yên bình. Nơi đây còn nổi tiếng với làng nghề điêu khắc đá mỹ nghệ truyền thống.",
        vitri: "Dưới chân Ngũ Hành Sơn, quận Ngũ Hành Sơn, thành phố Đà Nẵng.",
        lichsu: "Non Nước từng gắn với làng nghề điêu khắc đá Non Nước, phát triển nhờ nguồn đá tự nhiên từ núi Ngũ Hành Sơn. Các làng nghề truyền thống đến nay vẫn duy trì nhiều sản phẩm thủ công tinh xảo.",
        hoatdong: "Du khách có thể tắm biển, đi bộ ven bờ, ngắm cảnh Núi Non Nước và tham quan các xưởng sản xuất tượng đá. Đây cũng là khu vực thuận tiện để kết hợp khám phá Ngũ Hành Sơn.",
        luuy: "Nên bơi ở khu vực có lực lượng cứu hộ và tránh biển khi có sóng lớn. Mang kính râm, kem chống nắng và giữ vệ sinh môi trường khi tham quan."
    },
    {
        id: "bien-my-khe",
        ten: "Biển Mỹ Khê",
        anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        mota: "Mỹ Khê là một trong những bãi biển nổi tiếng nhất Đà Nẵng, có bãi cát dài, làn nước trong xanh và sóng vừa phải. Nơi đây thích hợp cho nghỉ dưỡng lẫn tham gia các hoạt động thể thao trên biển.",
        vitri: "Ven biển quận Sơn Trà và quận Ngũ Hành Sơn, thành phố Đà Nẵng.",
        lichsu: "Mỹ Khê đã trở thành địa điểm nổi tiếng của du lịch biển Đà Nẵng qua nhiều thập niên, thu hút du khách trong và ngoài nước nhờ thiên nhiên trong lành và dịch vụ phát triển.",
        hoatdong: "Du khách có thể tắm biển, chạy bộ, chụp ảnh hoàng hôn, chơi thể thao dưới nước hoặc thưởng thức hải sản tại các quán ven biển. Buổi sáng là thời điểm lý tưởng để ngắm bình minh.",
        luuy: "Nên tắm tại khu vực được cứu hộ, tránh để đồ cá nhân không người trông và theo dõi biển báo thời tiết. Các hoạt động thể thao dưới nước nên đi theo nhóm có hướng dẫn."
    },
    {
        id: "ban-dao-son-tra",
        ten: "Bán đảo Sơn Trà",
        anh: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600",
        mota: "Bán đảo Sơn Trà được ví như lá phổi xanh của Đà Nẵng, nổi bật với rừng nguyên sinh, đường ven biển uốn lượn và nhiều điểm ngắm cảnh. Đây cũng là nơi sinh sống của loài voọc chà vá chân nâu quý hiếm.",
        vitri: "Phía đông bắc thành phố Đà Nẵng.",
        lichsu: "Sơn Trà từ lâu đã là vùng núi ven biển quan trọng, đồng thời là nơi quân sự và sinh thái có vai trò đặc biệt. Dự án bảo vệ đa dạng sinh học ngày càng được chú trọng để giữ cảnh quan tự nhiên.",
        hoatdong: "Du khách có thể tham quan Bãi Bắc, chùa Linh Ứng, đỉnh Bàn Cờ, ngắm biển từ các hướng nhìn trên núi và quan sát động vật hoang dã. Chuyến tham quan thường kết hợp xe máy hoặc xe ô tô.",
        luuy: "Không tự ý cho động vật ăn hoặc tiếp cận voọc chà vá. Giữ đúng làn đường, tuân thủ biển báo và tránh lái xe dốc khi trời mưa hoặc tầm nhìn hạn chế."
    },
    {
        id: "pho-co-hoi-an",
        ten: "Phố Cổ Hội An",
        anh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600",
        mota: "Phố cổ Hội An là quần thể đô thị lịch sử được UNESCO công nhận, nổi tiếng với kiến trúc nhà cổ, đèn lồng, cửa hiệu và không gian sống động ven sông Hoài. Phố mang nét giao thoa văn hóa Việt, Hoa, Nhật và Châu Âu.",
        vitri: "Phường Hội An, thành phố Đà Nẵng.",
        lichsu: "Hội An từng là thương cảng sầm uất từ thế kỷ XVI-XVII, nơi buôn bán của thương nhân nhiều nước. Những ngôi nhà, hội quán và phố cổ còn lại đến nay giúp bảo tồn giá trị lịch sử độc đáo.",
        hoatdong: "Du khách có thể tham quan Chùa Cầu, hội quán, bảo tàng, nhà cổ, mua áo đèn lồng hoặc thưởng thức cao lầu, mì Quảng. Buổi tối là lúc phố cổ trở nên rực rỡ với ánh đèn.",
        luuy: "Nên mua vé tham quan tại quầy chính thức để vào các điểm di sản. Bảo quản đồ cá nhân khi đông du khách và tránh mang xe máy vào phố cổ theo quy định."
    }
];



const placeGrid = document.getElementById("placeGrid");
const toggleButton = document.getElementById("toggleButton");

if (placeGrid && toggleButton) {

    for (let i = 0; i < diadiemhot.length; i++) {

        const dd = diadiemhot[i];

        const the = document.createElement("div");
        the.dataset.id = dd.id;
        the.setAttribute("role", "button");
        the.setAttribute("tabindex", "0");
        the.className = "place-card";
        the.style.cursor = "pointer";

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

    const placeDetailModal = document.getElementById("placeDetailModal");
    const placeDetailClose = document.getElementById("placeDetailClose");
    const placeDetailImage = document.getElementById("placeDetailImage");
    const placeDetailTitle = document.getElementById("placeDetailTitle");
    const placeDetailDescription = document.getElementById("placeDetailDescription");
    const placeDetailLocation = document.getElementById("placeDetailLocation");
    const placeDetailExtra = document.getElementById("placeDetailExtra");

    function moThongTinDiaDiem(id) {
        const diaDiem = diadiemhot.find(function (item) {
            return item.id === id;
        });

        if (!diaDiem) {
            return;
        }

        placeDetailImage.src = diaDiem.anh;
        placeDetailImage.alt = diaDiem.ten;
        placeDetailTitle.textContent = diaDiem.ten;
        placeDetailDescription.textContent = diaDiem.mota;
        placeDetailLocation.innerHTML =
            "<strong>Vị trí:</strong> " + diaDiem.vitri;
        placeDetailExtra.innerHTML = `
            ${diaDiem.lichsu ? "<h3>Lịch sử và đặc điểm nổi bật</h3><p>" + diaDiem.lichsu + "</p>" : ""}
            ${diaDiem.hoatdong ? "<h3>Hoạt động tham quan</h3><p>" + diaDiem.hoatdong + "</p>" : ""}
            ${diaDiem.luuy ? "<h3>Lưu ý khi tham quan</h3><p>" + diaDiem.luuy + "</p>" : ""}
        `;

        placeDetailModal.classList.add("hien");
        placeDetailModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function dongThongTinDiaDiem() {
        placeDetailModal.classList.remove("hien");
        placeDetailModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        placeDetailImage.removeAttribute("src");
    }

    placeGrid.addEventListener("click", function (event) {
        const the = event.target.closest(".place-card");
        if (the) {
            moThongTinDiaDiem(the.dataset.id);
        }
    });

    placeGrid.addEventListener("keydown", function (event) {
        const the = event.target.closest(".place-card");
        if (the && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            moThongTinDiaDiem(the.dataset.id);
        }
    });

    placeDetailClose.addEventListener("click", dongThongTinDiaDiem);

    placeDetailModal.addEventListener("click", function (event) {
        if (event.target === placeDetailModal) {
            dongThongTinDiaDiem();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" &&
            placeDetailModal.classList.contains("hien")) {
            dongThongTinDiaDiem();
        }
    });

    // Xem thêm / Thu gọn
    toggleButton.addEventListener("click", function () {

        const cacThe = placeGrid.querySelectorAll(".place-card");

        const dangThuGon = placeGrid.querySelector(
            ".place-card.hidden"
        ) !== null;

        for (let i = 0; i < cacThe.length; i++) {

            if (dangThuGon) {
                cacThe[i].classList.remove("hidden");
            } else if (i >= 4) {
                cacThe[i].classList.add("hidden");
            }
        }

        toggleButton.textContent = dangThuGon
            ? "Thu gọn"
            : "Xem thêm";
    });
}

const detailList = document.getElementById("detailList");

if (detailList) {
    const maDiaDiem = decodeURIComponent(window.location.hash.slice(1));
    const dd = diadiemhot.find(function (diaDiem) {
        return diaDiem.id === maDiaDiem;
    });

    if (!dd) {
        detailList.innerHTML = `
            <section class="detail-item">
                <div class="detail-info">
                    <h2>Không tìm thấy địa điểm</h2>
                    <p>Liên kết không đúng hoặc địa điểm chưa có trong danh sách.</p>
                    <a href="nhap.html" class="back-link">
                        ← Quay lại danh sách địa điểm
                    </a>
                </div>
            </section>
        `;
    } else {
        const chiTiet = document.createElement("section");
        chiTiet.className = "detail-item";
        chiTiet.id = dd.id;

        chiTiet.innerHTML = `
            <img src="${dd.anh}" alt="${dd.ten}">

            <div class="detail-info">
                <h2>${dd.ten}</h2>

                <p>${dd.mota}</p>

                <p><strong>Vị trí:</strong> ${dd.vitri}</p>

                ${dd.lichsu ? `
                    <h3>Lịch sử và truyền thuyết</h3>
                    <p>${dd.lichsu}</p>
                ` : ""}

                ${dd.hoatdong ? `
                    <h3>Hoạt động tham quan</h3>
                    <p>${dd.hoatdong}</p>
                ` : ""}

                ${dd.luuy ? `
                    <h3>Lưu ý khi tham quan</h3>
                    <p>${dd.luuy}</p>
                ` : ""}

                <a href="nhap.html" class="back-link">
                    ← Quay lại danh sách địa điểm
                </a>
            </div>
        `;

        detailList.appendChild(chiTiet);
        document.title = `${dd.ten} - Đà Nẵng Travel`;
    }
}

const moihot = [
    {
        id: 1,
        ten: "Cầu Vàng",
        anh: "https://datviettour.com.vn/uploads/images/tin-tuc-SEO/mien-trung/Da-Nang/gioi-thieu-cau-vang-da-nang.jpg"
    },
    {
        id: 2,
        ten: "Cầu Rồng",
        anh: "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/86/2020/02/18085024/dragon-bridge-and-firework-ph%C3%A1o-hoa-tr%C3%AAn-c%E1%BA%A7u-r%E1%BB%93ng-Danang-Discovery-4-famous-bridge-in-danang-Restaurant-near-me-dragon-bridge-history-a-new-iconic-image-of-danang.jpg"
    },
    {
        id: 3,
        ten: "Bà Nà Hills",
        anh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqfvzNeGVpScmV-G6eaQCrRgHkG3aXfjkMQ6622xR8cWrKUwax_glAq0&s=10"
    },
    {
        id: 4,
        ten: "Phố Cổ Hội An",
        anh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzKRIXrQSw_2kpDoPIXeWAuXwk13yFbzKSjDk7ileRTg&s=10"
    },
    {
        id: 5,
        ten: "Cầu Sông Hàn",
        anh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF0osuAMr5SXE1oPxdEZ_0EDwtNGJmOrOWW6WvBLE76A&s=10"
    },
    {
        id: 6,
        ten: "Biển Mỹ Khê",
        anh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPlO1PpltxrRIZ1ksQbEm2FZhw9Urrv4HvQFVcN24Bjw&s=10"
    }
];

const danhSachDiaDiem =
    document.getElementById("danhSachDiaDiem");

const hopPhongTo =
    document.getElementById("hopPhongTo");

const anhPhongTo =
    document.getElementById("anhPhongTo");

const tenAnhPhongTo =
    document.getElementById("tenAnhPhongTo");

const nutDong =
    document.getElementById("nutDong");

function hienThiDiaDiem() {
    if (danhSachDiaDiem.dataset.daRender === "true") {
        return;
    }
    danhSachDiaDiem.dataset.daRender = "true";

    let html = "";

    moihot.forEach(function (diaDiem) {
        html += `
            <div class="dia-diem"
                 data-id="${diaDiem.id}"
                 tabindex="0"
                 role="button"
                 aria-label="Phóng to ảnh ${diaDiem.ten}">

                <img
                    src="${diaDiem.anh}"
                    alt="${diaDiem.ten}"
                    loading="lazy"
                >

                <div class="ten-dia-diem">
                    ${diaDiem.ten}
                </div>
            </div>
        `;
    });

    danhSachDiaDiem.innerHTML = html;
}

function timDiaDiem(id) {
    return moihot.find(function (diaDiem) {
        return diaDiem.id === Number(id);
    });
}

function moAnh(id) {
    const diaDiem = timDiaDiem(id);

    if (!diaDiem) {
        return;
    }

    anhPhongTo.src = diaDiem.anh;
    anhPhongTo.alt = diaDiem.ten;
    tenAnhPhongTo.textContent = diaDiem.ten;

    hopPhongTo.classList.add("hien");
    hopPhongTo.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function dongAnh() {
    hopPhongTo.classList.remove("hien");
    hopPhongTo.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    anhPhongTo.removeAttribute("src");
}

if (danhSachDiaDiem) {
    danhSachDiaDiem.addEventListener("click", function (event) {
        const theDiaDiem = event.target.closest(".dia-diem");

        if (!theDiaDiem) {
            return;
        }

        moAnh(theDiaDiem.dataset.id);
    });
}

if (danhSachDiaDiem) {
    danhSachDiaDiem.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const theDiaDiem = event.target.closest(".dia-diem");

        if (!theDiaDiem) {
            return;
        }

        event.preventDefault();
        moAnh(theDiaDiem.dataset.id);
    });
}

if (nutDong) {
    nutDong.addEventListener("click", dongAnh);
}

if (hopPhongTo) {
    hopPhongTo.addEventListener("click", function (event) {
        if (event.target === hopPhongTo) {
            dongAnh();
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (hopPhongTo &&
        event.key === "Escape" &&
        hopPhongTo.classList.contains("hien")) {
        dongAnh();
    }
});

if (danhSachDiaDiem) {
    hienThiDiaDiem();
}
