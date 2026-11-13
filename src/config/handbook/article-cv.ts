import type { Article } from "./article-types";

export const articleCv: Article = {
  slug: "viet-cv-an-tuong",
  title: "Viết CV ấn tượng cho developer",
  summary:
    "Cấu trúc CV mà nhà tuyển dụng IT thực sự đọc, cách viết bullet mô tả dự án và 7 lỗi khiến CV bị loại trong 10 giây đầu.",
  category: "CV",
  readingTime: "8 phút đọc",
  updatedAt: "2026",
  intro:
    "Một CV IT tốt không cần đẹp lung linh — nó cần trả lời được ba câu hỏi trong 10 giây đầu: bạn làm được gì, bạn đã làm gì, và bạn dùng công nghệ nào. Dưới đây là cấu trúc được các nhà tuyển dụng công nghệ tại Việt Nam đánh giá cao nhất.",
  sections: [
    {
      heading: "1. Cấu trúc chuẩn của một CV IT",
      paragraphs: [
        "Đừng bắt đầu bằng mục tiêu nghề nghiệp chung chung. Nhà tuyển dụng lướt theo thứ tự: tên + vị trí mong muốn → kỹ năng → kinh nghiệm/dự án → học vấn. Hãy đưa những gì quan trọng nhất lên trên.",
      ],
      list: [
        {
          title: "Header (3 dòng)",
          desc: "Họ tên, vị trí ứng tuyển (VD: Frontend Developer — React), email, số điện thoại, GitHub, portfolio. Không cần địa chỉ nhà, ngày sinh, tình trạng hôn nhân.",
        },
        {
          title: "Kỹ năng (Skills)",
          desc: "Chia thành nhóm: Ngôn ngữ / Framework / Công cụ / Cơ sở dữ liệu. Ghi mức độ nếu cần (Thành thạo / Đã dùng trong dự án). Tuyệt đối không liệt kê thứ bạn chưa từng chạm vào.",
        },
        {
          title: "Kinh nghiệm & Dự án",
          desc: "Với mỗi dự án: tên dự án, vai trò, tech stack, 2–3 bullet kết quả đo được. Đây là phần chiếm nhiều điểm nhất.",
        },
        {
          title: "Học vấn & chứng chỉ",
          desc: "Đặt ở cuối nếu bạn đã có kinh nghiệm. Với fresher, có thể đưa lên trên nhưng ngắn gọn.",
        },
      ],
      tip: {
        label: "Độ dài lý tưởng",
        text: "Fresher/Junior: 1 trang. Middle/Senior: tối đa 2 trang. Không ai đọc trang thứ 3.",
      },
    },
    {
      heading: "2. Viết bullet mô tả dự án sao cho có sức nặng",
      paragraphs: [
        "Công thức hiệu quả nhất là: Động từ hành động + Việc đã làm + Công nghệ + Kết quả đo được. Tránh mô tả nhiệm vụ chung chung kiểu “tham gia phát triển dự án”.",
      ],
      list: [
        {
          title: "Yếu",
          desc: "“Tham gia phát triển website bán hàng bằng React.”",
        },
        {
          title: "Tốt hơn",
          desc: "“Xây dựng 12 màn hình giỏ hàng và thanh toán bằng React + TypeScript, áp dụng React Query để cache dữ liệu.”",
        },
        {
          title: "Mạnh nhất",
          desc: "“Tối ưu luồng thanh toán bằng React Query và lazy loading, giảm LCP từ 4.2s xuống 1.8s và tăng tỉ lệ hoàn tất đơn hàng 12%.”",
        },
      ],
      tip: {
        label: "Mẹo",
        text: "Nếu chưa có số liệu thật, hãy dùng số liệu kỹ thuật — số component, số API, số test case, kích thước bundle giảm được. Vẫn trung thực và vẫn thuyết phục.",
      },
    },
    {
      heading: "3. Dự án cá nhân — vũ khí của người chưa có kinh nghiệm",
      paragraphs: [
        "Khi chưa đi làm, dự án cá nhân là bằng chứng duy nhất cho năng lực. Nhưng 10 dự án clone todo-list sẽ không bằng 1 dự án có chiều sâu.",
      ],
      list: [
        {
          title: "Chọn 2 dự án chất lượng hơn 6 dự án hời hợt",
          desc: "Một dự án full CRUD có auth, phân trang, upload file, deploy thật sẽ gây ấn tượng hơn nhiều dự án tutorial.",
        },
        {
          title: "Có link chạy được + link source code",
          desc: "Không deploy được thì ít nhất phải có README hướng dẫn chạy trong 3 lệnh.",
        },
        {
          title: "Ghi rõ phần bạn tự làm",
          desc: "Nếu làm theo tutorial, hãy ghi rõ phần nào bạn mở rộng thêm — nhà tuyển dụng đánh giá cao sự trung thực.",
        },
      ],
    },
    {
      heading: "4. Bảy lỗi khiến CV bị loại ngay",
      list: [
        {
          title: "Gửi một CV cho mọi vị trí",
          desc: "Không sửa lại kỹ năng và tiêu đề theo JD là dấu hiệu ứng tuyển hàng loạt.",
        },
        {
          title: "Liệt kê mọi công nghệ từng nghe tên",
          desc: "Bị hỏi lại và không trả lời được sẽ mất điểm nặng hơn là không ghi.",
        },
        {
          title: "File CV đặt tên “cv.pdf”",
          desc: "Đặt tên theo mẫu HoTen_ViTri_CV.pdf để nhà tuyển dụng tìm lại dễ dàng.",
        },
        {
          title: "Dùng ảnh đại diện không chuyên nghiệp hoặc quá nhiều màu",
          desc: "CV IT nên tối giản, dễ đọc, xuất PDF vector, không lỗi font.",
        },
        {
          title: "Không có thông tin liên hệ dự phòng",
          desc: "Email sinh viên có thể bị khoá sau tốt nghiệp — dùng email cá nhân ổn định.",
        },
        {
          title: "Sai chính tả và lỗi format",
          desc: "Với vị trí yêu cầu sự tỉ mỉ, một lỗi chính tả có thể là lý do đủ để loại.",
        },
        {
          title: "Nhồi nhét từ khoá vô nghĩa",
          desc: "ATS chỉ hỗ trợ, người thật mới quyết định. Từ khoá phải nằm trong ngữ cảnh thật.",
        },
      ],
    },
  ],
  checklist: [
    "CV dài 1 trang (fresher/junior) hoặc tối đa 2 trang",
    "Có vị trí ứng tuyển rõ ràng ngay dưới tên",
    "Kỹ năng chia nhóm, không liệt kê tràn lan",
    "Mỗi dự án có 2–3 bullet kèm số liệu",
    "Có link GitHub/portfolio còn hoạt động",
    "Xuất PDF, tên file theo mẫu HoTen_ViTri_CV.pdf",
    "Không có lỗi chính tả, font hiển thị đúng",
    "Đã đối chiếu lại với JD của vị trí đang ứng tuyển",
  ],
  relatedJobsQuery: "/search?language=ReactJS",
};
