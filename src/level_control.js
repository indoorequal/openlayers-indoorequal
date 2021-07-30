import { Control } from 'ol/control';

export default class LevelControl extends Control {
  constructor(indoorEqual, options = {}) {
    const element = document.createElement('div');
    element.className = 'level-control ol-unselectable ol-control';
    super({
      element,
      target: options.target,
    });

    this.indoorEqual = indoorEqual;
    this._renderNewLevels();
    this.indoorEqual.on('change:levels', this._renderNewLevels.bind(this));
    this.indoorEqual.on('change:level', this._renderNewLevels.bind(this));
  }

  _renderNewLevels() {
    this.element.innerHTML = '';
    const currentLevel = this.indoorEqual.get('level');
    this.indoorEqual.get('levels').forEach((level) => {
      const button = document.createElement('button');
      if (currentLevel === level) {
        button.classList.add('level-control-active');
      }
      button.textContent = level;
      button.addEventListener('click', () => {
        this.indoorEqual.set('level', level);
      })
      this.element.appendChild(button);
    });
  }
}
