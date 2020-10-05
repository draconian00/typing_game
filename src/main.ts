import '@/assets/main.scss';

import Router from '@/router';
import Component, { ComponentConstructor } from './views/base';
// import Store from '@/store';

const rootEl = document.querySelector('#root-app') as HTMLElement;


export interface IRootApp {
  renderComponent: (componentConstructor: ComponentConstructor) => void;
  $rootEl: HTMLElement;
  $router: Router;
  $child?: Component;
}

class RootApp implements IRootApp {
  public renderComponent(componentConstructor: ComponentConstructor) {
    // create component
    const component = new componentConstructor();
    this.$child = component;

    const newNode = document.createElement('div');
    newNode.classList.add('view-container');
    newNode.append(component.render());

    this.$rootEl.replaceChild(newNode, rootEl.querySelector('.view-container'));
  }

  public $rootEl = rootEl;
  public $router = new Router;
  public $child = undefined;
}

window.rootApp = new RootApp();
window.rootApp.$router.initRouter();
