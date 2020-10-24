<template>
<div>
<main-header navsel="back"></main-header>
<div class="img-pic">
    <div class="thumbnail-pic" v-if="rent.thumbnail != 'null'">
        <img :src="BASE_URL + rent.thumbnail" alt="thumbnail" />
    </div>
</div>
 <div class="container">
    <h1>{{ rent.title}}</h1>
    <div class="infomation">
        <h3><p><span>฿ </span> {{ rent.rentprice  | getNumberWithCommas }} / เดือน</p></h3>
        <p v-if="rent.depositprice == 0">ค่ามัดจำ : ไม่มี<p>
        <p v-if="rent.depositprice != 0">ค่ามัดจำ : {{ rent.depositprice | getNumberWithCommas}}<p>
        
        <div class="home-info">
            <p>
                <span>{{rent.bedroom}}</span>&nbsp;&nbsp;<i class="fa fa-bed"></i>
                <span>{{rent.toiletroom}}</span>&nbsp;&nbsp;<i class="fa fa-shower"></i>
            </p>
        </div>

        <div class="home-info2">
            <h3>รายละเอียด</h3>
            <p v-if="rent.address!=null"><span>ที่อยู่อาคาร : {{rent.address}}</span></p>
            <p v-if="rent.address==null">ที่อยู่อาคาร : <strong>ไม่มีข้อมูล</strong></p>
            <p v-if="rent.category!=null"><span>ประเภท : {{rent.category}}</span></p>
            <p v-if="rent.category==null">ประเภท : <strong>ไม่มีข้อมูล</strong></p>
            <p v-if="rent.landsize!=null"><span>ขนาดที่ดิน : {{rent.landsize}}</span></p>
            <p v-if="rent.landsize==null">ประเภท : <strong>ไม่มีข้อมูล</strong></p>
            
            <p v-if="rent.inhomesize!=null"><span>พึ้นที่ใช้สอย : {{rent.inhomesize}}</span></p>
            <p v-if="rent.inhomesize==null">ประเภท : <strong>ไม่มีข้อมูล</strong></p>

            <h3>รายละเอียดเพิ่มเติม</h3>
            <p><span><div v-html="rent.content"></div></span></p>

        </div>

        <div class="row justify-content-center btn-back">
            <button class="btn btn-success" v-on:click="navigateTo('/rents')"><i class="fa fa-arrow-left"></i> กลับ</button>
        </div>
    </div>

 </div>
 </div>
</template>
<script>
import RentsService from "@/services/RentsService"

export default {
    data () {
        return {
            BASE_URL: "http://localhost:8081/assets/uploads/",
            rent: [],
            rent: {
                title: "",
                rentprice: "",
                depositprice: "",
                thumbnail: "null",
            },
        }
    },

    filters: {
        getNumberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
    },
    async created () {
        try {
            let rentId = this.$route.params.rentId
            this.rent = (await RentsService.show(rentId)).data
        } catch (error) {
            console.log(error)
        }
    },
    methods : {
        navigateTo (route) {
            this.$router.push(route)
        }
    },
     
    
    

 }
</script>
<style scoped>
.container {
  margin-top:20px;
}

.img-pic img{
    width: 100%;
    height: 400px;
    object-fit: cover;
}
.infomation{
    margin-top:20px;
}

h1{
    font-weight: 700;
    font-size: 42px;
}

.infomation h3 p span {
    font-weight: 700;
    font-size: 0.8em;
}

.home-info p i{
    font-size: 26px;
    margin-right: 20px;
}

.home-info2{
    color:#999;
}


.home-info p span{
    font-size: 16px;
}

.home-info2 h3{
    font-weight: 600;
    margin-top:60px;
    color:#000000;
}

.home-info2 strong{
    color:#999;
}

.btn-back{
    margin-bottom: 50px;
}

.home-info2 p span{
    color:#000000;
}

</style>