import RootApp from '@/main';
import QuizView from '@/views/quiz';
import words from '../__mocks__/wordsMock';

describe('quiz view test suite', () => {
  let instance: QuizView;

  beforeEach(() => {
    instance = new QuizView();
    // get words
    instance.words = words;
    instance.totalScore = instance.words.length;
    instance.apiFinished = true;
  });
  afterEach(() => {
    instance.resetQuiz();
  });

  it('mounted test', () => {
    instance.mounted();
    expect(window.vm).toEqual(instance);
  });

  it ('test onClickStartBtn -> quizStatus 0', () => {
    let startQuizSpy = jest.spyOn(instance, 'startQuiz');
    let resetQuizSpy = jest.spyOn(instance, 'resetQuiz');

    instance.quizStatus = 0;
    instance.onClickStartBtn();
    expect(startQuizSpy).toBeCalled();
    expect(resetQuizSpy).not.toBeCalled();
  });
  it ('test onClickStartBtn -> quizStatus 1', () => {
    let startQuizSpy = jest.spyOn(instance, 'startQuiz');
    let resetQuizSpy = jest.spyOn(instance, 'resetQuiz');

    instance.quizStatus = 1;
    instance.onClickStartBtn();
    expect(startQuizSpy).not.toBeCalled();
    expect(resetQuizSpy).toBeCalled();
  });

  it('test start quiz', () => {
    expect(instance.currentWord).not.toBeDefined();
    // call start quiz
    instance.startQuiz();
    expect(instance.quizStatus).toEqual(1);
  });

  it('test setQuizWord', () => {
    const setQuizWordSpy = jest.spyOn(instance, 'setQuizWord');
    const clearTimerSpy = jest.spyOn(instance, 'clearTimer');
    // call startQuiz
    instance.startQuiz();
    expect(setQuizWordSpy).toBeCalledTimes(1);
    expect(instance.currentWord).toEqual(words[0]);
    expect(instance .currentLimitSecond).toEqual(words[0].second);
    expect(clearTimerSpy).toBeCalledTimes(1);
    expect(instance.wordTimer).toBeDefined();
  });

  it('test nextWord -> currentWordIndex < words.length', () => {
    const curIdx = instance.currentWordIndex;
    const setQuizWordSpy = jest.spyOn(instance, 'setQuizWord');
    instance.nextWord();
    expect(instance.currentWordIndex).toBeGreaterThan(curIdx);
    expect(setQuizWordSpy).toBeCalled();
  });

  it('test nextWord -> currentWordIndex === words.length', () => {
    const rootApp = new RootApp(document.querySelector('#root-app'));
    instance.$root = rootApp;

    instance.currentWordIndex = words.length - 1;

    const clearTimerSpy = jest.spyOn(instance, 'clearTimer');
    const setQuizWordSpy = jest.spyOn(instance, 'setQuizWord');
    const rootRouterPushSpy = jest.spyOn(rootApp.$router, 'push');

    instance.nextWord();

    expect(clearTimerSpy).toBeCalled();
    expect(setQuizWordSpy).not.toBeCalled();

    const { totalScore, totalTime, successCount } = instance;
    let avgTime = 0
    if (successCount > 0) {
      avgTime = Math.round(totalTime / successCount);
    }

    expect(rootRouterPushSpy).toBeCalledWith(
      '/complete',
      {
        avgTime,
        totalScore,
        totalTime,
        successCount,
      },
    );
  });
});