<template>
<div>
<main-header navsel="back"></main-header>
  <div class="container">
    <h1>Create Comments</h1>
    <form v-on:submit.prevent="createComment">

      <div class="form-group row justify-content-center">
        <label for="inputBlogId" class="col-sm-2 col-form-label"><strong> BlogID: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputBlogId" v-model="comment.blogId">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputComment" class="col-sm-2 col-form-label"><strong> Comment: </strong></label>
        <div class="col-lg-6 col-sm-10">
          <input type="text" class="form-control" id="inputComment" v-model="comment.comment">
        </div>
      </div>

      <div class="form-group row justify-content-center">
        <label for="inputButton" class="col-sm-2 col-form-label"></label>
        <div class="col-lg-6 col-sm-10">
          <button type="submit" class="btn btn-success"><i class="fa fa-check"></i> Create Comment</button>
          <button class="btn btn-light" v-on:click="navigateTo('/comments')">Back</button>
        </div>
      </div>

    </form>
  </div>
  </div>
</template>
<script>
import CommentsService from "@/services/CommentsService";
export default {
  data() {
    return {
      comment: {
        blogId: "",
        comment: "",
      },
    };
  },
  methods: {
    async createComment() {
      try {
        await CommentsService.post(this.comment);
        this.$router.push({
          name: "comments",
        });
      } catch (err) {
        console.log(err);
      }
    },

    navigateTo (route) {
            this.$router.push(route)
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

form{
  margin-top:20px;
}
</style>