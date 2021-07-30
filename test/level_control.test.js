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
    const getters = {
      levels: ['1', '0'],
      level: '0'
    };
    const indoorEqual = { on() {}, get: (get) => getters[get] };
    const control = new LevelControl(indoorEqual);
    expect(control.element.querySelectorAll('button').length).toEqual(2);
    expect(control.element.querySelectorAll('button.level-control-active').length).toEqual(1);
    expect(control.element.querySelector('button.level-control-active').textContent).toEqual('0');
  });

  it('refresh the control when the levels change', () => {
    const getters = {
      levels: [],
      level: '0'
    };
    const events = {};
    const indoorEqual = {
      get: (get) => getters[get],
      on: (eventName, callback) => events[eventName] = callback,
    };
    const control = new LevelControl(indoorEqual);
    expect(control.element.querySelectorAll('button').length).toEqual(0);
    getters.levels = ['2', '1', '0'];
    events['change:levels']();
    expect(control.element.querySelectorAll('button').length).toEqual(3);
  });

  it('refresh the control when the level change', () => {
    const getters = {
      levels: ['1', '0'],
      level: '0'
    };
    const events = {};
    const indoorEqual = {
      get: (get) => getters[get],
      on: (eventName, callback) => events[eventName] = callback,
    };
    const control = new LevelControl(indoorEqual);
    getters.level = '1';
    events['change:level']();
    expect(control.element.querySelector('button.level-control-active').textContent).toEqual('1');
  });

  it('set the level when clicking on the button', () => {
    let setParams;
    const levels = ['1', '0'];
    const indoorEqual = { on() {}, get: () => levels, set: (...args) => setParams = args };
    const control = new LevelControl(indoorEqual);
    control.element.querySelector('button').click()
    expect(setParams).toEqual(['level', '1']);
  });
});
