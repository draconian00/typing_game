import './style.scss';
const template = require('./quiz.html');

import Component from '@/views/base';
import xhr, { IXHRError, IXHROption } from '@/API';
import { wordsUrl, IWords } from '@/API/interface/words';

export default class QuizView extends Component {
  // data -----------
  public words: IWords[] = [];
  protected totalScore: number = 0;
  protected startQuiz: boolean = false;
  // data -----------

  // methods --------------
  public toggleStartQuiz() {
    this.startQuiz = !this.startQuiz;
    this.toggleVShow('startQuiz', this.startQuiz);
  }

  private toggleVShow(attrV: string, show: boolean) {
    const elements = this.componentEl.querySelectorAll(`[data-v-show=${attrV}]`);
    if (show) {
      elements.forEach((el) => {
        el.classList.add('show');
      });
    } else {
      elements.forEach((el) => {
        el.classList.remove('show');
      });
    }
  }
  // methods --------------

  // api
  protected getWords() {
    const url = wordsUrl;
    const option: IXHROption = {
      method: 'GET',
    };

    xhr(url, option)
      .then((res: IWords[]) => {
        this.words = res;
        // update total score
        this.totalScore = this.words.length;
      })
      .catch((xhrError: IXHRError) => {
        alert(`Networ Error\n\nstatus: ${xhrError.status}\n\nresponse: ${xhrError.response}`);
      });
  }

  // -----------------
  public render(): HTMLElement {
    return this.componentEl;
  }

  constructor() {
    super();
    // get words on create
    this.getWords();
    // setting template
    this.componentEl = document.createElement('div');
    this.componentEl.id = 'quiz_root';
    this.componentEl.innerHTML = template;
  }
}
