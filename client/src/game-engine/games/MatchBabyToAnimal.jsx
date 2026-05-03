import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Lightbulb, Map, RefreshCw, BarChart2 } from 'lucide-react';

const ANIMALS = [
  // Level 1 — Easy (id 1-5)
  { id:1, parent:"Cow 🐄", baby:"Calf 🐮", sound:"moo", level:1, wrongOptions:["Puppy 🐶","Kitten 🐱","Duckling 🐥"] },
  { id:2, parent:"Dog 🐕", baby:"Puppy 🐶", sound:"woof", level:1, wrongOptions:["Calf 🐮","Kitten 🐱","Foal 🐴"] },
  { id:3, parent:"Cat 🐈", baby:"Kitten 🐱", sound:"meow", level:1, wrongOptions:["Puppy 🐶","Calf 🐮","Chick 🐤"] },
  { id:4, parent:"Duck 🦆", baby:"Duckling 🐥", sound:"quack", level:1, wrongOptions:["Kitten 🐱","Puppy 🐶","Lamb 🐑"] },
  { id:5, parent:"Hen 🐓", baby:"Chick 🐤", sound:"cluck", level:1, wrongOptions:["Duckling 🐥","Calf 🐮","Foal 🐴"] },

  // Level 2 — More options (id 6-12)
  { id:6, parent:"Horse 🐎", baby:"Foal 🐴", sound:"neigh", level:2, wrongOptions:["Puppy 🐶","Lamb 🐑","Calf 🐮","Kitten 🐱"] },
  { id:7, parent:"Sheep 🐑", baby:"Lamb 🐑", sound:"baa", level:2, wrongOptions:["Foal 🐴","Chick 🐤","Calf 🐮","Duckling 🐥"] },
  { id:8, parent:"Pig 🐷", baby:"Piglet 🐽", sound:"oink", level:2, wrongOptions:["Lamb 🐑","Puppy 🐶","Chick 🐤","Foal 🐴"] },
  { id:9, parent:"Rabbit 🐇", baby:"Bunny 🐰", sound:"squeak", level:2, wrongOptions:["Kitten 🐱","Piglet 🐽","Chick 🐤","Duckling 🐥"] },
  { id:10, parent:"Bear 🐻", baby:"Bear cub 🐻", sound:"roar", level:2, wrongOptions:["Bunny 🐰","Lamb 🐑","Puppy 🐶","Foal 🐴"] },
  { id:11, parent:"Elephant 🐘", baby:"Elephant calf 🐘", sound:"trumpet", level:2, wrongOptions:["Calf 🐮","Bunny 🐰","Piglet 🐽","Chick 🐤"] },
  { id:12, parent:"Lion 🦁", baby:"Lion cub 🦁", sound:"roar", level:2, wrongOptions:["Puppy 🐶","Foal 🐴","Bear cub 🐻","Lamb 🐑"] },

  // Level 3 — Timer rush (id 13-20)
  { id:13, parent:"Frog 🐸", baby:"Tadpole 🫧", sound:"ribbit", level:3, wrongOptions:["Bunny 🐰","Piglet 🐽","Chick 🐤","Duckling 🐥"] },
  { id:14, parent:"Butterfly 🦋", baby:"Caterpillar 🐛", sound:"flutter", level:3, wrongOptions:["Tadpole 🫧","Lamb 🐑","Foal 🐴","Bear cub 🐻"] },
  { id:15, parent:"Kangaroo 🦘", baby:"Joey 🦘", sound:"boing", level:3, wrongOptions:["Bunny 🐰","Piglet 🐽","Calf 🐮","Chick 🐤"] },
  { id:16, parent:"Penguin 🐧", baby:"Penguin chick 🐧", sound:"squawk", level:3, wrongOptions:["Duckling 🐥","Joey 🦘","Tadpole 🫧","Piglet 🐽"] },
  { id:17, parent:"Owl 🦉", baby:"Owlet 🦉", sound:"hoot", level:3, wrongOptions:["Penguin chick 🐧","Chick 🐤","Joey 🦘","Bunny 🐰"] },
  { id:18, parent:"Deer 🦌", baby:"Fawn 🦌", sound:"bleat", level:3, wrongOptions:["Foal 🐴","Lamb 🐑","Joey 🦘","Bunny 🐰"] },
  { id:19, parent:"Wolf 🐺", baby:"Wolf pup 🐺", sound:"howl", level:3, wrongOptions:["Puppy 🐶","Kitten 🐱","Fawn 🦌","Lion cub 🦁"] },
  { id:20, parent:"Dragon 🐉", baby:"Dragon egg 🥚", sound:"roar", level:3, wrongOptions:["Foal 🐴","Owlet 🦉","Fawn 🦌","Joey 🦘"] },
];

function playSound(type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === "correct") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + 0.08);
    oscillator.frequency.setValueAtTime(783.99, now + 0.16);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } else if (type === "wrong") {
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.linearRampToValueAtTime(200, now + 0.15);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } else if (type === "levelUp") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + 0.1);
    oscillator.frequency.setValueAtTime(783.99, now + 0.2);
    oscillator.frequency.setValueAtTime(1046.50, now + 0.3);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } else if (type === "tick") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.03);
    oscillator.start(now);
    oscillator.stop(now + 0.04);
  } else if (type === "click") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.04);
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  } else if (type === "wellDone") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + 0.08);
    oscillator.frequency.setValueAtTime(783.99, now + 0.16);
    oscillator.frequency.setValueAtTime(1046.50, now + 0.24);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
    oscillator.start(now);
    oscillator.stop(now + 0.6);
  }

  setTimeout(() => {
    if (audioCtx.state !== "closed") {
      audioCtx.close().catch(() => {});
    }
  }, 1000);
}

function calcXP(isCorrect, streak, timerLeft, level) {
  if (!isCorrect) return 0;
  let xp = 10 * level; // base: L1=10, L2=20, L3=30
  if (streak >= 3) xp = Math.floor(xp * 2); // streak ×2
  if (level === 3 && timerLeft > 15) xp += 5; // speed bonus
  return xp;
}

function calcStars(correctCount, total) {
  const pct = correctCount / total;
  if (pct === 1) return 3;
  if (pct >= 0.8) return 2;
  if (pct >= 0.6) return 1;
  return 0;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MatchBabyToAnimal() {
  const [screen, setScreen] = useState("boot");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [timerLeft, setTimerLeft] = useState(20);
  const [selectedAnswer, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setFeedback] = useState(false);
  const [unlockedLevels, setUnlocked] = useState([1]);
  const [levelHistory, setHistory] = useState({});
  const [options, setOptions] = useState([]);
  const [dimmedOptions, setDimmedOptions] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [roundStats, setRoundStats] = useState({ xpEarned: 0, answers: [] });

  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "playing" && currentLevel === 3 && !showFeedback && timerLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimerLeft((t) => {
          if (t === 6) playSound("tick");
          if (t === 5) playSound("tick");
          if (t === 4) playSound("tick");
          if (t === 3) playSound("tick");
          if (t === 2) playSound("tick");
          if (t === 1) playSound("tick");
          
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleAnswer(null); // Time's up
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, currentLevel, showFeedback, timerLeft]);

  useEffect(() => {
    if (questions.length > 0 && currentQ < questions.length) {
      const q = questions[currentQ];
      const allOptions = [q.baby, ...q.wrongOptions];
      setOptions(shuffleArray(allOptions));
      setDimmedOptions([]);
      setTimerLeft(20);
    }
  }, [currentQ, questions]);

  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  const startGame = (level) => {
    playSound("click");
    setLevel(level);
    
    let levelQuestions = ANIMALS.filter((a) => a.level === level);
    levelQuestions = shuffleArray(levelQuestions);
    
    const count = level === 1 ? 5 : level === 2 ? 7 : 10;
    setQuestions(levelQuestions.slice(0, count));
    
    setCurrentQ(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setLives(3);
    setHintsLeft(2);
    setTimerLeft(20);
    setRoundStats({ xpEarned: 0, answers: [] });
    setScreen("playing");
  };

  const handleAnswer = (option) => {
    if (showFeedback || selectedAnswer !== null) return;
    
    setSelected(option);
    
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[currentQ];
    const correct = option === q.baby;
    setIsCorrect(correct);
    setFeedback(true);

    let gainedXP = calcXP(correct, streak, timerLeft, currentLevel);

    setRoundStats(prev => ({
      ...prev,
      xpEarned: prev.xpEarned + gainedXP,
      answers: [...prev.answers, { question: q, selected: option, correct }]
    }));

    if (correct) {
      playSound("correct");
      setScore(s => s + 10 * currentLevel); // base score
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
      setTotalXP(x => x + gainedXP);
    } else {
      playSound("wrong");
      setStreak(0);
      setLives(l => l - 1);
    }

    setTimeout(() => {
      setFeedback(false);
      setSelected(null);
      setIsCorrect(null);
      
      const newLives = correct ? lives : lives - 1;
      
      if (newLives === 0 || currentQ + 1 >= questions.length) {
        finishLevel(correct ? correctCount + 1 : correctCount, newLives);
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 2000);
  };

  const finishLevel = (finalCorrect, finalLives) => {
    const starsEarned = calcStars(finalCorrect, questions.length);
    const finalScore = score + (isCorrect ? 10 * currentLevel : 0);
    
    setHistory(prev => ({
      ...prev,
      [currentLevel]: {
        score: Math.max(prev[currentLevel]?.score || 0, finalScore),
        stars: Math.max(prev[currentLevel]?.stars || 0, starsEarned),
        xp: (prev[currentLevel]?.xp || 0) + roundStats.xpEarned + (isCorrect ? calcXP(true, streak, timerLeft, currentLevel) : 0),
        plays: (prev[currentLevel]?.plays || 0) + 1,
      }
    }));
    
    setUnlocked(prev => {
      const nextLvl = currentLevel + 1;
      if (starsEarned >= (currentLevel === 1 ? 1 : 2) && !prev.includes(nextLvl) && nextLvl <= 3) {
        return [...prev, nextLvl];
      }
      return prev;
    });

    playSound("levelUp");
    setConfetti(true);
    setScreen("result");
  };

  const useHint = () => {
    if (hintsLeft > 0 && !showFeedback) {
      playSound("click");
      setHintsLeft(h => h - 1);
      const q = questions[currentQ];
      const wrongs = options.filter(opt => opt !== q.baby && !dimmedOptions.includes(opt));
      const toDim = shuffleArray(wrongs).slice(0, 2);
      setDimmedOptions(prev => [...prev, ...toDim]);
    }
  };

  const speak = (sound, text) => {
    playSound("click");
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sound + "! " + text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderStars = (count) => {
    return Array(3).fill(0).map((_, i) => (
      <span key={i} style={{ color: '#FFD700', fontSize: '20px' }}>
        {i < count ? '⭐' : '☆'}
      </span>
    ));
  };

  const getBadge = () => {
    if (totalXP >= 500) return "Animal Master 🏆";
    if (totalXP >= 250) return "Wildlife Pro 🦁";
    if (totalXP >= 100) return "Farm Expert 🌿";
    return "Animal Friend 🌱";
  };
  
  const getNextBadgeXP = () => {
    if (totalXP < 100) return 100;
    if (totalXP < 250) return 250;
    if (totalXP < 500) return 500;
    return 500;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #87CEEB 0%, #B5E7A0 60%, #5D8233 100%)',
      fontFamily: "'Nunito', sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;0,800;1,400&display=swap');
          
          .card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          }
          
          .btn {
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .btn:hover:not(:disabled) {
            transform: scale(1.05);
          }
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .btn-green { background: #4CAF50; color: white; }
          .btn-green:hover:not(:disabled) { background: #388E3C; }
          
          .btn-orange { background: #FF9800; color: white; }
          .btn-orange:hover:not(:disabled) { background: #E65100; }
          
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-10px)}
            40%{transform:translateX(10px)}
            60%{transform:translateX(-8px)}
            80%{transform:translateX(8px)}
          }
          @keyframes bounce {
            0%,100%{transform:scale(1)}
            30%{transform:scale(1.15)}
            60%{transform:scale(0.95)}
          }
          @keyframes animalBob {
            0%,100%{transform:translateY(0) rotate(0deg)}
            50%{transform:translateY(-12px) rotate(3deg)}
          }
          @keyframes marquee {
            0%{transform:translateX(100%)}
            100%{transform:translateX(-100%)}
          }
          @keyframes pop {
            0%{transform:scale(0);opacity:0}
            60%{transform:scale(1.2);opacity:1}
            100%{transform:scale(1)}
          }
          @keyframes confettiFall {
            0%{transform:translateY(-20px) rotate(0deg);opacity:1}
            100%{transform:translateY(800px) rotate(720deg);opacity:0}
          }
          @keyframes slideUp {
            from{transform:translateY(80px);opacity:0}
            to{transform:translateY(0);opacity:1}
          }
          @keyframes pulse {
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:0.8;transform:scale(1.08)}
          }
          @keyframes timerPulse {
            0%,100%{transform:scale(1)}
            50%{transform:scale(1.05)}
          }
        `}
      </style>

      {confetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100 }}>
          {Array(30).fill(0).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-50px',
              left: `${Math.random() * 100}%`,
              width: '10px',
              height: '20px',
              backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#FFD700', '#7C4DFF', '#29B6F6'][Math.floor(Math.random() * 6)],
              animation: `confettiFall ${2 + Math.random() * 2}s linear forwards`,
              animationDelay: `${Math.random()}s`
            }} />
          ))}
        </div>
      )}

      {screen === "boot" && (
        <div className="card" style={{ maxWidth: '480px', width: '100%', margin: 'auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '20px' }}>
            <div style={{ display: 'inline-block', fontSize: '36px', animation: 'marquee 10s linear infinite' }}>
              🐄 🐶 🐱 🦆 🐓 🐎 🐑 🐷 🐇 🐻
            </div>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#2E7D32', textShadow: '2px 2px 0 #A5D6A7', margin: '0 0 10px 0' }}>
            Match Baby to Animal!
          </h1>
          <p style={{ fontSize: '16px', color: '#555', fontStyle: 'italic', marginBottom: '30px' }}>
            Can you find the baby animals? 🐾
          </p>
          
          <input 
            type="text" 
            placeholder="What's your name? 🌟" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              fontSize: '18px', border: '3px solid #4CAF50', padding: '12px 20px',
              borderRadius: '50px', textAlign: 'center', width: '80%', marginBottom: '20px',
              outline: 'none'
            }}
          />
          
          <button 
            className="btn btn-green"
            style={{ width: '80%', padding: '16px', fontSize: '20px' }}
            disabled={!playerName.trim()}
            onClick={() => { playSound("click"); setScreen("levelSelect"); }}
          >
            Let's Play! 🚀
          </button>
          
          <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
            3 exciting levels await you! ⭐⭐⭐
          </p>
        </div>
      )}

      {screen === "levelSelect" && (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', color: '#1B5E20', textShadow: '1px 1px 0 #FFF', margin: 0 }}>
              Choose Your Level, {playerName}! 🎯
            </h2>
            <button className="btn" style={{ padding: '8px 16px', background: 'white', color: '#333' }} onClick={() => setScreen("boot")}>
              Back
            </button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {[
              { id: 1, icon: '🌱', title: 'Level 1 — Easy Farm', desc: 'Find babies for common farm animals.' },
              { id: 2, icon: '🌿', title: 'Level 2 — More Options', desc: 'More animals and more choices!' },
              { id: 3, icon: '🔥', title: 'Level 3 — Timer Rush', desc: 'Race against the clock!' }
            ].map(lvl => {
              const unlocked = unlockedLevels.includes(lvl.id);
              const history = levelHistory[lvl.id] || { score: 0, stars: 0 };
              
              return (
                <div key={lvl.id} className="card" style={{ 
                  flex: '1 1 250px', padding: '24px', position: 'relative',
                  opacity: unlocked ? 1 : 0.8
                }}>
                  {!unlocked && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.6)', borderRadius: '24px', zIndex: 10,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      color: 'white', padding: '20px'
                    }}>
                      <div style={{ fontSize: '40px' }}>🔒</div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                        Complete Level {lvl.id - 1} first!
                      </div>
                    </div>
                  )}
                  
                  <div style={{ fontSize: '56px', marginBottom: '10px' }}>{lvl.icon}</div>
                  <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#333' }}>{lvl.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0', height: '40px' }}>{lvl.desc}</p>
                  
                  <div style={{ marginBottom: '12px' }}>
                    {renderStars(history.stars)}
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 'bold', marginBottom: '20px' }}>
                    Best: {history.score} pts
                  </div>
                  
                  <button 
                    className="btn btn-green"
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => startGame(lvl.id)}
                    disabled={!unlocked}
                  >
                    PLAY
                  </button>
                </div>
              );
            })}
          </div>
          
          <button 
            className="btn btn-orange" 
            style={{ marginTop: '30px', padding: '12px 24px' }}
            onClick={() => { playSound("click"); setScreen("dashboard"); }}
          >
            <BarChart2 size={24} /> My Dashboard
          </button>
        </div>
      )}

      {screen === "playing" && questions.length > 0 && (
        <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
          
          {/* TOP BAR */}
          <div className="card" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '20px' }}>
              {Array(3).fill(0).map((_, i) => <span key={i}>{i < lives ? '❤️' : '🖤'}</span>)}
            </div>
            
            <div style={{ flex: 1, margin: '0 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>
                Question {currentQ + 1} of {questions.length}
              </div>
              <div style={{ background: '#E0E0E0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#4CAF50', height: '100%', 
                  width: `${(currentQ / questions.length) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FF9800', fontWeight: 'bold', fontSize: '16px' }}>⭐ {score}</div>
              <div style={{ color: '#7C4DFF', fontWeight: 'bold', fontSize: '14px' }}>⚡ {totalXP} XP</div>
            </div>
          </div>

          {/* TIMER (L3) */}
          {currentLevel === 3 && (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '60px', height: '60px', borderRadius: '50%',
                border: `4px solid ${timerLeft > 10 ? '#4CAF50' : timerLeft > 5 ? '#FF9800' : '#F44336'}`,
                background: 'white', fontSize: '24px', fontWeight: 'bold',
                color: timerLeft > 10 ? '#4CAF50' : timerLeft > 5 ? '#FF9800' : '#F44336',
                animation: timerLeft <= 5 ? 'timerPulse 1s infinite' : 'none'
              }}>
                {timerLeft}
              </div>
            </div>
          )}
          
          {streak >= 3 && (
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#FF9800', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1s infinite', zIndex: 10 }}>
              🔥 ×2 Streak!
            </div>
          )}

          {/* PARENT CARD */}
          <div className="card" style={{ padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '80px', animation: 'animalBob 1.5s ease-in-out infinite', display: 'inline-block' }}>
              {questions[currentQ].parent.split(' ')[1]}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '10px 0 5px 0' }}>
              {questions[currentQ].parent.split(' ')[0]}
            </h2>
            <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#666', margin: '0 0 15px 0' }}>
              Who is my baby? 🤔
            </p>
            <button 
              className="btn btn-green" 
              style={{ padding: '8px 16px', fontSize: '14px' }}
              onClick={() => speak(questions[currentQ].sound, "I am a " + questions[currentQ].parent.split(' ')[0])}
            >
              <Volume2 size={16} /> Hear me!
            </button>
          </div>

          {/* OPTIONS GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '12px',
            marginBottom: '80px'
          }}>
            {options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === questions[currentQ].baby;
              
              let style = {
                background: 'white',
                border: '3px solid #E0E0E0',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: selectedAnswer ? 'default' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                pointerEvents: selectedAnswer ? 'none' : 'auto',
                opacity: dimmedOptions.includes(opt) ? 0.3 : 1
              };

              if (isSelected) {
                if (isCorrect) {
                  style.border = '3px solid #4CAF50';
                  style.background = '#E8F5E9';
                  style.boxShadow = '0 0 0 4px #4CAF50';
                  style.animation = 'bounce 0.5s';
                } else {
                  style.border = '3px solid #F44336';
                  style.background = '#FFEBEE';
                  style.animation = 'shake 0.5s';
                }
              }

              return (
                <button key={i} style={style} onClick={() => handleAnswer(opt)} disabled={dimmedOptions.includes(opt) || selectedAnswer !== null}>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* HINT BUTTON */}
          <button 
            className="btn btn-orange"
            style={{ position: 'fixed', bottom: '20px', left: '20px', padding: '12px 20px', zIndex: 10, opacity: hintsLeft === 0 ? 0.5 : 1 }}
            onClick={useHint}
            disabled={hintsLeft === 0 || selectedAnswer !== null}
          >
            <Lightbulb size={20} /> Hint ({hintsLeft})
          </button>

          {/* FEEDBACK OVERLAY */}
          {showFeedback && (
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, 
              background: isCorrect ? '#4CAF50' : '#F44336',
              color: 'white', padding: '20px', textAlign: 'center',
              animation: 'slideUp 0.3s ease-out', zIndex: 20,
              boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
            }}>
              <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>
                {isCorrect ? `✅ Well done, ${playerName}! 🎉` : `❌ Oops! The answer was ${questions[currentQ].baby}!`}
              </h3>
              
              <p style={{ fontSize: '18px', margin: '0 0 15px 0' }}>
                {isCorrect 
                  ? `A baby ${questions[currentQ].parent.split(' ')[0]} is called a ${questions[currentQ].baby.split(' ')[0]}!`
                  : "Keep trying! You've got this! 💪"
                }
              </p>
              
              {isCorrect && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <span style={{ background: 'white', color: '#7C4DFF', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                    +{calcXP(true, streak, timerLeft, currentLevel)} XP ⚡
                  </span>
                  {streak >= 2 && (
                    <span style={{ background: 'white', color: '#FF9800', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                      🔥 {streak} in a row!
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {screen === "result" && (
        <div className="card" style={{ maxWidth: '600px', width: '100%', margin: 'auto', padding: '40px 20px', textAlign: 'center', animation: 'pop 0.5s ease-out' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>
            {score / (10 * currentLevel * questions.length) === 1 ? '🏆' :
             score / (10 * currentLevel * questions.length) >= 0.8 ? '⭐' :
             score / (10 * currentLevel * questions.length) >= 0.6 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '32px', color: '#333', margin: '0 0 30px 0' }}>
            {score / (10 * currentLevel * questions.length) === 1 ? 'Perfect!' :
             score / (10 * currentLevel * questions.length) >= 0.8 ? 'Amazing!' :
             score / (10 * currentLevel * questions.length) >= 0.6 ? 'Good job!' : 'Keep practicing!'}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
            <div style={{ background: '#F5F5F5', padding: '15px', borderRadius: '16px', flex: 1 }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Score</div>
              <div style={{ color: '#4CAF50', fontSize: '24px', fontWeight: 'bold' }}>{score} pts</div>
            </div>
            <div style={{ background: '#F5F5F5', padding: '15px', borderRadius: '16px', flex: 1 }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>XP Earned</div>
              <div style={{ color: '#7C4DFF', fontSize: '24px', fontWeight: 'bold' }}>+{roundStats.xpEarned} ⚡</div>
            </div>
            <div style={{ background: '#F5F5F5', padding: '15px', borderRadius: '16px', flex: 1 }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Stars</div>
              <div>{renderStars(calcStars(correctCount, questions.length))}</div>
            </div>
          </div>

          <div style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto', marginBottom: '30px', padding: '10px', background: '#FAFAFA', borderRadius: '12px' }}>
            {roundStats.answers.map((ans, i) => (
              <div key={i} style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '10px', 
                borderBottom: i < roundStats.answers.length - 1 ? '1px solid #EEE' : 'none',
                background: ans.correct ? '#E8F5E9' : '#FFEBEE',
                borderRadius: '8px', marginBottom: '4px'
              }}>
                <span style={{ fontSize: '18px' }}>
                  {ans.question.parent.split(' ')[1]} → {ans.question.baby.split(' ')[1]}
                </span>
                <span>{ans.correct ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <button className="btn btn-green" style={{ padding: '12px 20px' }} onClick={() => startGame(currentLevel)}>
              <RefreshCw size={20} /> Play Again
            </button>
            <button className="btn btn-orange" style={{ padding: '12px 20px' }} onClick={() => { playSound("click"); setScreen("levelSelect"); }}>
              <Map size={20} /> Level Select
            </button>
            <button className="btn" style={{ padding: '12px 20px', background: '#7C4DFF', color: 'white' }} onClick={() => { playSound("click"); setScreen("dashboard"); }}>
              <BarChart2 size={20} /> Progress
            </button>
          </div>
        </div>
      )}

      {screen === "dashboard" && (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', color: '#1B5E20', margin: 0 }}>
              {playerName}'s Animal Expert Badge 🦁
            </h2>
            <button className="btn" style={{ padding: '8px 16px', background: 'white', color: '#333' }} onClick={() => setScreen("levelSelect")}>
              Back
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: '1 1 200px', padding: '20px', textAlign: 'center' }}>
              <div style={{ color: '#666', fontSize: '16px', marginBottom: '5px' }}>Total XP</div>
              <div style={{ color: '#7C4DFF', fontSize: '32px', fontWeight: 'bold' }}>{totalXP} ⚡</div>
            </div>
            <div className="card" style={{ flex: '1 1 200px', padding: '20px', textAlign: 'center' }}>
              <div style={{ color: '#666', fontSize: '16px', marginBottom: '5px' }}>Levels Played</div>
              <div style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold' }}>{Object.keys(levelHistory).length}</div>
            </div>
            <div className="card" style={{ flex: '1 1 200px', padding: '20px', textAlign: 'center' }}>
              <div style={{ color: '#666', fontSize: '16px', marginBottom: '5px' }}>Best Level</div>
              <div style={{ color: '#FF9800', fontSize: '32px', fontWeight: 'bold' }}>
                {Object.keys(levelHistory).length > 0 
                  ? "Level " + Object.entries(levelHistory).reduce((max, [lvl, data]) => data.stars > (levelHistory[max]?.stars || 0) ? lvl : max, Object.keys(levelHistory)[0])
                  : "-"}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#333' }}>Current Badge: {getBadge()}</h3>
            <div style={{ background: '#E0E0E0', height: '16px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ 
                background: '#7C4DFF', height: '100%', 
                width: `${Math.min((totalXP / getNextBadgeXP()) * 100, 100)}%`,
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '14px' }}>
              <span>{totalXP} XP</span>
              <span>Next Badge at {getNextBadgeXP()} XP</span>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#333' }}>Level Breakdown</h3>
            {[1, 2, 3].map(lvl => {
              const data = levelHistory[lvl];
              return (
                <div key={lvl} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '15px', borderBottom: lvl < 3 ? '1px solid #EEE' : 'none'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', width: '80px' }}>Level {lvl}</div>
                  {data ? (
                    <>
                      <div style={{ width: '100px' }}>{renderStars(data.stars)}</div>
                      <div style={{ color: '#4CAF50', fontWeight: 'bold', width: '100px', textAlign: 'center' }}>{data.score} pts</div>
                      <div style={{ color: '#666', fontSize: '14px' }}>{data.plays} plays</div>
                    </>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic', flex: 1, textAlign: 'right' }}>Not played yet</div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '20px', fontWeight: 'bold', color: '#2E7D32', animation: 'bounce 2s infinite' }}>
            You're becoming an animal expert, {playerName}! 🐾
          </div>
        </div>
      )}
    </div>
  );
}
