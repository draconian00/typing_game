import './assets/main.scss';

import Router from '@/router';
import Component from './views/base';

export default class RootApp extends Component {
  public $componentEl!: HTMLElement;
  public $router!: Router;
  public $child!: Component | undefined;

  constructor(rootHtml: HTMLElement) {
    super();
    this.$componentEl = rootHtml;
    this.$child = undefined;
    this.$router = new Router();

    this.$router.initRouter(this);
  }
}

const rootEl = document.querySelector('#root-app') as HTMLElement;
window.rootApp = new RootApp(rootEl);
