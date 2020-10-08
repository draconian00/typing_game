import Component from './views/base';

declare global {
  interface Window {
    rootApp: Component;
    vm: Component;
  }
}

declare module '*.html' {
  const value: string;
  export default value;
}

declare module JSX {
  type Element = string;
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
