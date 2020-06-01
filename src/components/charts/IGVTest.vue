<template>
    <div>
        <!-- <b-form-input
        v-model="genename"
        placeholder="enter a gene"
        /> -->
        <!-- <b-button @click="doSomething()">DO something</b-button>
        <b-button @click="loadBrowser()">Load other IGV</b-button> -->
        <div id="igvtest">
        </div>
        <b-container v-if="flag">
            <b-row>
                <b-col>
                    <b-button @click="loadH3k4me3()">
                        Show h3k4me3 tracks
                    </b-button>
                </b-col>
                <b-col>
                    <b-button @click="loadH3k4me1()">
                        Show h3k4me1 tracks
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import igv from 'igv';
    import $ from 'jquery';
    export default {
        name:  "EnhancerIGV",
        props: ['gene', 'type','age'],
        data: function() {
            return {
                flag: false,
                igvbrowser : {},
                options: {},
                genename: '',
                accesstracks: [
                    {
                        "label": "E11 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/E11_merged_1bp.bw",
                        "color": "#4682B4"
                    },
                    {
                        "label": "E12 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/E12_merged_1bp.bw",
                        "color": "#800000"
                    },
                    {
                        "label": "E13 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/E13_merged_1bp.bw",
                        "color": "#A52A2A"
                    },
                    {
                        "label": "E14 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/E14_merged_1bp.bw",
                        "color": "#00B300"
                    },
                    {
                        "label": "E16 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/E16_merged_1bp.bw",
                        "color": "#40E0D0"
                    },
                    {
                        "label": "P0 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/P0_merged_1bp.bw",
                        "color": "#9900FF"
                    },
                    {
                        "label": "Adult BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/CtrlUnInj_merged_1bp.bw",
                        "color": "#FFB733"
                    },
                ],
                exptracks: [
                    {
                        "label": "E11 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E11merged.bw",
                        "color": "#4682B4"
                    },
                    {
                        "label": "E12 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E12merged.bw",
                        "color": "#800000"
                    },
                    {
                        "label": "E13 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E13merged.bw",
                        "color": "#A52A2A"
                    },
                    {
                        "label": "E14 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E14merged.bw",
                        "color": "#00B300"
                    },
                    {
                        "label": "E16 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E16merged.bw",
                        "color": "#40E0D0"
                    },
                    {
                        "label": "E18 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E18merged.bw",
                        "color": "#ADD9E6"
                    },
                    {
                        "label": "P0 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/P0merged.bw",
                        "color": "#9900FF"
                    },         
                ],
                h3k27actracks: [
                    {
                        "label": "E11 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E11_h3k27ac.bw",
                        "color": "#4682B4"
                    },
                    {
                        "label": "New E11 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E11_chip-merged_1bp.bw",
                        "color": "#4682B4"
                    },
                    {
                        "label": "E12 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E12_h3k27ac.bw",
                        "color": "#800000"
                    },
                    {
                        "label": "New E12 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E12_chip-merged_1bp.bw",
                        "color": "#800000"
                    },
                    {
                        "label": "E13 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E13_h3k27ac.bw",
                        "color": "#A52A2A"
                    },
                    {
                        "label": "New E13 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E13_chip-merged_1bp.bw",
                        "color": "#A52A2A"
                    },
                    {
                        "label": "E14 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E14_h3k27ac.bw",
                        "color": "#00B300"
                    },
                    {
                        "label": "E16 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E16_h3k27ac.bw",
                        "color": "#40E0D0"
                    },
                    {
                        "label": "E18 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E18_h3k27ac.bw",
                        "color": "#ADD9E6"
                    },
                    {
                        "label": "P0 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/P0_h3k27ac.bw",
                        "color": "#9900FF"
                    },         
                    {
                        "label": "Adult BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/Adult_h3k27ac.bw",
                        "color": "black"
                    },         
                    {
                        "label": "New Adult BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/Adult_chip-merged_1bp.bw",
                        "color": "black"
                    },         
                ],
                h3k4me1tracks: [
                    {
                        "label": "E11 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E11_merged_h3k4me1.bw",
                        "color": "#4682B4",
//                        "autoscaleGroup": '1'
                    },
                    {
                        "label": "E12 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E12_merged_h3k4me1.bw",
                        "color": "#800000",
 //                       "autoscaleGroup": '1'
                    },
                    {
                        "label": "E13 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E13_merged_h3k4me1.bw",
                        "color": "#A52A2A",
  //                      "autoscaleGroup": '1'
                    },
                    {
                        "label": "E14 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E14_merged_h3k4me1.bw",
                        "color": "#00B300",
   //                     "autoscaleGroup": '1'
                    },
                    {
                        "label": "E16 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E16_merged_h3k4me1.bw",
                        "color": "#40E0D0",
    //                    "autoscaleGroup": '1'
                    },
                    {
                        "label": "E18 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E18_merged_h3k4me1.bw",
                        "color": "#ADD9E6",
     //                   "autoscaleGroup": '1'
                    },
                    {
                        "label": "P0 h3k4me1  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/P0_merged_h3k4me1.bw",
                        "color": "#9900FF",
      //                  "autoscaleGroup": '1'
                    },         
                    {
                        "label": "Adult h3k4me1  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/Adult_merged_h3k4me1.bw",
                        "color": "black",
       //                 "autoscaleGroup": '1'
                    },         
                ],
                h3k4me3tracks: [
                    {
                        "label": "E11 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E11_merged_h3k4me3.bw",
                        "color": "#4682B4",
        //                "autoscaleGroup": '2'
                    },
                    {
                        "label": "E12 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E12_merged_h3k4me3.bw",
                        "color": "#800000",
         //               "autoscaleGroup": '2'
                    },
                    {
                        "label": "E13 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E13_merged_h3k4me3.bw",
                        "color": "#A52A2A",
          ////              "autoscaleGroup": '2'
                    },
                    {
                        "label": "E14 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E14_merged_h3k4me3.bw",
                        "color": "#00B300",
            //            "autoscaleGroup": '2'
                    },
                    {
                        "label": "E16 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E16_merged_h3k4me3.bw",
                        "color": "#40E0D0",
             //           "autoscaleGroup": '2'
                    },
                    {
                        "label": "E18 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E18_merged_h3k4me3.bw",
                        "color": "#ADD9E6",
              //          "autoscaleGroup": '2'
                    },
                    {
                        "label": "P0 h3k4me3  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/P0_merged_h3k4me3.bw",
                        "color": "#9900FF",
               //         "autoscaleGroup": '2'
                    },         
                    {
                        "label": "Adult h3k4me3  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/Adult_merged_h3k4me3.bw",
                        "color": "black",
                //        "autoscaleGroup": '2'
                    },         
                ],

                counter: 0
            }
        },
        methods: {
            loadH3k4me3(){
                let mybrowser = this.igvbrowser;
                this.h3k4me3tracks.forEach(function(track){
                    mybrowser 
                    .loadTrack(track)
                    .then(function (loadedtrack){
                        console.log("new tracks loaded")
                    })
                    .catch(err=>{console.log(err + " happened")})
                })
            },
            loadH3k4me1(){
                let mybrowser = this.igvbrowser;
                this.h3k4me1tracks.forEach(function(track){
                    mybrowser 
                    .loadTrack(track)
                    .then(function (loadedtrack){
                        console.log("new tracks loaded")
                    })
                    .catch(err=>{console.log(err + " happened")})
                })
            },
            loadBrowser(geneofinterest){

                this.options = {
                    genome: "mm10",
                    tracks: this.getTracks(),
                    locus : [geneofinterest]
                };
                let currOptions = this.options
                let currState = this;
                if (this.counter == 0) {
                    igv.createBrowser($('#igvtest')[0], currOptions) 
                        .then(function (browser) {
                            //browser.loadGenome(currOptions.reference);
                            currState.igvbrowser = browser;
                            console.log("Browser Loaded")
                            // setTimeout(function()
                            // { 
                            //     currState.doSomething(geneofinterest)
                            // }, 1000);
                        })
                        .catch(function (err){
                            alert("browser couldn't load. Please refresh")
                        })
                    this.counter += 1;
                }
                else {
                    this.doSomething(geneofinterest);
                    console.log("new gene looked for...")
                }

                },
            getTracks(){
                let parent = this.type
                if (parent == 'expression'){
                    return this.exptracks;
                }
                else if (parent == 'featurecount') {
                    return this.accesstracks;
                }
                else if (parent == 'histone') {
                    this.flag = true; 
                    return this.h3k4me1tracks;
                }
                else if (parent == 'enhancer'){
                    let enhancertrack = [
                        {
                        "label": this.age + ' BAM',
                        "url": `https://129.114.16.59.xip.io/website-data/IGV/${this.age}_merged_1bp.bw`,
                        },
                        {
                        "label": this.age + ' enhancer-promoter loops',
                        "url": `https://129.114.16.59.xip.io/website-data/IGV/${this.age}_enhancers.bedpe`, 
                        "type": "interaction",
                        "format": "bedpe",
                        "color": ""
                        }
                    ]
                    return enhancertrack
                }
                else {
                    console.log("page not connected with IGV")
                }
            },
            doSomething(mygene){
                console.log(mygene);
                // this.igvbrowser.loadTrack({
                //     url: 'https://129.114.16.59.xip.io/website-data/IGV/E11_enhancers.bw',
                //     label: 'E11 bw'
                //         })
                //     .then(function (newTrack) {
                //     console.log("loading track....");
                //     })
                //     .catch(function (error)  {
                //     // Handle error
                //     })
                this.igvbrowser.search(mygene)
                }
            },
    }
</script>

<style scoped>

</style>