const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Dữ liệu mặc định ban đầu
const DEFAULT_DATA = {
  adminPassword: "quynhchau2026",
  students: [],
  exams: [
    {
      id: "exam-khoi-3",
      title: "Khảo sát kiến thức Tin học - Khối 3",
      description: "Bài thi trắc nghiệm tìm hiểu về các bộ phận máy tính và thao tác cơ bản.",
      grade: 3,
      duration: 10,
      isOpen: true,
      scheduleMode: "manual",
      allowViewScore: true,
      allowViewReview: true,
      questions: [
        {
          id: "q3_1",
          question: "Bộ phận nào của máy tính dùng để nhập chữ và số vào máy tính?",
          options: ["Chuột máy tính", "Màn hình máy tính", "Bàn phím máy tính", "Thân máy tính"],
          answer: 2,
          explanation: "Bàn phím chứa các phím chữ, số và ký tự đặc biệt giúp ta nhập thông tin văn bản vào máy tính."
        },
        {
          id: "q3_2",
          question: "Bộ phận nào được ví như 'bộ não' điều khiển mọi hoạt động của máy tính?",
          options: ["Màn hình (Monitor)", "Thân máy (chứa bộ xử lý trung tâm - CPU)", "Chuột (Mouse)", "Loa (Speaker)"],
          answer: 1,
          explanation: "Bộ xử lý trung tâm (CPU) nằm trong thân máy tính, thực hiện nhiệm vụ xử lý dữ liệu và điều khiển mọi hoạt động của máy."
        },
        {
          id: "q3_3",
          question: "Chuột máy tính thường có hai nút cơ bản là những nút nào?",
          options: ["Nút trên và nút dưới", "Nút trái và nút phải", "Nút giữa và nút bên hông", "Không có nút nào"],
          answer: 1,
          explanation: "Chuột máy tính thông dụng có nút trái (dùng nhiều nhất) và nút phải để mở rộng tính năng."
        },
        {
          id: "q3_4",
          question: "Màn hình máy tính có chức năng gì?",
          options: ["Để gõ chữ", "Để điều khiển con trỏ", "Để hiển thị kết quả làm việc của máy tính", "Để phát ra âm thanh"],
          answer: 2,
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
      duration: 15,
      isOpen: true,
      scheduleMode: "manual",
      allowViewScore: true,
      allowViewReview: true,
      questions: [
        {
          id: "q4_1",
          question: "Để khởi động phần mềm soạn thảo văn bản Microsoft Word, em nháy đúp chuột vào biểu tượng nào?",
          options: ["Biểu tượng chữ 'W' màu xanh dương", "Biểu tượng chữ 'P' màu cam", "Biểu tượng chữ 'X' màu xanh lá", "Biểu tượng hình quả địa cầu"],
          answer: 0,
          explanation: "Biểu tượng chữ W màu xanh dương là logo quen thuộc của phần mềm soạn thảo văn bản Microsoft Word."
        },
        {
          id: "q4_2",
          question: "Trong soạn thảo văn bản kiểu gõ TELEX, để gõ chữ 'â' em gõ phím nào?",
          options: ["gõ phím a và s", "gõ liên tiếp hai phím a (aa)", "gõ phím a và w", "gõ phím a và r"],
          answer: 1,
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
          options: ["Microsoft Paint", "Windows Media Player", "Google Chrome hoặc Cốc Cốc", "Microsoft Word"],
          answer: 2,
          explanation: "Google Chrome, Cốc Cốc, Microsoft Edge, Safari... là các ứng dụng trình duyệt web phổ biến."
        },
        {
          id: "q4_5",
          question: "Khi soạn thảo văn bản, phím nào trên bàn phím dùng để xuống dòng và bắt đầu một đoạn văn mới?",
          options: ["Phím cách (Spacebar)", "Phím Shift", "Phím Enter", "Phím Caps Lock"],
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
      duration: 15,
      isOpen: true,
      scheduleMode: "manual",
      allowViewScore: true,
      allowViewReview: true,
      questions: [
        {
          id: "q5_1",
          question: "Phần mềm nào sau đây chuyên dùng để thiết kế bài trình chiếu và báo cáo?",
          options: ["Microsoft Word", "Microsoft PowerPoint", "Scratch", "Google Chrome"],
          answer: 1,
          explanation: "Microsoft PowerPoint cung cấp các công cụ thiết kế slide trình chiếu, hoạt họa sinh động hỗ trợ thuyết trình."
        },
        {
          id: "q5_2",
          question: "Trong phần mềm lập trình trực quan Scratch, nhân vật mặc định hiển thị lúc mới tạo dự án là gì?",
          options: ["Chú chó vàng", "Chú cá heo xanh", "Chú mèo vàng", "Chú chim bồ câu"],
          answer: 2,
          explanation: "Nhân vật mặc định và cũng là biểu tượng của Scratch là chú mèo (Scratch Cat)."
        },
        {
          id: "q5_3",
          question: "Thiết bị nào sau đây dùng để lưu trữ dữ liệu ngoài, nhỏ gọn và có thể cắm trực tiếp vào cổng USB của máy tính?",
          options: ["Ổ đĩa CD/DVD", "Bộ nhớ RAM", "Thẻ nhớ hoặc thiết bị nhớ USB (Flash Drive)", "Bộ xử lý CPU"],
          answer: 2,
          explanation: "USB Flash Drive là thiết bị lưu trữ ngoài di động, dung lượng đa dạng, tiện lợi để trao đổi dữ liệu."
        },
        {
          id: "q5_4",
          question: "Để chèn thêm một hình ảnh minh họa từ máy tính vào trang slide trình chiếu PowerPoint, em chọn thẻ lệnh nào?",
          options: ["Thẻ Home", "Thẻ Design", "Thẻ Insert (chọn Pictures)", "Thẻ View"],
          answer: 2,
          explanation: "Thẻ 'Insert' (Chèn) chứa các chức năng chèn hình ảnh, bảng biểu, hình vẽ, hộp chữ (Text Box) vào trang chiếu."
        },
        {
          id: "q5_5",
          question: "Trong Scratch, khối lệnh màu vàng có chữ 'when green flag clicked' (khi nhấp vào cờ xanh) có tác dụng gì?",
          options: ["Để nhân vật chạy nhanh hơn", "Để xóa nhân vật hiện tại", "Để khởi chạy chương trình khi người dùng nhấn nút cờ xanh", "Để đổi màu nhân vật"],
          answer: 2,
          explanation: "Cờ xanh là nút bắt đầu chạy kịch bản lập trình trong Scratch."
        }
      ]
    }
  ],
  results: [],
  retakeRequests: []
};

// Đọc dữ liệu từ db.json
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...data };
  } catch (err) {
    console.error("Lỗi đọc cơ sở dữ liệu db.json:", err);
    return DEFAULT_DATA;
  }
}

// Lưu dữ liệu vào db.json
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Lỗi ghi cơ sở dữ liệu db.json:", err);
  }
}

// --- REST API ENDPOINTS ---

// 1. Kiểm tra kết nối Server
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Server Thi Tin học TH Quỳnh Châu đang hoạt động bình thường!" });
});

// 2. Lấy toàn bộ dữ liệu ban đầu cho Client
app.get('/api/sync-all', (req, res) => {
  const db = loadDB();
  res.json({
    students: db.students || [],
    exams: db.exams || [],
    results: db.results || [],
    retakeRequests: db.retakeRequests || []
  });
});

// Tiện ích xóa dấu tiếng Việt cho Server
function removeVietnameseTones(str) {
  if (!str) return "";
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|E|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0309|\u0303|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ + /g," ");
  str = str.trim();
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  str = str.replace(/\s+/g, "");
  return str.toLowerCase();
}

// 3. Đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = loadDB();

  const rawUsername = username ? String(username).trim() : "";
  const cleanedUsername = rawUsername.toLowerCase();
  const inputNoTone = removeVietnameseTones(rawUsername);
  const currentAdminPass = db.adminPassword || "quynhchau2026";

  if (cleanedUsername === "admin" && password === currentAdminPass) {
    return res.json({ success: true, role: "admin", user: { name: "Giáo viên Tin học", username: "admin" } });
  }

  const student = db.students.find(s => {
    if (String(s.password).trim() !== String(password).trim()) return false;

    const sUsername = String(s.username || "").trim().toLowerCase();
    const sName = String(s.name || "").trim().toLowerCase();
    const sNameNoTone = removeVietnameseTones(s.name || "");
    const sUserBaseNoTone = removeVietnameseTones(sUsername.split('.')[0] || "");

    return (
      sUsername === cleanedUsername ||
      sName === cleanedUsername ||
      sNameNoTone === inputNoTone ||
      sUserBaseNoTone === inputNoTone
    );
  });

  if (student) {
    return res.json({ success: true, role: "student", user: student });
  }

  return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
});

// 3.5. Thay đổi mật khẩu Giáo viên (Admin)
app.put('/api/admin/password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const db = loadDB();
  const currentPass = db.adminPassword || "quynhchau2026";

  if (oldPassword !== currentPass) {
    return res.status(400).json({ success: false, message: "Mật khẩu hiện tại của Giáo viên không chính xác!" });
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 4 ký tự!" });
  }

  db.adminPassword = newPassword.trim();
  saveDB(db);
  res.json({ success: true, message: "Đã cập nhật mật khẩu Giáo viên thành công!" });
});

// 4. Quản lý học sinh
app.get('/api/students', (req, res) => {
  const db = loadDB();
  res.json(db.students || []);
});

app.post('/api/students', (req, res) => {
  const { name, username, password, grade, class: cls } = req.body;
  const db = loadDB();

  if (db.students.some(s => s.username === username)) {
    return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
  }

  const newStudent = {
    id: "std_" + Date.now() + "_" + Math.floor(Math.random()*1000),
    name: name.trim(),
    username: username.trim(),
    password: password.trim(),
    grade: String(grade),
    class: cls.trim()
  };

  db.students.push(newStudent);
  saveDB(db);
  res.json({ success: true, student: newStudent, students: db.students });
});

app.post('/api/students/bulk', (req, res) => {
  const { students } = req.body;
  const db = loadDB();

  let addedCount = 0;
  students.forEach(st => {
    if (!db.students.some(s => s.username === st.username)) {
      db.students.push({
        id: "std_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        name: st.name.trim(),
        username: st.username.trim(),
        password: st.password.trim(),
        grade: String(st.grade),
        class: st.class.trim()
      });
      addedCount++;
    }
  });

  saveDB(db);
  res.json({ success: true, addedCount, students: db.students });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.students = db.students.filter(s => s.id !== id);
  saveDB(db);
  res.json({ success: true, students: db.students });
});

// 5. Quản lý Đề thi
app.get('/api/exams', (req, res) => {
  const db = loadDB();
  res.json(db.exams || []);
});

app.post('/api/exams', (req, res) => {
  const newExam = req.body;
  const db = loadDB();
  db.exams.push(newExam);
  saveDB(db);
  res.json({ success: true, exams: db.exams });
});

app.put('/api/exams/:id', (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const db = loadDB();

  db.exams = db.exams.map(e => e.id === id ? { ...e, ...updatedFields } : e);
  saveDB(db);
  res.json({ success: true, exams: db.exams });
});

app.delete('/api/exams/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.exams = db.exams.filter(e => e.id !== id);
  saveDB(db);
  res.json({ success: true, exams: db.exams });
});

// 6. Nộp bài thi & Lấy kết quả
app.get('/api/results', (req, res) => {
  const db = loadDB();
  res.json(db.results || []);
});

app.post('/api/results', (req, res) => {
  const newResult = req.body;
  const db = loadDB();

  db.results = db.results.filter(r => !(r.studentId === newResult.studentId && r.examId === newResult.examId));
  db.results.unshift(newResult);

  db.retakeRequests = db.retakeRequests.map(req => {
    if (req.studentId === newResult.studentId && req.examId === newResult.examId && req.status === "approved") {
      return { ...req, used: true };
    }
    return req;
  });

  saveDB(db);
  res.json({ success: true, results: db.results, retakeRequests: db.retakeRequests });
});

// 7. Quản lý Xin thi lại
app.get('/api/retakes', (req, res) => {
  const db = loadDB();
  res.json(db.retakeRequests || []);
});

app.post('/api/retakes', (req, res) => {
  const newReq = req.body;
  const db = loadDB();

  db.retakeRequests = db.retakeRequests.filter(r => !(r.studentId === newReq.studentId && r.examId === newReq.examId));
  db.retakeRequests.unshift(newReq);

  saveDB(db);
  res.json({ success: true, retakeRequests: db.retakeRequests });
});

app.put('/api/retakes/:id', (req, res) => {
  const { id } = req.params;
  const { status, used } = req.body;
  const db = loadDB();

  db.retakeRequests = db.retakeRequests.map(r => {
    if (r.id === id) {
      return { ...r, status: status || r.status, used: used !== undefined ? used : r.used, approvedTime: new Date().toLocaleString("vi-VN") };
    }
    return r;
  });

  saveDB(db);
  res.json({ success: true, retakeRequests: db.retakeRequests });
});

app.delete('/api/retakes/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.retakeRequests = db.retakeRequests.filter(r => r.id !== id);
  saveDB(db);
  res.json({ success: true, retakeRequests: db.retakeRequests });
});

// Khởi chạy Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 Server Thi Tin học TH Quỳnh Châu đang chạy tại:`);
  console.log(`👉 Trực tiếp trên máy chủ: http://localhost:${PORT}`);
  console.log(`👉 Cho các máy khác trong Mạng LAN: http://[Địa_Chỉ_IP_Máy_GV]:${PORT}`);
  console.log(`=======================================================`);
});
