export default class Component {
  protected componentEl!: HTMLElement;
  public render(): HTMLElement {
    return this.componentEl;
  }
}

export type ComponentConstructor = new () => Component;
