import Vue from 'vue'

class EventBus {
  constructor () {
    this.vue = new Vue()
  }

  emit (event, data = null) {
    this.vue.$emit(event, data)
  }

  on (event, callback) {
    this.vue.$on(event, callback)
  }

  once (event, callback) {
    this.vue.$once(event, callback)
  }

  off (event, callback) {
    this.vue.$off(event, callback)
  }

  offEvent (event) {
    this.vue.$off(event)
  }

  offAll () {
    this.vue.$off()
  }
}

export const eventBus = new EventBus()
