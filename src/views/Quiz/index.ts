import './style.scss';
const template = require('./quiz.html');

import Component from '@/views/base';
import xhr, { IXHRError, IXHROption } from '@/API';
import { wordsUrl, IWords } from '@/API/interface/words';

export default class QuizView extends Component {
  // data -----------
  public apiFinished: boolean = false;

  public words: IWords[] = [];
  public totalScore: number = 0;
  public quizStatus: number = 0;

  public inputEl: HTMLInputElement | undefined = undefined;

  public currentWordIndex: number = 0;
  public currentWord: IWords | undefined = undefined;
  public currentLimitSecond: number = 0;
  public wordTimer: NodeJS.Timeout | undefined = undefined;

  public totalTime: number = 0;

  // data -----------

  // methods --------------
  public getInitialLimitSecond() {
    if (this.currentWord) {
      this.currentLimitSecond = this.currentWord.second;
    }
    return 0;
  }

  public onClickStartBtn() {
    if (this.quizStatus === 0) {
      // 최초 시작
      this.startQuiz();
    } else if (this.quizStatus === 1) {
      // 초기화
      this.resetQuiz();
    }
  }

  public resetQuiz() {
    this.apiFinished = false;
    this.quizStatus = 0;
    this.words = [];
    this.totalScore = 0;
    this.currentWordIndex = 0;
    this.currentWord = undefined;
    this.currentLimitSecond = 0;

    this.totalTime = 0;

    // clear timer
    this.clearTimer();

    // reset input el
    if (this.inputEl) {
      this.inputEl.value = '';
    }
    // reset api
    this.getWords();
    this.updateComponent();
  }

  public startQuiz() {
    if (!this.apiFinished) {
      alert('api 완료 대기 중');
      return;
    }
    this.quizStatus = 1;
    this.setQuizWord();
    this.updateComponent();
    if (this.inputEl) {
      this.inputEl.focus();
    }
  }

  public nextWord() {
    if (this.currentWordIndex < this.words.length) {
      this.currentWordIndex++;
    }
    
    if (this.currentWordIndex === this.words.length) {
      this.clearTimer();
      // 문제 해결 시간 / 맞춘 단어 수 => complete view 로 route params 넘기기
      const { totalScore, totalTime } = this;
      let avgTime = 0
      if (totalScore > 0) {
        avgTime = Math.round(totalTime / totalScore);
      }
      this.$root.$router.push(
        '/complete',
        {
          avgTime,
          totalScore,
          totalTime,
        },
      );
      return;
    }

    if (this.inputEl) {
      this.inputEl.value = '';
    }
    this.setQuizWord();
  }

  public setQuizWord() {
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

  public clearTimer() {
    if (this.wordTimer) {
      clearInterval(this.wordTimer);
    }
  }

  public onInputKeyup(e: KeyboardEvent) {
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

        this.nextWord();
      } else {
        input.value = '';
      }
    }
  }
  // methods --------------

  // api
  public getWords() {
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
          this.apiFinished = true;
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
    super.mounted();

    // set input element
    this.inputEl = this.$componentEl.querySelector('#word_input');

    // get words on create
    this.getWords()
      .then(() => {
        this.updateComponent();
      });

    // set on input
    if (this.inputEl) {
      this.inputEl.addEventListener('keyup', (this.onInputKeyup).bind(this));
    }
  }
}
