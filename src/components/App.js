// src/App.js
import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import PreviousButton from "./PreviousButton";
import NumberOfQuestions from "./NumberOfQuestions";
import SelectLevel from "./SelectLevel";

// How many seconds per question?
const SECS_PER_QUESTION = 30;

// Our levels – note that the value (number) represents the question points for that difficulty.
const LEVELS = {
  ALL: 0,
  EASY: 10,
  MEDIUM: 20,
  HARD: 30,
};

// Helper: Given a level value, find its key name (defaults to "ALL")
function getLevelName(levelValue) {
  return Object.keys(LEVELS).find((key) => LEVELS[key] === levelValue) || "ALL";
}

// Our initial state – notice that highscores is now an object with one entry per level.
const initialState = {
  questions: [],
  filteredQuestions: [],
  // Status can be: 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answers: [],
  points: 0,
  highscores: {
    ALL: Number(localStorage.getItem("highscore-ALL")) || 0,
    EASY: Number(localStorage.getItem("highscore-EASY")) || 0,
    MEDIUM: Number(localStorage.getItem("highscore-MEDIUM")) || 0,
    HARD: Number(localStorage.getItem("highscore-HARD")) || 0,
  },
  numQuestions: 0,
  quizLevel: LEVELS.ALL,
  levels: LEVELS,
  secondsRemaining: null,
  errorMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        filteredQuestions: action.payload,
        numQuestions: action.payload.length,
        status: "ready",
      };

    case "setNumQuestions":
      return {
        ...state,
        numQuestions: action.payload,
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
        errorMessage: action.errorMessage,
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.numQuestions * SECS_PER_QUESTION,
      };

    case "newAnswer": {
      const question = state.filteredQuestions.at(state.index);
      return {
        ...state,
        answers: [...state.answers, action.payload],
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }

    case "previousQuestion":
      return { ...state, index: state.index - 1 };

    case "nextQuestion":
      return { ...state, index: state.index + 1 };

    case "setLevel": {
      // Filter questions by level. When action.payload is 0, show all questions.
      const filteredQuestions = state.questions.filter(
        (question) =>
          (action.payload !== 0 && question.points === action.payload) ||
          action.payload === 0
      );
      return {
        ...state,
        quizLevel: action.payload,
        filteredQuestions: filteredQuestions,
        numQuestions: filteredQuestions.length,
      };
    }

    case "finish": {
      // Determine which level was played:
      const currentLevelName = getLevelName(state.quizLevel);
      // Get the current highscore for that level
      const currentHighscore = state.highscores[currentLevelName] || 0;
      // Update if the current points exceed the saved highscore
      const newHighscore =
        state.points > currentHighscore ? state.points : currentHighscore;
      // Save new highscore to localStorage:
      localStorage.setItem(`highscore-${currentLevelName}`, newHighscore);
      return {
        ...state,
        status: "finished",
        highscores: {
          ...state.highscores,
          [currentLevelName]: newHighscore,
        },
      };
    }

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        filteredQuestions: state.questions,
        numQuestions: state.questions.length,
        status: "ready",
        highscores: state.highscores,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    {
      status,
      index,
      answers,
      points,
      highscores,
      secondsRemaining,
      numQuestions,
      filteredQuestions,
      levels,
      quizLevel,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Calculate the maximum possible points for the current quiz.
  const maxPossiblePoints = filteredQuestions
    .filter((question, i) => i < numQuestions)
    .reduce((prev, cur) => prev + cur.points, 0);

  // Fetch questions from your API endpoint.
  useEffect(() => {
    const quizApi = async function () {
      try {
        const res = await fetch(process.env.REACT_APP_QUIZ_URL);
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data.questions });
      } catch (err) {
        dispatch({ type: "dataFailed", errorMessage: err.message });
      }
    };
    quizApi();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen dispatch={dispatch} highscores={highscores}>
              <NumberOfQuestions
                maxNumQuestions={filteredQuestions.length}
                numQuestions={numQuestions}
                dispatch={dispatch}
              />
              <SelectLevel
                dispatch={dispatch}
                quizLevel={quizLevel}
                levels={levels}
              />
            </StartScreen>
          </>
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answers[index] ?? null}
            />
            <Question
              question={filteredQuestions[index]}
              dispatch={dispatch}
              answer={answers[index] ?? null}
              points={points}
            />
            <Footer>
              <>
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
                <PreviousButton dispatch={dispatch} index={index} />
                <NextButton
                  dispatch={dispatch}
                  answer={answers[index] ?? null}
                  numQuestions={numQuestions}
                  index={index}
                />
              </>
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            quizLevel={quizLevel}
            highscores={highscores}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
