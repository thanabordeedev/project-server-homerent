<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Kanit', sans-serif;
  color: #2c2c2c;
}

body {
 margin:0;
 padding:0;
 
}

/* Fade transition */
.fade-enter, .fade-leave-to {
 opacity: 0;
}
.fade-enter-active, .fade-leave-active {
 transition: opacity 0.5s;
}
.fade-enter-to {
 opacity: 1;
}
</style>
