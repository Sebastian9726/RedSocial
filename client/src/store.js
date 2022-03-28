import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    searchResults: [],
    userPosts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      // actualiza el valor de posts
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    clearSearchResults: state => {
      state.searchResults = [];
    },
    setUser: (state, payload) => {
      console.log("state", "payload", state, payload)
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => {
      state.user = null;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
  },
  actions: {
    getUserPosts: ({ commit }, payload) => {
      commit("setLoading", true);
      let config = {
        headers: {
          'X-Auth-Token': localStorage.getItem('token')
        }
      }
      console.log("user", localStorage.getItem('userId'))
      Vue.axios.get("http://localhost:3000/api/images/user/" + localStorage.getItem('UserId'), config)
        .then(({ data }) => {
          console.log("user post", data)
          commit("setUserPosts", data);
        })
        .catch(error => {
          console.log(error);
        });
    },

    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      let config = {
        headers: {
          'X-Auth-Token': localStorage.getItem('token')
        }
      }
      Vue.axios.get("http://localhost:3000/api/user/" + localStorage.getItem('UserId'), config)
        .then((response) => {
          console.log("repues get post", response.data)
          commit("setLoading", false);
          // Agregar la data(estado) a 'user'
          commit("setUser", response.data);
        }).catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      let config = {
        headers: {
          'X-Auth-Token': localStorage.getItem('token')

        }
      }
      Vue.axios.get("http://localhost:3000/api/contenido", config).
        then((response) => {
          console.log("repues get post", response.data)
          // actualizar el estado. Obtiene la data en 'actions' y la pasa a 'state' a traves de mutaciones
          // Commit pasa la data a la mutacion
          commit("setPosts", response.data);
          commit("setLoading", false);
        }).catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    addPost: ({ commit }, payload) => {
      commit("setLoading", true);
      let config = {
        headers: {
          'X-Auth-Token': localStorage.getItem('token')
        }
      }
      Vue.axios.post("http://localhost:3000/api/images/create", payload)
        .then(({ data }) => {
          commit("setLoading", false);
          console.log(data.addPost);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPost = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPost);
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      let config = {
        headers: {
          'X-Auth-Token': localStorage.getItem('token')
        }
      }
      Vue.axios.delete("http://localhost:3000/api/images/delete/" + payload.postId, config)
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      Vue.axios.post("http://localhost:3000/api/auth", payload)
        .then((response) => {
          console.log("el token", response.data.token)
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('Nombre', response.data['user'].name);
          localStorage.setItem('Apellido', response.data['user'].surname);
          localStorage.setItem('UserId', response.data['user']._id);
          // Asegurar que el metodo created en main.js se ejecute
          // router.go -> recarga la pagina
          router.go();
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log("error", error);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      Vue.axios.post("http://localhost:3000/api/register", payload).
        then((response) => {
          console.log("respuesta", response)
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('Nombre', response.data['user'].name);
          localStorage.setItem('Apellido', response.data['user'].surname);
          localStorage.setItem('UserId', response.data['user']._id);
          // Asegurar que el metodo created en main.js se ejecute
          // router.go -> recarga la pagina
        }).catch(error => {
          console.log("error", error)
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    signoutUser: async ({ commit }) => {
      // limpiar estado de 'user'
      commit("clearUser");
      // Eliminar toke de localStorage
      localStorage.setItem("token", "");
      // Terminar la sesión
      await apolloClient.resetStore();
      // Redireccionar al home page
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    searchResults: state => state.searchResults,
    userPosts: state => state.userPosts,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError
  }
});
