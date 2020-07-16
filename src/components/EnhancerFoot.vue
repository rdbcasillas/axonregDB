<template>
    <div>
        <b-container>
            <b-row>
                <b-col cols="2">
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <b-col>
                    <autocomplete :items="this.geneset" @finished="finished" type="TF" />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import * as d3 from "d3";
    import * as _ from "lodash";
    import Autocomplete from "./Autocomplete.vue";
    export default {
       name: 'EnhancerFoot',
       components: {
           Autocomplete
       },
       data: function(){
           return {
               genename: "",
               cardHeader: "",
               geneset:  [],
               //geneSet1 : [],
               //geneSet2 : [],
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
       methods:{
            finished(value) {
            this.genename = value;
            //this.getChart();
            //console.log(this.$refs)
            },
           async fetchgenelist(){
               let genelist = await d3.tsv("./datasets/enhancers/footprints/E12-genelist.txt")
               this.geneset =  _.map(genelist, 'genename');
               let enhancerlist = await d3.tsv("./datasets/enhancers/footprints/E12-enhancers-tfcobound-genelist.tsv") 
               console.log(enhancerlist)
               console.log(this.geneset)
           }
       },
       created(){
           this.fetchgenelist();
       }
    }
</script>

<style scoped>

</style>