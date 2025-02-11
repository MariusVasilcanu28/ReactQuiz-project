// src/components/FinishedScreen.js
import React from "react";

function FinishedScreen({
  points,
  maxPossiblePoints,
  quizLevel,
  highscores,
  dispatch,
}) {
  // Define the same LEVELS object to convert quizLevel back to its string key.
  const LEVELS = {
    ALL: 0,
    EASY: 10,
    MEDIUM: 20,
    HARD: 30,
  };

  // Find the current level name based on quizLevel.
  const currentLevelName =
    Object.keys(LEVELS).find((level) => LEVELS[level] === quizLevel) || "ALL";

  return (
    <div className="finished">
      <h2>Quiz Finished!</h2>
      <h3>
        You scored {points} out of {maxPossiblePoints} points.
      </h3>
      <h3>
        Highscore for {currentLevelName}: {highscores[currentLevelName]}
      </h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishedScreen;
