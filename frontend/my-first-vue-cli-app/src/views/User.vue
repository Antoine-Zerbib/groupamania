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
        <div class="user-info__block">
          <p class="user-info__block__title mb-0">Email</p>
          <p class="user-info__block__output">
            <small>{{user.email}}</small>
          </p>
        </div>
        <div class="user-info__block">
          <p class="user-info__block__title mb-0">Username</p>
          <p class="user-info__block__output">
            <small>{{user.username}}</small>
          </p>
        </div>
        <button
          type="button"
          class="btn btn-danger white d-block mx-auto mt-5 mb-2"
          @click="deleteAccount"
        >Delete account</button>
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
      changePwd: {
        newPassword: null,
        RepeatNewPassword: null
      }
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
    
    testInputs() {
      //8 caractères dont au minimum une majuscule, une minuscule, un caractère numérique et un caractère spécial
      const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
      let inputNewPwd = document.getElementById("InputNewPassword");
      let inputRepeatNewPwd = document.getElementById("RepeatInputNewPassword");
      inputNewPwd.addEventListener("input", function(e) {
        let value = e.target.value;
        let testValue = regexPassword.test(value);
        if (testValue) {
          inputNewPwd.style.backgroundColor = "#4CAF50";
        } else {
          inputNewPwd.style.backgroundColor = "#f44336";
        }
      });
      inputRepeatNewPwd.addEventListener("input", function() {
        if (
          inputRepeatNewPwd.value == inputNewPwd.value &&
          regexPassword.test(inputRepeatNewPwd.value)
        ) {
          inputRepeatNewPwd.style.backgroundColor = "#4CAF50";
        } else {
          inputRepeatNewPwd.style.backgroundColor = "#f44336";
        }
      });
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfos");
  }
};
</script>

<style lang="scss">
</style>