<template>
  <!--page305-->
  <div>
    <nav
      class="navbar sticky-top navbar-inverse navbar-expand-lg navbar-dark bg-dark"
    >
      <a
        class="navbar-brand"
        href="#"
        v-on:click.prevent="navigateTo('/dashboard')"
        ><img src="../assets/logo.png"
      /></a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link"><router-link :to="{ name: 'front' }"><i class="fa fa-home"></i> Home</router-link></a></li>
          <li v-if="isUserLoggedIn" class="nav-item"><a class="nav-link"><router-link :to="{ name: 'front-rents' }"><i class="fa fa-building-o"></i> Rent</router-link></a></li>
          <li v-if="!isUserLoggedIn" class="nav-item"><a class="nav-link" v-on:click.prevent="showLogin = true">Login</a></li>
          <li v-if="!isUserLoggedIn" class="nav-item"><a class="nav-link" v-on:click.prevent="showRegister = true">Register</a></li>
          <li v-if="isUserLoggedIn" class="nav-item"><a class="nav-link" v-on:click.prevent="logout">Logout</a></li>

        </ul>
      </div>
    </nav>

    <div class="modal" v-if="showLogin">
      <transition name="fade">
        <div class="login-wrapper">
          <h3>Client Login</h3>
          <form v-on:submit.prevent="clientLogin" class="formhorizontal">
            
            <div class="form-group row">
              <label for="inputEmail" class="col-md-3 col-form-label"><strong> Email:</strong></label>
              <div class="col-md-9">
                <input required type="email" class="form-control" id="inputEmail" v-model="email"  placeholder="email">
              </div>
            </div>

            <div class="form-group row">
              <label for="inputPassword" class="col-md-3 col-form-label"><strong>Password:</strong></label>
              <div class="col-md-9">
                <input required type="password" class="form-control" id="inputPassword" v-model="password"  placeholder="password">
              </div>
            </div>

             <div class="form-group row">
              <div class="col-md-offset-3 col-md-9">
                <button class="btn btn-success btn-sm" type="submit"><i class="fa fa-key"></i> Login</button>
                <button v-on:click.prevent="showLogin = false" class="btn btn-danger btn-sm" type="button"><i class="fas fa-timescircle"></i> Close</button>
              </div>
            </div>
            
            <div class="error">
              <p v-if="error">{{ error }}</p>
            </div>
          </form>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>

    <div class="modal" v-if="showRegister">
      <transition name="fade">
        <div class="login-wrapper">
          <h3>Client Register</h3>
          <form v-on:submit.prevent="clientRegister" class="formhorizontal">

            <div class="form-group row">
              <label for="inputEmail" class="col-md-3 col-form-label"><strong> Email:</strong></label>
              <div class="col-md-9">
                <input required type="email" class="form-control" id="inputEmail" v-model="client.email"  placeholder="email">
              </div>
            </div>

            <div class="form-group row">
              <label for="inputPassword" class="col-md-3 col-form-label"><strong>Password:</strong></label>
              <div class="col-md-9">
                <input required type="password" class="form-control" id="inputPassword" v-model="client.password"  placeholder="password">
              </div>
            </div>

            <div class="form-group row">
              <label for="inputName" class="col-md-3 col-form-label"><strong>Name:</strong></label>
              <div class="col-md-9">
                <input required type="text" class="form-control" id="inputName" v-model="client.name"  placeholder="name">
              </div>
            </div>

            <div class="form-group row">
              <label for="inputLastname" class="col-md-3 col-form-label"><strong>Lastname:</strong></label>
              <div class="col-md-9">
                <input required type="text" class="form-control" id="inputLastname" v-model="client.lastname"  placeholder="lastname">
              </div>
            </div>

            <div class="form-group row">
              <div class="col-md-offset-3 col-md-9">
                <button class="btn btn-success btn-sm" type="submit"><i class="fa fa-key"></i> Register</button>
                <button v-on:click.prevent="showRegister = false" class="btn btn-danger btn-sm" type="button"><i class="fa fa-times-circle"></i> Close</button>
              </div>
            </div>

            <div class="error">
              <p v-if="error">{{ error }}</p>
            </div>
          </form>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>

  </div>
</template>
<script>
import { mapState } from "vuex";
import AuthenService from "@/services/AuthenService";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      showLogin: false,
      showRegister: false,
      resultUpdated: "",
      client: {
        name: '',
        lastname: '',
        email: '',
        password: '',
        status: 'active',
        type: 'user'
      }
    };
  },

  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },

  methods: {
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      /*this.$router.push({
        name: "login",
      });*/
      this.resultUpdated = "Logout successful.";
      setTimeout(() => (this.resultUpdated = ""), 3000);
    },

   

    async clientLogin() {
      console.log(`acc: ${this.email} -${this.password}`);
      try {
        const response = await AuthenService.clientLogin({
          email: this.email,
          password: this.password,
        });

        this.error = "";

        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);

        (this.email = ""), (this.password = ""), (this.showLogin = false);
        this.resultUpdated = "Login successful.";
        setTimeout(() => (this.resultUpdated = ""), 3000);
      } catch (error) {
        console.log(error);
        this.error = error.response.data.error;
        this.email = "";
        this.password = "";
        setTimeout(() => (this.error = ""), 3000);
      }
    },
    async clientRegister () {
      console.log(this.client)
      try {
        await UsersService.post(this.client)
        this.client = {}
        this.showRegister = false
        this.resultUpdated = "Register successful, Please login first."
        setTimeout(() => this.resultUpdated = '', 5000)
      } catch (error) {
        console.log(error)
        this.client = {}
        this.error = error.response.data.error
        setTimeout(() => this.error = '', 5000)
      }
    },

  },

 

  
};
</script>
<style scoped>
.error {
  color: red;
  text-align: center;
}

.popup-msg {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #ddd;
  background: #fff;
  max-width: 400px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
}

.navbar-brand > img {
  width: 42px;
  padding: 3px 0;
  padding-right: 5px;
  margin-top: -5px;
}

.navbar-inverse {
  background-color: #51415f;
}
.navbar-inverse .navbar-nav > li > a {
  color: #dbdbf6;
}

.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 10; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.login-wrapper {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #ddd;
  width: 400px;
  padding: 10px 30px 20px 30px;
  background-color: #fefefe;
  margin: 10% auto; /* 15% from the top and centered */
  /* padding: 20px; */
}

.login-wrapper h3 {
  text-align: center;
  padding-bottom: 10px;
}

a.router-link-active {
  color: rgb(255, 255, 255) !important;
  text-decoration: none;
  font-weight: bold;
}

a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
}

a.dropdown-item {
  color: #212529;
}
</style>