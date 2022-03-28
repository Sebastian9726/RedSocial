<template>
  <v-container fluid text-md-center>
    <!-- alerta de error -->
    <v-layout row wrap v-if="error">
      <v-flex xs12 sm8 offset-sm2>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- formulario -->
    <v-layout row wrpa mt-3>
      <v-flex xs12 sm8 offset-sm2>
        <v-card color="accent" dark>
          <v-container>
            <v-form v-model="isValidForm" lazy-validation ref="form" @submit.prevent="handleSigninUser">

              <v-layout row mt-3>
                <v-flex xs12>
                   <v-text-field :rules="emailRules" prepend-icon="email" label="Correo" type="email" v-model="email"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" prepend-icon="vpn_key" label="Contraseña" type="password" v-model="password"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-3>
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isValidForm || loading" color="primary" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>loop</v-icon>
                    </span>
                    Ingresar
                  </v-btn>
                  <p class="mt-2">¿No tienes cuenta?
                    <router-link to="/signup">Regístrate</router-link>
                  </p>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      isValidForm: true,
      email: "",
      password: "",
      // Validación de campos de formulario
      emailRules: [
        email => !!email || "Completa este campo",
        email => /.@+./.test(email) || "Ingresa un correo válido"
      ],
      passwordRules: [
        password => !!password || "Completa este campo",
        password =>
          password.length > 5 || "La contraseña debe tener más de 5 caracteres"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "user", "error"])
  },
  watch: {
    user(value) {
      // Si el value de user cambia, redirecciona al home page
      if (value) {
        console.log("console log singin")
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSigninUser() {
      // Si no se validan los campos del formulario, no se realiza la petición signinUser
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          mail: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>