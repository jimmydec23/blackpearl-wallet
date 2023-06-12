import Vue from "vue";
const eventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $eventBus: {
    get: function() {
      return eventBus;
    }
  }
});
