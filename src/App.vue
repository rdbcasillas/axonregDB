<template>
  <div id="app">
    <Header></Header>
    <router-view :key="$route.path"></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import * as d3 from "d3";

//import MultiLine from "./components/MultiLine.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Home from "./components/Home.vue";
import * as _ from "lodash";

export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
  // data: function() {
  //   return {
  //     loadData: [],
  //     exprData: [],
  //     fcdata:[],
  //     labels:[]
  //   };
  // },
  mounted() {
    console.log("App loaded");
  },
  methods: {},
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.float-left {
  position: absolute;
}
</style>
