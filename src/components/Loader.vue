<template>
    <div>
        <b-container>
            <b-row v-if="plotType=='expression'">
                <b>Analyze temporal gene expression patterns across murine development in forebrain datasets from <a href="https://www.encodeproject.org/search/?type=Experiment&status=released&assay_slims=Transcription&assay_title=polyA+plus+RNA-seq&award.project=ENCODE&assembly=mm10&biosample_ontology.term_name=forebrain&biosample_ontology.term_name=forebrain"> ENCODE consortia</a></b>
            </b-row>
            <b-row v-else>
                <b>Analyze temporal chromatin accessibility patterns across murine development in forebrain datasets from <a href="https://www.encodeproject.org/search/?type=Experiment&assay_slims=DNA+accessibility&assay_title=ATAC-seq&replicates.library.biosample.donor.organism.scientific_name=Mus+musculus&biosample_ontology.term_name=forebrain">ENCODE consortia</a> 
                . FASTQ files from ENCODE were analyzed, bam files were merged and reads in promoter regions (1000 upstream, 500 downstream of TSS) were quantified using the tool - FeatureCounts to quantify chromatin accessibility in promoter regions.</b> 

            </b-row>
        </b-container>
        <br>
        <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" />

        <!-- <h3>Plot Expression values</h3> -->
        <LineChart v-if="flag" :labeldata=sampleLabels :expressData=exprData :genename=genename :ylabel=ylabel :mytitle=title :key="componentKey" />
        <br>
        <!-- <h3>Plot feature count values</h3> -->
        <!-- <LineChart v-if="flag" :labeldata=fclabels :expressData=fcValues :genename=genename :key="componentKey" /> -->
    </div>
</template>

<script>

    import * as _ from "lodash";
    import * as d3 from "d3";
    import LineChart from "./charts/devExpression.vue";
    export default {
       name: "Loader" ,
       components:{
           LineChart
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
                mytitle: ''
            };
        },
        methods: {
            getLabels() {
                this.sampleLabels= _.keys(this.geneData[0]).slice(1,);
                this.geneObj = _.omit(_.find(this.geneData,{ 'external_gene_name': this.genename}),"external_gene_name" );
                console.log(this.geneObj)
                this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
                console.log(this.exprData)
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
                    this.geneData= await d3.tsv("https://gist.githubusercontent.com/rdbcasillas/4bccacd715a88b3100783e8303666429/raw/00c31608c6cff9ead3093f4e5dffb2f040f85c1d/dev_fpkm.tsv"); 
                    this.ylabel = 'FPKM'
                    this.title = 'Expression Across Development'
                }
                else {
                    this.geneData = await d3.tsv("https://gist.githubusercontent.com/rdbcasillas/dfee731e3815e2827a6aa1ff5a75fac2/raw/d811ff14b82a63f5bbfb1de039cb85bdad6891e1/E11toAdult-fc-homer-proms.tsv");
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

<style lang="scss" scoped>

</style>