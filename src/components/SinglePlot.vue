<template>
  <div>
    <b-container>
      <b-row v-if="$route.name == 'expression'">
        <b class="expdesc">
          Query expression levels for gene(s) of interest across development in
          mouse forebrain.
          <br />
          Associated RNA-Seq datasets from ENCODE can be found
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&status=released&assay_slims=Transcription&assay_title=polyA+plus+RNA-seq&award.project=ENCODE&assembly=mm10&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=forebrain"
            >here</a
          >.
        </b>
      </b-row>
      <b-row v-else-if="$route.name == 'featurecount'">
        <b>
          Analyze temporal chromatin accessibility patterns across murine
          development in forebrain datasets from
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain"
            >ENCODE consortia</a
          >
          . FASTQ files from ENCODE were analyzed, bam files were merged and
          reads in promoter regions (1000 upstream, 100 downstream of TSS) were
          quantified using the tool - FeatureCounts to quantify chromatin
          accessibility in promoter regions.
        </b>
      </b-row>
      <b-row v-else>
        <b>
          Analyze temporal patterns of histone mark enrichment on gene promoters
          across murine development in forebrain datasets from
          <a
            href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain"
          >
            ENCODE consortia
          </a>
          . We have chosen a combination of marks that are indicative of
          multiple chromatin states - H3K4me3 (accessible promoter), H3K4me1
          (accessible enhancer), h3k27ac (accessible and active enhancer),
          H3K9Ac and H3K36me3 (latter in the works), H3K27me3 (repressive
          chromatin) and H3K36me3 (in the works). BAM files from ENCODE were
          merged and reads in promoter regions (1000 upstream, 100 downstream of
          TSS) were quantified using the tool - FeatureCounts to quantify
          enrichment of specific marks in promoter regions.
        </b>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <autocomplete
            :items="this.allgenes"
            @finished="finished"
            type="multiple"
          ></autocomplete>
        </b-col>
        <b-col cols="2" v-if="progressflag">
          <p>Fetching {{ $route.name }} data..</p>
          <b-img class="dnagif" src="./dnagif.gif"></b-img>
        </b-col>
        <b-col class="download" cols="3" v-if="flag">
          <a
            v-if="$route.name == 'expression'"
            href="https://149.165.169.187.nip.io/website-data/dev_fpkm.tsv"
            class="btn btn-primary"
            download
            >Download Raw Data</a
          >
          <a
            v-if="$route.name == 'featurecount'"
            href="https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms.tsv"
            class="btn btn-primary"
            download
            target="_blank"
            >Download Raw Data</a
          >
          <a
            v-if="$route.name == 'histone'"
            href="https://149.165.169.187.nip.io/website-data/histone-prom-fc.zip"
            class="btn btn-primary"
            download
            >Download Raw Data</a
          >
        </b-col>
        <b-col cols="2" v-if="flag">
          <a
            id="download"
            download="ChartImage.jpg"
            href=""
            @click="downloadChart()"
            class="btn btn-primary float-right bg-flat-color-1"
          >
            Download Chart
          </a>
        </b-col>
      </b-row>
      <br />
      <b-row v-if="!histoneflag">
        <b-col>
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
      </b-row>
      <b-row v-if="flag">
        <b-col cols="4">
          <LineChart
            v-if="histoneflag"
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
            v-if="histoneflag"
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
            v-if="histoneflag"
            :labeldata="sampleLabels"
            :expressData="exprData3"
            :genename="genename"
            :ylabel="ylabel"
            :title="title3"
            :datasets="datasets3"
            :key="componentKey"
          />
        </b-col>
        <b-col cols="4">
          <LineChart
            v-if="histoneflag"
            :labeldata="sampleLabels2"
            :expressData="exprData4"
            :genename="genename"
            :ylabel="ylabel"
            :title="title4"
            :datasets="datasets4"
            :key="componentKey"
          />
        </b-col>
        <b-col cols="4">
          <LineChart
            v-if="histoneflag"
            :labeldata="sampleLabels3"
            :expressData="exprData5"
            :genename="genename"
            :ylabel="ylabel"
            :title="title5"
            :datasets="datasets5"
            :key="componentKey"
          />
        </b-col>
      </b-row>
      <IGVTest :gene="this.genename" :type="this.$route.name" ref="igvComp" />
    </b-container>
    <br />
    <br />
  </div>
</template>

<script>
import * as _ from "lodash";
import * as d3 from "d3";
import LineChart from "./charts/devExpression.vue";
import IGVTest from "./charts/IGVTest.vue";
import Autocomplete from "./Autocomplete.vue";
export default {
  name: "SinglePlot",
  components: {
    LineChart,
    Autocomplete,
    IGVTest,
  },
  props: ["plotType"],
  data: function() {
    return {
      genename: "",
      sampleLabels: [],
      geneObj: {},
      flag: false,
      progressflag: false,
      histoneflag: false,
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
      datasets3: [],
      datasets4: [],
      datasets5: [],
    };
  },
  methods: {
    downloadChart() {
      var url_base64jp = document
        .getElementById("line-chart")
        .toDataURL("image/jpg");
      /*get download button (tag: <a></a>) */
      var a = document.getElementById("download");
      /*insert chart image url to download button (tag: <a></a>) */
      a.href = url_base64jp;
    },
    capitalFirstLetter(genename) {
      return genename.charAt(0).toUpperCase() + genename.slice(1);
    },
    finished(value) {
      this.datasets = [];
      this.datasets2 = [];
      this.datasets3 = [];
      this.datasets4 = [];
      this.datasets5 = [];
      if (value.includes(" ")) {
        this.geneArray = _.uniq(value.split(", "));
      } else {
        this.geneArray = _.uniq(value.split(","));
      }
      console.log(this.geneArray);
      this.geneArray = this.geneArray.map((gene) => {
        return this.capitalFirstLetter(gene);
      });
      console.log(this.geneArray);
      this.genename = value;
      this.getChart();
      // this.$refs.igvComp.loadBrowser();

      this.$nextTick(function() {
        this.$refs.igvComp.loadBrowser(this.geneArray[0]);
      });
      //this.$refs.igvComp.loadBrowser(this.geneArray[0]);
    },
    getLabels() {
      this.sampleLabels = _.keys(this.geneData[0]).slice(1);

      if (this.$route.name == "histone") {
        this.sampleLabels2 = _.keys(this.geneData4[0]).slice(1);
        this.sampleLabels3 = _.keys(this.geneData5[0]).slice(1);
      }
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
        this.geneObj3 = _.omit(
          _.find(this.geneData3, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );
        this.geneObj4 = _.omit(
          _.find(this.geneData4, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );
        this.geneObj5 = _.omit(
          _.find(this.geneData5, { external_gene_name: this.geneArray[item] }),
          "external_gene_name"
        );

        this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
        this.exprData2 = _.map(_.values(this.geneObj2), _.ary(parseInt, 1));
        this.exprData3 = _.map(_.values(this.geneObj3), _.ary(parseInt, 1));
        this.exprData4 = _.map(_.values(this.geneObj4), _.ary(parseInt, 1));
        this.exprData5 = _.map(_.values(this.geneObj5), _.ary(parseInt, 1));

        this.dataobject = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData,
        };

        this.dataobject2 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData2,
        };

        this.dataobject3 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData3,
        };

        this.dataobject4 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData4,
        };

        this.dataobject5 = {
          label: this.geneArray[item],
          pointBackgroundColor: "white",
          borderWidth: 2,
          fill: false,
          pointBorderColor: colors(item),
          borderColor: colors(item),
          data: this.exprData5,
        };

        this.datasets.push(this.dataobject);
        this.datasets2.push(this.dataobject2);
        this.datasets3.push(this.dataobject3);
        this.datasets4.push(this.dataobject4);
        this.datasets5.push(this.dataobject5);

        this.datasets = _.uniqBy(this.datasets, (o) => {
          return o.label;
        });
        this.datasets2 = _.uniqBy(this.datasets2, (o) => {
          return o.label;
        });
        this.datasets3 = _.uniqBy(this.datasets3, (o) => {
          return o.label;
        });
        this.datasets4 = _.uniqBy(this.datasets4, (o) => {
          return o.label;
        });
        this.datasets5 = _.uniqBy(this.datasets5, (o) => {
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
        this.progressflag = true;
        // this.geneData = await d3.tsv(
        //   "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/rna/dev_fpkm.tsv"
        // );
        // this.geneData = await d3.tsv(
        //   "https://149.165.169.187.nip.io/website-data/dev_fpkm.tsv"
        // );
        this.geneData = await d3.tsv(
          "https://cors-anywhere.com/https://149.165.169.187.nip.io/website-data/dev_fpkm.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "FPKM";
        this.title = "Expression Across Development";
        this.progressflag = false;
      } else if (this.$route.name == "featurecount") {
        this.progressflag = true;
        this.geneData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms-2.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "Feature Count";
        this.title = "Accessibility Across Development";
        this.progressflag = false;
      } else {
        this.histoneflag = true;
        this.progressflag = true;
        this.geneData = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/histone/E11toAdult_h3k4me1_prom.fc.tsv"
        );
        this.geneData2 = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/histone/E11toAdult_h3k4me3_prom.fc.tsv"
        );
        this.geneData3 = await d3.tsv(
          "https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/histone/E11toAdult_h3k27ac_prom.fc.tsv"
        );
        this.geneData4 = await d3.tsv(
          "https://149.165.169.187.nip.io/website-data/dev-series-tsv/E11toP0_h3k27me3_prom.fc.tsv"
        );
        this.geneData5 = await d3.tsv(
          "https://149.165.169.187.nip.io/website-data/dev-series-tsv/E12toP0_h3k9ac_prom.fc.tsv"
        );
        this.allgenes = _.map(this.geneData, "external_gene_name");
        this.ylabel = "Feature Count";
        this.title = "H3K4me1 Enrichment Across Development";
        this.title2 = "H3K4me3 Enrichment Across Development";
        this.title3 = "H3K27ac Enrichment Across Development";
        this.title4 = "H3K27me3 Enrichment Across Development";
        this.title5 = "H3K9ac Enrichment Across Development";
        this.progressflag = false;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.expdesc {
  margin-left: 65px;
}
.dnagif {
  height: 60px;
  width: 140px;
}
.download,
#download {
  margin-top: 12px;
}
</style>
