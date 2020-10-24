<template>
  <div id="carlist">
    <main-header navsel="front"></main-header>
    <div class="user-info">
      <h1>แสดงข้อมูลผู้ใช้งาน</h1>
      
      <div class="form-wrapper" v-if="user != null">
        <div class="container">
            <div class="form-row justify-content-center">
                <div class="form-group col-md-6">
                    <label for="">Name:</label>
                    <input type="text" class="form-control" v-model="user.name" disabled>
                </div>
            </div>

            <div class="form-row justify-content-center">
                <div class="form-group col-md-6">
                    <label for="">Lastname:</label>
                    <input type="text" class="form-control" v-model="user.lastname" disabled>
                </div>
            </div>

            <div class="form-row justify-content-center">
                <div class="form-group col-md-6">
                    <label for="">Email:</label>
                    <input type="email" class="form-control" v-model="user.email" disabled>
                </div>
            </div>
        </div>
      </div>

    </div>
    <!-- cart info -->
    <div class="cart-info container">
      <div class="rows">
        <div class="col-md-12">
          <div class="transection-wrapper">
            <h4>รายระเอียดยึนยันการจ่ายค่ามัดจำ</h4>
            <ul class="trasection-list">
              <li v-for="transection in transections" v-bind:key="transection.id">
                <h4>{{ transection.renttitle }} จํานวน {{ transection.qty }} x{{ transection.prices }}</h4>
                <p><strong>ราคารวม :</strong>{{(transection.qty * transection.prices) | getNumberWithCommas}} บาท</p>
                <p><strong>สถานะลูกค้า :</strong> {{ transection.clientstatus }}</p>
                <p><button v-on:click.prevent="sendPaid(transection.id)" class="btn btnxs btn-success">ยืนยันการชําระเงิน</button></p>
                <p><strong>สถานะจากเจ้าของบ้าน :</strong> {{ transection.homeowner_status }}</p>
                <p><strong>วันที่ :</strong>{{ transection.createdAt | formatedDate }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import LeasesService from "@/services/LeasesService";
import moment from "moment";
export default {
  filters: {
    formatedDate(value) {
      return moment(String(value)).format("DD-MM-YYYY");
    },
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
  data() {
    return {
      transections: [],
    };
  },
  async created() {
    this.transections = (await LeasesService.user(this.user.id)).data;
    console.log(this.transections);
  },

  mounted() {
    if (!this.isUserLoggedIn) {
      
      alert("Please, Register or Login before.\n\nThank you.");
      this.$router.push({
        name: "front",
      });
    }
  },

  methods: {
    async sendPaid(id) {
      let transection = {
        id: id,
        clientstatus: "ชําระแล้ว",
      };
      try {
        await LeasesService.put(transection);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async refreshData() {
      this.transections = (await LeasesService.user(this.user.id)).data;
    },
  },
};
</script>
<style scoped>
.container{
    margin-top:30px;
}
.user-info h1 {
  text-align: center;
  margin-top:15px;
}
.trasection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.trasection-list li {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.cart-info {
  margin-top: 50px;
}
</style>