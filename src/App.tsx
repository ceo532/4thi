/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
  HelpCircle,
  Send,
  User,
  ListOrdered,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTIONS, STUDENTS, Question, StudentName } from './questions';

const WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbw00EtPyhylfx8ZUg3o7CFvc5g44RK17byvTJqy8kMY6grcfIVpTAT7Enu9NenGnBFR/exec';

type Screen = 'name_select' | 'quiz' | 'result';
type FilterType = 'all' | 'correct' | 'wrong';

export default function App() {
  const [screen, setScreen] = useState<Screen>('name_select');
  const [selectedName, setSelectedName] = useState<StudentName | ''>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState<boolean>(false);
  const [resultFilter, setResultFilter] = useState<FilterType>('all');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'sending' | 'synced' | 'error'>('idle');

  const questionCardRef = useRef<HTMLDivElement>(null);

  // Scroll to top when changing question
  useEffect(() => {
    if (screen === 'quiz') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, screen]);

  // Handle fire confetti when entering result screen
  useEffect(() => {
    if (screen === 'result') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback if confetti fails
      }
    }
  }, [screen]);

  // Submit test and send webhook
  const submitQuiz = () => {
    // Calculate raw correct count
    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.cau] === q.dapAn) {
        correctCount += 1;
      }
    });

    setScreen('result');
    setShowConfirmModal(false);

    // POST to Google Sheet & Telegram Webhook
    setSyncStatus('sending');
    const payload = {
      ten: selectedName,
      lop: '7',
      diem: correctCount,
      tongCau: 40,
      url: window.location.href,
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        setSyncStatus('synced');
        console.log('Quiz results submitted successfully:', res.status);
      })
      .catch((err) => {
        // Silent error: do not block student from seeing their score
        setSyncStatus('error');
        console.warn('Webhook sync error (silent):', err);
      });
  };

  // Reset quiz
  const handleReset = () => {
    setSelectedName('');
    setCurrentIndex(0);
    setAnswers({});
    setShowConfirmModal(false);
    setShowQuestionPalette(false);
    setResultFilter('all');
    setSyncStatus('idle');
    setScreen('name_select');
  };

  const currentQuestion: Question = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = QUESTIONS.length - answeredCount;

  // Calculate score for result screen
  const correctCount = QUESTIONS.filter((q) => answers[q.cau] === q.dapAn).length;
  const wrongCount = QUESTIONS.length - correctCount;

  const handleNextClick = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question (câu 40)
      if (unansweredCount > 0) {
        setShowConfirmModal(true);
      } else {
        submitQuiz();
      }
    }
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.cau]: option,
    }));
  };

  // Extract grammar topic from question string if present (e.g. "Present Simple:")
  const getGrammarBadge = (hoi: string) => {
    const colonIdx = hoi.indexOf(':');
    if (colonIdx > 0 && colonIdx < 35) {
      return hoi.substring(0, colonIdx).trim();
    }
    return 'English 7';
  };

  // -------------------------------------------------------------
  // SCREEN 1: MÀN HÌNH CHỌN TÊN
  // -------------------------------------------------------------
  if (screen === 'name_select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        <div className="max-w-xl w-full mx-auto my-auto">
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-indigo-200 mb-4 animate-bounce">
              <GraduationCap className="w-11 h-11" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Bài Tập Trắc Nghiệm Tiếng Anh 7
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base font-medium">
              Chuyên đề: 4 thì cơ bản trong Tiếng Anh (Hiện tại & Quá khứ)
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 p-6 sm:p-8 border border-slate-100">
            {/* Instruction Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 leading-relaxed">
                <span className="font-bold">Chào mừng các em!</span> Bài tập gồm{' '}
                <span className="font-bold text-indigo-700">40 câu hỏi</span> trắc nghiệm. Hãy chọn đúng tên của mình để bắt đầu làm bài và lưu điểm nhé!
              </div>
            </div>

            {/* Student Selector */}
            <div className="mb-6">
              <label
                htmlFor="student-select"
                className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-600" />
                Chọn tên của em <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="student-select"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value as StudentName | '')}
                  className="w-full bg-slate-50 border-2 border-slate-200 hover:border-blue-400 focus:border-blue-600 focus:bg-white text-slate-800 font-semibold rounded-2xl px-4 py-3.5 outline-none transition-all cursor-pointer text-base"
                >
                  <option value="">-- Chọn tên của em trong danh sách --</option>
                  {STUDENTS.map((name) => (
                    <option key={name} value={name} className="py-2">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Select Buttons */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Hoặc bấm chọn nhanh tên của em:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {STUDENTS.map((name) => {
                    const isSelected = selectedName === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedName(name)}
                        className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all duration-200 flex flex-col items-center gap-1 border-2 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-md shadow-blue-100 scale-102'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-lg">
                          {name === 'Bảo Khuê' ? '🌸' : name === 'Duy Sang' ? '⚡' : '✨'}
                        </span>
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Overview Info */}
            <div className="grid grid-cols-2 gap-3 mb-6 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Tổng số: <strong>40 câu</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Chấm điểm: <strong>Tự động</strong></span>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="button"
              disabled={!selectedName}
              onClick={() => {
                if (selectedName) {
                  setScreen('quiz');
                }
              }}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
                selectedName
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-300 active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Bắt đầu làm bài</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Lớp 7 • Ôn tập ngữ pháp tiếng Anh • Chúc các em làm bài thật tốt!
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: MÀN HÌNH LÀM BÀI (40 CÂU TRẮC NGHIỆM)
  // -------------------------------------------------------------
  if (screen === 'quiz') {
    const isAnswered = answers[currentQuestion.cau] !== undefined;
    const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);
    const isLastQuestion = currentIndex === QUESTIONS.length - 1;
    const grammarTopic = getGrammarBadge(currentQuestion.hoi);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Học sinh</div>
                <div className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                  {selectedName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Question Palette Toggle */}
              <button
                type="button"
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                title="Bảng câu hỏi"
              >
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <span>
                  {answeredCount}/{QUESTIONS.length}
                </span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-2xl mx-auto mt-2.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
              <span>Câu {currentIndex + 1} trên {QUESTIONS.length}</span>
              <span className="text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* Question Palette Drawer (Collapsible) */}
        {showQuestionPalette && (
          <div className="bg-white border-b border-slate-200 p-4 shadow-md max-w-2xl mx-auto w-full animate-in slide-in-from-top-4 duration-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                Danh sách 40 câu hỏi
              </h3>
              <button
                type="button"
                onClick={() => setShowQuestionPalette(false)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-1">
              {QUESTIONS.map((q, idx) => {
                const isSelectedCurrent = currentIndex === idx;
                const hasAnswer = answers[q.cau] !== undefined;
                return (
                  <button
                    key={q.cau}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowQuestionPalette(false);
                    }}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      isSelectedCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-1 bg-blue-600 text-white'
                        : hasAnswer
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {q.cau}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" /> Đã chọn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block" /> Chưa chọn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Đang xem
              </span>
            </div>
          </div>
        )}

        {/* Main Quiz Area */}
        <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
          <div
            ref={questionCardRef}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200/80 mb-6"
          >
            {/* Tense / Category badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {grammarTopic}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Câu {currentQuestion.cau} / 40
              </span>
            </div>

            {/* Question Text (Exact verbatim English) */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
                {currentQuestion.hoi}
              </h2>
            </div>

            {/* 4 Options: A, B, C, D */}
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = currentQuestion[optKey];
                const isSelected = answers[currentQuestion.cau] === optKey;

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-2xl border-2 font-semibold text-base transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-md shadow-blue-100 scale-[1.01]'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="font-bold text-slate-800">{optText}</span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Bottom Navigation Toolbar */}
        <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3.5 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrevClick}
              disabled={currentIndex === 0}
              className={`px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Câu trước</span>
            </button>

            {/* Answered Status Hint */}
            <div className="text-center text-xs font-semibold text-slate-500">
              {isAnswered ? (
                <span className="text-emerald-600 flex items-center gap-1 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã chọn đáp án {answers[currentQuestion.cau]}
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1 justify-center">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Chưa chọn đáp án
                </span>
              )}
            </div>

            {/* Next or Submit Button */}
            <button
              type="button"
              onClick={handleNextClick}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer shadow-md ${
                isLastQuestion
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-200'
              }`}
            >
              <span>{isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo'}</span>
              {isLastQuestion ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </footer>

        {/* Confirmation Modal when submitting with unanswered questions */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">
                Em còn {unansweredCount} câu chưa làm!
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Em vẫn còn <strong>{unansweredCount} câu</strong> chưa chọn đáp án. Em có muốn quay lại kiểm tra không?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-200"
                >
                  Quay lại làm tiếp
                </button>
                <button
                  type="button"
                  onClick={submitQuiz}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Vẫn nộp bài bây giờ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 3: MÀN HÌNH KẾT QUẢ
  // -------------------------------------------------------------
  const filteredQuestions = QUESTIONS.filter((q) => {
    const isCorrect = answers[q.cau] === q.dapAn;
    if (resultFilter === 'correct') return isCorrect;
    if (resultFilter === 'wrong') return !isCorrect;
    return true;
  });

  // Encouraging praise message based on score
  let feedbackMessage = '';
  let feedbackBadge = '';
  if (correctCount >= 36) {
    feedbackMessage = 'Tuyệt vời! Em nắm rất chắc toàn bộ 4 thì tiếng Anh!';
    feedbackBadge = '🏆 Xuất sắc';
  } else if (correctCount >= 28) {
    feedbackMessage = 'Làm rất tốt! Em hãy xem lại vài câu chưa đúng ở dưới nhé!';
    feedbackBadge = '⭐ Giỏi';
  } else if (correctCount >= 20) {
    feedbackMessage = 'Khá tốt! Ôn kỹ lại dấu hiệu nhận biết các thì để đạt điểm cao hơn!';
    feedbackBadge = '👍 Đạt';
  } else {
    feedbackMessage = 'Cố gắng lên nào! Hãy đọc lại các đáp án đúng và làm lại lần nữa nhé!';
    feedbackBadge = '💪 Cần cố gắng';
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span className="font-extrabold text-slate-800 text-base">Kết Quả Bài Làm</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Score Hero Card */}
        <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-200 text-center relative overflow-hidden">
          {/* Subtle decoration circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Student badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white mb-4">
            <User className="w-3.5 h-3.5" />
            <span>Học sinh: {selectedName} • Lớp 7</span>
          </div>

          {/* Big Score Display */}
          <div className="my-2">
            <div className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
              Em đúng {correctCount}/40 câu
            </div>
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-extrabold text-white">
              {feedbackBadge}
            </div>
          </div>

          <p className="text-blue-100 text-sm sm:text-base font-medium max-w-md mx-auto mt-3">
            {feedbackMessage}
          </p>

          {/* Score details grid */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/20 max-w-sm mx-auto">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3">
              <div className="text-2xl font-black text-emerald-300">{correctCount}</div>
              <div className="text-xs font-semibold text-blue-100">Số câu đúng</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3">
              <div className="text-2xl font-black text-rose-300">{wrongCount}</div>
              <div className="text-xs font-semibold text-blue-100">Số câu sai</div>
            </div>
          </div>

          {/* Backend sync indicator */}
          <div className="mt-4 text-xs text-blue-200/90 flex items-center justify-center gap-1.5">
            {syncStatus === 'sending' && (
              <span>Đang lưu điểm số...</span>
            )}
            {syncStatus === 'synced' && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Điểm số đã được tự động lưu về hệ thống
              </span>
            )}
            {syncStatus === 'error' && (
              <span>Điểm số bài làm đã được ghi nhận</span>
            )}
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex items-center gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setResultFilter('all')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              resultFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả (40)
          </button>
          <button
            type="button"
            onClick={() => setResultFilter('correct')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              resultFilter === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Đúng ({correctCount})
          </button>
          <button
            type="button"
            onClick={() => setResultFilter('wrong')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              resultFilter === 'wrong'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Sai ({wrongCount})
          </button>
        </div>

        {/* Detailed Review List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base text-slate-800">
              Chi tiết câu hỏi ({filteredQuestions.length} câu)
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Đáp án đúng được tô màu xanh lá
            </span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500">
              Không có câu hỏi nào trong mục này.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const studentAnswer = answers[q.cau];
              const isCorrect = studentAnswer === q.dapAn;

              return (
                <div
                  key={q.cau}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-xs ${
                    isCorrect
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : 'border-rose-200 hover:border-rose-300'
                  }`}
                >
                  {/* Top status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {q.cau}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {getGrammarBadge(q.hoi)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Đúng
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full">
                          <XCircle className="w-4 h-4 text-rose-500" />
                          Sai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text verbatim */}
                  <p className="font-bold text-slate-800 text-base mb-4 leading-snug">
                    {q.hoi}
                  </p>

                  {/* 4 Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const isOptionCorrect = q.dapAn === opt;
                      const isOptionChosen = studentAnswer === opt;

                      let styleClasses =
                        'border border-slate-200 bg-slate-50/50 text-slate-600';

                      if (isOptionCorrect) {
                        styleClasses =
                          'border-2 border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isOptionChosen && !isCorrect) {
                        styleClasses =
                          'border-2 border-rose-500 bg-rose-50 text-rose-900 font-semibold line-through';
                      }

                      return (
                        <div
                          key={opt}
                          className={`p-2.5 rounded-xl flex items-center justify-between gap-2 ${styleClasses}`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                                isOptionCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isOptionChosen && !isCorrect
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {opt}
                            </span>
                            <span>{q[opt]}</span>
                          </div>

                          {isOptionCorrect && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              Đáp án đúng
                            </span>
                          )}
                          {isOptionChosen && !isOptionCorrect && (
                            <span className="text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                              Em đã chọn
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Restart Action Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center shadow-xs">
          <h4 className="font-extrabold text-slate-800 text-base mb-2">
            Em có muốn làm lại để đạt điểm tối đa không?
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Luyện tập thường xuyên sẽ giúp em nhớ lâu và tự tin hơn trong các bài kiểm tra!
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </main>
    </div>
  );
}
