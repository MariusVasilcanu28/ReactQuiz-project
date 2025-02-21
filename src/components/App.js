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
import { useQuiz } from "../context/QuizContext";

export default function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen>
              <NumberOfQuestions />
              <SelectLevel />
            </StartScreen>
          </>
        )}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <>
                <Timer />
                <PreviousButton />
                <NextButton />
              </>
            </Footer>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}
