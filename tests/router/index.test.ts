import Router, { IRouteError, IRouteItem } from '@/router';
import RootApp from '@/main';
import CompleteView from '@/views/Complete';
import QuizView from '@/views/Quiz';

describe('router test suite', () => {
  let router: Router;
  let rootApp: RootApp;
  const rootEl = document.getElementById('root-app');

  beforeEach(() => {
    rootApp = new RootApp(rootEl);
    router = rootApp.$router;
  });

  it('router init test', () => {
    const locationHash = window.location.hash;
    expect(locationHash).toBe('#/');
    expect(rootApp.$child).toBeInstanceOf(QuizView);
  });

  it('push error test - 404', () => {
    return router.push('/test')
      .catch((err: IRouteError) => {
        expect(err).toBeInstanceOf(Object);
        expect(err.message).toBe(`can't find route : path - /test`);
      });
  });

  it('push error test - duplicate path', () => {
    return router.push('/')
      .catch((err: IRouteError) => {
        expect(err).toBeInstanceOf(Object);
        expect(err.message).toBe(`duplicate route : curHash - / | path - /`);
      });
  });

  it('push success test', () => {
    const completePath = '/complete';

    return router.push(completePath)
      .then((res: IRouteItem) => {
        const locationHash = window.location.hash;
        expect(locationHash).toBe(`#${completePath}`);
        expect(rootApp.$child).toBeInstanceOf(CompleteView);
      });
  });
});