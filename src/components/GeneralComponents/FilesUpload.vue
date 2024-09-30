<template>
  <DeleteConfirmationModal
    :isOpen="open_delete_modal"
    @confirm-delete="deleteAction"
    @cancel-delete="closeDeleteModal"
  />
  <div
    :class="{
      'border-red-500  dark:border-red-500': error_message_data !== '',
      'border-gray-200 dark:border-gray-700': error_message_data == '',
    }"
    class="w-full p-4 bg-white border rounded-lg shadow dark:bg-gray-800"
  >
    <label
      :class="{
        'gl-label-form': error_message_data == '',
        'gl-label-form-invalid': error_message_data !== '',
        required: is_required,
      }"
      >{{ label_name }}</label
    >

    <div
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      class="flex flex-col items-center justify-center w-full h-40 mt-3 mb-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <input
          type="file"
          :ref="'file_input' + field_name"
          hidden
          :multiple="has_multiple_file"
          @change="uploadFiles"
        />

        <input type="hidden" :name="field_name" v-model="uploadFileListFinal" />
        <div
          class="flex flex-col items-center justify-center"
          @click="$refs['file_input' + this.field_name].click()"
          v-if="!isDragging"
        >
          <svg
            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            ></path>
          </svg>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Drag & drop files or browse
          </p>
        </div>
        <div v-else>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Drop files here
          </p>
        </div>
      </div>
    </div>

    <span class="mt-2 gl-span-form-error">{{ error_message_data }}</span>

    <small class="block mt-2 mb-3 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>

    <section class="" v-if="files.length > 0">
      <li
        class="flex items-center justify-between p-2 mb-2 text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
        v-for="(file, index) in files"
      >
        <i class="text-3xl fas fa-file-alt"></i>

        <div class="w-full ml-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-black dark:text-white">{{
              getFileName(file.file_name)
            }}</span>
            <span class="text-xs text-black dark:text-white">{{
              file.loading
            }}</span>
          </div>

          <div class="w-full h-1 mb-1 bg-white rounded-full dark:bg-gray-800">
            <div
              class="h-full bg-gray-500 rounded-full dark:bg-gray-400"
              :style="{ width: file.loading + '%' }"
            ></div>
          </div>
        </div>
      </li>
    </section>

    <section class="overflow-x-scroll max-h-56">
      <li
        class="flex items-center justify-between p-2 mb-2 text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
        v-for="(file, index) in uploadFileListFinal"
      >
        <div class="flex items-center">
          <i class="text-3xl fas fa-file-alt" aria-hidden="true"></i>
          <div class="flex flex-col ml-3">
            <span class="text-xs">{{ getFileName(file.file_name) }}</span>
            <span class="text-xs">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <a
            :href="file.url"
            target="_blank"
            class="text-lg text-blue-600 cursor-pointer dark:text-blue-400 fas fa-download"
          >
          </a>

          <i
            v-if="is_enable_delete"
            @click="
              media_id = file.id;
              open_delete_modal = true;
            "
            class="text-lg text-red-600 cursor-pointer dark:text-red-400 fas fa-x"
          ></i>
        </div>
      </li>
    </section>
  </div>
</template>

<script>
import DeleteConfirmationModal from "/src/components/GeneralComponents/DeleteConfirmationModal.vue";
import GlToast from "/src/Stores/toast.js";

export default {
  components: {
    DeleteConfirmationModal,
  },
  props: {
    is_required: {
      type: Boolean,
      default: false,
    },
    error_message: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },

    has_multiple_file: {
      show: Boolean,
      default: false,
    },

    field_name: {
      type: String,
      default: "",
    },

    label_name: {
      type: String,
      default: "",
    },

    route_url: {
      type: String,
      default: "",
    },

    modelValue: {
      type: Array,
      default: [],
    },

    file_config: {
      type: Object,
      default: {},
    },

    is_enable_delete: {
      type: Boolean,
      default: true,
    },

    accepts_file_types: {
      type: String,
      default: "",
    },

    max_file_size: {
      type: Number,
      default: 0,
    },





  },

  emits: ["update:modelValue", "uploaded"],

  data() {
    return {
      media_id: "",
      error_message_data: "",
      open_delete_modal: false,
      files: [],
      uploadFileList: [],

      isDragging: false,
    };
  },

  methods: {
    closeDeleteModal() {
      this.open_delete_modal = false;
    },

    deleteAction() {
      axios
        .delete(this.route_url + "/destroyMedia/" + this.media_id)
        .then((response) => {
          let index = this.uploadFileList.findIndex(
            (file) => file.id === this.media_id
          );
          if (index !== -1) {
            this.uploadFileList.splice(index, 1);
          }
          this.closeDeleteModal();

          GlToast.methods.add({
            message: "Item deleted successfully.",
            type: "success",
            duration: 5000,
          });
        })
        .catch((error) => {
          console.error(error);
          this.is_loading = false;
        });
    },

    getFileName(name) {
      return name.length > 12
        ? name.substring(0, 13) + "...  ." + name.split(".")[1]
        : name;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
    onDragOver(event) {
      event.preventDefault();
      this.isDragging = true;
      event.dataTransfer.dropEffect = "copy";
    },

    onDragLeave(event) {
      event.preventDefault();
      this.isDragging = false;
    },

    onDrop(event) {
      event.preventDefault();
      this.isDragging = false;
      const files = event.dataTransfer.files;
      Array.from(files).forEach((file) => {
        this.uploadFile(file);
      });
    },

    async uploadFiles(event) {
      const files = event.target.files;

      const uploadPromises = Array.from(files).map((file) =>
        this.uploadFile(file)
      );

      await Promise.all(uploadPromises);

      this.$emit("uploaded");
      this.$emit("update:modelValue", this.uploadFileList);
      console.log("uploadFileList", this.uploadFileList);
    },

    getFirstError(errors, field) {
      if (errors.hasOwnProperty(field)) {
        return errors[field][0];
      }
      return "";
    },
    async uploadFile(file) {
      return new Promise((resolve, reject) => {
        if (!file) resolve();

        const formData = new FormData();
        formData.append(this.field_name, file);
        formData.append("accepts_file_types", this.accepts_file_types);
        formData.append("max_file_size", this.max_file_size);
        formData.append("field_name", this.field_name);

        Object.entries(this.file_config).forEach(([key, value]) => {
          formData.append(key, value);
        });

        this.files.push({ file_name: file.name, loading: 0 });

        axios
          .post(this.route_url + "/media", formData, {
            onUploadProgress: (progressEvent) => {
              this.files[this.files.length - 1].loading = Math.floor(
                (progressEvent.loaded / progressEvent.total) * 100
              );
            },
          })
          .then((response) => {
            let index = this.files.findIndex(
              (file_data) => file_data.file_name === file.name
            );

            if (index !== -1) {
              this.files.splice(index, 1);
            }

            if (!this.has_multiple_file) {

              this.uploadFileList=[];

            }

            this.uploadFileList.push({
              file_name: response.data.file_name,
              size: response.data.size,
              id: response.data.id,
              url: response.data.url,
            });

            this.error_message_data = "";
            resolve();
          })
          .catch((error) => {
            if (error.response.status === 422) {
              this.error_message_data = this.getFirstError(
                error.response.data.errors,
                this.field_name
              );
            } else {
              console.error("An error occurred:", error);
            }

            let index = this.files.findIndex(
              (file_data) => file_data.file_name === file.name
            );

            if (index !== -1) {
              this.files.splice(index, 1);
            }
            console.log(error);
            resolve();
          });
      });
    },
  },

  computed: {
    uploadFileListFinal() {
      if (this.uploadFileList.length > 0) {


        return this.uploadFileList;

        /*
        if (this.has_multiple_file) {
          // return this.uploadFileList.map((file) => file.id);
          return this.uploadFileList;
        } else {
         // return this.uploadFileList[0] || null;
          return this.uploadFileList.slice(-1);
        }
          */
      } else {
        this.uploadFileList = [...this.uploadFileList, ...this.modelValue];
        return this.uploadFileList;
      }
    },
  },

  mounted() {
    this.error_message_data = this.error_message;
  },
};
</script>
