import { LevelControl } from '../src';

describe('LevelControl', () => {
  it('create a container', () => {
    const indoorEqual = { on() {}, get: () => [] };
    const control = new LevelControl(indoorEqual);
    expect(control.element).not.toBe(null);
    expect(control.element.classList.contains('level-control')).toBe(true);
    expect(control.element.classList.contains('ol-unselectable')).toBe(true);
    expect(control.element.classList.contains('ol-control')).toBe(true);
  });

  it('render the levels as button', () => {
    const levels = ['1', '0'];
    const indoorEqual = { on() {}, get: () => levels };
    const control = new LevelControl(indoorEqual);
    expect(control.element.querySelectorAll('button').length).toEqual(2);
  });

  it('refresh the control when the levels change', () => {
    let levels = [];
    const events = {};
    const indoorEqual = {
      get: () => levels,
      on: (eventName, callback) => events[eventName] = callback,
    };
    const control = new LevelControl(indoorEqual);
    expect(control.element.querySelectorAll('button').length).toEqual(0);
    levels = ['2', '1', '0'];
    events['change:levels']();
    expect(control.element.querySelectorAll('button').length).toEqual(3);
  });
});
