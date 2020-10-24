<template>
  <div>
    <main-header navsel="front"></main-header>
    <div class="container">
      
        <div class="hero">
            <img src="@/assets/logo.png" class="logo" style="float:left">
            <h1>Renthome from nodejs + vuejs</h1>

        </div>
        <div class="clearfix"></div>

    <div class="booking-header">
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

      <div class="create-booking">
        
        <strong>จำนวนบุ๊กกิ้งทั้งหมด: </strong> {{ bookings.length }}
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

    <transition-group name="fade">
    <div v-for="booking in bookings" v-bind:key="booking.id" class="booking-list">
      <!--<p>id: {{booking.id}}</p>-->
      <div class="booking-pic">
        <transition name="fade">
          <div class="thumbnail-pic" v-if="booking.thumbnail != 'null'">
            <img :src="BASE_URL + booking.thumbnail" alt="thumbnail" />
          </div>
        </transition>
      </div>

      <h3>{{ booking.title }}</h3>
      <div v-html="booking.content.slice(0, 200) + '...'"></div>

      <div class="booking-info">
        <p><strong> Price:</strong> {{ booking.bookingprice }}</p>
        <p><strong> Price: </strong>{{ booking.depositprice }}</p>
        <p><strong> category: </strong> {{ booking.category }}</p>
        <!--<p>status: {{booking.status}}</p> -->
        <p>
          <button class="btn btn-sm btn-info btn-list" v-on:click="navigateTo('/front/read/' + booking.id)">
            <i class="fa fa-book"></i> ดูข้อมูลของการให้เช่า
          </button>

        </p>
      </div>
      <div class="clearfix"></div>
    </div>
    </transition-group>
    <div class="empty-booking" v-if="bookings.length === 0 && loading === false"> *** ไม่มีข้อมูล*** </div>
    <div id="blog-list-bottom">
      <div class="blog-load-finished" v-if="bookings.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
  </div>
</template>
<script>
import BookingsService from "@/services/BookingsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "front",
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
        this.bookings = []
        this.results = []
        this.loading = true
        this.results = (await BookingsService.frontIndex(value)).data;
        this.appendResults()

        this.results.forEach((booking) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(blog.category))
            if (this.category.indexOf(booking.category) === -1) {
              this.category.push(booking.category);
            }
          } else {
            this.category.push(booking.category);
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
      bookings: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: '',
      results: [],
      category: [],
      loading: false,
    };
  },

  

  //async created() {
  //  this.bookings = (await BookingsService.index()).data;
  //},

  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },

    appendResults: function () {
      if (this.bookings.length < this.results.length) {
        let toAppend = this.results.slice(
          this.bookings.length,
          LOAD_NUM + this.bookings.length
        );
        this.bookings = this.bookings.concat(toAppend);
      }
    },

    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteBooking(booking) {
      let result = confirm("want to delete?");
      if (result) {
        try {
          await BookingsService.delete(booking);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      this.bookings = (await BookingsService.index()).data;
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

@media (max-width: 768px) {
 .logo {
 width: 120px;
 }
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

.empty-booking {
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
.booking-info {
  float: left;
}
.booking-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.booking-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.booking-header {
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

.create-booking {
 margin-top: 10px;
 margin-bottom: 10px;
}


</style>