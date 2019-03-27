const PopperJs = jest.requireActual("popper.js");

module.exports = class Popper {
  constructor() {
    this.placements = PopperJs.placements;

    return {
      destroy: () => {},
      scheduleUpdate: () => {}
    };
  }
};
