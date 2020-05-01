<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <b-col>
                    <autocomplete :items="this.tfset" @finished="finished" type="TF" />
                </b-col>
            </b-row>
            <br>
            <b-row v-if="flag">
                <b-card-group deck>
                    <b-card :header="cardHeader +  ' targets (' + geneSet1.length + ' )'" >
                        <b-list-group flush>
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
    import Autocomplete from "./Autocomplete.vue";
    export default {
       name: "findGeneTargets",
       components: {
           Autocomplete
       },
       data: function(){
           return {
               tfname: "",
               cardHeader: "",
               tfset:  [],
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
           finished(value) {
                this.tfname = value;
                this.loadGenes();
            },
           async getGenes() {
               let tflist = await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/TFlist.txt")
               this.tfset =  _.map(tflist, 'tfname');
           },
           loadGenes(){
               let url = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/E16/gene_target_files_allTF/E16_${this.tfname}_boundsites_prom_genes.txt`
               let myvar = this;
               d3.tsv(url).then((data)=>{
                   myvar.geneSet1 =  _.remove(_.map(data,'genelist'),
                    function(item){
                       return item !=  '';
                   });
                   console.log(myvar.geneSet1)
               })
               this.cardHeader = this.tfname
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