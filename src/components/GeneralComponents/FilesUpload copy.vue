<template>
    <div class="upload-box">
        <p>Upload your files</p>

        <div class="input-upload">
            <input
                type="file"
                name="file"
                ref="fileInput"
                hidden
                @change="uploadFile"
            />

            <div class="icon" @click="$refs.fileInput.click()">
                <img :src="`/images/icons/upload.svg`" />
            </div>

            <p>Browse File to Upload</p>
        </div>

        <section class="loading-area" v-if="showProgress">
            <li class="row_upload" v-for="(file, index) in files">
                <i class="fas fa-file-alt"></i>

                <div class="content">
                    <div class="details">
                        <span class="name">{{ file.name }}</span>
                        <span class="percent">{{ file.loading }}</span>
                    </div>

                    <div class="loading-bar">
                        <div
                            class="loading"
                            :style="{ width: file.loading + '%' }"
                        ></div>
                    </div>
                </div>
            </li>
        </section>

        <section class="uploaded-area">
            <li class="row_upload" v-for="(file, index) in uploadFiles">
                <div class="content upload">
                    <i class="fas fa-file-alt" aria-hidden="true"></i>
                    <div class="details">
                        <span class="name">{{ file.name }}</span>
                        <span class="percent">{{ file.size }}</span>
                    </div>
                </div>
                <i class="fas fa-check" aria-hidden="true"></i>
            </li>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            uploadFiles: [],
            showProgress: false,
        };
    },

    methods: {
        uploadFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const fileName =
                file.name.length > 12
                    ? file.name.substring(0, 13) +
                      "...  ." +
                      file.name.split(".")[1]
                    : file.name;
            const formData = new FormData();
            formData.append("file", file);
            this.files.push({ name: fileName, loading: 0 });
            this.showProgress = true;

            axios
                .post("/admin/Settings/media", formData, {
                    onUploadProgress: (progressEvent) => {
                        this.files[this.files.length - 1].loading = Math.floor(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );

                        if (progressEvent.loaded == progressEvent.total) {
                            const fileSize =
                                progressEvent.total < 1024
                                    ? progressEvent.total + " KB"
                                    : (
                                          progressEvent.loaded /
                                          (1024 * 1024)
                                      ).toFixed(2) + " MB";

                            this.uploadFiles.push({
                                name: fileName,
                                size: fileSize,
                            });
                            this.files = [];
                            this.showProgress = false;
                        }
                    },
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>

<style scoped>
.upload-box > p {
    text-align: center;
    font-weight: 500;
    margin-top: 10px;
}
img {
    width: 100%;
}

.icon {
    width: 90px;
    height: 90px;
    background: green;
}

.upload-box {
    width: 100%;
    background: #fff;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 7px 7px 12px rgba(0, 0, 0, 0.05);
}

.upload-box .input-upload {
    height: 170px;
    display: flex;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 5px;
    border: 2px dashed #29ba2a;
}

.input-upload :where(i, p) {
    color: #29ba2a;
}

.input-upload i {
    font-size: 50px;
}

.input-upload p {
    margin-top: 15px;
    font-size: 16px;
}

section .row_upload {
    margin-bottom: 10px;
    background: #d0ffd3;
    list-style: none;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

section .row_upload i {
    color: #1aaa4c;
    font-size: 30px;
}

section .details span {
    font-size: 12px;
}

.loading-area .row_upload .content {
    width: 100%;
    margin-left: 15px;
}

.loading-area .details {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    justify-content: space-between;
}
.loading-area .content .loading-bar {
    height: 6px;
    width: 100%;
    margin-bottom: 4px;
    background: #fff;
    border-radius: 30px;
}

.content .loading-bar .loading {
    height: 100%;
    width: 20%;
    background: #1aaa4c;
    border-radius: inherit;
}

.uploaded-area {
    max-height: 232px;
    overflow-y: scroll;
}

.uploaded-area.onprogress {
    max-height: 150px;
}

.uploaded-area::-webkit-scrollbar {
    width: 0px;
}

.uploaded-area .row_upload .content {
    display: flex;
    align-items: center;
}

.uploaded-area .row_upload .details {
    display: flex;
    margin-left: 15px;
    flex-direction: column;
}

.uploaded-area .row_upload .details .size {
    color: #404040;
    font-size: 11px;
}

.uploaded-area i.fa-check {
    font-size: 16px;
}
</style>
