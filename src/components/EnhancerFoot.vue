<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="2">
          <b-form-select v-model="selected" :options="options" @change="loadData(selected)"></b-form-select>
        </b-col>
        <b-col>
          <autocomplete :items="this.geneset" @finished="finished" type="single" />
        </b-col>
      </b-row>
      <b-row v-if="flag">
        <b-col>
          Filter TFs by
          <a href="https://github.com/loosolab/TOBIAS/">Motif Score</a>
          <vue-slider v-model="slidervalue" :max="maxrna"></vue-slider>
        </b-col>
        <b-col>
          <b-form-input
            type="text"
            v-model="tfhunter"
            placeholder="search for a TF"
            autocomplete="off"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-link @click="scrollTo('igvdiv')">See enhancers in IGV</b-link>
        </b-col>
      </b-row>
      <b-row v-if="flag">
        <b-col v-for="(enhancer,index) in filteredlist" :key="index">
          <b-button v-b-toggle="'collapse-' + index.toString()" variant="info" class="m-1">
            {{ enhancer.chr + ':' + enhancer.start + '-' + enhancer.stop
            + " (" + enhancer.ABCscore + ")" }}
            <sup v-if="index==0">
              <a
                v-b-tooltip.hover
                title="Value represents ABC score. Learn more here: 
                        https://github.com/broadinstitute/ABC-Enhancer-Gene-Prediction"
                class="suplink"
                href="https://github.com/broadinstitute/ABC-Enhancer-Gene-Prediction"
              >?</a>
            </sup>
          </b-button>

          <!-- Element to collapse -->
          <b-collapse visible :id="'collapse-' + index">
            <b-card>
              <b-list-group
                v-for="(item,index2) in enhancer.tflist.split(',')"
                :key="index2"
                class="mainpanel"
                flush
              >
                <b-list-group-item
                  v-if="parseInt(enhancer.motifscore.split(',')[index2])>=slidervalue[0] 
                                && parseInt(enhancer.motifscore.split(',')[index2])<=slidervalue[1] && filterTF(item)"
                  class="tflist"
                >
                  {{ item }}
                  <em>({{ enhancer.motifscore.split(',')[index2] }})</em>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>
      <a ref="igvdiv">
        <IGVTest
          :gene="this.genename"
          :type="this.$route.name"
          :age="this.selected"
          :loc="this.locarr"
          ref="igvComp"
        />
      </a>
    </b-container>
  </div>
</template>

<script>
import * as $ from "jquery";
import * as d3 from "d3";
import * as _ from "lodash";
import IGVTest from "./charts/IGVTest.vue";
import Autocomplete from "./Autocomplete.vue";
export default {
  name: "EnhancerFoot",
  components: {
    Autocomplete,
    IGVTest,
  },
  data: function () {
    return {
      genename: "",
      tfhunter: "",
      locarr: [],
      cardHeader: "",
      geneset: [],
      enhancerlist: [],
      filteredlist: [],
      //geneSet2 : [],
      selected: null,
      options: [
        { value: null, text: "Age" },
        { value: "E11", text: "E11" },
        { value: "E12", text: "E12" },
        { value: "E13", text: "E13" },
        { value: "E14", text: "E14" },
        { value: "E16", text: "E16" },
        { value: "P0", text: "P0" },
        { value: "Adult", text: "Adult" },
      ],
      flag: false,
      slidervalue: [4, 22],
      maxrna: 22,
      progressflag: false,
    };
  },
  methods: {
    finished(value) {
      this.genename = value;
      this.locarr = [];
      //this.getChart()
      //console.log(this.$refs)
      this.filteredlist = _.filter(this.enhancerlist, {
        genename: this.genename,
      });
      this.flag = true;
      console.log(this.filteredlist);

      this.filteredlist.forEach((enhancer) => {
        let location =
          enhancer.chr + ":" + enhancer.start + "-" + enhancer.stop;
        this.locarr.push(location);
      });
      this.callIGV();
    },
    scrollTo(refName) {
      let element = this.$refs[refName];
      let top = element.offsetTop;
      window.scrollTo(0, top);
    },
    callIGV() {
      this.$nextTick(function () {
        this.$refs.igvComp.loadBrowser(this.genename);
      });
    },
    filterTF(tfname) {
      let tfstr = this.tfhunter.toUpperCase();
      return tfname.includes(tfstr);
    },
    async loadData() {
      let genelistUrl = `./datasets/enhancers/footprints/${this.selected}-genelist.txt`;
      let genelist = await d3.tsv(genelistUrl);
      console.log(genelist);
      this.geneset = _.map(genelist, "genename");
      let enhancerDataUrl = `./datasets/enhancers/footprints/${this.selected}-enhancers-ABC-TOBIAS-mega2.tsv`;
      this.enhancerlist = await d3.tsv(enhancerDataUrl);
      console.log(this.enhancerlist);
    },
  },
};
</script>

<style scoped>
a.suplink {
  color: whitesmoke;
}
.tflist {
  font-size: 12px;
}
.m-1 {
  font-size: 11px;
  font-weight: bold;
}
</style>