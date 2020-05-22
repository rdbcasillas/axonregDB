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
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/E18merged.bw",
                        "color": "#9900FF"
                    },         
                ],
                counter: 0
            }
        },
        methods: {
            loadBrowser(geneofinterest){

                this.options = {
                    genome: "mm10",
                    tracks: this.getTracks() 
                };
                let currOptions = this.options
                let currState = this;
                if (this.counter == 0) {
                    igv.createBrowser($('#igvtest')[0], currOptions) 
                        .then(function (browser) {
                            //browser.loadGenome(currOptions.reference);
                            currState.igvbrowser = browser;
                            console.log("Browser Loaded")
                            console.log(currState.igvbrowser)
                            setTimeout(function()
                            { 
                                currState.doSomething(geneofinterest)
                            }, 1000);
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
        created(){
            //this.loadBrowser();
                this.options = {
                    genome: "mm10",
                    tracks: this.accesstracks 
                };
        },
    }
</script>

<style scoped>

</style>