// Dữ liệu ngân hàng câu hỏi Tin học mẫu cho Khối 3, Khối 4 và Khối 5
// Trường Tiểu học Quỳnh Châu

window.DEFAULT_EXAMS = [
  {
    id: "exam-khoi-3",
    title: "Khảo sát kiến thức Tin học - Khối 3",
    description: "Bài thi trắc nghiệm tìm hiểu về các bộ phận máy tính và thao tác cơ bản.",
    grade: 3,
    duration: 10, // 10 phút làm bài
    questions: [
      {
        id: "q3_1",
        question: "Bộ phận nào của máy tính dùng để nhập chữ và số vào máy tính?",
        options: [
          "Chuột máy tính",
          "Màn hình máy tính",
          "Bàn phím máy tính",
          "Thân máy tính"
        ],
        answer: 2, // Bàn phím máy tính (index 2)
        explanation: "Bàn phím chứa các phím chữ, số và ký tự đặc biệt giúp ta nhập thông tin văn bản vào máy tính."
      },
      {
        id: "q3_2",
        question: "Bộ phận nào được ví như 'bộ não' điều khiển mọi hoạt động của máy tính?",
        options: [
          "Màn hình (Monitor)",
          "Thân máy (chứa bộ xử lý trung tâm - CPU)",
          "Chuột (Mouse)",
          "Loa (Speaker)"
        ],
        answer: 1, // Thân máy (index 1)
        explanation: "Bộ xử lý trung tâm (CPU) nằm trong thân máy tính, thực hiện nhiệm vụ xử lý dữ liệu và điều khiển mọi hoạt động của máy."
      },
      {
        id: "q3_3",
        question: "Chuột máy tính thường có hai nút cơ bản là những nút nào?",
        options: [
          "Nút trên và nút dưới",
          "Nút trái và nút phải",
          "Nút giữa và nút bên hông",
          "Không có nút nào"
        ],
        answer: 1, // Nút trái và nút phải
        explanation: "Chuột máy tính thông dụng có nút trái (dùng nhiều nhất) và nút phải để mở rộng tính năng."
      },
      {
        id: "q3_4",
        question: "Màn hình máy tính có chức năng gì?",
        options: [
          "Để gõ chữ",
          "Để điều khiển con trỏ",
          "Để hiển thị kết quả làm việc của máy tính",
          "Để phát ra âm thanh"
        ],
        answer: 2, // Để hiển thị kết quả
        explanation: "Màn hình là thiết bị đầu ra giúp hiển thị văn bản, hình ảnh, video để người dùng nhìn thấy."
      },
      {
        id: "q3_5",
        question: "Để tắt máy tính một cách an toàn và đúng cách, em thực hiện thao tác nào?",
        options: [
          "Rút phích cắm điện của máy tính ra trực tiếp",
          "Nhấn giữ nút nguồn trên thân máy trong 10 giây",
          "Vào Start -> Chọn nút Nguồn (Power) -> Chọn Shut down",
          "Chỉ cần tắt màn hình máy tính là xong"
        ],
        answer: 2,
        explanation: "Tắt máy qua hệ điều hành (Start -> Power -> Shut down) giúp máy tính lưu lại trạng thái hệ thống trước khi ngắt điện hoàn toàn."
      }
    ]
  },
  {
    id: "exam-khoi-4",
    title: "Khảo sát kiến thức Tin học - Khối 4",
    description: "Bài thi tìm hiểu về hệ điều hành, soạn thảo văn bản Word và sử dụng Internet.",
    grade: 4,
    duration: 15, // 15 phút làm bài
    questions: [
      {
        id: "q4_1",
        question: "Để khởi động phần mềm soạn thảo văn bản Microsoft Word, em nháy đúp chuột vào biểu tượng nào?",
        options: [
          "Biểu tượng chữ 'W' màu xanh dương",
          "Biểu tượng chữ 'P' màu cam",
          "Biểu tượng chữ 'X' màu xanh lá",
          "Biểu tượng hình quả địa cầu"
        ],
        answer: 0, // Chữ W
        explanation: "Biểu tượng chữ W màu xanh dương là logo quen thuộc của phần mềm soạn thảo văn bản Microsoft Word."
      },
      {
        id: "q4_2",
        question: "Trong soạn thảo văn bản kiểu gõ TELEX, để gõ chữ 'â' em gõ phím nào?",
        options: [
          "gõ phím a và s",
          "gõ liên tiếp hai phím a (aa)",
          "gõ phím a và w",
          "gõ phím a và r"
        ],
        answer: 1, // aa
        explanation: "Theo quy tắc gõ TELEX: aa -> â, ee -> ê, oo -> ô, dd -> đ, uw -> ư, ow -> ơ."
      },
      {
        id: "q4_3",
        question: "Thư mục (Folder) trong máy tính được dùng để làm gì?",
        options: [
          "Để trang trí cho máy tính đẹp hơn",
          "Để lưu trữ và sắp xếp các tệp tin gọn gàng, khoa học",
          "Để máy tính chạy nhanh hơn",
          "Để kết nối Internet"
        ],
        answer: 1,
        explanation: "Thư mục giống như ngăn kéo tủ, giúp phân loại, sắp xếp các tài liệu, hình ảnh, bài học để dễ tìm kiếm."
      },
      {
        id: "q4_4",
        question: "Phần mềm nào sau đây là trình duyệt web dùng để truy cập thông tin trên mạng Internet?",
        options: [
          "Microsoft Paint",
          "Windows Media Player",
          "Google Chrome hoặc Cốc Cốc",
          "Microsoft Word"
        ],
        answer: 2,
        explanation: "Google Chrome, Cốc Cốc, Microsoft Edge, Safari... là các ứng dụng trình duyệt web phổ biến."
      },
      {
        id: "q4_5",
        question: "Khi soạn thảo văn bản, phím nào trên bàn phím dùng để xuống dòng và bắt đầu một đoạn văn mới?",
        options: [
          "Phím cách (Spacebar)",
          "Phím Shift",
          "Phím Enter",
          "Phím Caps Lock"
        ],
        answer: 2,
        explanation: "Phím Enter dùng để báo hiệu kết thúc một dòng hoặc một đoạn và di chuyển con trỏ xuống dòng tiếp theo."
      }
    ]
  },
  {
    id: "exam-khoi-5",
    title: "Khảo sát kiến thức Tin học - Khối 5",
    description: "Bài thi nâng cao về thiết kế trình chiếu PowerPoint, lập trình Scratch và thiết bị lưu trữ thông tin.",
    grade: 5,
    duration: 15, // 15 phút làm bài
    questions: [
      {
        id: "q5_1",
        question: "Phần mềm nào sau đây chuyên dùng để thiết kế bài trình chiếu và báo cáo?",
        options: [
          "Microsoft Word",
          "Microsoft PowerPoint",
          "Scratch",
          "Google Chrome"
        ],
        answer: 1, // PowerPoint
        explanation: "Microsoft PowerPoint cung cấp các công cụ thiết kế slide trình chiếu, hoạt họa sinh động hỗ trợ thuyết trình."
      },
      {
        id: "q5_2",
        question: "Trong phần mềm lập trình trực quan Scratch, nhân vật mặc định hiển thị lúc mới tạo dự án là gì?",
        options: [
          "Chú chó vàng",
          "Chú cá heo xanh",
          "Chú mèo vàng",
          "Chú chim bồ câu"
        ],
        answer: 2, // Chú mèo vàng
        explanation: "Nhân vật mặc định và cũng là biểu tượng của Scratch là chú mèo (Scratch Cat)."
      },
      {
        id: "q5_3",
        question: "Thiết bị nào sau đây dùng để lưu trữ dữ liệu ngoài, nhỏ gọn và có thể cắm trực tiếp vào cổng USB của máy tính?",
        options: [
          "Ổ đĩa CD/DVD",
          "Bộ nhớ RAM",
          "Thẻ nhớ hoặc thiết bị nhớ USB (Flash Drive)",
          "Bộ xử lý CPU"
        ],
        answer: 2,
        explanation: "USB Flash Drive là thiết bị lưu trữ ngoài di động, dung lượng đa dạng, tiện lợi để trao đổi dữ liệu."
      },
      {
        id: "q5_4",
        question: "Để chèn thêm một hình ảnh minh họa từ máy tính vào trang slide trình chiếu PowerPoint, em chọn thẻ lệnh nào?",
        options: [
          "Thẻ Home",
          "Thẻ Design",
          "Thẻ Insert (chọn Pictures)",
          "Thẻ View"
        ],
        answer: 2,
        explanation: "Thẻ 'Insert' (Chèn) chứa các chức năng chèn hình ảnh, bảng biểu, hình vẽ, hộp chữ (Text Box) vào trang chiếu."
      },
      {
        id: "q5_5",
        question: "Trong Scratch, khối lệnh màu vàng có chữ 'when green flag clicked' (khi nhấp vào cờ xanh) có tác dụng gì?",
        options: [
          "Để nhân vật chạy nhanh hơn",
          "Để xóa nhân vật hiện tại",
          "Để khởi chạy chương trình khi người dùng nhấn nút cờ xanh",
          "Để đổi màu nhân vật"
        ],
        answer: 2,
        explanation: "Cờ xanh là nút bắt đầu chạy kịch bản lập trình trong Scratch. Khối lệnh sự kiện này dùng để bắt đầu chạy các mã lệnh xếp phía dưới nó."
      }
    ]
  }
];
