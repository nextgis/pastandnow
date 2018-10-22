import { EventEmitter } from 'events';

export interface PanelOptions {
  headerText?: string;
  addClass?: string;
  position: string;
}

export class PanelControl {

  element;

  options: PanelOptions;

  emitter = new EventEmitter();

  _header: HTMLElement;
  _blocked: boolean = false;
  private _container: HTMLElement;
  private _body: HTMLElement;


  constructor(options?: PanelOptions) {
    this.options = Object.assign({}, this.options, options);
    this._header = null;
    this._body = null;
    this._container = this._createContainer();
  }

  onAdd() {
    return this.element;
  }

  setElement(el) {
    this.element = el;
  }

  // onAdd() {
  //   return this._container;
  // }

  onRemove() {
    this.removeFrom();
  }

  addTo(map) {
    // this.remove();
    // this._map = map;

    const container = this._container = this.onAdd();
    const pos = this.options.position;
    const corner = map._controlCorners[pos];

    container.classList.add('leaflet-control');

    if (pos.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }

    return this;
  }

  removeFrom() {
    // const parentNode = this._container && this._container.parentNode;
    // if (parentNode) {
    //   parentNode.removeChild(this._container);
    // }
  }

  updateBody(content: string | HTMLElement) {
    this._cleanBody();
    if (typeof content === 'string') {
      this._body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this._body.appendChild(content);
    }
  }

  hide() {
    this._container.classList.add('panel-hide');
    this.emitter.emit('toggle', false);
  }

  show() {
    if (!this._blocked) {
      this._container.classList.remove('panel-hide');
      this.emitter.emit('toggle', true);
    }
  }

  private _cleanBody() {
    if (this._body) {
      this._body.innerHTML = '';
    }
  }

  private _createContainer() {
    const element = document.createElement('div');
    // element.className = 'leaflet-bar leaflet-control';
    if (this.options.addClass) {
      this.options.addClass.split('-').forEach((x) => element.classList.add(x));
    }
    if (this.options.headerText) {
      element.appendChild(this._createHeader());
    }
    element.appendChild(this._createBody());
    return element;
  }

  private _createHeader() {
    const element = document.createElement('div');
    element.className = 'panel-header';

    element.innerHTML = this.options.headerText;

    this._header = element;
    return element;
  }

  private _createBody() {
    const element = document.createElement('div');
    element.className = 'panel-body';

    this._body = element;
    return element;
  }
}
