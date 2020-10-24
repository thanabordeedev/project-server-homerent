<template>
<div>
<main-header navsel="back"></main-header>
  <div class="container">
    <h1>Create User</h1>
    <form v-on:submit.prevent="createUser">

      <div class="form-group row justify-content-center">
        <label for="inputName" class="col-sm-2 col-form-label"><strong> Name: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputName" v-model="user.name">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputLastname" class="col-sm-2 col-form-label"><strong> Lastname: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputLastname" v-model="user.lastname">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputEmail" class="col-sm-2 col-form-label"><strong> Email: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputEmail" v-model="user.email">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputPassword" class="col-sm-2 col-form-label"><strong> Password: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="password" class="form-control" id="inputPassword" v-model="user.password">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputType" class="col-sm-2 col-form-label"><strong> Type: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <select class="custom-select" v-model="user.type">
            <option value="user" selected>User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputButton" class="col-sm-2 col-form-label"></label>
        <div class="col-lg-6 col-sm-10">
          <button type="submit" class="btn btn-success"><i class="fa fa-check"></i> Create User</button>
          <button class="btn btn-light" v-on:click="navigateTo('/users')">Back</button>
        </div>
      </div>

    </form>
  </div>
  </div>
</template>
<script>
import UsersService from "@/services/UsersService";
export default {
  data() {
    return {
      user: {
        name: "",
        lastname: "",
        email: "",
        password: "",
        status: "active",
      },
    };
  },
  methods: {
    async createUser() {
      try {
        await UsersService.post(this.user);
        this.$router.push({
          name: "users",
        });
      } catch (err) {
        console.log(err);
      }
    },

    navigateTo (route) {
            this.$router.push(route)
    }
  },
};
</script>
<style scoped>
.container {
  margin-top:60px;
}

h1 {
  text-align: center;
}

form{
  margin-top:20px;
}
</style>