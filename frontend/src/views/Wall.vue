<template>
    <div id="wall" class="wall">
        <CreatePost />
        <Post v-for="post in allPosts" v-bind:key="post.id" :post="post" @infosPost="setInfos" />
        <modalBoxModerate :post="post" />
    </div>
</template>

<script>
import axios from "axios";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import modalBoxModerate from "../components/ModifPost";


export default {
    name: "Mur",
    components: {
        CreatePost,
        Post,
        modalBoxModerate
    },
    data() {
        return {
            post: {
                id: "",
                content: "",
                image: ""
            },
            allPosts: []
        };
    },
    methods: {
        setInfos(payload) {
            this.post = payload.post;
        }
    },
    mounted() {  
        axios
        .get("http://localhost:3000/api/message/", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
                
            }
        })
        //.get("http://localhost:3000/api/post",this.$store.state.headerParams)
        .then(response => {
            console.log("post", response.data);
            this.allPosts = response.data;
        })
        .catch(error => {

            //n'affiche pas le message 'normalement' envoyé par le back
            console.log("vous n'êtes pas connecté, erreur d'abscence de token : " + error); 
        }),
        
        // appel de la méthode pour remplir le vuex.store
        this.$store.dispatch("getUserInfos");
    }
};
</script>

<style lang="scss">
.wall {
    background-color: white;
    min-height: 100%;
    padding: 5rem 0 2rem 0;
}
.block-post {
    background-color: white;
    width: 75%;
    margin: auto;
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.25);
    border-radius: 0.25rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
    & h3 {
        color: grey;
        margin: 0.25rem 0;
        font-size: 0.75rem;
    }
    & .like-section {
            & div {
                display: inline-block;
                margin: 0 0.5rem;
                & i {
                        margin: 0 0.2rem;
                }
                & a {
                        text-decoration: none;
                        color: grey;
                }
            }
            font-weight: 700;
            color: grey;
    }
}
</style>