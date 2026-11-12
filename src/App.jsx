import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, Award, ChevronRight, RefreshCw, ArrowRight, User, Play, Sparkles, CheckCircle, XCircle, FileText, HelpCircle, Volume2, VolumeX, ThumbsUp, Palette } from 'lucide-react';
// Import file audio lokal dari folder src/assets/instrumen-belajar.mp3
import musicFile from './assets/instrumen-belajar.mp3';

export default function App() {
  const [page, setPage] = useState('welcome');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  
  // State Kontrol Musik - Default langsung menyala (true)
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const audioRef = useRef(null);

  // State Sub-menu Kalkulator (Panduan vs Kalkulator Utama)
  const [calcTab, setCalcTab] = useState('panduan');

  // State Tombol Atraktif (Animasi Bintang & Jempol)
  const [floatingEffects, setFloatingEffects] = useState([]);

  // State Tema Warna Web
  const [themeMode, setThemeMode] = useState('blue'); // 'blue', 'purple', 'emerald'

  const themes = {
    blue: { primary: '#00105B', secondary: '#6061B6', pastel: '#C9B5E0', cardBg: '#FCF9EC' },
    purple: { primary: '#4A154B', secondary: '#7952B3', pastel: '#E0B5D5', cardBg: '#FDFCF7' },
    emerald: { primary: '#064E3B', secondary: '#059669', pastel: '#A7F3D0', cardBg: '#F0FDF4' }
  };

  const currentTheme = themes[themeMode];

  // Memanggil background lokal dari folder public: /bg-school.jpg
  const bgImageUrl = "/bg-school.jpg";

  useEffect(() => {
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    audioRef.current.play().then(() => {
      setIsPlayingMusic(true);
    }).catch(e => {
      console.log("Autoplay dibatasi browser, user perlu interaksi pertama");
      setIsPlayingMusic(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const isFocusPage = page === 'pretest' || page === 'latihan' || page === 'posttest' || page === 'evaluasi';
    
    if (!isFocusPage) {
      if (isPlayingMusic) {
        audioRef.current.play().catch(e => console.log("Audio dibatasi browser"));
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
    }
  }, [page, isPlayingMusic]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().catch(e => console.log("Gagal memutar audio"));
      setIsPlayingMusic(true);
    }
  };

  // Fungsi Efek Atraktif (Bintang & Jempol)
  const triggerEffect = (type) => {
    const id = Date.now();
    const newEffect = { id, type, left: Math.random() * 80 + 10 };
    setFloatingEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(item => item.id !== id));
    }, 2000);
  };

  const cycleTheme = () => {
    if (themeMode === 'blue') setThemeMode('purple');
    else if (themeMode === 'purple') setThemeMode('emerald');
    else setThemeMode('blue');
  };
  
  const [inputData, setInputData] = useState('4, 5, 6, 6, 7, 7, 8, 8, 9, 10');
  const [calcResult, setCalcResult] = useState(null);

  const [preAnswers, setPreAnswers] = useState({});
  const [preSubmitted, setPreSubmitted] = useState(false);
  const [preScore, setPreScore] = useState(0);

  const [latAnswers, setLatAnswers] = useState({});
  const [latSubmitted, setLatSubmitted] = useState(false);
  const [latScore, setLatScore] = useState(0);

  const [postAnswers, setPostAnswers] = useState({});
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [postScore, setPostScore] = useState(0);

  const questions = [
    {
      id: 1,
      indicator: "Jangkauan Kuartil",
      question: "Apa yang dimaksud dengan Jangkauan Kuartil (atau Jangkauan Antar Kuartil)?",
      options: ["Selisih antara nilai terbesar dan terkecil", "Selisih antara Kuartil Atas (Q3) dan Kuartil Bawah (Q1)", "Setengah dari jangkauan interkuartil", "Jumlah seluruh kuartil"],
      answer: 1,
      explanation: "Jangkauan Interkuartil (QR) adalah selisih antara Kuartil Atas (Q3) dan Kuartil Bawah (Q1), yaitu QR = Q3 - Q1."
    },
    {
      id: 2,
      indicator: "Simpangan Kuartil",
      question: "Dari data nilai: 4, 5, 6, 6, 7, 7, 8, 8, 9, 10. Jika Q1 = 6 dan Q3 = 8, berapakah Simpangan Kuartil (Qd)?",
      options: ["1", "2", "3", "4"],
      answer: 0,
      explanation: "Simpangan kuartil Qd = ½ (Q3 - Q1) = ½ (8 - 6) = ½ (2) = 1."
    },
    {
      id: 3,
      indicator: "Jangkauan Kuartil & Interkuartil",
      question: "Jika diketahui Q1 = 10 dan Q3 = 22, berapakah Jangkauan Interkuartil (QR)?",
      options: ["6", "11", "12", "16"],
      answer: 2,
      explanation: "Jangkauan Interkuartil QR = Q3 - Q1 = 22 - 10 = 12."
    },
    {
      id: 4,
      indicator: "Simpangan Kuartil",
      question: "Manakah rumus yang tepat untuk menghitung Simpangan Kuartil (Qd)?",
      options: ["Qd = Q3 - Q1", "Qd = ½ (Q3 - Q1)", "Qd = Q3 + Q1", "Qd = ¼ (Q3 - Q1)"],
      answer: 1,
      explanation: "Simpangan kuartil (deviasi kuartil) dirumuskan sebagai setengah kali jangkauan interkuartil, yaitu Qd = ½(Q3 - Q1)."
    },
    {
      id: 5,
      indicator: "Analisis Data",
      question: "Mengapa Simpangan Kuartil sering digunakan dalam statistika selain Jangkauan biasa?",
      options: ["Karena lebih rumit dihitung", "Karena tidak terpengaruh oleh data pencilan (ekstrem)", "Karena hanya menggunakan data genap", "Karena nilai selalu negatif"],
      answer: 1,
      explanation: "Simpangan kuartil dan jangkauan interkuartil bersifat lebih tahan terhadap nilai ekstrem atau data pencilan dibanding jangkauan biasa."
    }
  ];

  const handleCalculate = () => {
    try {
      const arr = inputData.split(',').map(item => parseFloat(item.trim())).filter(n => !isNaN(n));
      if (arr.length === 0) {
        alert('Masukkan angka yang valid dipisahkan koma!');
        return;
      }
      arr.sort((a, b) => a - b);
      const n = arr.length;
      
      // Hitung Kuartil sederhana untuk kalkulator
      const q1Index = Math.floor(n / 4);
      const q3Index = Math.floor((3 * n) / 4);
      const q1 = arr[q1Index];
      const q3 = arr[q3Index];
      const interquartileRange = q3 - q1;
      const quartileDeviation = 0.5 * interquartileRange;

      setCalcResult({ arr, n, q1, q3, interquartileRange, quartileDeviation });
    } catch (err) {
      alert('Terjadi kesalahan format angka.');
    }
  };

  const handleCheckQuiz = (type) => {
    let score = 0;
    if (type === 'pre') {
      questions.forEach(q => { if (preAnswers[q.id] === q.answer) score += 5; });
      setPreScore(score);
      setPreSubmitted(true);
    } else if (type === 'lat') {
      questions.forEach(q => { if (latAnswers[q.id] === q.answer) score += 5; });
      setLatScore(score);
      setLatSubmitted(true);
    } else if (type === 'post') {
      questions.forEach(q => { if (postAnswers[q.id] === q.answer) score += 5; });
      setPostScore(score);
      setPostSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 font-sans flex flex-col justify-between overflow-x-hidden antialiased tracking-wide">
      
      {/* BACKGROUND LOKAL DARI /bg-school.jpg DENGAN EFEK BURAM */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat filter blur-md scale-105 opacity-40"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* OVERLAY DENGAN WARNA TEMA */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: currentTheme.primary, opacity: 0.25 }} />

      {/* ANIMASI PARTIKEL ATRAKTIF DI LAYAR */}
      {floatingEffects.map(item => (
        <div 
          key={item.id} 
          className="fixed z-50 text-4xl pointer-events-none animate-bounce duration-1000"
          style={{ left: `${item.left}%`, bottom: '20%' }}
        >
          {item.type === 'star' ? '⭐✨' : '👍🔥'}
        </div>
      ))}

      {/* KONTEN UTAMA APLIKASI */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Tombol Musik & Tombol Atraktif Mengambang di Kanan Bawah */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <button 
            onClick={() => triggerEffect('star')}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-xl border-2 text-xs font-bold transition hover:scale-110"
            style={{ borderColor: currentTheme.secondary, color: currentTheme.primary }}
            title="Efek Bintang Jatuh"
          >
            ⭐
          </button>
          <button 
            onClick={() => triggerEffect('thumb')}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-xl border-2 text-xs font-bold transition hover:scale-110"
            style={{ borderColor: currentTheme.secondary, color: currentTheme.primary }}
            title="Efek Jempol Terbang"
          >
            👍
          </button>
          <button 
            onClick={cycleTheme}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-xl border-2 text-xs font-bold transition hover:scale-110"
            style={{ borderColor: currentTheme.secondary, color: currentTheme.primary }}
            title="Ganti Tema Warna Web"
          >
            <Palette size={16} />
          </button>
          <button 
            onClick={toggleMusic}
            className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl border-2 flex items-center gap-2 text-xs font-bold transition hover:scale-105"
            style={{ borderColor: currentTheme.secondary, color: currentTheme.primary }}
            title="Nyalakan/Matikan Musik"
          >
            {isPlayingMusic ? <Volume2 size={18} className="text-blue-700 animate-pulse" /> : <VolumeX size={18} className="text-slate-400" />}
            <span>{isPlayingMusic ? 'Musik Nyala 🎶' : 'Musik Mati 🔇'}</span>
          </button>
        </div>

        {page === 'welcome' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl shadow-2xl p-8 border-4 text-center space-y-5 relative overflow-hidden backdrop-blur-sm transition-colors duration-500" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
              
              <div className="relative w-24 h-24 mx-auto mt-2 flex items-center justify-center rounded-full shadow-inner border-4 bg-gradient-to-tr from-purple-200 to-indigo-200" style={{ borderColor: currentTheme.secondary }}>
                <span className="text-5xl animate-bounce drop-shadow-md">🧑‍🎓</span>
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight mt-1" style={{ color: currentTheme.primary }}>Statistika : Penyebaran Data</h1>
                <p className="text-xs font-semibold text-slate-700 mt-1">Media Pembelajaran Interaktif & Evaluasi Mandiri</p>
              </div>

              <div className="space-y-3 text-left pt-1">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">Nama Siswa:</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Contoh: aulia"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none font-semibold text-xs shadow-inner"
                      style={{ borderColor: currentTheme.secondary }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">Kelas:</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 8A"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none font-semibold text-xs shadow-inner"
                    style={{ borderColor: currentTheme.secondary }}
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if(!studentName.trim() || !studentClass.trim()) {
                    alert('Mohon masukkan Nama dan Kelas kamu dulu ya!');
                    return;
                  }
                  setIsPlayingMusic(true);
                  setPage('home');
                }}
                className="w-full text-white py-3 rounded-2xl font-bold transition shadow-lg hover:opacity-95 flex items-center justify-center gap-2 text-sm transform active:scale-95 tracking-wide"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Mulai Masuk Aplikasi <Play size={16} className="fill-white" />
              </button>
            </div>
          </div>
        )}

        {page !== 'welcome' && (
          <div className="flex flex-col flex-1 justify-between">
            <header className="text-white shadow-md p-3 sticky top-0 z-50 backdrop-blur-md bg-opacity-95 transition-colors duration-500" style={{ backgroundColor: currentTheme.primary }}>
              <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2">
                <div>
                  <button onClick={() => setPage('home')} className="text-left hover:opacity-90 transition">
                    <h1 className="text-lg font-black tracking-wide text-white">Statistika : Penyebaran Data</h1>
                    <p className="text-xs text-indigo-200 font-bold">Halo, {studentName} ✨</p>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-white/15 backdrop-blur-sm shadow-sm">
                  <button onClick={() => setPage('home')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'home' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Menu</button>
                  <button onClick={() => setPage('pretest')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'pretest' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Pre-Test</button>
                  <button onClick={() => setPage('materi')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'materi' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Materi</button>
                  <button onClick={() => { setCalcTab('panduan'); setPage('kalkulator'); }} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'kalkulator' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Kalkulator</button>
                  <button onClick={() => setPage('latihan')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'latihan' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Latihan</button>
                  <button onClick={() => setPage('posttest')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'posttest' || page === 'evaluasi' ? 'bg-white text-indigo-950 shadow' : 'text-white hover:bg-white/20'}`}>Post-Test</button>
                </div>
              </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 my-4 flex-1 w-full space-y-6">
              
              {page === 'home' && (
                <div className="space-y-6">
                  {/* KOTAK SELAMAT DATANG (TANPA KELAS SESUAI PERMINTAAN) */}
                  <div className="p-6 rounded-3xl shadow-lg text-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 border-2 transition-colors duration-500" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color: currentTheme.primary }}>Selamat Datang, {studentName}! 👋</h2>
                      <p className="text-slate-700 text-sm font-semibold">Ikuti tahapan belajar di bawah ini secara berurutan untuk hasil yang maksimal.</p>
                    </div>
                    <span className="text-5xl animate-pulse p-3 rounded-2xl shadow-inner border-2 bg-gradient-to-tr from-purple-200 to-indigo-200" style={{ borderColor: currentTheme.secondary }}>🧑‍🎓</span>
                  </div>

                  {/* KOTAK MENU UTAMA (DIPISAH: PRETEST, MATERI, KALKULATOR, LATIHAN, POSTTEST) */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div onClick={() => setPage('pretest')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1 bg-white" style={{ borderColor: currentTheme.primary }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{ backgroundColor: currentTheme.primary }}>1</div>
                      <h3 className="font-extrabold text-base text-slate-900">Pre-Test</h3>
                      <p className="text-xs text-slate-600 font-medium">Tes awal kemampuan sebelum masuk materi kuartil.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1" style={{ color: currentTheme.primary }}>Mulai Pre-Test <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => setPage('materi')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1 bg-white" style={{ borderColor: currentTheme.secondary }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{ backgroundColor: currentTheme.secondary }}>2</div>
                      <h3 className="font-extrabold text-base text-slate-900">Materi</h3>
                      <p className="text-xs text-slate-600 font-medium">Pelajari jangkauan kuartil, interkuartil, dan simpangan kuartil.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1" style={{ color: currentTheme.secondary }}>Buka Materi <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => { setCalcTab('panduan'); setPage('kalkulator'); }} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1 bg-white" style={{ borderColor: currentTheme.pastel }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-900 font-black text-sm shadow-sm" style={{ backgroundColor: currentTheme.pastel }}>3</div>
                      <h3 className="font-extrabold text-base text-slate-900">Kalkulator & Panduan</h3>
                      <p className="text-xs text-slate-600 font-medium">Gunakan kalkulator step-by-step beserta panduan penggunaannya.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1 text-indigo-900">Buka Kalkulator <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => setPage('latihan')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1 bg-white" style={{ borderColor: currentTheme.secondary }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{ backgroundColor: currentTheme.secondary }}>4</div>
                      <h3 className="font-extrabold text-base text-slate-900">Latihan Soal</h3>
                      <p className="text-xs text-slate-600 font-medium">Uji pemahaman mandiri dengan latihan soal interaktif.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1" style={{ color: currentTheme.secondary }}>Mulai Latihan <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => setPage('posttest')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1 bg-white md:col-span-2" style={{ borderColor: currentTheme.primary }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm" style={{ backgroundColor: currentTheme.primary }}>5</div>
                      <h3 className="font-extrabold text-base text-slate-900">Post-Test & Evaluasi</h3>
                      <p className="text-xs text-slate-600 font-medium">Evaluasi akhir pengerjaan lengkap dengan analisis hasil dan kunci jawaban.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1" style={{ color: currentTheme.primary }}>Mulai Post-Test <ChevronRight size={14} /></span>
                    </div>
                  </div>

                  {/* KOTAK DESKRIPSI WEB APLIKASI (DIPERBARUI MENGENAI KUARTIL) */}
                  <div className="p-6 rounded-3xl shadow-lg border-2 space-y-3 bg-white transition-colors duration-500" style={{ borderColor: currentTheme.secondary }}>
                    <h3 className="font-extrabold text-base flex items-center gap-2" style={{ color: currentTheme.primary }}>
                      <Sparkles size={18} className="text-amber-500" /> Tentang Web Aplikasi Ini
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Web aplikasi <strong>Statistika : Penyebaran Data</strong> ini dikhususkan untuk mempelajari topik ukuran penyebaran data yang meliputi <strong>Jangkauan Kuartil</strong>, <strong>Jangkauan Interkuartil</strong>, dan <strong>Simpangan Kuartil</strong>. Melalui aplikasi ini, kamu dapat memahami konsep dasar kuartil, menggunakan kalkulator interaktif step-by-step secara mandiri, serta menguji kemampuan melalui pre-test, latihan soal, dan post-test lengkap dengan musik latar belakang yang menenangkan.
                    </p>
                  </div>
                </div>
              )}

              {page === 'pretest' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: currentTheme.primary }}>Pre-Test (Tes Awal) - Mode Fokus 🎧</h2>
                      <p className="text-xs text-slate-600 font-medium">Musik dimatikan otomatis agar kamu bisa konsentrasi penuh.</p>
                    </div>
                    <button onClick={() => setPage('materi')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.secondary }}>Lanjut ke Materi →</button>
                  </div>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                      <span className="text-xs font-extrabold text-white px-3 py-1 rounded-full inline-block" style={{ backgroundColor: currentTheme.secondary }}>Soal Pre-Test {idx + 1}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-indigo-50/40 transition">
                            <input type="radio" name={`pre-${q.id}`} checked={preAnswers[q.id] === optIdx} onChange={() => setPreAnswers({ ...preAnswers, [q.id]: optIdx })} />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Menu Utama</button>
                    {!preSubmitted ? (
                      <button onClick={() => handleCheckQuiz('pre')} className="text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Kirim Pre-Test</button>
                    ) : (
                      <div className="text-sm font-black text-slate-900">Skor Pre-Test Kamu: <span style={{ color: currentTheme.primary }}>{preScore} / 25</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* HALAMAN MATERI (FOKUS JANGKAUAN KUARTIL, INTERKUARTIL, SIMPANGAN KUARTIL) */}
              {page === 'materi' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6 text-slate-900" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                    <div className="flex justify-between items-center border-b pb-4">
                      <div>
                        <h2 className="text-2xl font-black" style={{ color: currentTheme.primary }}>📖 Modul Materi: Jangkauan & Simpangan Kuartil</h2>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">Ukuran Penyebaran Data Berdasarkan Kuartil</p>
                      </div>
                      <button onClick={() => { setCalcTab('panduan'); setPage('kalkulator'); }} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.secondary }}>Buka Kalkulator →</button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border-2 border-indigo-100 shadow-sm space-y-2">
                      <h3 className="font-extrabold text-sm text-indigo-950 flex items-center gap-1.5">
                        <Sparkles size={16} className="text-amber-500" /> Apa itu Kuartil dalam Statistika?
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Sebelum menghitung sebaran kuartil, data harus diurutkan terlebih dahulu dari terkecil ke terbesar. Kuartil membagi data menjadi 4 bagian yang sama besar, yaitu:
                        <br/>• <strong>Q1 (Kuartil Bawah)</strong>
                        <br/>• <strong>Q2 (Kuartil Tengah / Median)</strong>
                        <br/>• <strong>Q3 (Kuartil Atas)</strong>
                      </p>
                    </div>

                    {/* 1. Jangkauan Kuartil / Interkuartil */}
                    <div className="p-5 rounded-2xl border-2 bg-white shadow-sm space-y-3" style={{ borderColor: currentTheme.primary }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base" style={{ color: currentTheme.primary }}>1. Jangkauan Interkuartil (QR)</h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900">Selisih Q3 dan Q1</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Jangkauan interkuartil (atau sering disebut jangkauan kuartil) adalah selisih antara kuartil atas ($Q_3$) dan kuartil bawah ($Q_1$).
                      </p>
                      <div className="p-3 rounded-xl text-white font-mono text-xs font-bold text-center tracking-wider shadow-inner" style={{ backgroundColor: currentTheme.primary }}>
                        Rumus: QR = Q3 - Q1
                      </div>
                      <div className="text-xs bg-slate-50 p-3 rounded-xl border space-y-1">
                        <p className="font-bold text-slate-800">Contoh Soal:</p>
                        <p className="text-slate-600">Dari suatu data terurut, diketahui Kuartil bawah ($Q_1$) = 6 dan Kuartil atas ($Q_3$) = 14. Tentukan jangkauan interkuartilnya!</p>
                        <p className="text-indigo-900 font-semibold pt-1">Penyelesaian: QR = 14 - 6 = 8.</p>
                      </div>
                    </div>

                    {/* 2. Simpangan Kuartil (Qd) */}
                    <div className="p-5 rounded-2xl border-2 bg-white shadow-sm space-y-3" style={{ borderColor: currentTheme.secondary }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-indigo-800">2. Simpangan Kuartil (Deviasi Kuartil / Qd)</h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900">Setengah dari QR</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Simpangan kuartil adalah setengah dari jangkauan interkuartil. Ukuran ini menunjukkan sebaran data di sekitar median.
                      </p>
                      <div className="p-3 rounded-xl text-white font-mono text-xs font-bold text-center tracking-wider shadow-inner" style={{ backgroundColor: currentTheme.secondary }}>
                        Rumus: Qd = ½ (Q3 - Q1) &nbsp; atau &nbsp; Qd = ½ QR
                      </div>
                      <div className="text-xs bg-slate-50 p-3 rounded-xl border space-y-1">
                        <p className="font-bold text-slate-800">Contoh Soal:</p>
                        <p className="text-slate-600">Jika diketahui Jangkauan Interkuartil (QR) adalah 10, berapakah simpangan kuartilnya?</p>
                        <p className="text-indigo-900 font-semibold pt-1">Penyelesaian: Qd = ½ × 10 = 5.</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Menu Utama</button>
                      <button onClick={() => { setCalcTab('panduan'); setPage('kalkulator'); }} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Lanjut ke Kalkulator →</button>
                    </div>
                  </div>
                </div>
              )}

              {/* HALAMAN KALKULATOR (PANDUAN & HITUNG KUARTIL) */}
              {page === 'kalkulator' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                  
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: currentTheme.primary }}>🧮 Menu Kalkulator & Panduan Kuartil</h2>
                      <p className="text-xs text-slate-600 font-medium">Pilih tab panduan atau gunakan alat hitung kuartil otomatis.</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-xl shadow-inner border">
                      <button 
                        onClick={() => setCalcTab('panduan')} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calcTab === 'panduan' ? 'text-white shadow' : 'text-slate-700 hover:bg-slate-100'}`}
                        style={{ backgroundColor: calcTab === 'panduan' ? currentTheme.primary : 'transparent' }}
                      >
                        Panduan Kalkulator
                      </button>
                      <button 
                        onClick={() => setCalcTab('hitung')} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${calcTab === 'hitung' ? 'text-white shadow' : 'text-slate-700 hover:bg-slate-100'}`}
                        style={{ backgroundColor: calcTab === 'hitung' ? currentTheme.primary : 'transparent' }}
                      >
                        Kalkulator Hitung
                      </button>
                    </div>
                  </div>

                  {calcTab === 'panduan' ? (
                    <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                      <div className="p-4 rounded-2xl border-2 bg-white border-slate-200 space-y-2 shadow-sm">
                        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                          <HelpCircle size={16} className="text-indigo-600" /> Cara Menggunakan Kalkulator Kuartil
                        </h3>
                        <p className="font-medium">
                          Kalkulator ini dirancang untuk membantumu menemukan nilai Kuartil Bawah ($Q_1$), Kuartil Atas ($Q_3$), Jangkauan Interkuartil ($QR$), serta Simpangan Kuartil ($Q_d$) secara otomatis dan akurat.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border-2 space-y-2 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                        <h3 className="font-extrabold text-sm" style={{ color: currentTheme.primary }}>📌 Langkah-Langkah Penggunaan:</h3>
                        <ol className="list-decimal list-inside space-y-1 font-semibold">
                          <li>Klik tab <strong>Kalkulator Hitung</strong> di atas.</li>
                          <li>Masukkan data angka pada kolom input dengan **dipisahkan tanda koma (`,`)**, contoh: <code className="bg-indigo-50 px-1.5 py-0.5 rounded font-bold text-indigo-900">4, 5, 6, 6, 7, 7, 8, 8, 9, 10</code>.</li>
                          <li>Klik tombol <strong>Hitung Kuartil</strong>.</li>
                          <li>Hasil analisis urutan data, Q1, Q3, Jangkauan Interkuartil, dan Simpangan Kuartil akan langsung muncul secara instan.</li>
                        </ol>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button onClick={() => setCalcTab('hitung')} className="text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>
                          Mulai Gunakan Kalkulator →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-600 font-medium">Masukkan data angka pisahkan dengan koma (contoh: <code className="bg-white px-1.5 py-0.5 rounded font-bold shadow-sm" style={{ color: currentTheme.primary }}>4, 5, 6, 6, 7, 7, 8, 8, 9, 10</code>):</p>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={inputData} 
                          onChange={(e) => setInputData(e.target.value)} 
                          className="flex-1 border-2 border-slate-200 px-4 py-3 rounded-2xl focus:outline-none font-mono text-sm bg-white shadow-inner"
                        />
                        <button onClick={handleCalculate} className="text-white px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2 shadow-md hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>
                          <Calculator size={18} /> Hitung Kuartil
                        </button>
                      </div>

                      {calcResult && (
                        <div className="mt-6 space-y-4 border-t pt-4">
                          <h3 className="font-bold text-slate-800 text-sm">Hasil Analisis Kuartil:</h3>
                          
                          <div className="p-4 bg-white rounded-2xl border shadow-sm space-y-1">
                            <p className="text-xs font-semibold text-slate-500">Data Terurut:</p>
                            <p className="font-mono font-bold text-sm text-indigo-950">{calcResult.arr.join(', ')}</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: currentTheme.primary }}>
                              <span className="text-xs text-slate-500 block font-semibold">Kuartil Bawah (Q1)</span>
                              <span className="text-xl font-black" style={{ color: currentTheme.primary }}>{calcResult.q1}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                              <span className="text-xs text-slate-500 block font-semibold">Kuartil Atas (Q3)</span>
                              <span className="text-xl font-black text-indigo-700">{calcResult.q3}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: currentTheme.primary }}>
                              <span className="text-xs text-slate-500 block font-semibold">Jangkauan Interkuartil (QR)</span>
                              <span className="text-xl font-black" style={{ color: currentTheme.primary }}>{calcResult.interquartileRange}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                              <span className="text-xs text-slate-500 block font-semibold">Simpangan Kuartil (Qd)</span>
                              <span className="text-xl font-black text-indigo-700">{calcResult.quartileDeviation.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 flex justify-between border-t">
                    <button onClick={() => setPage('materi')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Kembali ke Materi</button>
                    <button onClick={() => setPage('latihan')} className="text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Lanjut Latihan Soal →</button>
                  </div>
                </div>
              )}

              {page === 'latihan' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black" style={{ color: currentTheme.primary }}>Latihan Soal (5 Soal) - Mode Fokus 🎧</h2>
                    <button onClick={() => setPage('posttest')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.secondary }}>Lanjut Post-Test →</button>
                  </div>
                  
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                      <span className="text-xs font-extrabold text-white px-3 py-1 rounded-full inline-block shadow-sm" style={{ backgroundColor: currentTheme.secondary }}>Soal {idx + 1} • {q.indicator}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-indigo-50/40 transition">
                            <input type="radio" name={`lat-${q.id}`} checked={latAnswers[q.id] === optIdx} onChange={() => setLatAnswers({ ...latAnswers, [q.id]: optIdx })} />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Menu Utama</button>
                    {!latSubmitted ? (
                      <button onClick={() => handleCheckQuiz('lat')} className="text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Kirim Latihan</button>
                    ) : (
                      <div className="text-sm font-black text-slate-900">Skor Latihan: <span style={{ color: currentTheme.primary }}>{latScore} / 25</span></div>
                    )}
                  </div>
                </div>
              )}

              {page === 'posttest' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Post-Test & Evaluasi - Mode Fokus 🎧</h2>
                      <p className="text-xs text-slate-600 font-medium">Kerjakan soal akhir tanpa gangguan musik.</p>
                    </div>
                    {postSubmitted && (
                      <button onClick={() => setPage('evaluasi')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md flex items-center gap-1 transition hover:opacity-95" style={{ backgroundColor: currentTheme.secondary }}>
                        <FileText size={14} /> Lihat Preview Evaluasi Lengkap →
                      </button>
                    )}
                  </div>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full inline-block text-white shadow-sm" style={{ backgroundColor: currentTheme.primary }}>Post-Test Soal {idx + 1}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-indigo-50/40 transition">
                            <input type="radio" name={`post-${q.id}`} checked={postAnswers[q.id] === optIdx} onChange={() => setPostAnswers({ ...postAnswers, [q.id]: optIdx })} />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Menu Utama</button>
                    {!postSubmitted ? (
                      <button onClick={() => handleCheckQuiz('post')} className="text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition hover:opacity-95" style={{ backgroundColor: '#10B981' }}>Kirim Post-Test & Evaluasi</button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black">Total Skor Post-Test: {postScore} / 25</span>
                        <button onClick={() => setPage('evaluasi')} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Buka Preview Evaluasi</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {page === 'evaluasi' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary }}>
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: currentTheme.primary }}>Preview Evaluasi Pengerjaan Soal</h2>
                      <p className="text-xs text-slate-600 font-medium">Hasil analisis jawaban untuk siswa: <span className="font-bold text-slate-900">{studentName}</span></p>
                    </div>
                    <button onClick={() => setPage('posttest')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Kembali ke Post-Test</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl border-2 bg-white border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 block font-semibold">Total Soal</span>
                      <span className="text-lg font-black text-slate-900">5 Butir</span>
                    </div>
                    <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: currentTheme.secondary }}>
                      <span className="text-xs text-slate-500 block font-semibold">Skor Akhir</span>
                      <span className="text-lg font-black text-indigo-700">{postScore} / 25</span>
                    </div>
                    <div className="p-3.5 rounded-2xl border-2 bg-emerald-50 border-emerald-200 shadow-sm">
                      <span className="text-xs text-emerald-700 block font-semibold">Status</span>
                      <span className="text-sm font-black text-emerald-900">{postScore >= 15 ? 'Tuntas / Kompeten' : 'Perlu Remedial'}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl border-2 bg-indigo-50 border-indigo-200 shadow-sm">
                      <span className="text-xs text-indigo-700 block font-semibold">Validitas Soal</span>
                      <span className="text-sm font-black text-indigo-900">Valid & Diuji</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Rincian Pembahasan & Evaluasi 5 Soal:</h3>
                    {questions.map((q, idx) => {
                      const userChoice = postAnswers[q.id];
                      const isCorrect = userChoice === q.answer;
                      return (
                        <div key={q.id} className={`p-4 rounded-2xl border-2 space-y-2 shadow-sm ${isCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border shadow-sm">Soal {idx + 1} • {q.indicator}</span>
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm ${isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                              {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />} {isCorrect ? 'Jawaban Benar' : 'Jawaban Kurang Tepat'}
                            </span>
                          </div>
                          <p className="font-bold text-slate-900 text-xs">{q.question}</p>
                          <div className="text-xs bg-white p-3 rounded-xl border space-y-1 shadow-inner">
                            <p><strong>Pilihan Kamu:</strong> {userChoice !== undefined ? q.options[userChoice] : <span className="text-rose-600 font-bold">Tidak dijawab</span>}</p>
                            <p className="text-emerald-800 font-medium"><strong>Kunci / Pembahasan:</strong> {q.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-between border-t">
                    <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-300">← Kembali ke Menu Utama</button>
                    <button onClick={() => { setPage('welcome'); setStudentName(''); }} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: currentTheme.primary }}>Selesai & Keluar</button>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

        <footer className="relative z-10 text-center py-4 text-xs font-bold text-white border-t mt-8 shadow-inner transition-colors duration-500" style={{ backgroundColor: currentTheme.primary }}>
          Media Pembelajaran Matematika • Statistika : Penyebaran Data (Kuartil)
        </footer>
      </div>

    </div>
  );
}