<template>
    <div>
        <div class="block-post">
            <h3>Créer un article</h3>
            <form enctype="multipart/form-data" action="/create" method="post">
                <div class="input-group mb-3">
                    <label for="input_text">
                        Titre : ( Veuillez noter votre pseudonyme juste après le titre : " - by pseudo - " ) :
                    </label>
                    <br />
                    <input v-model="contentPost.title" class="input-text" id="input_text" type="text" />
                </div>
                <div class="input-group mb-3">
                    <label for="input_text">
                        Article : 
                    </label>
                    <br />
                    <input v-model="contentPost.content" class="input-text" id="input_titre" type="text" />
                </div>
                <div class="input-group mb-3">
                    
                    <div class="custom-file">
                        <input
                        name="inputFile"
                        type="file"
                        class="custom-file-input"
                        id="inputFile"
                        aria-describedby="inputFileAddon"
                        @change="onFileChange"
                        />
                        <label class="custom-file-label" for="inputFile">
                            Sélectionnez votre image
                        </label>
                    </div>
                </div>
                <input type="submit" class="btn btn-primary" @click.prevent="createPost" value="Publier votre article" />
                <span id='msgReturnAPI' class="mx-3 text-danger" v-if="user.token==null">
                    Veuillez vous connecter avec " Login "
                </span>
                <span id='msgReturnAPI' class="mx-3" v-else>{{msgError}}</span>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
    name: "CreatePost",
    data() {
        return {
        contentPost: {
            title:null,
            content: null,
            postImage: null
        },
    msgError: ""
    };
},
computed: {
    ...mapState(["user", "editOption"])
},
methods: {
    createPost() {
        const fd = new FormData();
        fd.append("image", this.contentPost.postImage);
        fd.append("title", this.contentPost.title);
        fd.append("content", this.contentPost.content);
        if (fd.get("image") == "null" && fd.get("content") == "null") {
            let msgReturn = document.getElementById('msgReturnAPI')
            msgReturn.classList.add('text-danger')
            this.msgError = "Rien à publier";
        } else {
            axios
            .post("http://localhost:3000/api/message/", fd,{
                headers: {
                    'Authorization': "Bearer " + window.localStorage.getItem("token")
                }
                })
                .then(response => {
                    if (response) {
                        window.location.reload();
                    }
                })
                .catch(error => (this.msgError = error));
            }
        },
        onFileChange(e) {
            this.contentPost.postImage = e.target.files[0] || e.dataTransfer.files;
        }
    }
};
</script>

<style>
.input-text {
    width: 100%;
}
</style>