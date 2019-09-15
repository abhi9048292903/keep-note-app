import Vue from 'vue'
import './assets/css/custom.css'
import App from './App.vue'
import router from './router'
import * as VeeValidate from 'vee-validate'

const v_config = {
  errorBagName: 'errors',
  classes: true,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
};
Vue.use(VeeValidate, v_config)
Vue.config.productionTip = false

Vue.directive('checkFormValidation', {
  update: function (el, binding) {
    let fields = binding.value
    let isValid = Object.keys(fields).every(field => {
      return fields[field] && fields[field].valid
    })
    el.disabled = !isValid
  },
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
