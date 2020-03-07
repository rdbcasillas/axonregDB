<template>
    <div>
        <!-- <b-container fluid="md">
            <b-form-input v-if="chartExists" type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="updateChart" />
            <b-form-input v-else type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="drawLineChart" />
        </b-container> -->
        <br>
        <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" />

        <!-- <h3>Plot Expression values</h3> -->
        <LineChart v-if="flag" :labeldata=exprlabels :expressData=exprData :genename=genename :key="componentKey" />
        <br>

        <!-- <h3>Plot feature count values</h3> -->
        <LineChart v-if="flag" :labeldata=fclabels :expressData=fcValues :genename=genename :key="componentKey" />
    </div>
</template>

<script>

    import * as _ from "lodash";
    import LineChart from "./RandomChart.vue";
    export default {
       name: "Loader" ,
       components:{
           LineChart
       },
       props: ["expressionData","fcData"],
       data: function() {
            return {
                genename:"",
                loadData: [],
                exprData: [],
                exprlabels:[],
                fclabels:[],
                fcValues:[],
                geneObj:{},
                geneObj2: {},
                flag:false,
                componentKey:0
            };
        },
        methods: {
            getLabels() {
                this.exprlabels= _.keys(this.expressionData[0]).slice(1,);
                this.fclabels= _.keys(this.fcData[0]).slice(1,);
                this.geneObj = _.omit(_.find(this.expressionData,{ 'external_gene_name': this.genename}),"external_gene_name" );
                this.geneObj2 = _.omit(_.find(this.fcData,{ 'external_gene_name': this.genename}),"external_gene_name" );
                this.exprData = _.map(_.values(this.geneObj), _.ary(parseInt, 1));
                this.fcValues = _.map(_.values(this.geneObj2), _.ary(parseInt, 1));
            },
            getChart() {
                this.getLabels();
                this.componentKey+=1;
                this.flag = true;
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>