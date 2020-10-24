<template>
  <div>
    <main-header navsel="front"></main-header>
          
      <div class="top-img">
        <img src="@/assets/homebg.jpg">
        <h2>โครงการหาจัดหาบ้านเช่า</h2>
      </div>

    <div class="container">

  
    <div class="rent-header">
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input type="text" v-model="search" class="form-control" placeholder="Search">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-search"></i></span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="create-rent">
        <strong>รายการที่สามารถเช่าได้: </strong> {{ rents.length }}
      </div>

      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">Clear</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>

    <h2>บ้านเช่าที่คุณอาจจะสนใจ</h2>
    <div class="card-top">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="rent in rents" v-bind:key="rent.id">
          <div class="card">
              <div v-if="rent.thumbnail != 'null'">
                <img class="img-res" :src="BASE_URL+rent.thumbnail" alt="thumbnail">
              </div>
            <div class="title_card">
              <h4>{{ rent.title.slice(0,55) + '...' }}</h4>
            </div>
            <div class="info_card" v-html="rent.content.slice(0,200) + '...'"></div>
            <div class="btn_card">
              <button v-on:click.prevent="addInRent(rent)" class="btn btn-danger btn-sm"><i class="fa fa-shopping-cart"></i> จอง</button>
              <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front/rent/'+ rent.id)"><i class="fa fa-book"></i> อ่านเพิ่ม</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition-group name="fade">
      <div v-for="rent in rents" v-bind:key="rent.id" class="book-list">
        <div class="popup-cart" v-if="carts.length">
          <h3>ตระกร้าสินค้า</h3>
          <ul class="cart">
              <li v-for="cart in carts" v-bind:key="cart.id">
                <div>{{ cart.renttitle }} ราคาจอง {{ cart.prices }}</div>
                <div>
                    <button v-on:click.prevent="inc(cart)">+</button>
                    <button v-on:click.prevent="dec(cart)">-</button>
                </div>
              </li>
            </ul>
            <hr />
            <p>รวมทั้งสิ้น: {{total | getNumberWithCommas}} บาท</p>
            <button class="btn btn-xs btn-danger" v-on:click.prevent="sendBuy">
              <i class="fa fa-check-square"></i> ยึนยันการจอง
            </button>
          </div>
        </div>

    </transition-group>
    

    <div class="empty-rent" v-if="rents.length === 0 && loading === false"> *** ไม่มีข้อมูล*** </div>
    <div id="blog-list-bottom">
      <div class="blog-load-finished" v-if="rents.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
  </div>
</template>
<script>
import RentsService from "@/services/RentsService";
import LeasesService from "@/services/LeasesService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";
import { mapState } from "vuex";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "front-rents",
      }

      if (this.search !== "") {
        route.query = {
          search: this.search,
        }
      }

      console.log("search: " + this.search)
      this.$router.push(route)
    }, 700),

    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.rents = []
        this.results = []
        this.loading = true
        this.results = (await RentsService.frontIndex(value)).data;
        this.appendResults()

        this.results.forEach((rent) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(blog.category))
            if (this.category.indexOf(rent.category) === -1) {
              this.category.push(rent.category);
            }
          } else {
            this.category.push(rent.category);
          }
        });
        this.loading = false;
        this.search = value;
        // console.log(this.category)
      },
    },
  },

  data() {
    return {
      rents: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: '',
      results: [],
      category: [],
      loading: false,
      carts:[],
      total: 0,
    };
  },


  async created() {
   this.rents = (await RentsService.index()).data;
  },

  filters: {
    getNumberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },


  methods: {

    async addInRent(rent){
      if(this.user == null){
        alert('Please, Register or Login before.\n\nThank you.')
      }else{
        this.total += parseInt(rent.depositprice)

        let found = false
        this.carts.map((cart) => {
        if(cart.rentid == rent.id) {
          cart.qty++
          found = true
        }
        })

        if (!found) {
        let cart = {
          rentid: rent.id,
          userid: this.user.id,
          email: this.user.email,
          qty:1,
          clientstatus:'รอชำระ',
          homeowner_status:'ยังไม่ได้รับการยืนยันจากเจ้าของบ้าน กรุณาติดต่อหากจ่ายแล้ว',
          renttitle: rent.title,
          username: this.user.name,
          userlastname: this.user.lastname,
          prices: rent.depositprice
        }
        this.carts.push(cart)
        }
      }
    },

    inc (item) {
    item.qty++
    this.total += parseInt(item.prices)
    },
    
    dec (item) {
    item.qty--
    this.total -= parseInt(item.prices)
    if(item.qty <= 0) {
    let i = this.carts.indexOf(item)
    this.carts.splice(i, 1)
    // this.total = 0
    }
    },
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      }
    },

    sendBuy() {
      this.carts.forEach(async (cart) => {
        console.log("cart: " + JSON.stringify(cart))
      try {
        await LeasesService.post(cart)
        this.$router.push({
          name: 'cartlist'
        })
      } catch (err) {
        console.log(err)
      }
      })
    },

    appendResults: function () {
      if (this.rents.length < this.results.length) {
        let toAppend = this.results.slice(
          this.rents.length,
          LOAD_NUM + this.rents.length
        );
        this.rents = this.rents.concat(toAppend);
      }
    },

    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteRent(rent) {
      let result = confirm("want to delete?");
      if (result) {
        try {
          await RentsService.delete(rent);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      this.rents = (await RentsService.index()).data;
    },

    setCategory(keyword) {
      if (keyword === ' ') {
        this.search = '';
        console.log('null');
      } else {
        this.search = keyword;
      }
    },
  },

  updated() {
    let sens = document.querySelector("#blog-list-bottom");
    pageWatcher = ScrollMonitor.create(sens);
    pageWatcher.enterViewport(this.appendResults);
  },

  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },

  beforeUpdated() {
    if (pageWatcher) {
      pageWatcher.destroy();
      pageWatcher = null;
    }
  },
};
</script>
<style scoped>

.hero {
 margin-top: 40px;
 max-width: 900px;
 margin-left: auto;
 margin-right: auto;
 border-radius: 5px;
 background: darkcyan;
 height:250px;
 color:white;
 padding: 20px;
 }
.hero h1
{
 margin-top: 30px;
}
.logo
{
 padding-right: 20px;
}

#blog-list-bottom {
  padding-top: 4px;
}
.blog-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}

.empty-rent {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}

/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.rent-info {
  float: left;
}
.rent-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.rent-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.rent-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-top:10px;
}



/*category style*/
.categories {
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.categories li.clear a {
  background: tomato;
  color: white;
}

.create-rent {
 margin-top: 10px;
 margin-bottom: 10px;
}

.card{
  margin-bottom: 10px;
}

.card img{
  width:100%;
  height:220px;
  object-fit: cover;
}

.title_card h4{
  margin-left: 8px;
  margin-top:6px;
  font-weight: 600;
}

.title_card{
  height: 65px;
}

.info_card{
  height: 200px;
  margin-left: 8px;
}

.btn_card {
  margin-left: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.card-top{
  margin-bottom: 15px;
}

h2{
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 20px;
}

.top-img img{
  width: 100%;
  height:350px;
  object-fit: cover;
}

.top-img h2{
  margin-top: -40px;
  margin-bottom: 30px;
  margin-left: 50px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 2px 2px 4px #000000;
}

.popup-cart {
 box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
 border: solid 1px #ddd;
 background: #fff;
 width:360px;
 padding: 10px;
 position:fixed;
 bottom:0;
 right:0;
 border-radius: 5px;
 margin-bottom: 5px;
 margin-right: 5px;
}

@media (max-width: 768px) {
 .top-img h2 {
    margin-left: 10px;
 }

 .card{
    margin-bottom: 10px;
  }
}


</style>