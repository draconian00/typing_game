import Router, { IRouteParams } from '@/router';

export interface IComponent {
  $componentEl: HTMLElement;
  $router?: Router;
  $root?: Component;
  $parent?: Component;
  $child?: Component;
}

export default class Component implements IComponent {
  // component root el
  public $componentEl!: HTMLElement;
  public $root!: Component;
  public $router!: Router;
  public $parent!: Component;
  public $child!: Component;

  // set template data
  protected setTemplateData(targetDataKey?: string) {
    const elements = this.$componentEl.querySelectorAll(`[data-map]`);
    elements.forEach((el) => {
      const dataKey = el.getAttribute('data-map');
      if (targetDataKey) {
        if (dataKey === targetDataKey) {
          this.setDataMap(el, dataKey);
        }
      } else {
        this.setDataMap(el, dataKey);
      }
    });
  }

  protected setDataMap(el: Element, key: string) {
    const keyArr = key.split('.');
    let data: any;
    keyArr.forEach((key, index) => {
      if (index === 0) {
        data = this.getData(this, key);
      } else {
        data = this.getData(data, key);
      }
    });
    el.innerHTML = data;
  }
  private getData(target: any, key: string) {
    if (target) {
      return target[key];
    }
    return '';
  }

  // set v show
  protected checkVShow() {
    const elements = this.$componentEl.querySelectorAll(`[data-v-show]`);
    elements.forEach((el) => {
      const condition = el.getAttribute('data-v-show');
      if (eval(condition)) {
        el.classList.add('show');
      } else {
        el.classList.remove('show');
      }
    });
  }

  public updateComponent() {
    this.setTemplateData();
    this.checkVShow();
  }

  // rendering
  public render(): HTMLElement {
    return this.$componentEl;
  }

  // mounted
  public mounted(): void {
    window.vm = this;
    this.updateComponent();
  }
}

export type ComponentConstructor = new (params?: IRouteParams) => Component;
