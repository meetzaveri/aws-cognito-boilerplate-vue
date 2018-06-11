
<template>
  <div>
    <h1> Welcome {{ this.$store.state.email }}</h1>
    <b-btn @click="getUser"> Get Current User</b-btn>
  </div>
</template>

<script>
/* eslint-disable */

// import {CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import { signOut, getCurrentUser } from "../../cognito-services/index";

export default {
  name: "Login",
  data() {
    return {
      email: this.$store.state.email
    };
  },
  mounted() {
    // this.email =  this.$store.state.email;
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
    },
    getUser() {
      var email = this.email;
      getCurrentUser(email).then(data => {
        console.log("USER DATA", data);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
