<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-select v-model="selected" :options="options" @change="loadGenes(selected)"></b-form-select>
                </b-col>
                <b-col>
                    <autocomplete :items="this.geneset" @finished="finished" type="TF" />
                </b-col>
            </b-row>
            <br>
            <b-row v-if="flag">
                <b-card-group deck>
                    <b-card :header="cardHeader +  ' bound TF (' + geneSet1.length + ' )'" >
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
       name: "findBoundTF",
       components: {
           Autocomplete
       },
       data: function(){
           return {
               genename: "",
               cardHeader: "",
               geneset:  [],
               geneSet1 : [],
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
                geneTFobj: {},
                flag: false
           }
       },   
       methods: {
           finished(value) {
               this.genename = value;
               this.loadTF();
            },
           async getGenes() {
               let genelist = await d3.tsv("./datasets/targetGenes/P0/gene_target_files_allTF/allgenes")
               let boundtfobj = await d3.json("./datasets/targetGenes/P0/data.json")
               this.geneset =  _.map(genelist, 'genename');
               this.geneTFobj = boundtfobj;
           },
           loadTF() {
               this.flag = true;
               this.geneSet1 = this.geneTFobj[this.genename]
           }
       },
       created() {
           this.getGenes();
       }
    }
</script>

<style lang="scss" scoped>

</style>