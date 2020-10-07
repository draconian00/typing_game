import './style.scss';
const template = require('./complete.html');

import Component from '@/views/base';
import { IRouteParams } from '@/router';

export default class CompleteView extends Component {

  // -------------------
  constructor(params?: IRouteParams) {
    super();
    // set template
    this.$componentEl = document.createElement('div');
    this.$componentEl.id = 'complete_root';
    this.$componentEl.innerHTML = template;
    console.log(params);
  }

  public mounted() {
    window.vm = this;
    this.updateComponent();
  }
}
