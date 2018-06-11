
<template>
  <div>

    <div v-if="sentVerificationCode">
      <form @submit.prevent="validateBeforeSubmit">
                  
        <b-input-group class="mb-4">
          <div class="input-group-prepend"><span class="input-group-text"><i class="icon-user"></i></span></div>
          <input type="text" name="vcode" v-validate= "'required'" v-model="vcode" class="form-control" placeholder="Verification Code">
        </b-input-group>
        <b-btn v-b-tooltip.hovershow variant="danger" v-show="errors.has('vcode')">{{ errors.first('vcode') }}</b-btn>
        
        <b-input-group class="mb-4">
          <div class="input-group-prepend"><span class="input-group-text"><i class="icon-lock"></i></span></div>
          <input type="password" name="password" v-validate= "'required'" v-model="newPassword" class="form-control" placeholder="New password" >
        </b-input-group>
        <b-btn v-b-tooltip.hovershow variant="danger" v-show="errors.has('password')">{{ errors.first('password') }}</b-btn>
        
        <b-row>
          <b-col class="mb-4" cols="3"><b-button variant="primary" class="px-4" type="submit">Confirm</b-button></b-col>
        </b-row>

        </form>
    </div>

    <div v-else>
      <div class="loginBox">
        <h3>Reset Password</h3>
        <div class="form-group">
          <input type="email" class="form-control" id="exampleInputEmail" v-model="email" placeholder="email">
        </div>
        <button class="btn btn-primary" @click="resetPassword">Submit</button>
      </div>
    </div>
    
  </div>
</template>

<script>
/* eslint-disable */

// import {CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {
  forgotPassword,
  sendVerificationCode
} from "../../cognito-services/index.js";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      sentVerificationCode: false,
      newPassword: "",
      vcode: ""
    };
  },
  methods: {
    resetPassword() {
      let email = this.email;
      let resetAttempt = true;

      forgotPassword(email)
        .then(data => {
          console.log("Data", data);
          // this.sentVerificationCode = true
        })
        .catch(err => {
          console.log("Err:", err);
          // this.sentVerificationCode = true
        });
    },
    validateBeforeSubmit() {
      console.log("This Email", this.email);
      let email = this.email;
      let password = this.newPassword;
      let verificationCode = this.vcode;
      let resetAttempt = false;

      // Login API to verify user's email and password and perform actual login action
      this.$validator.validateAll().then(result => {
        if (result) {
          // Login API to verify user's email and password and perform actual login action
          forgotPassword(email, password, verificationCode, resetAttempt)
            .then(data => {
              console.log("Data", data);
              this.$toasted.show("Message:" + data);
            })
            .catch(err => {
              console.log("Err:", err);
              this.$toasted.show("Err:" + err);
            });
        } else {
          this.$toasted.show("Enter all fields correctly");
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background-color: #3d3d3d;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 3px,
    rgba(76, 76, 76, 0.5) 3px,
    rgba(76, 76, 76, 0.5) 5px
  );
  color: #333333;
}

.loginBox {
  background: rgba(238, 238, 238, 0.75);
  width: 100%;
  max-width: 20em;
  padding: 1em;
  margin: 2em auto;
  border-radius: 0.4em;
  box-shadow: 1px 1px 4px 0px rgba(50, 50, 50, 0.5);
}

.loginBox h3 {
  margin-top: 0;
}

.ulinks {
  margin: 1em 0;
}
</style>
