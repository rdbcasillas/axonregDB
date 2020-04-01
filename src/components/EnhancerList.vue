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
                    <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="getChart()" />
                </b-col>
                <b-col>
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
            </b-row>
            <br>
            <b-row>
                <b-table striped hover :items="filteredData"></b-table>
            </b-row>
        </b-container>
    </div>
</template>

<script>

    import * as _ from "lodash";
    import * as d3 from "d3";
    export default {
       name: 'Enhancer',
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
               geneData: [],
               filteredData: []
           }
       },
       methods:  {
            getChart()  {
                let currName = this.genename;
                this.filteredData = _.filter(this.geneData, function(o) { 
                    return o['TargetGene'] == currName; 
                });
                console.log(this.filteredData);
            },
            async fetchData() {
            //fetch data based on URL
                this.geneData= await d3.tsv("https://gist.githubusercontent.com/rdbcasillas/bb18b50f98d302f58c7676d01c3e9114/raw/d2c3677f0702dff703d2f9fed18ebb67d2128410/E14_enhancers_genes.tsv"); 
                this.ylabel = 'FPKM'
                this.title = 'Expression Across Development'            
                console.log(this.geneData);
           }
       },
       created() {
           this.fetchData();
       }
    }
</script>

<style lang="scss" scoped>

</style>