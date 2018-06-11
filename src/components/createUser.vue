<template>
  <div class="app flex-row align-items-center" style="margin-top:-55px;">
    <p v-if="$route.query.redirect">
      You need to login first.
    </p>
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>Create a new user</h1>
                <p class="text-muted">Enter all details</p>
                <form @submit.prevent="validateBeforeSubmit">

                  <b-input-group class="mb-4">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="icon-envelope"></i></span></div>
                    <input type="text" name="email" v-validate= "'required|email'" v-model="email" class="form-control" placeholder="Email">
                  </b-input-group>
                  <b-btn v-b-tooltip.hovershow variant="danger" v-show="errors.has('email')">{{ errors.first('email') }}</b-btn>
                  
                  <b-input-group class="mb-4">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="icon-lock"></i></span></div>
                    <input type="password" name="password" v-validate= "'required'" v-model="password" class="form-control" placeholder="Password" >
                  </b-input-group>
                  <b-btn v-b-tooltip.hovershow variant="danger" v-show="errors.has('password')">{{ errors.first('password') }}</b-btn>

                  <b-input-group class="mb-4">
                    <b-form-group label="User role">
                      <b-form-radio-group v-model="selectedRole"
                        :options="options"
                        plain
                        name="role" />
                    </b-form-group>
                  </b-input-group>

                  <b-row>
                    <b-col class="mb-4" cols="4"><b-button variant="primary" class="px-4" type="submit">Create</b-button></b-col>
                    
                  </b-row>

                </form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { createUser } from "../../cognito-services/index";

export default {
  name: "Login",
  beforeCreate() {
    localStorage.removeItem("token");
  },
  data() {
    return {
      password: "",
      email: "",
      selectedRole: "superAdmin",
      options: [
        { text: "Super Admin", value: "superAdmin" },
        { text: "Normal User", value: "user" }
      ]
    };
  },
  methods: {
    validateBeforeSubmit() {
      var userData = {
        password: this.password,
        role: this.selectedRole,
        email: this.email
      };
      console.log("UserData:", userData);

      // Login API to verify user's email and password and perform actual login action
      this.$validator.validateAll().then(result => {
        if (result) {
          createUser(userData.email, userData.password, userData.role)
            .then(data => {
              console.log("Data", data);
              this.$toasted.show("User successfully created!");
            })
            .catch(err => {
              console.log("Err in creating user", err);
            });
        } else {
          this.$toasted.show("Enter all fields correctly");
        }
      });
    }
  }
};
</script>

<style scoped>
.mb-4 {
  margin-top: 1.5rem !important;
  margin-bottom: 0 !important;
}
</style>
