<template>
    <div>
        <b-container>
            <b-row>
                <b-col cols="2">
                    <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
                <b-col cols="3">
                    FPKM threshold
                    <vue-slider v-model="slidervalue" :max="maxrna"></vue-slider>
                </b-col>
                <b-col>
                    <autocomplete :items="this.tfset" @finished="finished" type="TF" />
                </b-col>
            </b-row>
            <!-- <b-spinner v-if="progressflag" variant="primary" label="Spinning"></b-spinner> -->
            <p v-if="progressflag">Fetching footprinting data..</p>
            <b-img v-if="progressflag" class="dnagif" src="./dnagif.gif"></b-img>
            <br>
            <b-row v-if="flag">
                <b-card-group deck
                v-for="(obj,index) in tfgenearr" :key="index">
                    <b-card class="mainpanelheader" :header=" 'Genes bound to ' + obj.tfname 
                    +  ' (' + getCount(selected,obj.rnadata) + ' )'">
                        <b-list-group v-for="(item,index2) in obj.rnadata" :key="index2" class="mainpanel" flush>
                            <b-list-group-item v-if="parseInt(item[selected])>=slidervalue[0] 
                                && parseInt(item[selected])<=slidervalue[1]" class="genebox">
                                {{ item.external_gene_name }} 
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-card-group>
                <!-- <b-card-group deck>
                    <b-card :header="cardHeader +  ' targets (' + geneSet1.length + ' )'" >
                        <b-list-group flush>
                            <b-list-group-item  class="genebox"  v-for="(item,index) in finalgenelist" :key="index">
                                {{ item }} 
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-card-group> -->
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
               //finalgenelist: {'tfname':'','rnadata':[]},
               tfgenearr: [],
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
                maxrna: 200,
                progressflag: false
           }
       },
       methods: {
           finished(value) {
               this.tfArray = _.uniq(value.split(","));
                this.tfname = value;
                this.loadGenes();
            },
           getCount(age,data) {
             let sliderval = this.slidervalue[0]
             let sliderval2 = this.slidervalue[1]
             let newarr = _.each(data, item => item[age] = parseInt(item[age], 10));
             //this.maxrna =  _.maxBy(newarr, age)[age];

             let filtdata = _.filter(data, function(o) { 
                return o[age] >= sliderval && o[age] <= sliderval2; 
             });
             return filtdata.length;
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
                for (let tf in this.tfArray){
                    let newgenelist = {}
                    newgenelist['tfname'] = this.tfname;
                    newgenelist['rnadata'] = _.compact(_(this.expdata)
                        .keyBy('external_gene_name')
                        .at(this.geneSet1)
                        .value());
                    this.tfgenearr.push(newgenelist);
                }
                console.log(this.tfgenearr)
                //this.finalgenelist = newgenelist;
                //console.log(this.finalgenelist)
                this.cardHeader = this.tfname;
                this.progressflag  = false;
                this.flag = true
           },
           async loadRNAdata(){
            this.expdata = await d3.tsv(
                "https://129.114.16.59.xip.io/website-data/dev_fpkm.tsv"

            );
            //console.log(this.expdata);
           }
       },
       created() {
           this.getTFs();
           this.loadRNAdata();
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
/* .sidepanel {
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
} */
</style>