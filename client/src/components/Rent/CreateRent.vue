<template>
  <div>
  <main-header navsel="back"></main-header>
  <div class="container">
    <h1>Create Rent</h1>

    <form v-on:submit.prevent="createRent">
      <div class="form-group">
        <label for="InputRentTitle" class="boldtext">Title</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.title">
      </div>
      <div class="form-group">
        <label for="InputRentprice" class="boldtext">Rent Price</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.rentprice">
      </div>
      <div class="form-group">
        <label for="InputDepositprice" class="boldtext">Deposit Price</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.depositprice">
      </div>

      <div class="form-group">
        <label for="InputBedroom" class="boldtext">Bed room</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.bedroom">
      </div>
      <div class="form-group">
        <label for="Inputtoiletroom" class="boldtext">Toilet room</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.toiletroom">
      </div>

      <div class="form-group">
        <label for="InputAddress" class="boldtext">Address</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.address">
      </div>

      <div class="form-group">
        <label for="InputLandsize" class="boldtext">ขนาดที่ดิน</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.landsize">
      </div>

      <div class="form-group">
        <label for="InputInhomesize" class="boldtext">พึ้นที่ใช้สอย</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.inhomesize">
      </div>
  
      <transition name="fade">
        <div class="thumbnail-pic" v-if="rent.thumbnail != 'null'">
          <img :src="BASE_URL+rent.thumbnail" alt="thumbnail">
        </div>
      </transition>
      <form enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="
              filesChange($event.target.name, $event.target.files);
              fileCount = $event.target.files.length;
            "
            accept="image/*"
            class="input-file"
          />
          <!-- <p v-if="isInitial || isSuccess"> -->
          <p v-if="isInitial">
            Drag your file(s) here to begin<br />
            or click to browse
          </p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          <p v-if="isSuccess">Upload Successful.</p>
        </div>
      </form>
      <!--Upload end-->
      <div>
        <transition-group tag="ul" class="pictures">
          <li v-for="picture in pictures" v-bind:key="picture.id">
            <img
              style="margin-bottom: 5px"
              :src="BASE_URL + picture.name"
              alt="picture image"
            />
            <br />
            <button class="btn btn-sm btn-info" v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
            <button class="btn btn-sm btn-danger" v-on:click.prevent="delFile(picture)">Delete</button>
          </li>
        </transition-group>
        <div class="clearfix"></div>
      </div>
      <!--img end-->
      <p><strong>content:</strong></p>
      <p>
        <vue-ckeditor
          v-model.lazy="rent.content"
          :config="config"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        />
      </p>
      <div class="form-group">
        <label for="InputCategory" class="boldtext">Category</label>
        <input type="text" class="form-control col-lg-6" v-model="rent.category">
      </div>
      <p><button class="btn btn-success" type="submit">Create Rent</button></p>
    </form>
  </div>
  </div>
</template>
<script>
import RentsService from "@/services/RentsService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "@/services/UploadService";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  data() {
    return {
      rent: {
        title: "",
        rentprice: "",
        depositprice: "",
        bedroom: '',
        toiletroom: '',
        address: '',
        landsize: "",
        inhomesize: "",
        thumbnail: "null",
        pictures: "null",
        content: "",
        category: "",
        status: "saved",
      },
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      config: {
        toolbar: [
          ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"],
        ],
        height: 300,
      },
    };
  },

  methods: {
    async createRent() {
      this.rent.pictures = JSON.stringify(this.pictures)
      try {
        await RentsService.post(this.rent);
        this.$router.push({
          name: "rents",
        });
      } catch (err) {
        console.log(err);
      }
    },
    onBlur(editor) {
      console.log(editor);
    },
    onFocus(editor) {
      console.log(editor);
    },

    //page 264
    //delfile
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name,
        };

        await UploadService.delete(dataJSON);
        for (var i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.materialIndex--;
            break;
          }
        }
      }
    },

    // upload
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      // this.uploadedFiles = []
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach((uploadFilename) => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFilename) {
              found = true;
              break;
            }
          }

          if (!found) {
            this.pictureIndex++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename,
            };
            this.pictures.push(pictureJSON);
          }
        });

        this.clearUploadResult();
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },

    useThumbnail (filename) {
      console.log(filename)
      this.rent.thumbnail = filename
    },
  },

  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  components: {
    VueCkeditor,
  },

  created() {
    this.reset(),

    this.config.toolbar = [
      {
        name: "document",
        items: [
          "Source",
          "-",
          "Save",
          "NewPage",
          "Preview",
          "Print",
          "-",
          "Templates",
        ],
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "-",
          "Undo",
          "Redo",
        ],
      },
      {
        name: "editing",
        items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
      },
      {
        name: "forms",
        items: [
          "Form",
          "Checkbox",
          "Radio",
          "TextField",
          "Textarea",
          "Select",
          "Button",
          "ImageButton",
          "HiddenField",
        ],
      },
      "/",
      {
        name: "basicstyles",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "Strike",
          "Subscript",
          "Superscript",
          "-",
          "CopyFormatting",
          "RemoveFormat",
        ],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "Outdent",
          "Indent",
          "-",
          "Blockquote",
          "CreateDiv",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
          "BidiLtr",
          "BidiRtl",
          "Language",
        ],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Flash",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "InsertPre",
        ],
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "about", items: ["About"] },
    ];
  },
};
</script>
<style scoped>

.boldtext {
  font-weight:600;
}

.container {
  margin-top:60px;
}
/* uplaod */
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lemonchiffon;
  color: dimgray;
  padding: 10px 10px;
  min-height: 300px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 300px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: khaki; /* when mouse over to the drop zone, change color
*/
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 100px 0;
}

ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 10px;
  padding-bottom: 10px;
}
ul.pictures li {
  float: left;
}
ul.pictures li img {
  max-width: 180px;
  margin-right: 20px;
}
.clearfix {
  clear: both;
}

/* thumbnail */
.thumbnail-pic img{
 width:200px;
}
</style>