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
      <b-row v-else-if="$route.name == 'featurecount'">
        <b>
          Analyze temporal chromatin accessibility patterns across murine
          development in forebrain datasets from
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain"
          >ENCODE consortia</a>
          . FASTQ files from ENCODE were analyzed, bam files were merged and
          reads in promoter regions (1000 upstream, 100 downstream of TSS) were
          quantified using the tool - FeatureCounts to quantify chromatin
          accessibility in promoter regions.
        </b>
      </b-row>
      <b-row v-else>
        <b>
          Analyze temporal  patterns of histone mark enrichment on gene promoters across murine development in forebrain datasets from <a href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain" > ENCODE consortia </a> .  
          We've chosen a combination of marks that are indicative of multiple chromatin states -  H3K4me3 (accessible promoter), H3K4me1 (accessible enhancer), 
          h3k27ac (accessible and active enhancer), H3K9Ac and H3K36me3 (actively transcribed regions of chromatin), H3K27me3 and H3K36me3 (repressive chromatin).  
          BAM files from ENCODE were merged and reads in promoter regions (1000 upstream, 100 downstream of TSS) were quantified using the tool - 
          FeatureCounts to quantify enrichment of specific marks in promoter regions.
        </b>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <autocomplete :items="this.allgenes" @finished="finished" type="multiple"></autocomplete>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col cols="4">
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
        </b-col>
        <b-col cols="4">
          <LineChart
            v-if="flag"
            :labeldata="sampleLabels"
            :expressData="exprData2"
            :genename="genename"
            :ylabel="ylabel"
            :title="title2"
            :datasets="datasets2"
            :key="componentKey"
          />
        </b-col>
        <b-col cols="4">
          <LineChart
            v-if="flag"
            :labeldata="sampleLabels"
            :expressData="exprData3"
            :genename="genename"
            :ylabel="ylabel"
            :title="title3"
            :datasets="datasets3"
            :key="componentKey"
          />
        </b-col>
      </b-row>

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
  name: "SinglePlot",
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
      title2: "",
      allgenes: [],
      geneArray: [],
      dataobject: {},
      dataobject2: {},
      dataobject3: {},
      datasets: [], 
      datasets2: [],
      datasets3: [] 
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
        this.geneObj2 = _.omit(
          _.find(this.geneData2, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );
        this.geneObj3  = _.omit(
          _.find(this.geneData3, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );

        this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
        this.exprData2= _.map(_.values(this.geneObj2), _.ary(parseInt, 1));
        this.exprData3= _.map(_.values(this.geneObj3), _.ary(parseInt, 1));

        this.dataobject = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData
        };
        this.dataobject2 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData2
        };
        this.dataobject3 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData3
        };
        this.datasets.push(this.dataobject);
        this.datasets2.push(this.dataobject2);
        this.datasets3.push(this.dataobject3);
        this.datasets = _.uniqBy(this.datasets, o => {
          return o.label;
        });
        this.datasets2 = _.uniqBy(this.datasets2, o => {
          return o.label;
        });
        this.datasets3 = _.uniqBy(this.datasets3, o => {
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
      } else if (this.$route.name == "featurecount") {
        this.geneData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "Feature Count";
        this.title = "Accessibility Across Development";
      }
      else {
        this.geneData = await d3.tsv(
          "./datasets/histone/E11toAdult_h3k4me1_prom.fc.tsv"
        );
        this.geneData2  = await d3.tsv(
          "./datasets/histone/E11toAdult_h3k4me3_prom.fc.tsv"
        );
        this.geneData3  = await d3.tsv(
          "./datasets/histone/E11toAdult_h3k27ac_prom.fc.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "Feature Count";
        this.title = "H3K4me1 Enrichment Across Development";
        this.title2 = "H3K4me3 Enrichment Across Development";
        this.title3 = "H3K27ac Enrichment Across Development";
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
