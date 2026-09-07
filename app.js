// Mã nguồn React điều khiển ứng dụng thi Tin học Online
// Trường Tiểu học Quỳnh Châu

const { useState, useEffect, useRef } = React;

function App() {
  // --- Khởi tạo dữ liệu trong LocalStorage ---
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("qc_students");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeStudent, setActiveStudent] = useState(() => {
    const saved = localStorage.getItem("qc_active_student");
    return saved ? JSON.parse(saved) : null;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("qc_exams");
    if (saved) {
      return JSON.parse(saved);
    } else {
      localStorage.setItem("qc_exams", JSON.stringify(window.DEFAULT_EXAMS));
      return window.DEFAULT_EXAMS;
    }
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("qc_results");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Trạng thái giao diện ---
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedActive = localStorage.getItem("qc_active_student");
    return savedActive ? "student_dashboard" : "login";
  });

  // Trạng thái đăng nhập / đăng ký
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regGrade, setRegGrade] = useState("3");
  const [regClass, setRegClass] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Trạng thái Giáo viên đăng nhập
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherTab, setTeacherTab] = useState("results"); // 'results', 'students', 'exams'

  // Trạng thái làm bài thi
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({}); // { questionId: selectedIndex }
  const [timeLeft, setTimeLeft] = useState(0); // giây
  const timerRef = useRef(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Trạng thái xem kết quả bài thi vừa hoàn thành
  const [latestResult, setLatestResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // Trạng thái quản lý câu hỏi ở trang giáo viên
  const [selectedExamForEdit, setSelectedExamForEdit] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(0);
  const [newExplanation, setNewExplanation] = useState("");

  // Đồng bộ LocalStorage khi dữ liệu thay đổi
  useEffect(() => {
    localStorage.setItem("qc_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("qc_active_student", JSON.stringify(activeStudent));
  }, [activeStudent]);

  useEffect(() => {
    localStorage.setItem("qc_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("qc_results", JSON.stringify(results));
  }, [results]);

  // Bộ đếm thời gian cho bài thi
  useEffect(() => {
    if (currentScreen === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Hết giờ tự động nộp bài
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentScreen, timeLeft]);

  // --- Logic Đăng ký & Đăng nhập ---
  const handleRegister = (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim() || !regClass.trim()) {
      setRegError("Vui lòng điền đầy đủ tất cả các thông tin.");
      return;
    }

    const cleanedUsername = regUsername.trim().toLowerCase();
    const userExists = students.some((s) => s.username === cleanedUsername) || cleanedUsername === "admin";
    if (userExists) {
      setRegError("Tên đăng nhập này đã tồn tại trên hệ thống.");
      return;
    }

    const newStudent = {
      id: "std_" + Date.now(),
      name: regName.trim(),
      username: cleanedUsername,
      password: regPassword,
      grade: parseInt(regGrade),
      class: regClass.trim().toUpperCase()
    };

    setStudents([...students, newStudent]);
    setRegSuccess("Đăng ký tài khoản thành công! Em có thể đăng nhập ngay bây giờ.");
    // Reset form
    setRegName("");
    setRegUsername("");
    setRegPassword("");
    setRegClass("");

    // Chuyển sang tab đăng nhập sau 1.5 giây
    setTimeout(() => {
      setCurrentScreen("login");
      setRegSuccess("");
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const cleanedUsername = loginUsername.trim().toLowerCase();
    const password = loginPassword;

    if (!cleanedUsername || !password) {
      setLoginError("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    // Đăng nhập quyền Giáo viên
    if (cleanedUsername === "admin") {
      if (password === "quynhchau2026") {
        setCurrentScreen("teacher_dashboard");
        setLoginUsername("");
        setLoginPassword("");
        return;
      } else {
        setLoginError("Mật khẩu Giáo viên không chính xác.");
        return;
      }
    }

    // Đăng nhập học sinh
    const foundStudent = students.find(
      (s) => s.username === cleanedUsername && s.password === password
    );

    if (foundStudent) {
      setActiveStudent(foundStudent);
      setCurrentScreen("student_dashboard");
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  };

  const handleLogout = () => {
    setActiveStudent(null);
    setCurrentScreen("login");
  };

  // --- Logic Thi và Nộp Bài ---
  const startExam = (exam) => {
    setCurrentExam(exam);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeLeft(exam.duration * 60);
    setCurrentScreen("exam");
    setShowConfirmSubmit(false);
  };

  const selectAnswer = (questionId, optionIndex) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleAutoSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    submitExam(true);
  };

  const submitExam = (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirmSubmit(false);

    // Tính điểm
    let correctCount = 0;
    currentExam.questions.forEach((q) => {
      if (studentAnswers[q.id] === q.answer) {
        correctCount++;
      }
    });

    const score = parseFloat(((correctCount / currentExam.questions.length) * 10).toFixed(1));
    const timeTaken = currentExam.duration * 60 - timeLeft; // tính bằng giây

    const examResult = {
      id: "res_" + Date.now(),
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentClass: activeStudent.class,
      studentGrade: activeStudent.grade,
      examId: currentExam.id,
      examTitle: currentExam.title,
      score: score,
      correctCount: correctCount,
      totalQuestions: currentExam.questions.length,
      date: new Date().toLocaleString("vi-VN"),
      durationTaken: formatDuration(timeTaken),
      answers: studentAnswers
    };

    setResults([examResult, ...results]);
    setLatestResult(examResult);
    setCurrentScreen("result");
    setShowReview(false);

    // Kích hoạt pháo hoa chúc mừng nếu điểm số cao (>= 8)
    if (score >= 8 && typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const formatTimeLimit = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Logic Giáo viên quản lý câu hỏi ---
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some((opt) => !opt.trim())) {
      alert("Vui lòng điền nội dung câu hỏi và tất cả 4 đáp án lựa chọn.");
      return;
    }

    const updatedExams = exams.map((exam) => {
      if (exam.id === selectedExamForEdit.id) {
        const newQuestion = {
          id: "q_" + Date.now(),
          question: newQuestionText.trim(),
          options: [...newOptions],
          answer: newCorrectAnswer,
          explanation: newExplanation.trim() || "Chưa có lời giải thích chi tiết."
        };
        const updatedQuestions = [...exam.questions, newQuestion];
        // Đồng bộ dữ liệu cục bộ để hiển thị ngay
        setSelectedExamForEdit({
          ...exam,
          questions: updatedQuestions
        });
        return {
          ...exam,
          questions: updatedQuestions
        };
      }
      return exam;
    });

    setExams(updatedExams);
    // Reset Form
    setNewQuestionText("");
    setNewOptions(["", "", "", ""]);
    setNewCorrectAnswer(0);
    setNewExplanation("");
    alert("Thêm câu hỏi mới thành công!");
  };

  const handleDeleteQuestion = (questionId) => {
    if (!confirm("Thầy/Cô có chắc chắn muốn xóa câu hỏi này?")) return;

    const updatedExams = exams.map((exam) => {
      if (exam.id === selectedExamForEdit.id) {
        const updatedQuestions = exam.questions.filter((q) => q.id !== questionId);
        setSelectedExamForEdit({
          ...exam,
          questions: updatedQuestions
        });
        return {
          ...exam,
          questions: updatedQuestions
        };
      }
      return exam;
    });
    setExams(updatedExams);
  };

  // --- Giao diện Từng Screen ---

  // 1. Màn hình Đăng nhập
  const renderLogin = () => (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100 transition-all duration-300 hover:shadow-2xl">
      <div className="p-8">
        <div className="text-center mb-8">
          <span className="inline-block p-4 bg-indigo-50 text-indigo-600 rounded-full mb-3 shadow-inner">
            <i className="fas fa-graduation-cap text-4xl"></i>
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Học sinh đăng nhập</h2>
          <p className="text-gray-500 text-sm mt-1">Đăng nhập tài khoản để vào phòng thi online</p>
        </div>

        {loginError && (
          <div className="mb-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3 rounded-lg text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
              <i className="fas fa-user text-indigo-400"></i>
              Tên đăng nhập (hoặc 'admin')
            </label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Nhập tên đăng nhập..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
              <i className="fas fa-lock text-indigo-400"></i>
              Mật khẩu
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2 text-lg"
          >
            Đăng nhập ngay
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản học sinh?{" "}
            <button
              onClick={() => {
                setCurrentScreen("register");
                setLoginError("");
              }}
              className="text-indigo-600 font-bold hover:underline hover:text-indigo-800 transition"
            >
              Đăng ký tài khoản mới
            </button>
          </p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Mẹo cho Giáo viên: đăng nhập với tên 'admin'</p>
            <p>mật khẩu: 'quynhchau2026' để vào trang quản lý</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. Màn hình Đăng ký
  const renderRegister = () => (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100 transition-all duration-300">
      <div className="p-8">
        <div className="text-center mb-8">
          <span className="inline-block p-4 bg-emerald-50 text-emerald-600 rounded-full mb-3 shadow-inner">
            <i className="fas fa-user-plus text-4xl"></i>
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="text-gray-500 text-sm mt-1">Tạo tài khoản học sinh để tham gia thi</p>
        </div>

        {regError && (
          <div className="mb-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3 rounded-lg text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            <span>{regError}</span>
          </div>
        )}

        {regSuccess && (
          <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-3 rounded-lg text-sm flex items-center gap-2">
            <i className="fas fa-check-circle"></i>
            <span>{regSuccess}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
              <i className="fas fa-id-card text-emerald-400"></i>
              Họ và tên học sinh
            </label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Ví dụ: Nguyễn Văn A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
                <i className="fas fa-layer-group text-emerald-400"></i>
                Khối lớp
              </label>
              <select
                value={regGrade}
                onChange={(e) => setRegGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="3">Khối 3</option>
                <option value="4">Khối 4</option>
                <option value="5">Khối 5</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
                <i className="fas fa-users text-emerald-400"></i>
                Lớp học
              </label>
              <input
                type="text"
                value={regClass}
                onChange={(e) => setRegClass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Ví dụ: 3A, 4B, 5C"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
              <i className="fas fa-user text-emerald-400"></i>
              Tên đăng nhập viết liền không dấu
            </label>
            <input
              type="text"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Ví dụ: nguyenvana"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
              <i className="fas fa-lock text-emerald-400"></i>
              Mật khẩu đăng nhập
            </label>
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2 text-lg"
          >
            Tạo tài khoản
            <i className="fas fa-check text-sm"></i>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản học sinh?{" "}
            <button
              onClick={() => {
                setCurrentScreen("login");
                setRegError("");
              }}
              className="text-emerald-600 font-bold hover:underline hover:text-emerald-800 transition"
            >
              Đăng nhập tại đây
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // 3. Màn hình Bảng điều khiển Học sinh
  const renderStudentDashboard = () => {
    // Lọc đề thi phù hợp với khối lớp của học sinh đang đăng nhập
    const studentExams = exams.filter((e) => e.grade === activeStudent.grade);
    // Lọc kết quả thi đã làm của học sinh
    const studentHistory = results.filter((r) => r.studentId === activeStudent.id);

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Lời chào chào đón sinh động */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10 scale-150">
            <i className="fas fa-desktop text-[160px]"></i>
          </div>
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="bg-yellow-400 text-yellow-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md inline-block mb-1 animate-bounce">
              Chào mừng bạn nhỏ! 👋
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Chào em, <span className="text-yellow-300 font-black">{activeStudent.name}</span>
            </h2>
            <p className="text-blue-100 text-base">
              Lớp: <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{activeStudent.class}</span> | Khối: <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{activeStudent.grade}</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center z-10 w-full md:w-auto">
            <p className="text-xs text-blue-200">Đã hoàn thành</p>
            <p className="text-3xl font-black text-yellow-300">{studentHistory.length} bài</p>
          </div>
        </div>

        {/* Nội dung chính: Đề thi và Lịch sử */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Đề thi dành cho em */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-star text-yellow-400"></i>
                Bài thi Tin học dành cho em
              </h3>
              <span className="text-sm font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                Lớp {activeStudent.grade}
              </span>
            </div>

            {studentExams.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100">
                <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">Hiện tại chưa có đề thi nào được tạo cho Khối {activeStudent.grade}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-3xl p-6 shadow-md border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                          <i className="fas fa-laptop-code text-xl"></i>
                        </span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <i className="fas fa-clock"></i>
                          {exam.duration} phút
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {exam.title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {exam.description || "Bài thi khảo sát năng lực trực tuyến môn Tin học."}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">
                        Số câu hỏi: <span className="text-gray-700 font-bold">{exam.questions.length} câu</span>
                      </span>
                      <button
                        onClick={() => startExam(exam)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition shadow hover:shadow-md flex items-center gap-1.5"
                      >
                        Bắt đầu thi
                        <i className="fas fa-play text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cột phải: Lịch sử làm bài */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-history text-indigo-500"></i>
              Lịch sử làm bài
            </h3>

            {studentHistory.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100">
                <i className="fas fa-info-circle text-3xl text-gray-300 mb-2 animate-pulse"></i>
                <p className="text-gray-500 text-sm">Em chưa làm bài thi nào. Hãy bắt đầu bài thi đầu tiên ở bên nhé!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {studentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow transition duration-200 cursor-pointer"
                    onClick={() => {
                      setLatestResult(item);
                      setCurrentScreen("result");
                      setShowReview(true); // Mở thẳng phần xem lại bài
                    }}
                  >
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-800 text-sm line-clamp-1">{item.examTitle}</h5>
                      <div className="text-[11px] text-gray-400 space-y-0.5">
                        <p>{item.date}</p>
                        <p>Thời gian: {item.durationTaken}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span
                        className={`text-base font-black px-2.5 py-1 rounded-xl shadow-sm ${
                          item.score >= 8
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : item.score >= 5
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {item.score} / 10
                      </span>
                      <span className="text-[10px] text-indigo-500 font-semibold hover:underline">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 4. Màn hình làm bài thi
  const renderExam = () => {
    const q = currentExam.questions[currentQuestionIndex];
    const isAnswered = studentAnswers[q.id] !== undefined;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Thanh tiêu đề thi & đếm ngược */}
        <div className="bg-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row justify-between items-center gap-4 border border-indigo-100">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <i className="fas fa-file-signature text-xl animate-pulse"></i>
            </span>
            <div>
              <h3 className="font-bold text-gray-800 text-base md:text-lg">{currentExam.title}</h3>
              <p className="text-xs text-gray-400">
                Thí sinh: <span className="font-semibold text-gray-700">{activeStudent.name}</span> (Lớp {activeStudent.class})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Đồng hồ đếm ngược */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-black shadow-inner transition-colors duration-300 ${
                timeLeft <= 60
                  ? "bg-rose-50 text-rose-600 animate-pulse border border-rose-200"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-100"
              }`}
            >
              <i className={`fas fa-hourglass-half ${timeLeft <= 60 ? "animate-spin" : ""}`}></i>
              <span>{formatTimeLimit(timeLeft)}</span>
            </div>

            {/* Nút Nộp Bài */}
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow hover:shadow-lg flex items-center gap-1.5"
            >
              <i className="fas fa-paper-plane text-xs"></i>
              Nộp bài
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cột trái: Nội dung câu hỏi (Chiếm 3/4) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 flex flex-col justify-between min-h-[400px]">
            <div>
              {/* Tiêu đề câu hỏi */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase">
                  Câu hỏi {currentQuestionIndex + 1} / {currentExam.questions.length}
                </span>
                <span className="text-xs text-gray-400">
                  {isAnswered ? "Đã chọn đáp án" : "Chưa trả lời"}
                </span>
              </div>

              {/* Nội dung câu hỏi */}
              <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-8 leading-relaxed">
                {q.question}
              </h4>

              {/* Các phương án trả lời */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {q.options.map((option, index) => {
                  const prefix = ["A", "B", "C", "D"][index];
                  const isSelected = studentAnswers[q.id] === index;

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(q.id, index)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-600 shadow-md scale-[1.01]"
                          : "bg-white border-gray-200 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                        }`}
                      >
                        {prefix}
                      </span>
                      <span className={`text-base font-medium ${isSelected ? "text-indigo-950 font-bold" : "text-gray-700"}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nút chuyển câu hỏi */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center gap-1"
              >
                <i className="fas fa-chevron-left text-[10px]"></i>
                Câu trước
              </button>

              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(currentExam.questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestionIndex === currentExam.questions.length - 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center gap-1"
              >
                Câu tiếp theo
                <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Cột phải: Bản đồ câu hỏi (Chiếm 1/4) */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-2">Tiến độ làm bài</h4>
              {/* Thanh tiến độ */}
              <div className="w-full bg-gray-100 rounded-full h-3.5 dark:bg-gray-200 overflow-hidden shadow-inner">
                <div
                  className="bg-indigo-600 h-3.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (Object.keys(studentAnswers).length / currentExam.questions.length) * 100
                    }%`
                  }}
                ></div>
              </div>
              <div className="text-right text-[11px] text-gray-400 font-bold mt-1.5">
                Đã trả lời: {Object.keys(studentAnswers).length} / {currentExam.questions.length}
              </div>
            </div>

            {/* Lưới nút bấm chuyển nhanh câu hỏi */}
            <div>
              <h5 className="font-bold text-gray-700 text-xs uppercase mb-3 tracking-wider">
                Danh sách câu hỏi
              </h5>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                {currentExam.questions.map((question, index) => {
                  const isCurrent = index === currentQuestionIndex;
                  const isQAnswered = studentAnswers[question.id] !== undefined;

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        isCurrent
                          ? "ring-2 ring-indigo-600 ring-offset-2 scale-105"
                          : ""
                      } ${
                        isQAnswered
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mẹo nhỏ */}
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 text-xs text-yellow-800 flex gap-2">
              <i className="fas fa-info-circle text-sm mt-0.5"></i>
              <div>
                <p className="font-bold mb-0.5">Lời khuyên cho em:</p>
                <p className="leading-relaxed">Em có thể nhảy nhanh đến bất kỳ câu hỏi nào bằng cách nhấp chọn các số câu ở trên nhé!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal xác nhận nộp bài */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-indigo-50 animate-scale-up">
              <div className="text-center space-y-4">
                <span className="inline-block p-4 bg-amber-50 text-amber-500 rounded-full">
                  <i className="fas fa-question-circle text-4xl animate-bounce"></i>
                </span>
                <h3 className="text-xl font-bold text-gray-800">Xác nhận nộp bài</h3>
                <p className="text-gray-500 text-sm">
                  Em đã trả lời <span className="font-black text-indigo-600">{Object.keys(studentAnswers).length} / {currentExam.questions.length}</span> câu hỏi.
                  Em có thực sự muốn nộp bài thi ngay bây giờ không?
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                  >
                    Làm tiếp
                  </button>
                  <button
                    onClick={() => submitExam(false)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow hover:shadow-indigo-200 transition"
                  >
                    Đồng ý nộp bài
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 5. Màn hình Kết quả thi
  const renderResult = () => {
    if (!latestResult) return null;
    const isHigh = latestResult.score >= 8;
    const isMedium = latestResult.score >= 5;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Tấm bìa điểm số */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
              {showReview ? "Xem lại chi tiết bài làm" : "Kết quả thi của em"}
            </h2>

            {/* Điểm số */}
            <div className="relative inline-flex items-center justify-center">
              {/* Vòng tròn điểm */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-8 shadow-inner ${
                  isHigh
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                    : isMedium
                    ? "bg-amber-50 border-amber-500 text-amber-600"
                    : "bg-rose-50 border-rose-500 text-rose-600"
                }`}
              >
                <span className="text-5xl font-black">{latestResult.score}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Điểm
                </span>
              </div>
            </div>

            {/* Thông điệp khích lệ */}
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                {isHigh
                  ? "Xuất sắc! Con thật tuyệt vời! 🌟"
                  : isMedium
                  ? "Làm tốt lắm! Hãy cố gắng hơn ở lần sau nhé! 👍"
                  : "Đừng nản lòng nhé! Con hãy ôn tập và thử lại nào! 💪"}
              </h3>
              <p className="text-gray-500 text-sm">
                Em đã làm đúng <span className="font-bold text-gray-700">{latestResult.correctCount}</span> trên tổng số <span className="font-bold text-gray-700">{latestResult.totalQuestions}</span> câu hỏi.
              </p>
            </div>

            {/* Thống kê chi tiết */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Thời gian</p>
                <p className="font-bold text-gray-700 text-sm truncate">{latestResult.durationTaken}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Đề thi</p>
                <p className="font-bold text-gray-700 text-sm truncate">{latestResult.examTitle}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Ngày làm</p>
                <p className="font-bold text-gray-700 text-sm truncate">{latestResult.date.split(" ")[0]}</p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentScreen("student_dashboard");
                  setLatestResult(null);
                  setShowReview(false);
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition duration-200 flex items-center gap-2"
              >
                <i className="fas fa-home"></i>
                Quay lại Trang chủ
              </button>

              {!showReview && (
                <button
                  onClick={() => setShowReview(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow hover:shadow-indigo-200 transition duration-200 flex items-center gap-2"
                >
                  <i className="fas fa-search-plus"></i>
                  Xem đáp án chi tiết
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Đáp án chi tiết */}
        {showReview && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
              <i className="fas fa-tasks text-indigo-600"></i>
              Đáp án chi tiết các câu hỏi
            </h3>

            {(() => {
              const exam = exams.find((e) => e.id === latestResult.examId);
              if (!exam) return <p className="text-gray-500 text-center">Không tìm thấy dữ liệu đề thi tương ứng.</p>;

              return exam.questions.map((question, qIdx) => {
                const selectedAns = latestResult.answers[question.id];
                const correctAns = question.answer;
                const isCorrect = selectedAns === correctAns;

                return (
                  <div
                    key={question.id}
                    className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${
                      isCorrect ? "border-emerald-100 hover:border-emerald-300" : "border-rose-100 hover:border-rose-300"
                    } transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-gray-400">Câu hỏi {qIdx + 1}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <i className={isCorrect ? "fas fa-check" : "fas fa-times"}></i>
                        {isCorrect ? "Trả lời Đúng" : "Trả lời Sai"}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-800 text-base mb-4 leading-relaxed">
                      {question.question}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {question.options.map((opt, optIdx) => {
                        const optPrefix = ["A", "B", "C", "D"][optIdx];
                        const isStudentChoice = selectedAns === optIdx;
                        const isCorrectChoice = correctAns === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm font-medium transition ${
                              isCorrectChoice
                                ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                                : isStudentChoice
                                ? "bg-rose-50 border-rose-500 text-rose-950"
                                : "bg-gray-50 border-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isCorrectChoice
                                  ? "bg-emerald-600 text-white"
                                  : isStudentChoice
                                  ? "bg-rose-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {optPrefix}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Giải thích câu trả lời */}
                    <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-50/80 text-xs text-indigo-900 flex gap-2">
                      <i className="fas fa-lightbulb text-sm text-amber-500 mt-0.5"></i>
                      <div>
                        <p className="font-bold mb-1">Giải thích đáp án đúng:</p>
                        <p className="leading-relaxed text-indigo-950">
                          {question.explanation || "Đáp án đúng là đáp án được tô màu xanh."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    );
  };

  // 6. Màn hình quản trị của Giáo viên
  const renderTeacherDashboard = () => {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Banner Giáo viên */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex justify-between items-center">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              Hệ thống Quản lý
            </span>
            <h2 className="text-2xl font-black">Bảng điều khiển của Giáo viên</h2>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5"
          >
            <i className="fas fa-sign-out-alt"></i>
            Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu điều khiển bên trái */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-2 lg:col-span-1 h-fit">
            <button
              onClick={() => {
                setTeacherTab("results");
                setSelectedExamForEdit(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
                teacherTab === "results"
                  ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <i className="fas fa-poll-h"></i>
              Kết quả học sinh
            </button>
            <button
              onClick={() => {
                setTeacherTab("students");
                setSelectedExamForEdit(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
                teacherTab === "students"
                  ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <i className="fas fa-users-cog"></i>
              Danh sách học sinh
            </button>
            <button
              onClick={() => {
                setTeacherTab("exams");
                setSelectedExamForEdit(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
                teacherTab === "exams"
                  ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <i className="fas fa-folder-open"></i>
              Quản lý đề thi
            </button>
          </div>

          {/* Nội dung bên phải */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
            {/* Tab: Kết quả thi */}
            {teacherTab === "results" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-800">Bảng điểm thi học sinh</h3>
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Chưa có kết quả làm bài nào của học sinh.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                          <th className="py-3 px-4">Tên học sinh</th>
                          <th className="py-3 px-4">Lớp</th>
                          <th className="py-3 px-4">Khối</th>
                          <th className="py-3 px-4">Đề thi</th>
                          <th className="py-3 px-4 text-center">Điểm số</th>
                          <th className="py-3 px-4 text-center">Thời gian</th>
                          <th className="py-3 px-4">Ngày thi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((res) => (
                          <tr key={res.id} className="border-b border-gray-50 hover:bg-slate-50 transition">
                            <td className="py-3.5 px-4 font-bold text-gray-800">{res.studentName}</td>
                            <td className="py-3.5 px-4 text-gray-600 font-semibold">{res.studentClass}</td>
                            <td className="py-3.5 px-4 text-gray-600">Khối {res.studentGrade}</td>
                            <td className="py-3.5 px-4 text-gray-600 line-clamp-1 max-w-[160px]">{res.examTitle}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`font-black px-2 py-0.5 rounded ${
                                  res.score >= 8
                                    ? "bg-emerald-50 text-emerald-600"
                                    : res.score >= 5
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}
                              >
                                {res.score}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-xs text-gray-500">{res.durationTaken}</td>
                            <td className="py-3.5 px-4 text-xs text-gray-500">{res.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Danh sách học sinh */}
            {teacherTab === "students" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-800">Danh sách tài khoản học sinh</h3>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Chưa có tài khoản học sinh nào đăng ký trên hệ thống.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                          <th className="py-3 px-4">Họ và tên</th>
                          <th className="py-3 px-4">Tên đăng nhập</th>
                          <th className="py-3 px-4">Mật khẩu</th>
                          <th className="py-3 px-4">Khối</th>
                          <th className="py-3 px-4">Lớp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b border-gray-50 hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-bold text-gray-800">{student.name}</td>
                            <td className="py-3 px-4 text-gray-600 code">{student.username}</td>
                            <td className="py-3 px-4 text-gray-600">{student.password}</td>
                            <td className="py-3 px-4 text-gray-600">Khối {student.grade}</td>
                            <td className="py-3 px-4 text-gray-600 font-semibold">{student.class}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Quản lý đề thi */}
            {teacherTab === "exams" && !selectedExamForEdit && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-800">Danh sách đề thi hiện tại</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exams.map((exam) => (
                    <div key={exam.id} className="p-5 border-2 border-gray-100 hover:border-teal-500 rounded-2xl space-y-4 flex flex-col justify-between transition duration-200">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                            Khối {exam.grade}
                          </span>
                          <span className="text-xs text-gray-400">
                            {exam.duration} phút
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mt-2 text-base">{exam.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{exam.questions.length} câu hỏi</p>
                      </div>
                      <button
                        onClick={() => setSelectedExamForEdit(exam)}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <i className="fas fa-edit"></i>
                        Chi tiết & Thêm câu hỏi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chế độ Chi tiết Đề thi (Sửa câu hỏi) */}
            {teacherTab === "exams" && selectedExamForEdit && (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <button
                      onClick={() => setSelectedExamForEdit(null)}
                      className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 mb-1"
                    >
                      ← Quay lại danh sách đề
                    </button>
                    <h3 className="text-lg font-black text-gray-800">{selectedExamForEdit.title}</h3>
                  </div>
                  <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                    Khối {selectedExamForEdit.grade}
                  </span>
                </div>

                {/* Form thêm câu hỏi */}
                <form onSubmit={handleAddQuestion} className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <i className="fas fa-plus-circle text-teal-600"></i>
                    Thêm câu hỏi mới vào đề thi
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nội dung câu hỏi</label>
                    <textarea
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Nhập nội dung câu hỏi..."
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Đáp án {["A", "B", "C", "D"][idx]}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updatedOpts = [...newOptions];
                            updatedOpts[idx] = e.target.value;
                            setNewOptions(updatedOpts);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder={`Đáp án ${["A", "B", "C", "D"][idx]}...`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Đáp án đúng</label>
                      <select
                        value={newCorrectAnswer}
                        onChange={(e) => setNewCorrectAnswer(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="0">Đáp án A</option>
                        <option value="1">Đáp án B</option>
                        <option value="2">Đáp án C</option>
                        <option value="3">Đáp án D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Lời giải thích chi tiết (tùy chọn)</label>
                      <input
                        type="text"
                        value={newExplanation}
                        onChange={(e) => setNewExplanation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Giải thích vì sao đáp án đó đúng..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow hover:shadow-teal-100 flex items-center gap-1 ml-auto"
                  >
                    <i className="fas fa-plus"></i>
                    Thêm vào đề
                  </button>
                </form>

                {/* Danh sách câu hỏi hiện tại */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm">Danh sách câu hỏi hiện tại ({selectedExamForEdit.questions.length})</h4>
                  {selectedExamForEdit.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-100 flex justify-between gap-4 hover:bg-slate-50 transition duration-150">
                      <div className="space-y-2">
                        <p className="font-bold text-gray-800 text-sm">
                          Câu {idx + 1}: {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <p key={oIdx} className={q.answer === oIdx ? "text-emerald-600 font-bold" : ""}>
                              {["A", "B", "C", "D"][oIdx]}. {opt}
                            </p>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold self-start mt-0.5 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 flex flex-col font-sans">
      {/* Khung Header */}
      <header className="bg-white shadow-md border-b-4 border-indigo-600 sticky top-0 z-40 transition duration-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Tên trường & Icon */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => {
            if (activeStudent) {
              setCurrentScreen("student_dashboard");
            } else if (currentScreen !== "teacher_dashboard") {
              setCurrentScreen("login");
            }
          }}>
            <span className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md transform rotate-[-3deg] hover:rotate-0 transition duration-300">
              <i className="fas fa-desktop text-2xl md:text-3xl"></i>
            </span>
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl font-black text-indigo-900 tracking-tight leading-none uppercase">
                Tiểu học Quỳnh Châu
              </h1>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest leading-none">
                Cổng Thi Tin học Trực tuyến
              </p>
            </div>
          </div>

          {/* Trạng thái Người dùng đăng nhập */}
          {activeStudent && currentScreen !== "exam" && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="font-bold text-gray-800 text-sm">
                  {activeStudent.name}
                </span>
                <span className="text-[11px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">
                  Lớp {activeStudent.class}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-100 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5"
              >
                <i className="fas fa-sign-out-alt"></i>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Nội dung chính ứng dụng */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {currentScreen === "login" && renderLogin()}
        {currentScreen === "register" && renderRegister()}
        {currentScreen === "student_dashboard" && renderStudentDashboard()}
        {currentScreen === "exam" && renderExam()}
        {currentScreen === "result" && renderResult()}
        {currentScreen === "teacher_dashboard" && renderTeacherDashboard()}
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© 2026 Trường Tiểu học Quỳnh Châu. Thiết kế dành cho học tập.</p>
          <div className="flex gap-4">
            {currentScreen !== "exam" && (
              <button
                onClick={() => {
                  if (currentScreen === "teacher_dashboard") {
                    if (activeStudent) {
                      setCurrentScreen("student_dashboard");
                    } else {
                      setCurrentScreen("login");
                    }
                  } else {
                    // Mở cửa sổ nhắc đăng nhập admin
                    const userPass = prompt("Vui lòng nhập mật khẩu quản trị viên (Giáo viên):");
                    if (userPass === "quynhchau2026") {
                      setCurrentScreen("teacher_dashboard");
                    } else if (userPass !== null) {
                      alert("Mật khẩu không chính xác!");
                    }
                  }
                }}
                className="hover:text-indigo-600 hover:underline transition font-bold"
              >
                {currentScreen === "teacher_dashboard" ? "Trang học sinh" : "Cổng cho Giáo viên"}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Render component chính
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
