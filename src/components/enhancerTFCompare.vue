<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-form-group id="checkbox-group-1">
            <!-- <b-form-checkbox v-model="selections" v-for="option in chartoptions" :value="option.value" :key="option.value" :class="option.value" switch>
             {{ option.text }}
            </b-form-checkbox>-->
            <b-form-checkbox-group v-model="selections" :options="ageoptions"></b-form-checkbox-group>
          </b-form-group>
        </b-col>
        <b-col>
          <autocomplete
            :items="this.allgenes"
            @finished="finished"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="progressflag">
          <p>Fetching enhancer data ..</p>
          <b-img class="dnagif" src="./dnagif.gif"></b-img>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="10">
          <div id="vizdiv"></div>
        </b-col>
        <b-col v-if="vizactive">
          <p>
            Click on a chord to display the list of TFs
          </p>
          <div id="tflist">
            <ul class="list-group ul">
            </ul>
          </div> 
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as _ from "lodash";
import * as d3 from "d3";
import Autocomplete from "./Autocomplete.vue";
import * as multichord from "../assets/scripts/multichord.js";
import * as mycolors from "../assets/scripts/colors2.js";
import "bootstrap/js/dist/tooltip.js";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/js/dist/popover.js"
export default {
  name: "enhancerTFCompare",
  components: {
    Autocomplete,
  },
  data: function () {
    return {
      progressflag: false,
      vizactive:false,
      genename: "",
      plotdisable: true,
      selections: [],
      allgenes: [],
      filteredlist: [],
      ageoptions: [
        { value: "E11", text: "E11" },
        { value: "E12", text: "E12" },
        { value: "E13", text: "E13" },
        { value: "E14", text: "E14" },
        { value: "E16", text: "E16" },
        { value: "P0", text: "P0" },
        { value: "Adult", text: "Adult" },
      ],
      disgenes: {},
      totalcolumns: [],
      width: 700,
      height: 700,
      circosdata: [],
      padding: 0.1,
      url:'',
      currAge:'',
      mainObj: {}
    };
  },
  methods: {
    finished(value) {
      this.genename = value;
      //this.getChart();
      //console.log(this.$refs)
      this.createMainObj();

    },
    createMainObj(){
      let currentGene = this.genename;
      let ageTFObj = {}
      _.map(this.mainObj, function(value,key){
        let filteredlist = _.filter(value,{
          genename: currentGene,
        })
        let tmparr = []
        filteredlist.map((obj) => {
          tmparr.push(obj.tflist.split(","));
        });
        let newtmparr = _.uniq(_.flatten(tmparr))
        ageTFObj[key] = newtmparr;
      })
      this.disgenes = ageTFObj;
      this.totalcolumns = _.keys(this.disgenes)
      this.drawChord(this.disgenes);
    },
    createData(rgdgenes, columns) {
      let mysetObj = {};
      mysetObj = rgdgenes;
      let allkeys = _.keys(mysetObj);
      let myobjlen = allkeys.length;
      let powerset = (arr) => {
        if (arr.length == 0) return [[]];
        else {
          let e = arr[0];
          let T = arr.slice(1);
          return powerset(T).concat(powerset(T).map((X) => X.concat([e])));
        }
      };
      let keyIndexObj = {};
      let keyLengthObj = {};
      for (let key in allkeys) {
        keyIndexObj[key] = allkeys[key];
        keyLengthObj[key] = mysetObj[allkeys[key]].length;
      }
      let keyIndexArr = _.keys(keyIndexObj);
      let myarr = keyIndexArr;
      //let myarr = allkeys;
      let mykeys = powerset(myarr)
        .filter((xs) => xs.length >= 1) // filter out combinations of 0 length.
        .map((xs) => xs.join("_"));

      let column_permutations = powerset(columns)
        .filter((xs) => xs.length >= 1) // filter out combinations of 0 length.
        .map((xs) => xs.join("_"));
      let myobj = {};
      let myobj_genes = {};
      let intersectArrOfArr = _.spread(_.intersection);
      let brilset = (arrIntersect) => {
        let set = [];
        for (let i in arrIntersect) {
          let newkey = keyIndexObj[arrIntersect[i]];
          set.push(mysetObj[newkey]);
        }
        return set;
      };
      for (let key of mykeys) {
        myobj[key] = intersectArrOfArr(brilset(key.split("_"))).length;
        myobj_genes[key] = intersectArrOfArr(brilset(key.split("_")));
      }

      // if (counter === 0) {
      //   colorChordScale.domain(column_permutations);
      // }
      // counter += 1;
      let myobj_keys = _.keys(myobj);
      let connections = [];
      for (let key in myobj_keys) {
        let tinyarr = myobj_keys[key].split("_");
        let grouparr = [];
        for (let i in tinyarr) {
          let tmpobj = {};
          tmpobj.group = parseInt(tinyarr[i]);
          tmpobj.value = myobj[myobj_keys[key]];
          grouparr.push(tmpobj);
        }
        connections.push(grouparr);
      }

      let uniqarr = [];
      for (let i in allkeys) {
        let key = allkeys[i];
        let currarr = [mysetObj[key]];
        let tmpObj = _.omit(mysetObj, key);
        let restkeys = _.keys(tmpObj);
        let restarr = [];
        for (let k in restkeys) {
          restarr.push(mysetObj[restkeys[k]]);
        }
        let fullarr = currarr.concat(restarr);
        let curruniqset = _.difference.apply(_, fullarr);
        uniqarr.push(curruniqset);
      }
      let dataObj = {
        connections: connections,
        labels: keyIndexObj,
        genecount: keyLengthObj,
        genelist: myobj_genes,
        uniqgenes: uniqarr,
        genecountObj: myobj,
      };
      let testdata = [dataObj];
      return testdata;
    },
    async fetchData() {
      //let genelistUrl = "./datasets/enhancers/footprints/${this.selected}-mega2.tsv";
      let genelistUrl = "./datasets/enhancers/footprints/allgeneslist.txt";
      let genelist = await d3.tsv(genelistUrl);
      this.allgenes = _.map(genelist, "genename");
      //this.circosdata = this.createData(this.disgenes, this.totalcolumns);
      this.setupChart();
    },
    async loadData() {
      this.progressflag = true;
      this.tfdata1 = await d3.tsv(this.url);
      if (!(this.currAge in this.mainObj)) {
        this.mainObj[this.currAge] = this.tfdata1
      }
      this.progressflag = false;
    },
    setupChart() {
      d3.select("#vizdiv")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "mainviz");

      this.mainGroup = d3
        .select(".mainviz")
        .append("g")
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 2 + ")"
        );
      //let colorSet = mycolors.colorPalette();
    },
    getDefaultLayout() {
      return multichord
        .chord2()
        .sortChords(d3.ascending)
        .sortSubgroups(d3.ascending)
        .width(this.width)
        .height(this.height)
        .padding(this.padding);
    },
    drawChord(newdata) {
      //if (!updatecategory){
      this.vizactive = true;
      this.newgeneObject = this.createData(newdata, this.totalcolumns);
      console.log(this.newgeneObject)
      //newdata = newgeneObject;
      // }
      let chart = this.getDefaultLayout();
      this.mainGroup.data(this.newgeneObject).attr("class", "mainGroup").call(chart);
    },
  },
  created() {
    this.fetchData();
  },
  watch: {
    selections: function () {
      let removable = _.difference(this.oldselections, this.selections);
      if (removable.length > 0) {
        this.mainObj = _.omit(this.mainObj, removable)
        this.createMainObj();
      }
      else {
        let currselect = this.selections;
        let lastelement = currselect[currselect.length - 1]
        this.currAge = lastelement;
        this.url  = `./datasets/enhancers/footprints/${lastelement}-enhancers-ABC-TOBIAS-mega2.tsv`
        if (this.vizactive) {
          this.loadData();
          d3.tsv(this.url).then((response)=>{
          this.createMainObj() 
          });
          //this.createMainObj();
          //this.drawChord(this.disgenes);
          this.oldselections = currselect;
        }
        else {
          this.loadData();
        }
      }

    },
  },
};
</script>

<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>