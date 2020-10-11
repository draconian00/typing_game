import './style.scss';
const template = require('./complete.html');

import Component from '@/views/base';
import { IRouteParams } from '@/router';

export default class CompleteView extends Component {
  public avgTime!: number;
  public totalScore: number = 0;
  public totalTime!: number;
  public successCount!: number;

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
      const { avgTime, totalScore, totalTime } = params;

      if (avgTime !== undefined && typeof avgTime === 'number') {
        this.avgTime = avgTime;
      }
      if (totalScore !== undefined && typeof totalScore === 'number') {
        this.totalScore = totalScore;
      }
      if (totalTime !== undefined && typeof totalTime === 'number') {
        this.totalTime = totalTime;
      }
    }
    
  }

  public mounted() {
    super.mounted();
  }
}
