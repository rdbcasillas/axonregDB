<template>
  <div>
    <b-container>
      <b-row>
        <b>
          To define functional enhancers in forebrain across murine development, we ran the package Activity by contact model (ABC) developed by the Broad Institute on forebrain RNA-Seq and ATAC-Seq datasets from ENCODE consortia.
          For annotated functional enhancers, chromatin accessibility was quantified by counting reads present in enhancer regions using the tool - FeatureCounts
        </b>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <b-form-select v-model="selected" :options="options" @change="loadGenes(selected)"></b-form-select>
        </b-col>
        <b-col>
          <autocomplete :items="this.allgenes" @finished="finished" />
          <!-- <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" /> -->
        </b-col>
      </b-row>
      <br />
      <!-- <b-row>
                <b-table striped hover :items="filteredData"></b-table>
      </b-row>-->
      <b-row>
        <b-col v-if="flag">
            <b-button variant="outline-info" @click="isChip=!isChip;getChart()" > Show {{ state }} data
                <b-img src="./images/histone.png" fluid alt="Responsive image"></b-img>
            </b-button> 
        </b-col>
      </b-row>
      <!-- <b-row>
        <b-col>
          <h5
            v-if="flag"
            align="center"
          >Accessibility across {{ count }} Enhancer regions for {{genename}} at {{ selected }}:</h5>
        </b-col>
      </b-row> -->
      <b-row>
        <b-col cols="4" v-for="(item,index) in devArray" :key="index">
          <LineChart
            v-if="flag"
            :labeldata="sampleLabels"
            :expressData="item"
            :genename="genename"
            :ylabel="ylabel"
            :title="titleArray[index]"
            :key="compKey"
            :color="chartColor"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as _ from "lodash";
import * as d3 from "d3";
import Autocomplete from "./Autocomplete.vue";
import LineChart from "./charts/enhancerChart.vue";
export default {
  name: "Enhancer",
  components: {
    LineChart,
    Autocomplete
  },
  data: function() {
    return {
      selected: null,
      allgenes: [],
      options: [
        { value: null, text: "Please select an age" },
        { value: "E11", text: "E11" },
        { value: "E12", text: "E12" },
        { value: "E13", text: "E13" },
        { value: "E14", text: "E14" },
        { value: "E16", text: "E16" },
        { value: "P0", text: "P0" }
      ],
      genename: "",
      enhancerData: {
        E11: {
            atac: [],
            chip: []
            },
        E12: {
            atac: [],
            chip: []
            },
        E13: {
            atac: [],
            chip: []
            },
        E14: {
            atac: [],
            chip: []
            },
        E16: {
            atac: [],
            chip: []
            },
        P0: {
            atac: [],
            chip: []
            },
      },
      filteredData: [],
      devArray: [],
      sampleLabels: [],
      ylabel: "ylabel",
      flag: false,
      compKey: 0,
      titleArray: [],
      count: 0,
      isChip:false,
      state: 'Chip',
      chartColor: 'steelblue'
    };
  },
  computed: {
    itemsHead() {
      return this.devArray ? this.devArray.slice(0, 3) : [];
    },
    itemsTail() {
      return this.devArray ? this.devArray.slice(3) : [];
    }
  },
  methods: {
    finished(value) {
      this.genename = value;
      this.getChart();
    },
    async loadGenes() {
      let url = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/${this.selected}_enhancers_genes_devFC.tsv`
      let url2= `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/${this.selected}_enhancers_chip_genes_devFC.tsv`
      
      this.enhancerData[this.selected]['atac'] = await d3.tsv(url);
      this.enhancerData[this.selected]['chip'] = await d3.tsv(url2);
      this.allgenes = _.uniq(
        _.map(this.enhancerData[this.selected]['atac'], "TargetGene")
      );
    },
    getChart() {
      this.flag = true;
      this.compKey += 1;
      let temparr = [];
      let titlearr = [];
      let currName = this.genename;
      let currData = []
      if (this.isChip){
        this.state = 'ATAC'
        currData = this.enhancerData[this.selected]['chip']
        this.chartColor = "#FF6600"
      }
      else {
        this.state = 'Chip'
        currData = this.enhancerData[this.selected]['atac']
        this.chartColor = "steelblue"
      }
      this.filteredData = _.filter(currData, function(
        o
      ) {
        return o["TargetGene"] == currName;
      });
      this.sampleLabels = _.keys(this.filteredData[0]).slice(4);
      console.log(currData,currName)
      this.filteredData.forEach(obj => {
        titlearr.push(obj.chr + ":  " + obj.start + "-" + obj.stop);
      });
      this.count = titlearr.length;

      this.filteredData.forEach(function(item) {
        let tmpval = _.values(item).slice(4);
        temparr.push(_.map(tmpval, _.ary(parseInt, 1)));
      });
      this.titleArray = titlearr;
      this.devArray = temparr;
      console.log(this.titleArray);
      this.ylabel = "Accessibility";
    },
  },
  created() {
    //this.fetchData();
  }
};
</script>

<style lang="css" scoped>
img {
    width: 25px;
    height: 25px;
}
</style>