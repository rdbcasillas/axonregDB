<template>
  <div id="app">
    <!-- <MultiLine/> -->
    <!-- <Loader :expressionData=exprData :fcData=fcdata /> -->
    <router-view></router-view>
  </div>
</template>

<script>
import * as d3 from "d3";

import MultiLine from "./components/MultiLine.vue";
import Loader from "./components/Loader.vue";
import Home from "./components/Home.vue"
import * as _ from "lodash";

export default {
  name: "app",
  components: {
  //  Home,
   // Loader
  },
  data: function() {
    return {
      loadData: [],
      exprData: [],
      fcdata:[],
      labels:[]
    };
  },
  mounted() {
    console.log("App loaded");
  },
  methods: {
  }
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
</style>
