import '@/assets/main.scss';

import Router, { IRouteItem, IRouteParams } from '@/router';
import Component, { ComponentConstructor, IComponent } from './views/base';
// import Store from '@/store';

const rootEl = document.querySelector('#root-app') as HTMLElement;


export interface IRootApp extends IComponent {
  renderComponent: (
    componentConstructor: ComponentConstructor,
    params?: IRouteParams,
  ) => void;
  $router?: Router;
}

class RootApp extends Component implements IRootApp {

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
    this.$componentEl.replaceChild(newNode, rootEl.querySelector('.view-container'));

    // call mounted
    this.$child.mounted();
  }

  public $componentEl = rootEl;
  public $router = new Router;
  public $child = undefined;
}

window.rootApp = new RootApp();
window.rootApp.$router.initRouter();
