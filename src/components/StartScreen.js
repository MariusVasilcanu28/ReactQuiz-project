// src/components/StartScreen.js
import React from "react";
import { useQuiz } from "../context/QuizContext";

function StartScreen({ children }) {
  const { dispatch, highscores } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <div className="highscores-summary">
        <h3>Highscores by Difficulty:</h3>
        <ul className="highscore-list">
          {Object.entries(highscores).map(([level, score]) => (
            <li key={level} className="highscore-list-item">
              <span>{level}</span>
              <span>{score}</span>
            </li>
          ))}
        </ul>
      </div>
      {children}
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
