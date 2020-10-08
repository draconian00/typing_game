import { ComponentConstructor } from '@/views/base';
import QuizView from '@/views/Quiz';
import CompleteView from '@/views/Complete';
import RootApp from '@/main';

export interface IRouteItem {
  path: string;
  constructor: ComponentConstructor;
  params?: IRouteParams;
}

export interface IRouteParams {
  [key: string]: any;
}

export interface IRouteError {
  message: string;
}

export const routes: IRouteItem[] = [
  {
    path: '/',
    constructor: QuizView,
  },
  {
    path: '/complete',
    constructor: CompleteView,
  },
];

export default class Router {
  public routeList: IRouteItem[] = routes;
  private rootApp!: RootApp;

  private findTarget(path: string): IRouteItem | undefined {
    return this.routeList.find((item) => {
      return item.path === path;
    });
  }

  public push(
    path: string,
    params?: IRouteParams,
  ): Promise<IRouteItem | IRouteError> {
    return new Promise((resolve, reject) => {
      const target = this.findTarget(path);
      
      // check route path
      if (!target) {
        const errObj: IRouteError = {
          message: `can't find route : path - ${path}`,
        };
        reject(errObj);
        return;
      }

      const curHash: string = window.location.hash.replace('#', '');

      // check duplicate path
      if (curHash === path) {
        const errObj: IRouteError = {
          message: `duplicate route : curHash - ${curHash} | path - ${path}`,
        };
        reject(errObj);
        return;
      }

      // change hash
      window.history.pushState({ path, params }, path, `#${path}`);
      // route
      this.renderComponent(target.constructor, params);
      resolve(target);
    });
  }

  public back(): void {
    window.history.back();
  }

  private onPopStateEvent(event: PopStateEvent) {
    const state = event.state;
    const path = state.path;
    const params = state.params;
    const target = this.findTarget(path);
    this.renderComponent(target.constructor, params);
  }

  public initRouter(rootApp: RootApp): void {
    this.rootApp = rootApp;
    let preHash: string = window.location.hash.replace('#', '');
    if (!preHash) {
      preHash = '/';
    }

    const target = this.findTarget(preHash);

    if (!target) {
      throw new Error(`can't find route : path - ${preHash}`);
      return;
    }

    // on history back
    window.onpopstate = (this.onPopStateEvent).bind(this);

    window.history.replaceState({ path: preHash }, preHash, `#${preHash}`);
    this.renderComponent(target.constructor);
  }

  private renderComponent(targetComponent: ComponentConstructor, params?: IRouteParams) {
    // create component
    const component = new targetComponent(params);
    this.rootApp.$child = component;
    this.rootApp.$child.$root = this.rootApp;
    this.rootApp.$child.$parent = this.rootApp;

    const newNode = document.createElement('div');
    newNode.classList.add('view-container');
    newNode.append(component.render());

    if (this.rootApp.$componentEl) {
      this.rootApp.$componentEl.replaceChild(newNode, this.rootApp.$componentEl.querySelector('.view-container'));
  
      this.rootApp.$child.mounted();
    }
  }
}
