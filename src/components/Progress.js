import { useQuiz } from "../context/QuizContext";

function Progress() {
  const { index, numQuestions, points, maxPossiblePoints, answers } = useQuiz();

  const answer = answers[index] ?? null;
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />

      <p>
        Question <strong>{index + 1}</strong> / <strong>{numQuestions}</strong>
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
