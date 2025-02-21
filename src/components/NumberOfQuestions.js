import { useQuiz } from "../context/QuizContext";

function NumberOfQuestions() {
  const { filteredQuestions, numQuestions, dispatch } = useQuiz();
  const maxNumQuestions = filteredQuestions.length;

  return (
    <div className="form-group-inline mx-30">
      <label htmlFor="numQuestions" className="form-label">
        Choose the number of Q's:
      </label>
      <input
        type="number"
        id="numQuestions"
        className="form-input"
        min={0}
        max={maxNumQuestions}
        value={numQuestions}
        onChange={(e) =>
          dispatch({ type: "setNumQuestions", payload: e.target.value })
        }
      />
    </div>
  );
}

export default NumberOfQuestions;
