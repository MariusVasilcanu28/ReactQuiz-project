function SelectLevel({ dispatch, quizLevel, levels }) {
  return (
    <>
      <div className="level-box">
        {Object.keys(levels).map((key, index) => (
          <label className="btn btn-ui grid-option-easy" key={key}>
            <input
              className="radio-btn"
              onClick={() => {
                dispatch({ type: "setLevel", payload: levels[key] });
                console.log(levels[key]);
              }}
            />
            {key}
          </label>
        ))}
      </div>
    </>
  );
}

export default SelectLevel;
