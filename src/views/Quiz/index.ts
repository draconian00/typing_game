import './style.scss';
const template = require('./quiz.html');

import Component from '@/views/base';
import xhr, { IXHRError, IXHROption } from '@/API';
import { wordsUrl, IWords } from '@/API/interface/words';
import { threadId } from 'worker_threads';

export default class QuizView extends Component {
  // data -----------
  public words: IWords[] = [];
  protected totalScore: number = 0;
  protected quizStatus: number = 0;

  protected inputEl: HTMLInputElement | undefined = undefined;

  protected currentWordIndex: number = 0;
  protected currentWord: IWords | undefined = undefined;
  protected currentLimitSecond: number = 0;
  protected wordTimer: NodeJS.Timeout | undefined = undefined;


  protected successCount: number = 0;
  protected totalTime: number = 0;

  // data -----------

  // methods --------------
  protected getInitialLimitSecond() {
    if (this.currentWord) {
      this.currentLimitSecond = this.currentWord.second;
    }
    return 0;
  }

  protected onClickStartBtn() {
    if (this.quizStatus === 0) {
      // 최초 시작
      this.quizStatus = 1;
      this.startQuiz();
    } else if (this.quizStatus === 1) {
      // 초기화
      this.resetQuiz();
    }
  }

  protected resetQuiz() {
    this.quizStatus = 0;
    this.words = [];
    this.totalScore = 0;
    this.currentWordIndex = 0;
    this.currentWord = undefined;
    this.currentLimitSecond = 0;

    this.totalTime = 0;
    this.successCount = 0;

    // clear timer
    this.clearTimer();

    // reset input el
    this.inputEl.value = '';
    // reset api
    this.getWords();
    this.updateComponent();
  }

  protected startQuiz() {
    this.setQuizWord();
    this.updateComponent();
    this.inputEl.focus();
  }

  protected nextWord() {
    if (this.currentWordIndex < this.words.length) {
      this.currentWordIndex++;
    }
    
    if (this.currentWordIndex === this.words.length) {
      this.clearTimer();
      // 문제 해결 시간 / 맞춘 단어 수 => complete view 로 route params 넘기기
      const { totalScore, totalTime, successCount } = this;
      let avgTime = 0
      if (successCount > 0) {
        avgTime = Math.round(totalTime / successCount);
      }
      this.$root.$router.push(
        '/complete',
        {
          avgTime,
          totalScore,
          totalTime,
          successCount,
        },
      );
      return;
    }

    this.inputEl.value = '';
    this.setQuizWord();
  }

  protected setQuizWord() {
    this.currentWord = this.words[this.currentWordIndex];
    this.currentLimitSecond = this.currentWord.second;
    this.updateComponent();

    // clear timer
    this.clearTimer();

    // start timer
    this.wordTimer = setInterval(() => {
      this.currentLimitSecond--;
      // this.updateComponent();
      this.setTemplateData('currentLimitSecond');
      if (this.currentLimitSecond === 0) {
        this.totalScore--;
        clearInterval(this.wordTimer);
        this.nextWord();
      }
    }, 1000);
  }

  protected clearTimer() {
    if (this.wordTimer) {
      clearInterval(this.wordTimer);
    }
  }

  protected onInputKeyup(e: KeyboardEvent) {
    // check enter
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const value = input.value

      // check word
      if (value === this.currentWord.text) {
        // timer 멈추기
        this.clearTimer();

        // 최초 제한 시간 - 남은 시간 => 총 시간에 더하기
        this.totalTime += (this.currentWord.second - this.currentLimitSecond);
        // 맞춘 단어 숫자++
        this.successCount++;

        this.nextWord();
      } else {
        input.value = '';
      }
    }
  }
  // methods --------------

  // api
  protected getWords() {
    return new Promise((resolve, reject) => {
      const url = wordsUrl;
      const option: IXHROption = {
        method: 'GET',
      };
  
      xhr(url, option)
        .then((res: IWords[]) => {
          this.words = res;
          // update total score
          this.totalScore = this.words.length;
          resolve();
        })
        .catch((xhrError: IXHRError) => {
          alert(`Networ Error\n\nstatus: ${xhrError.status}\n\nresponse: ${xhrError.response}`);
          reject();
        });
    });
  }

  // -----------------
  constructor() {
    super();
    // setting template
    this.$componentEl = document.createElement('div');
    this.$componentEl.id = 'quiz_root';
    this.$componentEl.innerHTML = template;
  }

  public mounted() {
    window.vm = this;
    this.updateComponent();

    // set input element
    this.inputEl = this.$componentEl.querySelector('#word_input');

    // get words on create
    this.getWords()
      .then(() => {
        this.updateComponent();
      });

    // set on input
    this.inputEl.addEventListener('keyup', (this.onInputKeyup).bind(this));
  }
}
