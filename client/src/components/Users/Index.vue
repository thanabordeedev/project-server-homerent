<template>
<div>
<main-header navsel="back"></main-header>
  <div class="container">
    <div class="users-header">
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input type="text" v-model="search" class="form-control" placeholder="Search">
              <div class="input-group-prepend"><span class="input-group-text"><i class="fa fa-search"></i></span></div>
            </div>
          </div>
        </form>
      </div>

      <div class="create-booking">
      <button class="btn btn-success" v-on:click="navigateTo('/user/create')">สร้างผู้ใช้งาน</button>
       <strong>จํานวน {{ users.length }} คน</strong>
      </div>
    </div>

    <transition-group name="fade">
    <div v-for="user in users" v-bind:key="user.id" class="booking-list">
      <p> id: {{ user.id }}</p>
      <p>ชื่อ-นามสกุล: {{ user.name }} - {{ user.lastname }}</p>
      <p>email: {{ user.email }}</p>
      <p>สร้างเมื่อ: {{ user.createdAt | formatedDate  }}</p>
      <p>ระดับการใช้งาน: {{ user.type }}</p>
      <p>สถานะ: {{ user.status }}</p>

      <div class="booking-info">
        <p>
          <button class="btn btn-sm btn-info btn-list" v-on:click="navigateTo('/user/' + user.id)">
            <i class="fa fa-book"></i> ดูข้อมูลผู้ใช้
          </button>
          <button  class="btn btn-sm btn-warning btn-list" v-on:click="navigateTo('/user/edit/' + user.id)">
            <i class="fa fa-pencil-square-o"></i> แก้ไขข้อมูล
          </button>
          <button class="btn btn-sm btn-danger btn-list"  v-on:click="deleteUser(user)"><i class="fa fa-trash-o"></i>  ลบข้อมูล</button>
        </p>
        <p>
          <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="pauseUser(user.id)"><i class="fa fa-pause"></i>
          Pause</a>&nbsp;
          <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="activeUser(user.id)"><i class="fa fa-check"></i>
          Active</a>&nbsp;
        </p>
      </div>
      <div class="clearfix"></div>
    </div>
    </transition-group>
    <div class="empty-booking" v-if="users.length === 0 && loading === false"> *** ไม่มีข้อมูล*** </div>
    <div id="blog-list-bottom">
      <div class="blog-load-finished" v-if="users.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
    </div>
  </div>

</template>
<script>
import UsersService from "@/services/UsersService";
import _ from "lodash";
import ScrollMonitor from 'scrollMonitor'
import moment from 'moment'

let LOAD_NUM = 3
let pageWatcher;

export default {
  data() {
    return {
      users: [],
      search: "",
      results: [],
       loading: false
    };
  },

  filters: {
    formatedDate (value) {
      return moment(String(value)).format('DD-MM-YYYY')
    },
  },

  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "users",
      };

      if (this.search !== '') {
        route.query = {
          search: this.search,
        };
      }

      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),
    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.users = []
        this.results = []
        this.results = (await UsersService.index(value)).data;
        this.appendResults()
      },
    },
  },

  

  async created() {
    try {
      this.users = (await UsersService.index()).data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {

    appendResults: function () {
      if (this.users.length < this.results.length) {
        let toAppend = this.results.slice(
        this.users.length,
        LOAD_NUM + this.users.length
      )
      this.users = this.users.concat(toAppend)
      }
    },

    async pauseUser(userId) {
      let user = {
        "id": userId,
        "status":"pause"
      }
      try {
        await UsersService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
    },

  async activeUser(userId) {
  let user = {
    "id": userId,
    "status":"active"
  }
  try {
    await UsersService.put(user)
    this.refreshData()
  } catch (error) {
    console.log(error)
  }
  },

    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteUser(user) {
      let result = confirm("Want to delete?");
      if (result) {
        try {
          await UsersService.delete(user);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      this.users = (await UsersService.index()).data;
    },
  },

  updated () {
    let sens = document.querySelector('#blog-list-bottom')
    pageWatcher = ScrollMonitor.create(sens)
    pageWatcher.enterViewport(this.appendResults);
  },

  beforeUpdated () {
    if (pageWatcher) {
      pageWatcher.destroy()
      pageWatcher = null
    }
  }
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

.users-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

.create-booking {
 margin-top: 10px;
 margin-bottom: 10px;
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

.booking-list p {
  margin-left: 10px;
}

.clearfix {
  clear: both;
}
</style>