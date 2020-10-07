import './assets/main.scss';

import Router, { IRouteItem, IRouteParams } from '@/router';
import Component, { ComponentConstructor, IComponent } from './views/base';
// import Store from '@/store';

// const rootEl = document.querySelector('#root-app') as HTMLElement;


export interface IRootApp extends IComponent {
  renderComponent: (
    componentConstructor: ComponentConstructor,
    params?: IRouteParams,
  ) => void;
  $router?: Router;
}

export default class RootApp extends Component implements IRootApp {
  public $componentEl!: HTMLElement;
  public $router!: Router;
  public $child!: Component | undefined;

  constructor(rootHtml: HTMLElement, params?: IRouteParams) {
    super();
    this.$componentEl = rootHtml;
    this.$child = undefined;
    this.$router = new Router();

    setTimeout(() => {
      this.mounted();
    }, 0);
  }

  public renderComponent(
    componentConstructor: ComponentConstructor,
    params?: IRouteParams
  ) {
    // create component
    const component = new componentConstructor(params);
    this.$child = component;
    this.$child.$root = this;
    this.$child.$parent = this;

    const newNode = document.createElement('div');
    newNode.classList.add('view-container');
    newNode.append(component.render());

    // render html
    this.$componentEl.replaceChild(newNode, this.$componentEl.querySelector('.view-container'));

    // call mounted
    this.$child.mounted();
  }

  public mounted() {
    super.mounted();
    this.$router.initRouter(this);
  }
}

const rootEl = document.querySelector('#root-app') as HTMLElement;
window.rootApp = new RootApp(rootEl);
