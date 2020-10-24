<template>
<div>
<main-header navsel="back"></main-header>
 <div class="container">
    <h1>{{ booking.title}}</h1>
    <p>booking price: {{ booking.bookingprice}}</p>
    <p>deposit price: {{ booking.depositprice}}</p>
    <p>category: {{ booking.category}}</p>
    <p>status: {{ booking.status}}</p>
    <div v-html="booking.content"></div>
    <p>
        <button class="btn btn-success" v-on:click="navigateTo('/bookings')"><i class="fa fa-arrow-left"></i> กลับ</button>
    </p>
 </div>
 </div>
</template>
<script>
import BookingsService from "@/services/BookingsService"

export default {
    data () {
        return {
            booking: []
        }
    },
    async created () {
        try {
            let bookingId = this.$route.params.bookingId
            this.booking = (await BookingsService.show(bookingId)).data
        } catch (error) {
            console.log(error)
        }
    },
    methods : {
        navigateTo (route) {
            this.$router.push(route)
        }
    }
 }
</script>
<style scoped>
.container {
  margin-top:60px;
}
</style>