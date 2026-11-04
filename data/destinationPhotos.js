// TỆP SINH TỰ ĐỘNG bởi scripts/fetch-commons-photos.mjs — không sửa tay.
// Ghi đè ảnh/credit của điểm đến trong data/destinations.js. Slug không có ở đây giữ nguyên dữ liệu cũ.
const photos = {
  "nha-co-87-ma-may": {
    "image": "/assets/images/destinations/nha-co-87-ma-may.webp",
    "imageSrcSet": "/assets/images/destinations/nha-co-87-ma-may-800.webp 800w, /assets/images/destinations/nha-co-87-ma-may.webp 1600w",
    "alt": "Ảnh chụp thực tế: Nhà cổ 87 Mã Mây, Hà Nội.",
    "imageCredit": "Guerinf · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AMaison_longue_traditionnelle_(1).jpg",
    "file": "Maison longue traditionnelle (1).jpg",
    "license": "CC BY-SA 4.0",
    "author": "Guerinf"
  },
  "dinh-kim-ngan": {
    "image": "/assets/images/destinations/dinh-kim-ngan.webp",
    "imageSrcSet": "/assets/images/destinations/dinh-kim-ngan-800.webp 800w, /assets/images/destinations/dinh-kim-ngan.webp 1600w",
    "alt": "Ảnh chụp thực tế: Đình Kim Ngân, Hà Nội.",
    "imageCredit": "Christophe95 · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AKim_Ng%C3%A2n_Temple_3.jpg",
    "file": "Kim Ngân Temple 3.jpg",
    "license": "CC BY-SA 4.0",
    "author": "Christophe95"
  },
  "den-bach-ma": {
    "image": "/assets/images/destinations/den-bach-ma.webp",
    "imageSrcSet": "/assets/images/destinations/den-bach-ma-800.webp 800w, /assets/images/destinations/den-bach-ma.webp 1600w",
    "alt": "Ảnh chụp thực tế: Đền Bạch Mã, Hà Nội.",
    "imageCredit": "Christophe95 · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AB%E1%BA%A1ch_M%C3%A3_Temple_1.jpg",
    "file": "Bạch Mã Temple 1.jpg",
    "license": "CC BY-SA 4.0",
    "author": "Christophe95"
  },
  "tt-50-dao-duy-tu": {
    "image": "/assets/images/destinations/tt-50-dao-duy-tu.webp",
    "imageSrcSet": "/assets/images/destinations/tt-50-dao-duy-tu-800.webp 800w, /assets/images/destinations/tt-50-dao-duy-tu.webp 1600w",
    "alt": "Ảnh chụp thực tế: Trung tâm Giao lưu Văn hóa Phố cổ (50 Đào Duy Từ), Hà Nội.",
    "imageCredit": "Vinnie Cartabiano · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ADao_Duy_Tu_%26_Ma_May%2C_Old_Quarter%2C_Hanoi_(28456369447).jpg",
    "file": "Dao Duy Tu & Ma May, Old Quarter, Hanoi (28456369447).jpg",
    "license": "CC BY 2.0",
    "author": "Vinnie Cartabiano"
  },
  "tt-22-hang-buom": {
    "image": "/assets/images/destinations/tt-22-hang-buom.webp",
    "imageSrcSet": "/assets/images/destinations/tt-22-hang-buom-800.webp 800w, /assets/images/destinations/tt-22-hang-buom.webp 1600w",
    "alt": "Ảnh chụp thực tế: Trung tâm Nghệ thuật 22 Hàng Buồm (Hội quán Quảng Đông), Hà Nội.",
    "imageCredit": "NKSTTSSHNVN · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AH%E1%BB%99i_qu%C3%A1n_Qu%E1%BA%A3ng_%C4%90%C3%B4ng_22_H%C3%A0ng_Bu%E1%BB%93m.jpg",
    "file": "Hội quán Quảng Đông 22 Hàng Buồm.jpg",
    "license": "CC BY-SA 4.0",
    "author": "NKSTTSSHNVN"
  },
  "dinh-thanh-ha": {
    "image": "/assets/images/destinations/dinh-thanh-ha.webp",
    "imageSrcSet": "/assets/images/destinations/dinh-thanh-ha-800.webp 800w, /assets/images/destinations/dinh-thanh-ha.webp 1600w",
    "alt": "Ảnh chụp thực tế: Đình Thanh Hà, Hà Nội.",
    "imageCredit": "Bản vẽ thành Nam Định 1912. , www.hinhanhlichsu.org . Bản vẽ thành Ninh Bình. , www.hinhanhlichsu.org . Bản vẽ thành Phú Yên, Hòa Đinh Đông, Tuy Hòa, Phú Yên. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Ngãi. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Ngãi năm 1901. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Trị năm 1913. Thành Quảng Trị được xây vào năm Gia Long thứ 1. , www.hinhanhlichsu.org . Bản vẽ thành Sơn Tây. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm), Quảng Nam. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm), Quảng Nam. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm) do Trần Đình Đạt thực hiện năm 1913. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa năm 1913. , www.hinhanhlichsu.org . Bản vẽ quy hoạch thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn, sau trận Gia Định, ngày 8 tháng 3 năm 1859. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn, sau trận Gia Định, ngày 8 tháng 3 năm 1859. , www.hinhanhlichsu.org . Bản vẽ thành Tuyên Quang. , www.hinhanhlichsu.org . Bản vẽ thành Vinh, Nghệ An. , www.hinhanhlichsu.org . Bản vẽ thành Vĩnh Long. , www.hinhanhlichsu.org . Bản vẽ thành Vĩnh Long năm 1872. , www.hinhanhlichsu.org . · Wikimedia Commons · Public domain",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AB%E1%BA%A3n_v%E1%BA%BD_th%C3%A0nh_H%C3%A0_Thanh%2C_H%C3%A0_T%C4%A9nh.jpg",
    "file": "Bản vẽ thành Hà Thanh, Hà Tĩnh.jpg",
    "license": "Public domain",
    "author": "Bản vẽ thành Nam Định 1912. , www.hinhanhlichsu.org . Bản vẽ thành Ninh Bình. , www.hinhanhlichsu.org . Bản vẽ thành Phú Yên, Hòa Đinh Đông, Tuy Hòa, Phú Yên. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Ngãi. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Ngãi năm 1901. , www.hinhanhlichsu.org . Bản vẽ thành Quãng Trị năm 1913. Thành Quảng Trị được xây vào năm Gia Long thứ 1. , www.hinhanhlichsu.org . Bản vẽ thành Sơn Tây. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm), Quảng Nam. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm), Quảng Nam. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Chiêm (Dinh trấn Thanh Chiêm) do Trần Đình Đạt thực hiện năm 1913. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Thanh Hóa năm 1913. , www.hinhanhlichsu.org . Bản vẽ quy hoạch thành Thanh Hóa. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn, sau trận Gia Định, ngày 8 tháng 3 năm 1859. , www.hinhanhlichsu.org . Bản vẽ thành Phụng (thành Gia Định), Sài Gòn, sau trận Gia Định, ngày 8 tháng 3 năm 1859. , www.hinhanhlichsu.org . Bản vẽ thành Tuyên Quang. , www.hinhanhlichsu.org . Bản vẽ thành Vinh, Nghệ An. , www.hinhanhlichsu.org . Bản vẽ thành Vĩnh Long. , www.hinhanhlichsu.org . Bản vẽ thành Vĩnh Long năm 1872. , www.hinhanhlichsu.org ."
  },
  "den-quan-de": {
    "image": "/assets/images/destinations/den-quan-de.webp",
    "imageSrcSet": "/assets/images/destinations/den-quan-de-800.webp 800w, /assets/images/destinations/den-quan-de.webp 1600w",
    "alt": "Ảnh chụp thực tế: Đền Quan Đế, Hà Nội.",
    "imageCredit": "Richard Mortel from Riyadh, Saudi Arabia · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AQuan_De_Temple%2C_Old_Quarter%2C_Hanoi_(7)_(38497042101).jpg",
    "file": "Quan De Temple, Old Quarter, Hanoi (7) (38497042101).jpg",
    "license": "CC BY 2.0",
    "author": "Richard Mortel from Riyadh, Saudi Arabia"
  },
  "o-quan-chuong": {
    "image": "/assets/images/destinations/o-quan-chuong.webp",
    "imageSrcSet": "/assets/images/destinations/o-quan-chuong-800.webp 800w, /assets/images/destinations/o-quan-chuong.webp 1600w",
    "alt": "Ảnh chụp thực tế: Cửa Ô Quan Chưởng, Hà Nội.",
    "imageCredit": "Alex 69200 vx · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AQuan-chuong-hanoi.jpg",
    "file": "Quan-chuong-hanoi.jpg",
    "license": "CC BY-SA 4.0",
    "author": "Alex 69200 vx"
  },
  "cho-dong-xuan": {
    "image": "/assets/images/destinations/cho-dong-xuan.webp",
    "imageSrcSet": "/assets/images/destinations/cho-dong-xuan-800.webp 800w, /assets/images/destinations/cho-dong-xuan.webp 1600w",
    "alt": "Ảnh chụp thực tế: Chợ Đồng Xuân, Hà Nội.",
    "imageCredit": "Juliana Ng from Singapore · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ADong_Xuan_market.jpg",
    "file": "Dong Xuan market.jpg",
    "license": "CC BY 2.0",
    "author": "Juliana Ng from Singapore"
  },
  "pho-hang-bac": {
    "image": "/assets/images/destinations/pho-hang-bac.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-bac-800.webp 800w, /assets/images/destinations/pho-hang-bac.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Bạc, Hà Nội.",
    "imageCredit": "Alexis Lê-Quôc · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AH%C3%A0ng_B%E1%BA%A1c.jpg",
    "file": "Hàng Bạc.jpg",
    "license": "CC BY 2.0",
    "author": "Alexis Lê-Quôc"
  },
  "pho-hang-ma": {
    "image": "/assets/images/destinations/pho-hang-ma.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-ma-800.webp 800w, /assets/images/destinations/pho-hang-ma.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Mã, Hà Nội.",
    "imageCredit": "Phan Minh Tuấn · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3APh%E1%BB%91_H%C3%A0ng_M%C3%A3%2C_H%C3%A0_N%E1%BB%99i_001.JPG",
    "file": "Phố Hàng Mã, Hà Nội 001.JPG",
    "license": "CC BY-SA 4.0",
    "author": "Phan Minh Tuấn"
  },
  "pho-hang-dao": {
    "image": "/assets/images/destinations/pho-hang-dao.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-dao-800.webp 800w, /assets/images/destinations/pho-hang-dao.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Đào, Hà Nội.",
    "imageCredit": "Unknown · Wikimedia Commons · Public domain",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3APh%E1%BB%91_H%C3%A0ng_%C4%90%C3%A0o%2C_la_rue_de_la_soie%2C_Ha_Noi%2C_1920s.jpg",
    "file": "Phố Hàng Đào, la rue de la soie, Ha Noi, 1920s.jpg",
    "license": "Public domain",
    "author": "Unknown"
  },
  "pho-hang-ngang": {
    "image": "/assets/images/destinations/pho-hang-ngang.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-ngang-800.webp 800w, /assets/images/destinations/pho-hang-ngang.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Ngang, Hà Nội.",
    "imageCredit": "Hoangkid at Vietnamese Wikipedia · Wikimedia Commons · CC BY 3.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ANgh%E1%BB%87_nh%C3%A2n_trong_nh%C3%A0_v%E1%BA%BD_truy%E1%BB%81n_th%E1%BA%A7n%2C_s%E1%BB%91_47_H%C3%A0ng_Ngang%2C_H%C3%A0_N%E1%BB%99i.jpg",
    "file": "Nghệ nhân trong nhà vẽ truyền thần, số 47 Hàng Ngang, Hà Nội.jpg",
    "license": "CC BY 3.0",
    "author": "Hoangkid at Vietnamese Wikipedia"
  },
  "pho-hang-thiec": {
    "image": "/assets/images/destinations/pho-hang-thiec.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-thiec-800.webp 800w, /assets/images/destinations/pho-hang-thiec.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Thiếc, Hà Nội.",
    "imageCredit": "Busy Léon · Wikimedia Commons · CC0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AUn_pousse-pousse_devant_des_boutiques%2C_surplomb%C3%A9es_de_flambloyants_en_fleurs_(Albizia)%2C_dans_la_%22_rue_des_Ferblantiers_%22_-_A5569.jpg",
    "file": "Un pousse-pousse devant des boutiques, surplombées de flambloyants en fleurs (Albizia), dans la \" rue des Ferblantiers \" - A5569.jpg",
    "license": "CC0",
    "author": "Busy Léon"
  },
  "pho-hang-quat": {
    "image": "/assets/images/destinations/pho-hang-quat.webp",
    "imageSrcSet": "/assets/images/destinations/pho-hang-quat-800.webp 800w, /assets/images/destinations/pho-hang-quat.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Hàng Quạt, Hà Nội.",
    "imageCredit": "Greg Willis from Denver, CO, usa · Wikimedia Commons · CC BY-SA 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AHang_Quat_street_of_Buddhist_altars_%26_statues_(3695174688).jpg",
    "file": "Hang Quat street of Buddhist altars & statues (3695174688).jpg",
    "license": "CC BY-SA 2.0",
    "author": "Greg Willis from Denver, CO, usa"
  },
  "pho-lan-ong": {
    "image": "/assets/images/destinations/pho-lan-ong.webp",
    "imageSrcSet": "/assets/images/destinations/pho-lan-ong-800.webp 800w, /assets/images/destinations/pho-lan-ong.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Lãn Ông, Hà Nội.",
    "imageCredit": "trungydang · Wikimedia Commons · CC BY 3.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3APh%E1%BB%91_c%E1%BB%A7-qu%C3%A2n5-H%E1%BA%A3i_Th%C6%B0%E1%BB%A3ng_L%E1%BA%A3n_Ong-Ch%E1%BB%A3_L%E1%BB%9Bn-HCMVN_-_panoramio.jpg",
    "file": "Phố củ-quân5-Hải Thượng Lản Ong-Chợ Lớn-HCMVN - panoramio.jpg",
    "license": "CC BY 3.0",
    "author": "trungydang"
  },
  "pho-ma-may": {
    "image": "/assets/images/destinations/pho-ma-may.webp",
    "imageSrcSet": "/assets/images/destinations/pho-ma-may-800.webp 800w, /assets/images/destinations/pho-ma-may.webp 1600w",
    "alt": "Ảnh chụp thực tế: Phố Mã Mây, Hà Nội.",
    "imageCredit": "Vinnie Cartabiano · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ADao_Duy_Tu_%26_Ma_May%2C_Old_Quarter%2C_Hanoi_(28456369447).jpg",
    "file": "Dao Duy Tu & Ma May, Old Quarter, Hanoi (28456369447).jpg",
    "license": "CC BY 2.0",
    "author": "Vinnie Cartabiano"
  },
  "pho-ta-hien": {
    "image": "/assets/images/destinations/pho-ta-hien.webp",
    "imageSrcSet": "/assets/images/destinations/pho-ta-hien-800.webp 800w, /assets/images/destinations/pho-ta-hien.webp 1600w",
    "alt": "Ảnh chụp thực tế: Tuyến phố Tạ Hiện, Hà Nội.",
    "imageCredit": "NKSTTSSHNVN · Wikimedia Commons · CC BY-SA 4.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3APh%E1%BB%91_T%E1%BA%A1_Hi%E1%BB%87n_-_NKS.jpg",
    "file": "Phố Tạ Hiện - NKS.jpg",
    "license": "CC BY-SA 4.0",
    "author": "NKSTTSSHNVN"
  },
  "ho-guom": {
    "image": "/assets/images/destinations/ho-guom.webp",
    "imageSrcSet": "/assets/images/destinations/ho-guom-800.webp 800w, /assets/images/destinations/ho-guom.webp 1600w",
    "alt": "Ảnh chụp thực tế: Hồ Hoàn Kiếm & Cầu Thê Húc, Hà Nội.",
    "imageCredit": "David Stanley · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AHuc_Bridge.jpg",
    "file": "Huc Bridge.jpg",
    "license": "CC BY 2.0",
    "author": "David Stanley"
  },
  "pho-co": {
    "image": "/assets/images/destinations/pho-co.webp",
    "imageSrcSet": "/assets/images/destinations/pho-co-800.webp 800w, /assets/images/destinations/pho-co.webp 1600w",
    "alt": "Ảnh chụp thực tế: Khu Phố cổ Hà Nội, Hà Nội.",
    "imageCredit": "Maryam Laura Moazedi, www.moazedi.org · Wikimedia Commons · CC BY-SA 3.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AVietnam_hanoi_old_quarter.jpg",
    "file": "Vietnam hanoi old quarter.jpg",
    "license": "CC BY-SA 3.0",
    "author": "Maryam Laura Moazedi, www.moazedi.org"
  },
  "mua-roi-thang-long": {
    "image": "/assets/images/destinations/mua-roi-thang-long.webp",
    "imageSrcSet": "/assets/images/destinations/mua-roi-thang-long-800.webp 800w, /assets/images/destinations/mua-roi-thang-long.webp 1600w",
    "alt": "Ảnh chụp thực tế: Nhà hát Múa rối Thăng Long, Hà Nội.",
    "imageCredit": "shi zhao · Wikimedia Commons · CC BY-SA 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3AThang_Long_Water_Puppet_Theatre.jpg",
    "file": "Thang Long Water Puppet Theatre.jpg",
    "license": "CC BY-SA 2.0",
    "author": "shi zhao"
  },
  "van-mieu": {
    "image": "/assets/images/destinations/van-mieu.webp",
    "imageSrcSet": "/assets/images/destinations/van-mieu-800.webp 800w, /assets/images/destinations/van-mieu.webp 1600w",
    "alt": "Ảnh chụp thực tế: Văn Miếu – Quốc Tử Giám, Hà Nội.",
    "imageCredit": "xiquinhosilva · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ATemple_of_Literature%2C_Hanoi_by_Xiquinho_Silva_02.jpg",
    "file": "Temple of Literature, Hanoi by Xiquinho Silva 02.jpg",
    "license": "CC BY 2.0",
    "author": "xiquinhosilva"
  },
  "hoang-thanh-thang-long": {
    "image": "/assets/images/destinations/hoang-thanh-thang-long.webp",
    "imageSrcSet": "/assets/images/destinations/hoang-thanh-thang-long-800.webp 800w, /assets/images/destinations/hoang-thanh-thang-long.webp 1600w",
    "alt": "Ảnh chụp thực tế: Hoàng thành Thăng Long, Hà Nội.",
    "imageCredit": "katiebordner · Wikimedia Commons · CC BY 2.0",
    "imageSource": "https://commons.wikimedia.org/wiki/File%3ACentral_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi_(26246667851).jpg",
    "file": "Central Sector of the Imperial Citadel of Thang Long - Hanoi (26246667851).jpg",
    "license": "CC BY 2.0",
    "author": "katiebordner"
  }
};
export default photos;
