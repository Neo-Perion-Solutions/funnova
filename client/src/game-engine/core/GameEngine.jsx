// file: client/src/game-engine/core/GameEngine.jsx

import React, { useCallback, useRef } from 'react';
import { getGame } from '../registry/gameRegistry';
import { useGameState } from '../hooks/useGameState';
import { useTimer } from '../hooks/useTimer';
import { useScore } from '../hooks/useScore';
import HUD from '../components/HUD';
import ScoreBoard from '../components/ScoreBoard';
import SoundSystem from '../systems/SoundSystem';

/**
 * GameEngine — orchestrates any registered game inside a lesson.
 *
 * Props:
 *   gameId    {string}   — registry key e.g. "plant-or-animal"
 *   gameDbId  {string}   — database games.id (for score submission)
 *   lessonId  {string}   — owning lesson id (passed through to onFinish)
 *   config    {object}   — optional config overrides merged with game defaults
 *   onFinish  {function} — ({ score, accuracy, correctCount, wrongCount,
 *                            bestStreak, gameId, lessonId }) => void
 *
 * Integration contract (what LessonPage must do in onFinish):
 *   1. POST /student/games/:gameId/score   — save raw score
 *   2. POST /student/lessons/:lessonId/section/game/complete — unlock next section
 *   3. Refresh roadmap progress
 */
const GameEngine = ({
  gameId,
  gameDbId,
  lessonId,
  config: configOverrides = {},
  onFinish,
}) => {
  const gameEntry = getGame(gameId);

  if (!gameEntry) {
    return (
      <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-6 text-center">
        <p className="text-red-700 font-bold text-lg">Game not found: <code>{gameId}</code></p>
        <p className="text-red-500 text-sm mt-1">
          Register it in <code>gameRegistry.js</code> first.
        </p>
      </div>
    );
  }

  const { component: GameComponent, config: defaultConfig } = gameEntry;
  const mergedConfig = { ...defaultConfig, ...configOverrides };

  return (
    <GameEngineInner
      GameComponent={GameComponent}
      config={mergedConfig}
      gameId={gameId}
      gameDbId={gameDbId}
      lessonId={lessonId}
      onFinish={onFinish}
    />
  );
};

/* ─────────────────────────────────────────────────────────────── */

/**
 * Inner component — separated so hooks are always called unconditionally
 * even after the registry guard above.
 */
const GameEngineInner = ({
  GameComponent,
  config,
  gameId,
  gameDbId,
  lessonId,
  onFinish,
}) => {
  const { state, dispatch, actions } = useGameState({
    totalRounds:  config.totalRounds,
    timePerRound: config.timePerRound,
  });

  const scoreData = useScore(state);

  /*
   * Snapshot score at the moment the game finishes.
   * useScore() derives values from state, which is reactive —
   * using a ref ensures we read the last stable value even if
   * a re-render happens between FINISH dispatch and Continue click.
   */
  const finalScoreRef = useRef(null);

  // Called by GameLoop when time runs out
  const handleTimeUp = useCallback(() => {
    actions.wrong();
    actions.nextLevel(config.timePerRound);
  }, [actions, config.timePerRound]);

  // Timer — active only when timePerRound > 0 and game is still running
  useTimer({
    state,
    dispatch,
    onTimeUp: handleTimeUp,
    enabled: config.timePerRound > 0 && !state.isFinished,
  });

  /*
   * Snapshot score every render while the game is still running.
   * When isFinished flips to true, finalScoreRef holds the last
   * complete score snapshot.
   */
  if (!state.isFinished) {
    finalScoreRef.current = {
      score:        scoreData.totalScore,
      accuracy:     scoreData.accuracy,
      correctCount: scoreData.correctCount,
      wrongCount:   scoreData.wrongCount,
      bestStreak:   scoreData.bestStreak,
    };
  }

  /*
   * Called when the player clicks "Continue" on the ScoreBoard.
   * Reads from the ref snapshot (not the scoreData closure) to
   * guarantee the correct final values are reported.
   */
  const handleContinue = useCallback(() => {
    SoundSystem.playComplete();

    const result = finalScoreRef.current ?? {
      score:        scoreData.totalScore,
      accuracy:     scoreData.accuracy,
      correctCount: scoreData.correctCount,
      wrongCount:   scoreData.wrongCount,
      bestStreak:   scoreData.bestStreak,
    };

    onFinish?.({
      ...result,
      gameId:   gameDbId ?? gameId,   // prefer DB id for API calls
      lessonId: lessonId,
    });
  }, [onFinish, scoreData, gameDbId, gameId, lessonId]);

  // Re-mount game cleanly by resetting shared state
  const handlePlayAgain = useCallback(() => {
    finalScoreRef.current = null;
    actions.reset({
      totalRounds:  config.totalRounds,
      timePerRound: config.timePerRound,
    });
  }, [actions, config]);

  /* ── ScoreBoard (game over) ── */
  if (state.isFinished) {
    return (
      <ScoreBoard
        state={state}
        onPlayAgain={handlePlayAgain}
        onContinue={handleContinue}
        gameTitle={config.title || 'Game'}
      />
    );
  }

  /* ── Active gameplay ── */
  return (
    <div className="space-y-2">
      {/* HUD: score / streak / round / timer */}
      <HUD state={state} config={config} />

      {/* Game component receives engine state + dispatch + helpers */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-6 shadow-sm">
        <GameComponent
          state={state}
          dispatch={dispatch}
          actions={actions}
          config={config}
        />
      </div>
    </div>
  );
};

export default GameEngine;
