<template>
  <v-app dark>
    <v-app-bar
      app
      color="grey darken-4"
      dark
      dense
    >
      <div class="d-flex align-center">
        
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/Codenert/split-excel-column-data"
        target="_blank"
        text
      >
        <span class="mr-2">View Code</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content dark>
      <div class="py-2"></div>

      <Home/>
      <div class="py-8"></div>
    </v-content>
    <v-footer
    dark
      fixed
      class="font-weight-medium"
    >
      <v-col
        class="text-center"

        cols="12"
      >
        &copy; {{ new Date().getFullYear() }} — <strong>Developed by West Auckland Copy Shop</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Home from './components/Home';

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
