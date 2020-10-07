import RootApp from '@/main';
import Router from '@/router';
import CompleteView from '@/views/Complete';
import QuizView from '@/views/Quiz';

describe('RootApp Class', () => {
  let instance: RootApp;
  const rootEl = document.querySelector('#root-app') as HTMLElement;

  beforeEach(() => {
    instance = new RootApp(rootEl);
  });

  it('root app initializing', () => {
    // init property
    expect(instance.$componentEl).toBe(rootEl);
    expect(instance.$router).toBeDefined();
    expect(instance.$router).toBeInstanceOf(Router);
    expect(instance.$child).not.toBeDefined();

    // call mounted
    setTimeout(() => {
      const routerInitSpy = jest.spyOn(instance.$router, 'initRouter');
      expect(routerInitSpy).toHaveBeenCalledTimes(1);
      // check mounted called
      const mountedSpy = jest.spyOn(instance, 'mounted');
      expect(mountedSpy).toHaveBeenCalledTimes(1);
      // check reanderComponent called
      const renderComponentSpy = jest.spyOn(instance, 'renderComponent');
      expect(renderComponentSpy).toHaveBeenCalled();
      // check $child component
      expect(instance.$child).toBeDefined();
    }, 0);
  });
});