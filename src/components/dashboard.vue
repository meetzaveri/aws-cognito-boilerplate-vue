<template>
  <div>
    <h1> Welcome to dashboard</h1>
    <router-link to="/">Back to home page</router-link>
  </div>
</template>

<script>
import { createUser } from "../../cognito-services/index";
export default {
  data() {
    return {
      email: "kevin@mailinator.com",
      password: "Buzzing#1",
      role: "superAdmin"
    };
  },
  methods: {}
};
</script>

<style>
</style>
