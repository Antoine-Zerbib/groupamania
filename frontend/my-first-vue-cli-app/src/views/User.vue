<template>
  <main class="main">
    <div class="row p-2">
      <div class="col-12">
        <h1>
          <i class="fas fa-cog"></i>Paramètres du compte
        </h1>
        <hr />
      </div>
    </div>
    <section class="row user-info pl-5 pr-5">
      <div class="col-12">
        <h2>
          <u>Informations de l'utilisateur</u>
        </h2>
        <br><br>
        <div class="user-info__block">
          <p class="user-info__block__title mb-0">Username</p>
          <p class="user-info__block__output">
            <small>{{user.username}}</small>
          </p>
        </div>
        <br>
       
        <button
          type="button"
          class="btn btn-danger white d-block mx-auto mt-5 mb-2"
          @click="deleteAccount"
        >Delete account</button>
      </div> 
      <div class="user-info__block mx-auto">
          <p class="user-info__block__title mb-0">Attention, cela engendrera la suppression de tous vos articles.</p>
        </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
// import { mapGetters } from "vuex";

export default {
  name: "User",
  data() {
    return {
      retourAPI: "",
    };
  },
  computed: {
    ...mapState(["user"])
    //...mapGetters(["user"])
  },
  methods: {
    deleteAccount() {
      axios
        .delete("http://localhost:3000/api/user/me", {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
        .then(() => {
          localStorage.clear();
          location.replace(location.origin+'/#/signup');
        })
        .catch(error => console.log(error));
    },
  },
  mounted() {
    this.$store.dispatch("getUserInfos");
  }
};
</script>

<style lang="scss">
</style>