import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, Award, ChevronRight, RefreshCw, ArrowRight, User, Play, Sparkles, CheckCircle, XCircle, FileText, HelpCircle, Volume2, VolumeX } from 'lucide-react';
// Import file audio lokal dari folder src/assets/instrumen-belajar.mp3
import musicFile from './assets/instrumen-belajar.mp3';

export default function App() {
  const [page, setPage] = useState('welcome');
  const [studentName, setStudentName] = useState('');
  
  // State Kontrol Musik menggunakan file lokal
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // Memanggil background lokal dari folder public: /bg-school.jpg
  const bgImageUrl = "/bg-school.jpg";

  useEffect(() => {
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (page === 'welcome' || page === 'home') {
      if (isPlayingMusic) {
        audioRef.current.play().catch(e => console.log("Audio autoplay dibatasi browser"));
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
  
  const [inputData, setInputData] = useState('6, 8, 7, 5, 9');
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
      indicator: "Mathematical Reasoning (Konsistensi Data)",
      question: "Pelatih memilih pemain berdasarkan kestabilan skor. Pemain A: 10, 12, 11, 10, 12 (Jangkauan = 2). Pemain B: 5, 17, 6, 18, 9 (Jangkauan = 13). Siapa yang lebih konsisten?",
      options: ["Pemain A karena jangkauannya lebih kecil", "Pemain B karena nilainya besar", "Keduanya sama saja", "Tidak dapat ditentukan"],
      answer: 0,
      explanation: "Pemain A lebih konsisten karena nilai sebaran data (jangkauan) lebih kecil dibanding Pemain B."
    },
    {
      id: 2,
      indicator: "Formulating Situations (Jangkauan Interkuartil)",
      question: "Dari data nilai: 4, 5, 6, 6, 7, 7, 8, 8, 9, 10. Berapakah Jangkauan Interkuartil (QR = Q3 - Q1) jika Q1 = 6 dan Q3 = 8?",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explanation: "QR = Q3 - Q1 = 8 - 6 = 2."
    },
    {
      id: 3,
      indicator: "Employing Concepts (Simpangan Rata-rata)",
      question: "Diketahui data 4, 6, 8, 10, 12 dengan Rata-rata = 8. Berapakah jumlah deviasi mutlak |xi - x̄|?",
      options: ["10", "12", "15", "20"],
      answer: 1,
      explanation: "|4-8| + |6-8| + |8-8| + |10-8| + |12-8| = 4 + 2 + 0 + 2 + 4 = 12."
    },
    {
      id: 4,
      indicator: "Interpreting Outcomes (Simpangan Baku Produk)",
      question: "Pabrik baut membandingkan Simpangan Baku: Baut A (S = 0,1 mm) dan Baut B (S = 1,5 mm). Apakah Baut B lebih berkualitas?",
      options: ["Ya, karena angkanya lebih besar", "Tidak, Baut A lebih presisi karena S lebih kecil", "Sama saja", "Tergantung warna baut"],
      answer: 1,
      explanation: "Semakin kecil simpangan baku (S), produk semakin seragam dan presisi."
    },
    {
      id: 5,
      indicator: "Mathematical Reasoning (Notasi Sigma)",
      question: "Apa arti dari simbol notasi Sigma (Σ) dalam rumus statistika?",
      options: ["Perkalian semua data", "Pengurangan data terbesar dan terkecil", "Penjumlahan seluruh suku data", "Akar kuadrat data"],
      answer: 2,
      explanation: "Simbol Σ (Sigma) melambangkan operasi penjumlahan dari suatu barisan bilangan."
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
      const sum = arr.reduce((acc, val) => acc + val, 0);
      const mean = sum / n;
      const min = arr[0];
      const max = arr[n - 1];
      const range = max - min;

      const deviations = arr.map(x => x - mean);
      const absDeviations = deviations.map(x => Math.abs(x));
      const sumAbsDev = absDeviations.reduce((acc, val) => acc + val, 0);
      const meanDev = sumAbsDev / n;

      const squaredDevs = deviations.map(x => Math.pow(x, 2));
      const sumSqDev = squaredDevs.reduce((acc, val) => acc + val, 0);
      const variance = sumSqDev / n;
      const stdDev = Math.sqrt(variance);

      setCalcResult({ arr, n, sum, mean, min, max, range, deviations, absDeviations, sumAbsDev, meanDev, squaredDevs, sumSqDev, variance, stdDev });
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
      
      {/* BACKGROUND LOKAL DARI /bg-school.jpg DENGAN EFEK BURAM (BLURRED BACKGROUND) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat filter blur-md scale-105 opacity-40"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* OVERLAY WARNA LEMBUT DENGAN SENTUHAN #B4E4D6 DAN #FFF6A9 */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#FFF3E3', opacity: 0.82 }} />

      {/* KONTEN UTAMA APLIKASI */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        
        {/* Tombol Musik Mengambang */}
        <button 
          onClick={toggleMusic}
          className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl border-2 flex items-center gap-2 text-xs font-bold transition hover:scale-105"
          style={{ borderColor: '#B4E4D6', color: '#DE7272' }}
          title="Nyalakan/Matikan Musik Instrumen"
        >
          {isPlayingMusic ? <Volume2 size={18} className="text-emerald-600 animate-pulse" /> : <VolumeX size={18} className="text-slate-400" />}
          <span>{isPlayingMusic ? 'Musik Nyala 🎶' : 'Musik Mati 🔇'}</span>
        </button>

        {page === 'welcome' && (
          <div className="flex-1 flex items-center justify-center p-4">
            {/* KOTAK WELCOME WARNA PINK LEMBUT DENGAN SENTUHAN PALET BARU */}
            <div className="max-w-md w-full rounded-3xl shadow-2xl p-8 border-4 text-center space-y-6 relative overflow-hidden backdrop-blur-sm" style={{ backgroundColor: '#FFF3E3', borderColor: '#B4E4D6' }}>
              
              <div className="absolute -top-3 -right-3 text-white px-4 py-1 rounded-full text-xs font-extrabold transform rotate-12 shadow-sm" style={{ backgroundColor: '#DE7272' }}>
                S = √(Σ(x-x̄)²/n)
              </div>
              <div className="absolute top-4 -left-3 text-slate-800 px-3 py-1 rounded-full text-xs font-extrabold transform -rotate-12 shadow-sm" style={{ backgroundColor: '#FFF6A9' }}>
                J = Xmax - Xmin
              </div>

              {/* EMOJI KARAKTER ANAK-ANAK ANIMASI DI TENGAH */}
              <div className="relative w-32 h-32 mx-auto mt-2 flex items-center justify-center rounded-full shadow-inner border-4" style={{ backgroundColor: '#B4E4D6', borderColor: '#FFCA88' }}>
                <span className="text-5xl animate-bounce">🧑‍🎓🎒✨</span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-3 shadow-sm" style={{ backgroundColor: '#FFF6A9', color: '#7a5a00' }}>
                  <Sparkles size={14} className="text-amber-600" /> Matematika SMP Kelas VIII
                </div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: '#DE7272' }}>Statistika : Penyebaran Data</h1>
                <p className="text-xs font-medium text-slate-600 mt-1">Media Pembelajaran Interaktif & Evaluasi Mandiri</p>
              </div>

              <div className="space-y-2 text-left pt-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Masukkan Nama Siswa:</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={18} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Contoh: Aulia Syafira Maharani"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none font-semibold text-sm shadow-inner"
                    style={{ borderColor: '#B4E4D6' }}
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if(!studentName.trim()) {
                    alert('Masukkan nama kamu dulu ya!');
                    return;
                  }
                  setIsPlayingMusic(true);
                  setPage('home');
                }}
                className="w-full text-white py-4 rounded-2xl font-bold transition shadow-lg hover:opacity-95 flex items-center justify-center gap-2 text-base transform active:scale-95 tracking-wide"
                style={{ backgroundColor: '#DE7272' }}
              >
                Mulai Masuk Aplikasi <Play size={18} className="fill-white" />
              </button>
            </div>
          </div>
        )}

        {page !== 'welcome' && (
          <div className="flex flex-col flex-1 justify-between">
            <header className="text-white shadow-md p-3 sticky top-0 z-50 backdrop-blur-md bg-opacity-95" style={{ backgroundColor: '#B4E4D6' }}>
              <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-2">
                <div>
                  <button onClick={() => setPage('home')} className="text-left hover:opacity-90 transition">
                    <h1 className="text-lg font-black tracking-wide text-slate-900">Statistika : Penyebaran Data</h1>
                    <p className="text-xs text-slate-700 font-bold">Halo, {studentName} ✨</p>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-white/40 backdrop-blur-sm shadow-sm">
                  <button onClick={() => setPage('home')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'home' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Menu</button>
                  <button onClick={() => setPage('pretest')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'pretest' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Pre-Test</button>
                  <button onClick={() => setPage('materi')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'materi' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Materi</button>
                  <button onClick={() => setPage('panduan-kalkulator')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'panduan-kalkulator' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Panduan</button>
                  <button onClick={() => setPage('kalkulator')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'kalkulator' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Kalkulator</button>
                  <button onClick={() => setPage('latihan')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'latihan' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Latihan</button>
                  <button onClick={() => setPage('posttest')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${page === 'posttest' || page === 'evaluasi' ? 'bg-white text-slate-900 shadow' : 'text-slate-800 hover:bg-white/20'}`}>Post-Test</button>
                </div>
              </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 my-4 flex-1 w-full">
              
              {page === 'home' && (
                <div className="space-y-6">
                  {/* KOTAK MENU UTAMA WARNA PINK (#FFF3E3) DENGAN SENTUHAN #FFCA88 */}
                  <div className="p-6 rounded-3xl shadow-lg text-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 border-2" style={{ backgroundColor: '#FFF3E3', borderColor: '#FFCA88' }}>
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color: '#DE7272' }}>Selamat Datang, {studentName}! 👋</h2>
                      <p className="text-slate-700 text-sm font-semibold">Ikuti tahapan belajar di bawah ini secara berurutan untuk hasil yang maksimal.</p>
                    </div>
                    <span className="text-5xl animate-pulse p-3 rounded-2xl shadow-inner" style={{ backgroundColor: '#FFF6A9' }}>🎒📚</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div onClick={() => setPage('pretest')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1" style={{ backgroundColor: '#FFF3E3', borderColor: '#DE7272' }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm" style={{ backgroundColor: '#DE7272' }}>1</div>
                      <h3 className="font-extrabold text-lg text-slate-900">Pre-Test</h3>
                      <p className="text-xs text-slate-600 font-medium">Tes awal kemampuan sebelum masuk materi penyebaran data.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1" style={{ color: '#DE7272' }}>Mulai Pre-Test <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => setPage('materi')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1" style={{ backgroundColor: '#FFF3E3', borderColor: '#B4E4D6' }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg shadow-sm" style={{ backgroundColor: '#B4E4D6' }}>2</div>
                      <h3 className="font-extrabold text-lg text-slate-900">Materi & Panduan</h3>
                      <p className="text-xs text-slate-600 font-medium">Pelajari konsep rumus dan cara pakai kalkulator step-by-step.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1 text-emerald-700">Buka Materi <ChevronRight size={14} /></span>
                    </div>

                    <div onClick={() => setPage('posttest')} className="p-5 rounded-3xl shadow-md border-2 cursor-pointer transition hover:shadow-xl space-y-2 transform hover:-translate-y-1" style={{ backgroundColor: '#FFF3E3', borderColor: '#FFCA88' }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg shadow-sm" style={{ backgroundColor: '#FFCA88' }}>3</div>
                      <h3 className="font-extrabold text-lg text-slate-900">Post-Test & Evaluasi</h3>
                      <p className="text-xs text-slate-600 font-medium">Uji kemampuan akhir dan lihat preview evaluasi pembahasan soal.</p>
                      <span className="text-xs font-extrabold flex items-center gap-1 pt-1 text-amber-700">Mulai Post-Test <ChevronRight size={14} /></span>
                    </div>
                  </div>
                </div>
              )}

              {page === 'pretest' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#DE7272' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: '#DE7272' }}>Pre-Test (Tes Awal) - Mode Fokus 🎧</h2>
                      <p className="text-xs text-slate-600 font-medium">Musik dimatikan otomatis agar kamu bisa konsentrasi penuh.</p>
                    </div>
                    <button onClick={() => setPage('materi')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: '#B4E4D6', color: '#1e293b' }}>Lanjut ke Materi →</button>
                  </div>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white shadow-sm" style={{ borderColor: '#DE7272' }}>
                      <span className="text-xs font-extrabold text-white px-3 py-1 rounded-full inline-block" style={{ backgroundColor: '#DE7272' }}>Soal Pre-Test {idx + 1}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-amber-50/40 transition`}>
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
                      <button onClick={() => handleCheckQuiz('pre')} className="text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Kirim Pre-Test</button>
                    ) : (
                      <div className="text-sm font-black text-slate-900">Skor Pre-Test Kamu: <span style={{ color: '#DE7272' }}>{preScore} / 25</span></div>
                    )}
                  </div>
                </div>
              )}

              {page === 'materi' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#B4E4D6' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-black text-emerald-800">Modul Materi Pembelajaran</h2>
                        <p className="text-slate-600 text-sm font-medium">Penyebaran Data Statistika Kelas VIII SMP</p>
                      </div>
                      <button onClick={() => setPage('panduan-kalkulator')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Baca Panduan Kalkulator →</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#DE7272' }}>
                        <h3 className="font-extrabold text-lg mb-1" style={{ color: '#DE7272' }}>1. Jangkauan (Range)</h3>
                        <p className="text-xs text-slate-700 font-medium">Selisih antara nilai terbesar (Xmax) dan terkecil (Xmin).</p>
                        <code className="block bg-slate-50 p-2.5 mt-3 rounded-xl text-xs font-mono font-extrabold text-center border shadow-inner" style={{ borderColor: '#DE7272', color: '#DE7272' }}>J = Xmax - Xmin</code>
                      </div>

                      <div className="p-5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                        <h3 className="font-extrabold text-lg mb-1 text-emerald-700">2. Simpangan Kuartil</h3>
                        <p className="text-xs text-slate-700 font-medium">Setengah dari jangkauan interkuartil (Q3 - Q1).</p>
                        <code className="block bg-slate-50 p-2.5 mt-3 rounded-xl text-xs font-mono font-extrabold text-center border shadow-inner text-emerald-700" style={{ borderColor: '#B4E4D6' }}>Qd = ½ (Q3 - Q1)</code>
                      </div>

                      <div className="p-5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                        <h3 className="font-extrabold text-lg mb-1 text-emerald-700">3. Simpangan Rata-rata</h3>
                        <p className="text-xs text-slate-700 font-medium">Rata-rata jarak mutlak tiap data terhadap rata-rata.</p>
                        <code className="block bg-slate-50 p-2.5 mt-3 rounded-xl text-xs font-mono font-extrabold text-center border shadow-inner text-emerald-700" style={{ borderColor: '#B4E4D6' }}>SR = (Σ |xi - x̄|) / n</code>
                      </div>

                      <div className="p-5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#DE7272' }}>
                        <h3 className="font-extrabold text-lg mb-1" style={{ color: '#DE7272' }}>4. Simpangan Baku</h3>
                        <p className="text-xs text-slate-700 font-medium">Akar kuadrat dari varians (ragam) sebaran data.</p>
                        <code className="block bg-slate-50 p-2.5 mt-3 rounded-xl text-xs font-mono font-extrabold text-center border shadow-inner" style={{ borderColor: '#DE7272', color: '#DE7272' }}>S = √( Σ(xi - x̄)² / n )</code>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <button onClick={() => setPage('home')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Menu Utama</button>
                      <button onClick={() => setPage('panduan-kalkulator')} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Lanjut ke Panduan Kalkulator →</button>
                    </div>
                  </div>
                </div>
              )}

              {page === 'panduan-kalkulator' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#FFCA88' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-amber-800">📖 Panduan Penggunaan Kalkulator Step-by-Step</h2>
                      <p className="text-xs text-slate-600 font-medium">Pelajari cara kerja dan contoh penggunaan alat sebelum mencoba kalkulator mandiri.</p>
                    </div>
                    <button onClick={() => setPage('kalkulator')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Coba Kalkulator Sekarang →</button>
                  </div>

                  <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                    <div className="p-4 rounded-2xl border-2 bg-white border-slate-200 space-y-2 shadow-sm">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                        <HelpCircle size={16} className="text-indigo-600" /> Apa itu Kalkulator Step-by-Step?
                      </h3>
                      <p className="font-medium">
                        Fitur ini dirancang khusus untuk membantumu menghitung besaran sebaran data secara otomatis, sekaligus menampilkan rincian tabel perhitungan secara runtut.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border-2 space-y-2 bg-white shadow-sm" style={{ borderColor: '#FFCA88' }}>
                      <h3 className="font-extrabold text-sm text-amber-800">📌 Langkah-Langkah Penggunaan:</h3>
                      <ol className="list-decimal list-inside space-y-1 font-semibold">
                        <li>Buka menu <strong>Kalkulator</strong> di atas.</li>
                        <li>Ketikkan data angka pada kolom input. Pastikan antar angka **dipisahkan dengan tanda koma (`,`)**, contoh: <code className="bg-amber-50 px-1.5 py-0.5 rounded font-bold text-amber-900">6, 8, 7, 5, 9</code>.</li>
                        <li>Klik tombol <strong>Hitung</strong> berwarna merah.</li>
                        <li>Perhatikan tabel penolong di bawahnya untuk melihat asal-usul nilai deviasi secara rinci.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setPage('materi')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Kembali ke Materi</button>
                    <button onClick={() => setPage('kalkulator')} className="text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Buka Kalkulator Step-by-Step →</button>
                  </div>
                </div>
              )}

              {page === 'kalkulator' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-4" style={{ backgroundColor: '#FFF3E3', borderColor: '#DE7272' }}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black" style={{ color: '#DE7272' }}>Kalkulator Step-by-Step</h2>
                    <div className="flex gap-2">
                      <button onClick={() => setPage('panduan-kalkulator')} className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 shadow-sm">? Baca Panduan</button>
                      <button onClick={() => setPage('latihan')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: '#B4E4D6', color: '#1e293b' }}>Lanjut Latihan Soal →</button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Masukkan angka pisahkan dengan koma (contoh: <code className="bg-white px-1.5 py-0.5 rounded font-bold shadow-sm" style={{ color: '#DE7272' }}>6, 8, 7, 5, 9</code>):</p>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputData} 
                      onChange={(e) => setInputData(e.target.value)} 
                      className="flex-1 border-2 border-slate-200 px-4 py-3 rounded-2xl focus:outline-none font-mono text-sm bg-white shadow-inner"
                    />
                    <button onClick={handleCalculate} className="text-white px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2 shadow-md hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>
                      <Calculator size={18} /> Hitung
                    </button>
                  </div>

                  {calcResult && (
                    <div className="mt-6 space-y-4 border-t pt-4">
                      <h3 className="font-bold text-slate-800 text-sm">Hasil Analisis Tahapan:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#DE7272' }}>
                          <span className="text-xs text-slate-500 block font-semibold">Jumlah Data (n)</span>
                          <span className="text-xl font-black" style={{ color: '#DE7272' }}>{calcResult.n}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                          <span className="text-xs text-slate-500 block font-semibold">Nilai Rata-rata (x̄)</span>
                          <span className="text-xl font-black text-emerald-700">{calcResult.mean.toFixed(2)}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#DE7272' }}>
                          <span className="text-xs text-slate-500 block font-semibold">Jangkauan (Range)</span>
                          <span className="text-xl font-black" style={{ color: '#DE7272' }}>{calcResult.range}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                          <span className="text-xs text-slate-500 block font-semibold">Simpangan Baku (S)</span>
                          <span className="text-xl font-black text-emerald-700">{calcResult.stdDev.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-xs text-left border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                          <thead>
                            <tr className="text-slate-900 font-bold" style={{ backgroundColor: '#B4E4D6' }}>
                              <th className="p-3 border">Data (xi)</th>
                              <th className="p-3 border">xi - x̄</th>
                              <th className="p-3 border">|xi - x̄| (Deviasi)</th>
                              <th className="p-3 border">(xi - x̄)² (Kuadrat)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calcResult.arr.map((val, idx) => (
                              <tr key={idx} className="border-b bg-white hover:bg-slate-50">
                                <td className="p-2.5 border font-mono font-bold">{val}</td>
                                <td className="p-2.5 border font-mono">{calcResult.deviations[idx].toFixed(2)}</td>
                                <td className="p-2.5 border font-mono font-bold" style={{ color: '#DE7272' }}>{calcResult.absDeviations[idx].toFixed(2)}</td>
                                <td className="p-2.5 border font-mono font-bold text-emerald-700">{calcResult.squaredDevs[idx].toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between border-t">
                    <button onClick={() => setPage('panduan-kalkulator')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Lihat Panduan</button>
                    <button onClick={() => setPage('latihan')} className="text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Lanjut Latihan Soal →</button>
                  </div>
                </div>
              )}

              {page === 'latihan' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#B4E4D6' }}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-emerald-800">Latihan Soal (5 Soal) - Mode Fokus 🎧</h2>
                    <button onClick={() => setPage('posttest')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Lanjut Post-Test →</button>
                  </div>
                  
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                      <span className="text-xs font-extrabold text-slate-900 px-3 py-1 rounded-full inline-block shadow-sm" style={{ backgroundColor: '#B4E4D6' }}>Soal {idx + 1} • {q.indicator}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-emerald-50/40 transition`}>
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
                      <button onClick={() => handleCheckQuiz('lat')} className="text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition hover:opacity-95" style={{ backgroundColor: '#B4E4D6', color: '#1e293b' }}>Kirim Latihan</button>
                    ) : (
                      <div className="text-sm font-black text-slate-900">Skor Latihan: <span className="text-emerald-700">{latScore} / 25</span></div>
                    )}
                  </div>
                </div>
              )}

              {page === 'posttest' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#FFCA88' }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-amber-900">Post-Test & Evaluasi - Mode Fokus 🎧</h2>
                      <p className="text-xs text-slate-600 font-medium">Kerjakan soal akhir tanpa gangguan musik.</p>
                    </div>
                    {postSubmitted && (
                      <button onClick={() => setPage('evaluasi')} className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md flex items-center gap-1 transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>
                        <FileText size={14} /> Lihat Preview Evaluasi Lengkap →
                      </button>
                    )}
                  </div>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl border-2 space-y-3 bg-white border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full inline-block bg-slate-800 text-white shadow-sm">Post-Test Soal {idx + 1}</span>
                      <p className="font-bold text-slate-900 text-sm">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold bg-slate-50 hover:bg-amber-50/40 transition`}>
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
                        <button onClick={() => setPage('evaluasi')} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Buka Preview Evaluasi</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {page === 'evaluasi' && (
                <div className="p-6 rounded-3xl shadow-lg border-2 space-y-6" style={{ backgroundColor: '#FFF3E3', borderColor: '#DE7272' }}>
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-black" style={{ color: '#DE7272' }}>Preview Evaluasi Pengerjaan Soal</h2>
                      <p className="text-xs text-slate-600 font-medium">Hasil analisis jawaban dan pembahasan per soal untuk siswa: <span className="font-bold text-slate-900">{studentName}</span></p>
                    </div>
                    <button onClick={() => setPage('posttest')} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm">← Kembali ke Post-Test</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl border-2 bg-white border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 block font-semibold">Total Soal</span>
                      <span className="text-lg font-black text-slate-900">5 Butir</span>
                    </div>
                    <div className="p-3.5 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: '#B4E4D6' }}>
                      <span className="text-xs text-slate-500 block font-semibold">Skor Akhir</span>
                      <span className="text-lg font-black text-emerald-700">{postScore} / 25</span>
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
                    <button onClick={() => { setPage('welcome'); setStudentName(''); }} className="text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition hover:opacity-95" style={{ backgroundColor: '#DE7272' }}>Selesai & Keluar</button>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

        <footer className="relative z-10 text-center py-4 text-xs font-bold text-slate-700 border-t bg-white/80 backdrop-blur-md mt-8 shadow-inner">
          Media Pembelajaran Matematika • Statistika : Penyebaran Data Kelas VIII SMP
        </footer>
      </div>

    </div>
  );
}