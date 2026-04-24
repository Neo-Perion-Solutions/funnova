// file: client/src/game-engine/core/GameEngine.jsx

import React, { useCallback } from 'react';
import { getGame } from '../registry/gameRegistry';
import { useGameState } from '../hooks/useGameState';
import { useTimer } from '../hooks/useTimer';
import { useScore } from '../hooks/useScore';
import HUD from '../components/HUD';
import ScoreBoard from '../components/ScoreBoard';
import SoundSystem from '../systems/SoundSystem';

/**
 * GameEngine — the main orchestrator component.
 *
 * Props:
 *   gameId    — registry key (e.g. "number-builder")
 *   config    — optional config overrides
 *   onFinish  — callback({ score, accuracy, gameId }) when game ends
 *   gameDbId  — the database game.id for score submission
 */
const GameEngine = ({ gameId, config: configOverrides = {}, onFinish, gameDbId }) => {
  // Look up game from registry
  const gameEntry = getGame(gameId);

  if (!gameEntry) {
    return (
      <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-6 text-center">
        <p className="text-red-700 font-bold">⚠️ Game not found: {gameId}</p>
        <p className="text-red-500 text-sm mt-1">This game is not registered in the game engine.</p>
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
      onFinish={onFinish}
    />
  );
};

/**
 * Inner component that manages state lifecycle.
 * Separated to ensure hooks are called unconditionally.
 */
const GameEngineInner = ({ GameComponent, config, gameId, gameDbId, onFinish }) => {
  const { state, dispatch, actions } = useGameState({
    totalRounds: config.totalRounds,
    timePerRound: config.timePerRound,
  });

  const scoreData = useScore(state);

  // Timer callback when time runs out
  const handleTimeUp = useCallback(() => {
    actions.wrong();
    actions.nextLevel(config.timePerRound);
  }, [actions, config.timePerRound]);

  // Timer — only runs if timePerRound > 0
  useTimer({
    state,
    dispatch,
    onTimeUp: handleTimeUp,
    enabled: config.timePerRound > 0 && !state.isFinished,
  });

  // Called when the game finishes
  const handleFinish = useCallback(() => {
    SoundSystem.playComplete();
    onFinish?.({
      score: scoreData.totalScore,
      accuracy: scoreData.accuracy,
      gameId: gameDbId || gameId,
      correctCount: scoreData.correctCount,
      wrongCount: scoreData.wrongCount,
      bestStreak: scoreData.bestStreak,
    });
  }, [onFinish, scoreData, gameDbId, gameId]);

  // Play again handler
  const handlePlayAgain = useCallback(() => {
    actions.reset({
      totalRounds: config.totalRounds,
      timePerRound: config.timePerRound,
    });
  }, [actions, config]);

  // Show scoreboard when finished
  if (state.isFinished) {
    return (
      <ScoreBoard
        state={state}
        onPlayAgain={handlePlayAgain}
        onContinue={handleFinish}
        gameTitle={config.title || 'Game'}
      />
    );
  }

  return (
    <div className="space-y-2">
      {/* HUD */}
      <HUD state={state} config={config} />

      {/* Game Component */}
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
