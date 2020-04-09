<template>
    <div>
        <b-container>
            <b-row v-if="plotType=='expression'">
                <b class="expdesc">Analyze temporal gene expression patterns across murine development in forebrain datasets from <a href="https://www.encodeproject.org/search/?type=Experiment&status=released&assay_slims=Transcription&assay_title=polyA+plus+RNA-seq&award.project=ENCODE&assembly=mm10&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=forebrain"> ENCODE consortia</a></b>
            </b-row>
            <b-row v-else>
                <b>Analyze temporal chromatin accessibility patterns across murine development in forebrain datasets from <a href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain">ENCODE consortia</a> 
                . FASTQ files from ENCODE were analyzed, bam files were merged and reads in promoter regions (1000 upstream, 500 downstream of TSS) were quantified using the tool - FeatureCounts to quantify chromatin accessibility in promoter regions.</b> 
            </b-row>
            <br>
            <b-row>
                <b-col>
                    <autocomplete :items="this.allgenes" @finished="finished" ></autocomplete>
                </b-col>
            </b-row>
            <br>
                <LineChart 
                v-if="flag" 
                :labeldata=sampleLabels 
                :expressData=exprData 
                :genename=genename 
                :ylabel=ylabel 
                :title=title 
                :key="componentKey" />
        </b-container>
        <br>
        <!-- <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" /> -->
        <!-- <h3>Plot Expression values</h3> -->
        <br>
        <!-- <h3>Plot feature count values</h3> -->
        <!-- <LineChart v-if="flag" :labeldata=fclabels :expressData=fcValues :genename=genename :key="componentKey" /> -->
    </div>
</template>

<script>

    import * as _ from "lodash";
    import * as d3 from "d3";
    import LineChart from "./charts/devExpression.vue";
    import Autocomplete from "./Autocomplete.vue"
    export default {
       name: "Loader" ,
       components:{
           LineChart,
           Autocomplete
       },
       props: ["plotType"],
       data: function() {
            return {
                genename:"",
                sampleLabels:[],
                geneObj:{},
                flag:false,
                componentKey:0,
                geneData: [],
                ylabel: '',
                title: '',
                allgenes: [] 
            };
        },
        methods: {
            finished(value) {
                this.genename = value
                this.getChart();
            },
            getLabels() {
                this.sampleLabels= _.keys(this.geneData[0]).slice(1,);
                this.geneObj = _.omit(_.find(this.geneData,{ 'external_gene_name': this.genename}),"external_gene_name" );
                this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
            },
            getChart() {
                this.getLabels();
                this.componentKey+=1;
                this.flag = true;
            },
            async fetchData() {
            //fetch data based on URL
                let mypage = false
                if (this.plotType=="expression") {
                    this.geneData= await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/rna/dev_fpkm.tsv"); 
                    this.allgenes = _.map(this.geneData, 'external_gene_name');
                    this.ylabel = 'FPKM'
                    this.title = 'Expression Across Development'
                }
                else {
                    this.geneData = await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/atac/E11toAdult-fc-homer-proms.tsv");
                    this.allgenes = _.map(this.geneData, 'external_gene_name');
                    this.ylabel = 'Feature Count'
                    this.title = 'Accessibility Across Development'
                }
            }
        },
        created() {
            this.fetchData();
            console.log(this.plotType)
        },
    }
</script>

<style scoped>
.expdesc {
    margin-left: 65px;
}

</style>