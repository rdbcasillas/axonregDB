<template>
    <div>
        <b-container>
            <b-row>
                <b-col cols="2">
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <!-- <b-col cols="2">
                    FPKM threshold
                    <vue-slider v-model="slidervalue" :max="maxrna"></vue-slider>
                </b-col> -->
                <b-col>
                    <autocomplete :items="this.tfset" @finished="finished" type="TF" />
                </b-col>
            </b-row>
            <!-- <b-spinner v-if="progressflag" variant="primary" label="Spinning"></b-spinner> -->
            <b-img v-if="progressflag" class="dnagif" src="./dnagif.gif"></b-img>
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
                    { value: null, text: "Age" },
                    { value: "E11", text: "E11" },
                    { value: "E12", text: "E12" },
                    { value: "E13", text: "E13" },
                    { value: "E14", text: "E14" },
                    { value: "E16", text: "E16" },
                    { value: "P0", text: "P0" },
                    { value: "Adult", text: "Adult" }
                ],
                flag: false,
                slidervalue: [0,100],
                maxrna: 100,
                progressflag: false
           }
       },
       methods: {
           finished(value) {
                this.tfname = value;
                this.loadGenes();
            },
           async getTFs() {
               let tflist = await d3.tsv("https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/TFlist.txt")
               this.tfset =  _.map(tflist, 'tfname');
           },
           async loadGenes() {
               let url = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/${this.selected}/gene_target_files_allTF/${this.selected}_${this.tfname}_boundsites_prom_genes.txt`
               this.progressflag = true;
               let genelist = await  d3.tsv(url)
               this.geneSet1 =  _.remove(_.map(genelist,'genelist'),
                 function(item){
                    return item !=  '';
                });
                this.cardHeader = this.tfname;
                this.progressflag  = false;
                this.flag = true
           }
       },
       created() {
           this.getTFs();
       }
       
    }
</script>

<style lang="css" scoped>
.genebox {
    font-size: 11px;
} 

.dnagif {
    height: 60px;
    width: 140px
}

</style>