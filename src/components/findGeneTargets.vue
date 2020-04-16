<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <b-col>
                    <b-form-input type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="loadGenes()" />
                </b-col>
            </b-row>
            <br>
            <b-row v-if="flag">
                <b-card-group deck>
                    <b-card :header="cardHeader +  ' targets'" >
                        <b-list-group>
                            <b-list-group-item  class="genebox"  v-for="(item,index) in geneSet1" :key="index">
                                {{ item }} 
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-card-group>

            </b-row>
        </b-container>

    </div>
</template>

<script>
    import * as d3 from "d3";
    import * as _ from "lodash";
    export default {
       name: "findGeneTargets",
       data: function(){
           return {
               genename: "",
               cardHeader: "",
               geneSet1 : [],
               geneSet2 : [],
               selected: null,
               options: [
                    { value: null, text: "Please select an age" },
                    { value: "E11", text: "E11" },
                    { value: "E12", text: "E12" },
                    { value: "E13", text: "E13" },
                    { value: "E14", text: "E14" },
                    { value: "E16", text: "E16" },
                    { value: "P0", text: "P0" }
                ],
                flag: false
           }
       },
       methods: {
           async getGenes() {
               let gene1 = await d3.tsv("https://github.com/rdbcasillas/axonregDB/blob/master/public/datasets/targetGenes/E16/FOXA1_E16bound_prom_genes.txt")
               let gene2 = await d3.tsv("https://github.com/rdbcasillas/axonregDB/blob/master/public/datasets/targetGenes/E16/STAT3_E16bound_prom_genes.txt")
               let genearr1 = _.map(gene1, '');
               let genearr2 = _.map(gene2, '');
               this.geneSet1 = genearr1;
               this.geneSet2 = genearr1;
           },
           loadGenes(){
               this.cardHeader = this.genename
               this.flag = true;
           }
       },
       created() {
           this.getGenes();
       }
       
    }
</script>

<style lang="css" scoped>
.genebox {
    font-size: 11px;
} 

</style>