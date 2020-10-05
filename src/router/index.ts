import { ComponentConstructor } from '@/views/base';
import QuizView from '@/views/Quiz';
import CompleteView from '@/views/Complete';

export interface IRouteItem {
  path: string;
  constructor: ComponentConstructor;
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
  public routeList = routes;

  private findTarget(path: string) {
    return this.routeList.find((item) => {
      return item.path === path;
    });
  }

  public push(path: string) {
    return new Promise((resolve, reject) => {
      const target = this.findTarget(path);
      
      // check route path
      if (!target) {
        const errObj = {
          message: `can't find route : path - ${path}`,
        };
        reject(errObj);
        return;
      }

      const curHash = window.location.hash.replace('#', '');

      // check duplicate path
      if (curHash === path) {
        const errObj = {
          message: `duplicate route : curHash - ${curHash} | path - ${path}`,
        };
        reject(errObj);
        return;
      }

      // change hash
      window.location.hash = path;
      resolve();
    });
  }

  public back() {
    window.history.back();
  }

  public initRouter() {
    let preHash = window.location.hash.replace('#', '');
    if (!preHash) {
      preHash = '/';
    }

    const target = this.findTarget(preHash);

    if (!target) {
      throw new Error(`can't find route : path - ${preHash}`);
      return;
    }

    window.addEventListener('popstate', () => {
      const path = window.location.hash.replace('#', '');
      const target = this.findTarget(path);
      window.rootApp.renderComponent(target.constructor);
    });

    window.location.hash = preHash;
    window.rootApp.renderComponent(target.constructor);
  }
}
