<template>

<!--page305-->
<nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark ">
  <a class="navbar-brand" href="#" v-on:click.prevent="navigateTo('/dashboard')"><img src="../assets/logo.png"></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="nav-item"><a class="nav-link"><router-link :to="{name: 'bookings'}">Bookings</router-link></a></li>
      <li class="nav-item"><a class="nav-link"><router-link :to="{name: 'rents'}">Rent</router-link></a></li>
      <li class="nav-item"><a class="nav-link"><router-link :to="{name: 'comments'}">Comments</router-link></a></li>
      <li class="nav-item"><a class="nav-link"><router-link :to="{name: 'users'}">Users</router-link></a></li>
      <li class="nav-item"><a class="nav-link"><router-link :to="{name: 'Cartlist'}">RentList</router-link></a></li>
      
      <li v-if="!isUserLoggedIn" class="nav-item"><a class="nav-link"><router-link :to="{name: 'login'}">Login</router-link></a></li>
      <li v-if="isUserLoggedIn" class="nav-item"><a class="nav-link" v-on:click="logout">Logout</a></li>
      <li v-if="isUserLoggedIn" class="nav-item"><a class="nav-link" >{{user.name}}</a></li>
      
    </ul>
  </div>
</nav>

</template>
<script>
import {mapState} from 'vuex'

export default {
  methods: {
      logout () {
        this.$store.dispatch('setToken', null)
        this.$router.push({
          name: 'login'
        })
      }
     
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ]),
  },

}
</script>
<style scoped>
.navbar-brand > img {
 width: 42px;
 padding: 3px 0;
 padding-right: 5px;
 margin-top: -5px;
}

a{
   text-decoration: none;
   color:rgba(255, 255, 255, 0.5);
 }

 a.dropdown-item{
   color:#212529;
 }

 

a.router-link-active{
 color:rgb(255, 255, 255) !important;
 text-decoration: none;
 font-weight: bold;
}


</style>