<template>
  <div>
    <b-container>
      <b-row v-if="$route.name == 'expression'">
        <b class="expdesc">
          Analyze temporal gene expression patterns across murine development
          in forebrain datasets from
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&status=released&assay_slims=Transcription&assay_title=polyA+plus+RNA-seq&award.project=ENCODE&assembly=mm10&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=forebrain"
          >ENCODE consortia</a>
        </b>
      </b-row>
      <b-row v-else>
        <b>
          Analyze temporal chromatin accessibility patterns across murine
          development in forebrain datasets from
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain"
          >ENCODE consortia</a>
          . FASTQ files from ENCODE were analyzed, bam files were merged and
          reads in promoter regions (1000 upstream, 500 downstream of TSS) were
          quantified using the tool - FeatureCounts to quantify chromatin
          accessibility in promoter regions.
        </b>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <autocomplete :items="this.allgenes" @finished="finished" type="multiple"></autocomplete>
        </b-col>
      </b-row>
      <br />
      <LineChart
        v-if="flag"
        :labeldata="sampleLabels"
        :expressData="exprData"
        :genename="genename"
        :ylabel="ylabel"
        :title="title"
        :datasets="datasets"
        :key="componentKey"
      />
    </b-container>
    <br />
    <br />
  </div>
</template>

<script>
import * as _ from "lodash";
import * as d3 from "d3";
import LineChart from "./charts/devExpression.vue";
import Autocomplete from "./Autocomplete.vue";
export default {
  name: "Loader",
  components: {
    LineChart,
    Autocomplete
  },
  props: ["plotType"],
  data: function() {
    return {
      genename: "",
      sampleLabels: [],
      geneObj: {},
      flag: false,
      componentKey: 0,
      geneData: [],
      ylabel: "",
      title: "",
      allgenes: [],
      geneArray: [],
      dataobject: {},
      datasets: []
    };
  },
  methods: {
    finished(value) {
      this.geneArray = _.uniq(value.split(","));
      this.genename = value;
      this.getChart();
    },
    getLabels() {
      this.sampleLabels = _.keys(this.geneData[0]).slice(1);
      let colors = d3.scaleOrdinal(d3.schemeCategory10);
      this.geneArray = _.uniq(this.geneArray);
      for (let item in this.geneArray) {
        this.geneObj = _.omit(
          _.find(this.geneData, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );
        this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
        this.dataobject = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData
        };
        console.log(this.datasets);
        this.datasets.push(this.dataobject);
        this.datasets = _.uniqBy(this.datasets, o => {
          return o.label;
        });
      }
    },
    getChart() {
      this.getLabels();
      this.componentKey += 1;
      this.flag = true;
    },
    async fetchData() {
      //fetch data based on URL
      let mypage = false;
      if (this.$route.name == "expression") {
        this.geneData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/rna/dev_fpkm.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "FPKM";
        this.title = "Expression Across Development";
      } else {
        this.geneData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "Feature Count";
        this.title = "Accessibility Across Development";
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.expdesc {
  margin-left: 65px;
}
</style>
