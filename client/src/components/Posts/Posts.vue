<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="posts">
      <v-flex xs12 sm4 v-for="post in posts" :key="post._id">
        <v-card hover>
          <v-card-media :src="post.ruta" height="30vh" lazy @click.native="goToPost(post._id)"></v-card-media>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.nombre }}</div>
                <span class="grey--text">{{ post.likes }} likes - {{ post.nombre }} comentarios</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
          </v-card-actions>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
            <img :src="post.ruta" height="30" />
            <span class="grey--text ml-2">{{ post.UserId }}</span>
            <!-- <span class="grey--text">{{post.createdDate}}</span> -->
            <v-spacer></v-spacer>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout >
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="primary">Cargar más</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Posts",
  created() {
    this.handleHomePosts();
  },

  computed: {
    posts() {
      return this.$store.getters.posts;
    },
    users() {
      return this.$store.getters.user;
    }
  },
  methods: {
    handleHomePosts() {
      // traer el metodo desde el archivo store
      this.$store.dispatch("getPosts");
      this.$store.dispatch("getCurrentUser");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>
