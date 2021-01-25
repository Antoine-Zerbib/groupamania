import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: 'Nc',
      userId: 'Nc',
      email: 'Nc',
      token: null,
      isAdmin: false
    },
    editOption: ""
  },

  getters: {},
  
  mutations: {
   
    saveUserInfos(state, [username, userId, email, isAdmin]) {
        state.user.username = username,
          state.user.userId = userId,
          state.user.email = email,
          state.user.token = localStorage.getItem('token'),
          state.user.isAdmin = isAdmin
    },
    editStyle(state, value) {
      state.editOption = value
    }
  },
  actions: {
    getUserInfos(context) {
      axios
        .get("http://localhost:3000/api/user/me",{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
        .then(response => {
          console.log('réponse API',response.data);

          //la mutation marque des erreurs avec les [0] mais ça marche ... ???
          context.commit('saveUserInfos',[response.data.[0].username, response.data.[0].id, response.data.[0].email, response.data.[0].isAdmin])
        })
        .catch(error => {
          console.log('Erreur auth', error); //affiche pas le message 'normalement' envoyé par le back
        });
    },
    changeEditStyle(context, value){
      context.commit('editStyle',value)
    }
  },
  modules: {
  }
})