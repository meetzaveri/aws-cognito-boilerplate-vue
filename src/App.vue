<template>
  <div id="app">
    <div v-if="!this.$store.state.userLoggedIn"><before-login-nav > </before-login-nav></div>
    <div v-else><after-login-nav ></after-login-nav></div>
    <div class="app-body">
      <b-container>
        <div class="" style="margin-top:4rem;">
          <router-view></router-view>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import afterLogin from "./components/Navbars/afterLoginNav.vue";
import beforeLogin from "./components/Navbars/beforeLoginNav.vue";
import { isUserLoggedIn } from "../cognito-services/index";

export default {
  name: "App",
  components: {
    "before-login-nav": beforeLogin,
    "after-login-nav": afterLogin
  },
  mounted() {
    var email = localStorage.getItem("email");
    if (isUserLoggedIn(email)) {
      console.log("User is logged in ");
      this.$store.commit("checkUserIsLoggedIn", { userLoggedIn: true });
    } else {
      console.log("User is not logged in");
      this.$store.commit("checkUserIsLoggedIn", { userLoggedIn: false });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
