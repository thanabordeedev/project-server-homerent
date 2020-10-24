<template>
  <div>
    <main-header navsel="front"></main-header>
    <div v-if="booking">
    <div class="container">
      <h1>{{ booking.title }}</h1>
      <p>booking price: {{ booking.bookingprice }}</p>
      <p>deposit price: {{ booking.depositprice }}</p>
      <p>category: {{ booking.category }}</p>
      <div v-html="booking.content"></div>
      <p>
        <p ><button class="btn btn-success" v-on:click="navigateTo('/front')">
          <i class="fa fa-arrow-left"></i> กลับ
        </button>
      </p>

      <comment-comp v-bind:bookingid="booking.id" v-bind:user="user" ></comment-comp>

     
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import BookingsService from "@/services/BookingsService";
import UsersService from '@/services/UsersService'
import CommentComp from '@/components/Fronts/Comment'

export default {
  data() {
    return {
      booking: null,
      users: null,
    }
  },

  components : {
    CommentComp
  },

   async created() {
    try {
      let bookingId = this.$route.params.bookingId;
      this.booking = (await BookingsService.show(bookingId)).data;
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },

  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },


}
</script>
<style scoped>
.container {
  margin-top: 60px;
}

</style>