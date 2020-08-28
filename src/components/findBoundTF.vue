<template>
    <div>
        <b-container >
            <b-row>
            <b-col cols="10">
            <b-row>
                <b-col cols="2">
                    <b-form-select v-model="selected" :options="options" @change="loadData(selected)"></b-form-select>
                </b-col>
                <b-col cols="2">
                    FPKM threshold
                    <vue-slider v-model="slidervalue" :max="maxrna"></vue-slider>
                </b-col>
                <b-col>
                    <autocomplete :items="this.geneset" @finished="finished" type="multiple"/>
                </b-col>
            </b-row>
            <br>
            <b-row v-if="flag">
                <b-card-group deck
                v-for="(obj,index) in geneTFarr" :key="index">
                    <b-card class="mainpanelheader" :header="cardHeader 
                    + obj.genename +  ' bound TF (' + getCount(selected,obj.rnadata) + ' )'">
                        <b-list-group v-for="(item,index2) in obj.rnadata" :key="index2" class="mainpanel" flush>
                            <b-list-group-item v-if="parseInt(item[selected])>=slidervalue[0] 
                                && parseInt(item[selected])<=slidervalue[1]" class="genebox">
                                {{ item.external_gene_name }} 
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-card-group>
            </b-row>
            </b-col>
            <b-col >
                <b-card-group deck v-if="showcommon">
                <b-card class="sidepanelheader" header="Top common TFs">
               <b-list-group class="sidepanel" v-for="(tf,index) in impTF" :key="index">
                   <b-list-group-item :variant="tf.count == geneArray.length ? 'success' : 'warning'"
                   class="d-flex justify-content-between align-items-center">
                            {{ tf.tf }}
                            <b-badge variant="primary" pill>
                                {{ tf.count }}
                            </b-badge>
                   </b-list-group-item>
               </b-list-group>
                </b-card>
                </b-card-group>
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
       name: "findBoundTF",
       components: {
           Autocomplete
       },
       data: function(){
           return {
               slidervalue: [0,100],
               genename: "",
               cardHeader: "",
               geneset:  [],
               geneSet1 : [],
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
                geneTFobj: {},
                flag: false,
                showcommon: false,
                geneArray: [],
                geneTFarr: [],
                impTF: [],
                expdata: [],
                maxrna: 200
           }
       },   
       methods: {
           getCount(age,data) {
             let sliderval = this.slidervalue[0]
             let sliderval2 = this.slidervalue[1]
             let newarr = _.each(data, item => item[age] = parseInt(item[age], 10));
             this.maxrna =  _.maxBy(newarr, age)[age];

             let filtdata = _.filter(data, function(o) { 
                return o[age] >= sliderval && o[age] <= sliderval2; 
             });
             return filtdata.length;
           },
           finished(value) {
               this.geneArray = _.uniq(value.split(","));
               this.genename = value;
               //console.log(value)
               this.loadTF();
            },
           async loadData(selected){
               let url = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/${this.selected}/gene_target_files_allTF/allgenes`

               let genelist = await d3.tsv(url)

               this.geneset =  _.map(genelist, 'genename');

               let url2 = `https://raw.githubusercontent.com/rdbcasillas/axonregDB/master/public/datasets/targetGenes/${this.selected}/data.json`
               let boundtfobj = await d3.json(url2)
               this.geneTFobj = boundtfobj;
           },
           loadTF() {
               this.geneTFarr = []
               this.flag = true;
               this.impTF = []
               //this.geneSet1 = this.geneTFobj[this.genename]
               for (let item in this.geneArray) {
                    let tmpobj = {}
                    let gene = this.geneArray[item];
                    tmpobj['genename'] = gene
                    tmpobj['boundTF'] = this.geneTFobj[gene];
                    tmpobj['rnadata'] = _.compact(_(this.expdata)
                                        .keyBy('external_gene_name')
                                        .at(this.geneTFobj[gene])
                                        .value());
                    console.log(tmpobj['rnadata'])
                    this.geneTFarr.push(tmpobj);
               }
               this.geneTFarr = _.uniq(this.geneTFarr, 'genename');
               let allTFarr = []
               this.geneTFarr.forEach(obj => {
                   allTFarr.push(obj['boundTF']);
               });

               let filtTFdata = _.compact(_(this.expdata)
                                .keyBy('external_gene_name')
                                .at(allTFarr[0])
                                .value());

               let tmpobj = _.countBy(_.flatten(allTFarr));
               let sorted = new Map(Object.entries(tmpobj).sort((a, b) => b[1] - a[1]));
               for (let [key,val] of sorted) {
                    if (val >= (this.geneTFarr.length-1) && this.geneTFarr.length>1) {
                        this.showcommon = true;
                        this.impTF.push({tf: key, count: val})
                    }
                }
           },
           async loadRNAdata(){
            this.expdata = await d3.tsv(
                "./datasets/targetGenes/TFrnaexp.tsv"
            );
           }
       },
       created() {
           this.loadRNAdata();
       }
    }
</script>

<style lang="css" scoped>
.sidepanel {
    font-size: 12px;
}
.sidepanelheader {
    font-size: 14px;
    font-weight: bold;
}
.mainpanel {
    font-size: 12px;
}
.mainpanelheader {
    font-size: 14px;
}
</style>