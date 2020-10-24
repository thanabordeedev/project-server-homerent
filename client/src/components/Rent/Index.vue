<template>
  <div>
  <main-header navsel="back"></main-header>
  <div class="container">
    <div class="rent-header">
      <h2>ใครจะหาบ้านใหม่ จองได้เลยครับ</h2>
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
        <button class="btn btn-success" v-on:click="navigateTo('/rent/create')">
          สร้าง rent
        </button>
        <strong>จำนวนบุ๊กกิ้งทั้งหมด: </strong> {{ rents.length }}
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
    <div v-for="rent in rents" v-bind:key="rent.id" class="rent-list">
      <!--<p>id: {{rent.id}}</p>-->
      <div class="row">
        <div class="col-md-4">
          <div class="rent-pic">
            <transition name="fade">
              <div class="thumbnail-pic" v-if="rent.thumbnail != 'null'">
                <img :src="BASE_URL + rent.thumbnail" alt="thumbnail" />
              </div>
            </transition>
          </div>
        </div>
        <div class="col-md-8">
          <div class="content">
            <h3>{{ rent.title }}</h3>
            <div v-html="rent.content.slice(0, 200) + '...'"></div>
            <p><strong> ค่าเช่า:</strong> {{ rent.rentprice | getNumberWithCommas}} บาท</p>
            <p v-if="rent.depositprice != 0"><strong> ค่ามัดจำ: </strong>{{ rent.depositprice | getNumberWithCommas}} บาท</p>
            <p v-if="rent.depositprice == 0"><strong> ค่ามัดจำ: </strong><span>ไม่มี</span></p>
            <p><strong> ประเภทอาคาร: </strong> {{ rent.category }}</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-8">
          <p>
            <button class="btn btn-sm btn-info btn-list" v-on:click="navigateTo('/rent/' + rent.id)">
              <i class="fa fa-book"></i> ดูข้อมูลของการให้เช่า
            </button>
            <button class="btn btn-sm btn-warning btn-list" v-on:click="navigateTo('/rent/edit/' + rent.id)">
              <i class="fa fa-pencil-square-o"></i> แก้ใข rent
            </button>
            <button class="btn btn-sm btn-danger btn-list" v-on:click="deleteRent(rent)"><i class="fa fa-trash-o"></i> ลบข้อมูล</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(rent.id)"><i class="fa fa-pause"></i>
            Suspend</a>&nbsp;
            <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(rent.id)"><i class="fa fa-check"></i>
            Published</a>&nbsp;
          </p>
        </div>
      </div>

      <div class="clearfix"></div>
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
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  data() {
    return {
      rents: [],
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
        name: "rents",
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
        this.results = (await RentsService.index(value)).data;
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

  //async created() {
  //  this.rents = (await RentsService.index()).data;
  //},

  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },

    async suspend (rentId) {
      let user = {
        "id": rentId,
        "status":"saved"
      }
      try {
        await RentsService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
    },

    async publish (rentId) {
      let user = {
        "id": rentId,
        "status":"published"
      }
      try {
        await RentsService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
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
  filters: {
    getNumberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  height: 200px;
  object-fit: cover;

}
.rent-info {
  float: left;
}
.rent-pic {
  float: left;
}

.rent-pic img {
  float: left;
  width: 100%;
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
  padding: 6px;
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

.content span{
  color: #8c8c8c;
}

@media only screen and (max-width: 767px) {
  h3{
    margin-top:10px;
  }
}


</style>