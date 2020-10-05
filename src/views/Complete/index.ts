import Component from '@/views/base';

export default class CompleteView extends Component {

  public render(): HTMLElement {
    return this.componentEl;
  }

  constructor() {
    super();
    this.componentEl = document.createElement('div');
  }
}
