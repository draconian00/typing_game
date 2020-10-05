import { IRootApp } from "./main";

declare global {
  interface Window {
    rootApp: IRootApp;
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
