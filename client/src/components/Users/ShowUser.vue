<template>
<div>
  <main-header navsel="back"></main-header>
  <div class="container">
    <h1>แสดงข้อมูลผู้ใช้งาน</h1>

    <form>
      <div class="form-group row justify-content-center">
        <label for="inputStaicName" class="col-sm-2 col-form-label"><strong> Name: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputStaicName" v-model="user.name" readonly>
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputStaicLastname" class="col-sm-2 col-form-label"><strong> Lastname: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputStaicLastname" v-model="user.lastname" readonly>
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputStaicEmail" class="col-sm-2 col-form-label"><strong> Email: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputStaicEmail" v-model="user.email" readonly>
        </div>
      </div>

       <div class="form-group row justify-content-center">
          <button class="btn btn-success justify-content-center" v-on:click="navigateTo('/users')"><i class="fa fa-arrow-left"></i> Back..</button>
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
      user: []
    };
  },

  methods : {
        navigateTo (route) {
            this.$router.push(route)
        }
  },

  async created() {
    try{
         let userId = this.$route.params.userId
    this.user = (await UsersService.show(userId)).data
      } catch (error) {
         console.log (error)
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

form,button{
  margin-top:20px;
}
</style>