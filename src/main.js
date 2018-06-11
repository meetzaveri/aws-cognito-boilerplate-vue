// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import routes from './router';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'simple-line-icons/css/simple-line-icons.css'
import {store} from './store/store'
import Toasted from 'vue-toasted';
import VeeValidate from 'vee-validate';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.config.productionTip = false;

Vue.use(Toasted, {
  position: 'bottom-center',
  duration: 1500
});

export const router = new VueRouter({routes, mode: 'history'});

const checkUserIsLoggedIn = () => {
  var email = localStorage.getItem('email');
  if (email !== null) {
    return true;
  } else {
    return false;
  }
}

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    if (checkUserIsLoggedIn()) {
      next();
    } else {
      router.push('/login');
    }
  } else if (to.path === '/createuser') {
    if (checkUserIsLoggedIn()) {
      next();
    } else {
      router.push('/login');
    }
  } else if (to.path === '/dashboard') {
    if (checkUserIsLoggedIn()) {
      next();
    } else {
      router.push('/login');
    }
  } else {
    next();
  }
})

/* eslint-disable no-new */
new Vue({el: '#app', router, store, components: {
    App
  }, template: '<App/>'});
