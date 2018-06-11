import Login from '@/components/login.vue';
import SignUp from '@/components/signup';
import ForgotPassword from '@/components/forgotpassword';
import Welcomepage from '@/components/welcomepage';
import Dashboard from '@/components/dashboard';
import CreateUser from '@/components/createUser'

var routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/signup',
    component: SignUp,
  },
  {
    path: '/forgotpassword',
    component: ForgotPassword,
  },
  {
    path: '/',
    component: Welcomepage,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/createuser',
    component : CreateUser
  }
];

export default routes;
