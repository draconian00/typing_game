import RootApp from '@/main';
import Router from '@/router';
import Component from '@/views/base';

jest.useFakeTimers();

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
    expect(instance.$child).toBeInstanceOf(Component);
  });
});