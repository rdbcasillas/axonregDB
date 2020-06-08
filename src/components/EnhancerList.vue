<template>
  <div>
    <b-container>

      <b-row>
        <p>
        <b>To define functional enhancers across murine development, we ran the package <a href="https://github.com/broadinstitute/ABC-Enhancer-Gene-Prediction"> Activity By Contact model (ABC) </a> developed 
            by the Broad Institute on forebrain and frontal cortex (for Adult) 
            <a href="https://www.encodeproject.org/search/?type=Experiment&assay_term_name=RNA-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&status=released&assembly=mm10&assay_title=polyA+plus+RNA-seq&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=frontal+cortex"> RNA-Seq </a>, 
            <a href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&assembly=mm10&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=frontal+cortex"> ATAC-Seq </a> and 
            <a href="https://www.encodeproject.org/search/?type=Experiment&assay_title=Histone+ChIP-seq&assembly=mm10&target.label=H3K27ac&biosample_ontology.term_name=forebrain&target.label=H3K4me1"> ChIP-Seq </a> datasets from ENCODE consortia. For annotated functional enhancers, 
            chromatin accessibility and histone mark enrichment was quantified by counting reads present in enhancer regions using the tool <a href="http://bioinf.wehi.edu.au/featureCounts/"> FeatureCounts </a></b>
        </p>
      </b-row>
      <br />
      <b-col cols="12">
      <b-row>
        <b-col cols="2">
          <b-form-select v-model="selected" :options="options" @change="loadGenes(selected)"></b-form-select>
        </b-col>
        <b-col cols="3">
          <b-form-group 
            id="checkbox-group-1"
           >
           <b-form-checkbox v-model="selections" v-for="option in chartoptions" :value="option.value" :key="option.value" :class="option.value" switch>
             {{ option.text }}
           </b-form-checkbox>
           </b-form-group>

          </b-col>
          <b-col cols="6">
            <autocomplete :items="this.allgenes" @finished="finished" />
          </b-col>
        <b-col>
         <b-button v-if="flag" v-b-toggle.sidebar-1>Plot gene-expression/promoter-accessibility</b-button>
        </b-col>
      </b-row>
      </b-col>
      <br />
        <b-row>

          <b-col class="enhancerplot" cols="4" v-for="(item,index) in this.chartSets" :key="index">
            <h5 class="title">{{ titleArray[index] }}</h5>
            <LineChart
              v-if="flag"
              :labeldata="sampleLabels"
              :expressData="item"
              :genename="genename"
              :ylabel="ylabel"
              :title="titleArray[index]"
              :datasets="item"
              :key="compKey"
              :color="chartColor"
              :state="stateLabel"
            />
          </b-col>
          <b-col>
        </b-col>
        </b-row>
          <b-sidebar v-if="flag" 
          id="sidebar-1" 
          title="" right shadow>
           <b-form-group 
          v-if="flag"
          > 
            <b>Plot:</b>
            <b-form-checkbox
              v-for="option in chartoptions2"
              v-model="selections2"
              :value="option.value"
              :key=option.value
              :class=option.value
              switch
            >
            {{ option.text }} 
            </b-form-checkbox>
          </b-form-group>      
          <LineChart2
            v-if="rnaflag"
            :labeldata="altsampleLabels"
            :expressData="exprData"
            :genename="genename"
            :ylabel="rnaylabel"
            :title="rnatitle"
            :datasets="rnadataset"
          />
          <LineChart2
            v-if="atacflag"
            :labeldata="altsampleLabels"
            :expressData="atacData"
            :genename="genename"
            :ylabel="atacylabel"
            :title="atactitle"
            :datasets="atacdataset"
          />
          </b-sidebar> 
      <b-row>
            
      </b-row>
      <hr>
      <b-row v-if="flag">
        <b-col>
          <!-- <EnhancerIGV :age="selected"/> -->
          <IGVTest :gene="this.genename" :type="this.$route.name" :age="this.selected" ref="igvComp"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as _ from "lodash";
import * as d3 from "d3";
import Autocomplete from "./Autocomplete.vue";
//import EnhancerIGV from "./EnhancerIGV.vue";
import LineChart from "./charts/enhancerChart.vue";
import LineChart2 from "./charts/devExpression.vue";
import IGVTest from "./charts/IGVTest.vue";
export default {
  name: "Enhancer",
  components: {
    LineChart,
    LineChart2,
    Autocomplete,
    //EnhancerIGV,
    IGVTest
  },
  data: function() {
    return {
        selections: [], // Must be an array reference!
        selections2: [],
        chartoptions2: [
          { text: 'Gene Expression', value: 'expr' },
          { text: 'Promoter Accessibility', value: 'access' },
        ],
        chartoptions: [
          { text: 'Enhancer Accessibility', value: 'atac' },
          { text: 'H3K27ac Enrichment', value: 'h3k27ac' },
          { text: 'H3K4me1 Enrichment', value: 'h3k4me1' }
        ],
      selected: null,
      allgenes: [],
      options: [
        { value: null, text: "Age" },
        { value: "E11", text: "E11" },
        { value: "E12", text: "E12" },
        { value: "E13", text: "E13" },
        { value: "E14", text: "E14" },
        { value: "E16", text: "E16" },
        { value: "P0", text: "P0" },
        { value: "Adult", text: "Adult" }
      ],
      genename: "",
      enhancerData: {
        E11: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        E12: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        E13: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        E14: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        E16: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        P0: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        },
        Adult: {
          atac: [],
          h3k27ac: [],
          h3k4me1: []
        }
      },
      filteredData: [],
      devArray: [],
      sampleLabels: [],
      altsampleLabels: [],
      geneObj: {},
      geneObj2: {},
      exprData: [],
      atacData: [],
      ylabel: "ylabel",
      flag: false,
      rnaflag: false,
      atacflag: false,
      compKey: 0,
      titleArray: [],
      count: 0,
      isChip: false,
      state: "Histone Enrichment",
      stateLabel: "ATAC",
      chartColor: "steelblue",
      chartGroup: [],
      filteredChartGroup: [],
      chartSets : [],
      rnadataset: [],
      atacdataset: [],
      rnatitle: 'Expression Across Age',
      rnaylabel: 'FPKM value',
      atactitle: 'Chromatin Accessibility Across Age',
      atacylabel: 'Accessibility at Promoter'
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
      //console.log(this.$refs)
    },
    async loadGenes() {
      let url = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/${this.selected}_enhancers_genes_devFC.tsv`;
      let url2 = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/${this.selected}_enhancers_chip_genes_devFC.tsv`;
      let url3 = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/${this.selected}_enhancers_h3k4me1_genes_devFC.tsv`;

      this.enhancerData[this.selected]["atac"] = await d3.tsv(url);
      this.enhancerData[this.selected]["h3k27ac"] = await d3.tsv(url2);
      this.enhancerData[this.selected]["h3k4me1"] = await d3.tsv(url3);
      console.log(this.enhancerData[this.selected]);
      this.allgenes = _.uniq(
        _.map(this.enhancerData[this.selected]["atac"], "TargetGene")
      );
    },
    getChart() {
      this.cleanSlate();
      this.flag = true;
      this.compKey += 1;
      let temparr = [];
      let titlearr = [];
      let currName = this.genename;
      let currData = [];
      if (this.isChip) {
        this.stateLabel = "Chip";
        this.state = "Accessibility";
        currData = this.enhancerData[this.selected]["h3k27ac"];
        this.chartColor = "#FF6600";
      } else {
        this.stateLabel = "ATAC";
        this.state = "Histone Enrichment";
        currData = this.enhancerData[this.selected]["atac"];
        this.chartColor = "steelblue";
      }


      this.geneObj = _.omit(
          _.find(this.rnaData, { external_gene_name: this.genename }),
          "external_gene_name"
        );
      this.geneObj2 = _.omit(
          _.find(this.accessData, { external_gene_name: this.genename }),
          "external_gene_name"
        );
      this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
      this.atacData = _.map(_.values(this.geneObj2), _.ary(parseInt, 1));

      console.log(this.exprData)


      let rnaobject = {
          label: this.genename,
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: 'maroon',
          borderColor: 'maroon',
          data: this.exprData
        };

      let atacobject = {
          label: this.genename,
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: 'turquoise',
          borderColor: 'turquoise',
          data: this.atacData
        };
      
      this.rnadataset.push(rnaobject);
      this.atacdataset.push(atacobject);

      this.selections.forEach(obj=>{
          this.chartGroup.push(this.enhancerData[this.selected][obj])
      })

      this.chartGroup.forEach(obj=>{
          let filtdata = _.filter(obj,function(o){
              return o["TargetGene"] == currName;
          })
          this.filteredChartGroup.push(filtdata);
      })
      //console.log(this.filteredChartGroup);
    let myobj = {};
    let encount = [];  
    this.filteredChartGroup.forEach((item,index)=>{
        let currarray = []
        item.forEach(o=>{
            let tmpval = _.values(o).slice(4);
            currarray.push(_.map(tmpval, _.ary(parseInt, 1)));
        })
        myobj[this.selections[index]]  = currarray;
        encount = currarray.length
    })
    let colorObj = {
        'atac':'steelblue',
        'h3k27ac':'orange',
        'h3k4me1': 'green'
    }
    console.log(myobj)
    let tmpselections = this.selections;
    console.log(tmpselections);
    for (let index=0; index < encount; index++) {
        let datasets = []
        for (let i in tmpselections) {
            let dataobject = {
                label: tmpselections[i],
                pointBackgroundColor: "white",
                borderWidth: 2,
                fill: false,
                pointBorderColor: colorObj[tmpselections[i]],
                borderColor: colorObj[tmpselections[i]],
                data: myobj[tmpselections[i]][index]
            }; 
            datasets.push(dataobject)
        }
        this.chartSets.push(datasets); 
    }

      this.filteredData = _.filter(currData, function(o) {
        return o["TargetGene"] == currName;
      });
      this.sampleLabels = _.keys(this.filteredData[0]).slice(4);
      //console.log(currData, currName);
      this.filteredData.forEach(obj => {
        titlearr.push(obj.chr + ":" + obj.start + "-" + obj.stop);
      });
      this.count = titlearr.length;

      this.filteredData.forEach(function(item) {
        let tmpval = _.values(item).slice(4);
        temparr.push(_.map(tmpval, _.ary(parseInt, 1)));
      });
      this.titleArray = titlearr;
      this.devArray = temparr;
      //console.log(this.titleArray);
      this.ylabel = "Normalized Feature Count";

//      this.$refs.igvComp.loadBrowser();
      this.callIGV();
    },
    callIGV(){
      this.$nextTick(function () {
        this.$refs.igvComp.loadBrowser(this.genename);
        //this.$refs.igvComp.loadBrowser();
      })
    },
    cleanSlate() {
        this.chartSets = [];
        this.chartGroup = [];
        this.filteredChartGroup = [];
        this.rnadataset = [];
        this.atacdataset = [];
    },
    async fetchData() {
        this.rnaData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/rna/dev_fpkm.tsv"
        );

        this.accessData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms.tsv"
        );

        this.altsampleLabels = _.keys(this.rnaData[0]).slice(1);
    }

  },
  created() {
    this.fetchData();
  },
  mounted() {

  },
  watch: {
      'selections': function(){
          console.log(this.selections);
          if (this.genename != ''){
              this.getChart();
          }
      },
      'selections2': function(){
          if (_.includes(this.selections2, 'expr')) {
            this.rnaflag = true;
          }
          else {
            this.rnaflag = false;
          }
          if (_.includes(this.selections2, 'access')) {
            this.atacflag = true;
          }
          else {
            this.atacflag = false;
          }
          console.log(this.selections2);
      }
  }
};
</script>

<style lang="css" scoped>
img {
  width: 20px;
  height: 20px;
}
b-form-group {
  font-weight: bold;
}
.h3k27ac {
  margin-left: -7px;
}
.access {
  margin-left: 38px;
}
.enhancerplot {
  border: 0.5px solid darkcyan;
  padding: 5px;
  margin: 0 0px 0 0px
}
.title {
  color: darkcyan
}
</style>