<template>
    <div>
        <!-- <b-container fluid="md">
            <b-form-input v-if="chartExists" type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="updateChart" />
            <b-form-input v-else type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="drawLineChart" />
        </b-container> -->
        <br>
        <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" />

        <!-- <h3>Plot Expression values</h3> -->
        <LineChart v-if="flag" :labeldata=sampleLabels :expressData=exprData :genename=genename :key="componentKey" />
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
       //props: ["expressionData","fcData"],
       data: function() {
            return {
                genename:"",
                sampleLabels:[],
                geneObj:{},
                flag:false,
                componentKey:0,
                geneData: []
            };
        },
        methods: {
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
                if (mypage) {
                    this.geneData= await d3.tsv("./dev_fpkm.tsv"); 
                }
                else {
                    this.geneData = await d3.tsv("./FCvalues.tsv");
                }
            }
        },
        created() {
            this.fetchData();
        },
    }
</script>

<style lang="scss" scoped>

</style>