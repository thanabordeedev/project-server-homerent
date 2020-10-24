<template>
  <div>
    <main-header navsel="back"></main-header>
    <div class="container">
      <div class="comment-header">
        <div>
          <form class="form-inline form-search">
            <div class="form-group">
              <div class="input-group">
                <input
                  type="text"
                  v-model="search"
                  class="form-control"
                  placeholder="Search"
                />
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="fa fa-search"></i
                  ></span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="create-comment">
          <button class="btn btn-success" v-on:click="navigateTo('/comment/create')">สร้าง comment</button>
          <strong>จํานวน comment ทั้งหมด: </strong> {{ comments.length }}
        </div>

        <transition-group name="fade">
          <div v-for="comment in comments" v-bind:key="comment.id" class="comment-list">
            <div class="comment-info">
              <p><strong>id:</strong> {{ comment.id }}</p>
              <p><strong>booking id: </strong> {{ comment.bookingId }}</p>
              <p><strong> comment: </strong>{{ comment.comment }}</p>
              <p>
                <button class="btn btn-sm btn-info btn-list" v-on:click="navigateTo('/front/read/'+  comment.bookingId)">ดูบล็อกที่ comment</button>
                <button class="btn btn-sm btn-danger btn-list" v-on:click="deleteComment(comment)"><i class="fa fa-trash-o"></i> ลบข้อมูล</button>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </transition-group>
        <div
          class="empty-booking"
          v-if="comments.length === 0 && loading === false"
        >
          *** ไม่มีข้อมูล***
        </div>
        <div id="blog-list-bottom">
          <div
            class="blog-load-finished"
            v-if="comments.length === results.length && results.length > 0"
          >
            โหลดข้อมูลครบแล้ว
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CommentsService from "@/services/CommentsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  data() {
    return {
      comments: [],
      search: '',
      results: [],
      loading: false,
    };
  },

  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "comments",
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
        this.comments = []
        this.results = []
        this.results = (await CommentsService.index(value)).data;
        this.appendResults()
      },
    },
  },

  async created() {
    this.comments = (await CommentsService.index()).data;
  },

  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },

    appendResults: function () {
      if (this.comments.length < this.results.length) {
        let toAppend = this.results.slice(
          this.comments.length,
          LOAD_NUM + this.comments.length
        );
        this.comments = this.comments.concat(toAppend);
      }
    },

    navigateTo(route) {
      this.$router.push(route);
    },

    async deleteComment(comment) {
      try {
        await CommentsService.delete(comment);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },

    async refreshData() {
      this.comments = (await CommentsService.index()).data;
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
.container {
  margin-top: 60px;
}

.comment-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

.create-comment {
  margin-top: 10px;
  margin-bottom: 10px;
}

.comment-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
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
</style>