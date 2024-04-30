<template>
    <div>
      <label for="file-upload" class="flex items-center justify-center w-full h-full p-4 border border-gray-400 border-dashed cursor-pointer">
        <input id="file-upload" type="file" @change="handleFileUpload" class="hidden" :multiple="allowMultiple" />
        <span v-if="!file">Drag and drop files here, or click to browse</span>
        <span v-else>
          <template v-if="Array.isArray(file)">
            <div v-for="(f, index) in file" :key="index">
              <img v-if="isImage(f)" :src="f.preview" alt="Preview" class="object-cover w-16 h-16 mr-2" />
              <span v-else>{{ f.name }}</span>
            </div>
          </template>
          <template v-else>
            <img v-if="isImage(file)" :src="file.preview" alt="Preview" class="object-cover w-16 h-16 mr-2" />
            <span v-else>{{ file.name }}</span>
          </template>
        </span>
      </label>
    </div>
</template>

  <script>
  import Dropzone from 'dropzone';

  export default {
    data() {
      return {
        file: null,
        dropzone: null,
        allowMultiple: true,
      };
    },
    mounted() {
      this.dropzone = new Dropzone(this.$el, {
        url: '/your-upload-url', // Replace with your upload URL
        autoProcessQueue: false,
        maxFilesize: 5, // Example: Limit file size to 5 MB
        acceptedFiles: '.jpg,.jpeg,.png,.gif', // Example: Only allow image files
        dictDefaultMessage: 'Drag and drop files here, or click to browse', // Default message
        previewsContainer: false, // Disable default preview container
        previewTemplate: '<div class="flex items-center"><img data-dz-thumbnail class="object-cover w-16 h-16 mr-2"><span data-dz-name></span></div>', // Custom preview template
        maxFiles: 5, // Example: Maximum 5 files allowed (can be adjusted as needed)
      });

      this.dropzone.on('addedfile', (file) => {
        if (this.allowMultiple) {
          if (!this.file) {
            this.file = [file];
          } else {
            this.file.push(file);
          }
        } else {
          this.file = file;
        }
      });
    },
    methods: {
      handleFileUpload() {
        const input = document.getElementById('file-upload');
        if (this.allowMultiple) {
          this.file = Array.from(input.files);
        } else {
          this.file = input.files[0];
        }
      },
      isImage(file) {
        return file.type.startsWith('image');
      },
    },
  };
  </script>

  <style scoped>
  /* Add Tailwind CSS classes or your custom styles here */
  </style>
