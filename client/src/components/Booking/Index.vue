<template>
  <div>
  <main-header navsel="back"></main-header>
  <div class="container">
    <div class="booking-header">
      <h2>ส่วนจัดการบุ๊กกิ้ง</h2>
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
        <button class="btn btn-success" v-on:click="navigateTo('/booking/create')">
          สร้างการจอง
        </button>
        <strong>รายการการจองทั้งหมด: </strong> {{ bookings.length }}
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
          <button class="btn btn-sm btn-info btn-list" v-on:click="navigateTo('/booking/' + booking.id)">
            <i class="fa fa-book"></i> ดูข้อมูลของการให้เช่า
          </button>
          <button class="btn btn-sm btn-warning btn-list" v-on:click="navigateTo('/booking/edit/' + booking.id)">
            <i class="fa fa-pencil-square-o"></i> แก้ใข booking
          </button>
          <button class="btn btn-sm btn-danger btn-list" v-on:click="deleteBooking(booking)"><i class="fa fa-trash-o"></i> ลบข้อมูล</button>
        </p>
        <p>
          <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(booking.id)"><i class="fa fa-pause"></i>
          Suspend</a>&nbsp;
          <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(booking.id)"><i class="fa fa-check"></i>
          Published</a>&nbsp;
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

  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "bookings",
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
        this.results = (await BookingsService.index(value)).data;
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

  //async created() {
  //  this.bookings = (await BookingsService.index()).data;
  //},

  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },

    async suspend (bookingId) {
      let user = {
        "id": bookingId,
        "status":"saved"
      }
      try {
        await BookingsService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
    },

    async publish (bookingId) {
      let user = {
        "id": bookingId,
        "status":"published"
      }
      try {
        await BookingsService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
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