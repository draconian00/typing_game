import './style.scss';
const template = require('./complete.html');

import Component from '@/views/base';
import { IRouteParams } from '@/router';

export default class CompleteView extends Component {
  public avgTime: number = 0;
  public totalScore: number = 0;
  public totalTime: number = 0;
  public successCount: number = 0;

  public restartQuiz() {
    this.$root.$router.back();
  }

  // -------------------
  constructor(params?: IRouteParams) {
    super();
    // set template
    this.$componentEl = document.createElement('div');
    this.$componentEl.id = 'complete_root';
    this.$componentEl.innerHTML = template;

    if (params) {
      const { avgTime, totalScore, totalTime, successCount } = params;

      if (avgTime && typeof avgTime === 'number') {
        this.avgTime = avgTime;
      }
      if (totalScore && typeof totalScore === 'number') {
        this.totalScore = totalScore;
      }
      if (totalTime && typeof totalTime === 'number') {
        this.totalTime = totalTime;
      }
      if (successCount && typeof successCount === 'number') {
        this.successCount = successCount;
      }
    }
    
  }

  public mounted() {
    window.vm = this;
    this.updateComponent();
  }
}
