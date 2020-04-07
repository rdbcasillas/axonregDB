<template>
    <div>
        <b-container>
            <b-row>
                <b>
                    To define functional enhancers in forebrain across murine development, we ran the package Activity by contact model (ABC) developed by the Broad Institute on forebrain RNA-Seq and ATAC-Seq datasets from ENCODE consortia. 
                    For annotated functional enhancers, chromatin accessibility was quantified by counting reads present in enhancer regions using the tool - FeatureCounts
                </b>
            </b-row>
            <br>
            <b-row>
                <b-col>
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <b-col>
                    <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" />
                </b-col>
            </b-row>
            <br>
            <b-row>
                <b-table striped hover :items="filteredData"></b-table>
            </b-row>
            <b-row>
                <b-col v-for="(item,index) in itemsHead" :key="index">
                    <LineChart v-if="flag" :labeldata=sampleLabels :expressData=item :genename=genename :ylabel=ylabel :title=title :key="compKey" />
                </b-col>
            </b-row>
            <b-row>
                <b-col v-for="(item,index) in itemsTail" :key="index">
                    <LineChart v-if="flag" :labeldata=sampleLabels :expressData=item :genename=genename :ylabel=ylabel :title=title :key="compKey" />
                </b-col>
            </b-row>
            <b-row>
                <!-- <b-col v-if="flag"><b-img thumbnail src="./devexpr.png" fluid alt="Responsive image"></b-img></b-col> -->
                <b-col></b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>

    import * as _ from "lodash";
    import * as d3 from "d3";
    import LineChart from "./charts/devExpression.vue";
    export default {
       name: 'Enhancer',
       components:{
           LineChart
       },
       data: function(){
           return {
               selected: null,
               options: [
                   {value: null, text: 'Please select an age'},
                   {value:'E11', text: 'E11'},
                   {value:'E12', text: 'E12'},
                   {value:'E13', text: 'E13'},
                   {value:'E14', text: 'E14'},
               ],
               genename: "",
               enhancerData: {
                   'E13': [],
                   'E14': []
               },
               filteredData: [],
               devArray:[],
               sampleLabels: [],
               title: 'Accessibility across enhancer region',
               ylabel: 'ylabel',
               flag: false,
               compKey: 0
           }
       },
       computed:{
            itemsHead() {
                return this.devArray ? this.devArray.slice(0, 3) : [];
            },
            itemsTail() {
                return this.devArray ? this.devArray.slice(3) : [];
            }
       },   
       methods:  {
            getChart()  {
                console.log(this.enhancerData.E14)
                this.flag = true;
                this.compKey+=1;
                let temparr = []
                let currName = this.genename;
                this.filteredData = _.filter(this.enhancerData[this.selected], function(o) { 
                    return o['TargetGene'] == currName; 
                });
                //console.log(this.enhancerData);
                //console.log(this.filteredData);
                this.sampleLabels= _.keys(this.filteredData[0]).slice(4,);
                this.filteredData.forEach(function(item){
                    let tmpval = _.values(item).slice(4,) 
                    temparr.push(_.map(tmpval, _.ary(parseInt, 1)))
                    })
                //console.log(temparr);
                this.devArray = temparr;
                //console.log(this.devArray);
                //console.log(this.sampleLabels);

            },
            async fetchData() {
            //fetch data based on URL
                this.enhancerData.E14 = await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/E14_enhancers_genes_devFC.tsv"); 
                this.enhancerData.E13 = await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/enhancers/E13_enhancers_genes_devFC.tsv"); 
                this.ylabel = 'Accessibility'
                this.title = 'Accessibility across Enhancer Region'        
           },
       },
       created() {
           this.fetchData();
       }
    }
</script>

<style lang="scss" scoped>

</style>