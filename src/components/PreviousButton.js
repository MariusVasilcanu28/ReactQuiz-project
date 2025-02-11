function PreviousButton({ index, dispatch }) {
  if (index > 0) {
    return (
      <button
        className="btn btn-ui-left"
        onClick={() => dispatch({ type: "previousQuestion" })}
      >
        Previous
      </button>
    );
  }
}

export default PreviousButton;
