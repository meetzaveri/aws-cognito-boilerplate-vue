<template>
  <div>
    <b-navbar toggleable type="light" variant="light">
        <b-navbar-brand><router-link to="/">Home </router-link></b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item class="px-3"><router-link to="/dashboard">Dashboard </router-link></b-nav-item>
          <b-nav-item class="px-3"><router-link to="/createuser">Create User </router-link></b-nav-item>
          <b-nav-item variant="danger" class="px-3" @click="signOut">Sign out</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
/* eslint-disable */

// import {CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import { signOut, getCurrentUser } from "../../../cognito-services/index";

export default {
  name: "Login",
  data() {
    return {
      email: this.$store.state.email
    };
  },
  mounted() {
    // this.email =  this.$store.state.email;
    // var email = localStorage.getItem('email');
    // if(email !== null){
    //   getCurrentUser(email).then((data) => {
    //     console.log('USER DATA',data);
    //   })
    //   .catch((err) => {
    //     console.log('User does not exist');
    //     this.$store.commit('checkUserIsLoggedIn',{userLoggedIn:false})
    //   })
    // }
  },
  methods: {
    signOut() {
      var email = this.email;
      signOut(email)
        .then(data => {
          console.log("Sign out successful");
          this.$store.commit("signOut");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log("Error occured while signing off");
        });
    }
  }
};
</script>

<style scoped>
</style>
