import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import { CheckCircle, Zap } from 'lucide-react';

/**
 * Simple confetti animation using CSS
 * Creates falling confetti pieces without external dependencies
 */
const Confetti = ({ show }) => {
  if (!show) return null;

  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-linear-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const CompletionCelebration = ({
  score,
  streak = 0,
  nextLesson = null,
  onContinue,
  onRetry,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((score.correct / score.total) * 100);
  const isHighScore = percentage >= 70;

  // Trigger confetti on mount for high scores
  useEffect(() => {
    if (isHighScore) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isHighScore]);

  // Determine messaging based on performance
  const getMessage = () => {
    if (percentage >= 90)
      return { title: 'Incredible!', subtitle: "You're a superstar! 🌟", color: 'yellow' };
    if (percentage >= 80)
      return { title: 'Excellent!', subtitle: 'Awesome work! 🎯', color: 'green' };
    if (percentage >= 70)
      return { title: 'Great Job!', subtitle: 'You got it! ✨', color: 'blue' };
    if (percentage >= 60)
      return { title: 'Good Effort!', subtitle: 'Keep practicing! 💪', color: 'purple' };
    return { title: 'Nice Try!', subtitle: 'Review and retry for better results! 📚', color: 'orange' };
  };

  const message = getMessage();
  const colorClasses = {
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  const streakIncremented = streak > 0;

  return (
    <div className="relative min-h-full bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex flex-col items-center justify-center">
      <Confetti show={showConfetti} />

      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
        {/* Main Score Card */}
        <div
          className={`rounded-2xl bg-linear-to-br ${colorClasses[message.color]} p-1 shadow-2xl transform transition-all duration-300 hover:scale-105`}
        >
          <div className="bg-white rounded-2xl p-8 sm:p-10 space-y-6">
            {/* Celebration Emoji */}
            <div className="text-center">
              <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
                {isHighScore ? '🎉' : '🌟'}
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold bg-linear-to-r ${colorClasses[message.color]} bg-clip-text text-transparent`}>
                {message.title}
              </h2>
              <p className="text-lg text-gray-600 mt-2">{message.subtitle}</p>
            </div>

            {/* Score Display */}
            <div className="border-t-2 border-b-2 border-gray-200 py-6">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black text-blue-600 mb-2">
                  {score.correct}/{score.total}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${colorClasses[message.color]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-700 min-w-fit">{percentage}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  You got <span className="font-bold text-gray-900">{score.correct}</span> correct{' '}
                  {score.correct === 1 ? 'answer' : 'answers'}
                </p>
              </div>
            </div>

            {/* Streak Widget */}
            {streakIncremented && (
              <div className="flex items-center justify-center gap-3 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <Zap className="h-6 w-6 text-amber-500 animate-pulse" />
                <div className="text-center">
                  <p className="text-sm text-amber-900 font-semibold">Streak +1!</p>
                  <p className="text-xs text-amber-700">Keep it up!</p>
                </div>
              </div>
            )}

            {/* Next Lesson Preview */}
            {nextLesson && percentage >= 60 && (
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-bold text-blue-900 mb-1">NEXT UP</p>
                <p className="text-sm font-semibold text-gray-900">{nextLesson.title}</p>
                <p className="text-xs text-gray-600 mt-1">Keep the momentum! 🚀</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {percentage < 60 && (
            <Button
              onClick={onRetry}
              variant="secondary"
              className="w-full"
            >
              Retry Question
            </Button>
          )}
          <Button
            onClick={onContinue}
            variant="primary"
            className="w-full"
          >
            {nextLesson && percentage >= 60
              ? `Continue to ${nextLesson.title}`
              : 'Back to Dashboard'}
          </Button>
        </div>

        {/* Metadata */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionCelebration;
