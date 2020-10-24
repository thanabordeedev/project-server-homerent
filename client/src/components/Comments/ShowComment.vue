<template>
<div>
<main-header navsel="back"></main-header>
 <div class="container">
     <p><strong> ID: </strong> {{ comment.blogId}}</p>
    <p><strong> Comment: </strong> {{ comment.comment}}</p>
    <p><strong> Create date: </strong>{{ comment.createdAt}}</p>
    <p>
        <button class="btn btn-success" v-on:click="navigateTo('/comments')"><i class="fa fa-arrow-left"></i> กลับ</button>
    </p>
 </div>
 </div>
</template>
<script>
import CommentsService from "@/services/CommentsService"

export default {
    data () {
        return {
            comment: []
        }
    },
    async created () {
        try {
            let commentId = this.$route.params.commentId
            this.comment = (await CommentsService.show(commentId)).data
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