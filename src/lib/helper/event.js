export class EventEmitter {
  events = {};

  /**
   * @param {string} name
   * @param {function} callback
   */
  on = function (name, callback) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  };

  /**
   * @param {string} name
   * @param {any} data
   */
  emit = function (name, data) {
    if (this.events[name]) {
      this.events[name].forEach(
        /**
         * @param {function} callback
         */
        (callback) => {
          callback(data);
        }
      );
    }
  };
}
