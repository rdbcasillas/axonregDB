<template>
    <div>
        <!-- <b-form-input
        v-model="genename"
        placeholder="enter a gene"
        /> -->
        <!-- <b-button @click="doSomething()">DO something</b-button>
        <b-button @click="loadBrowser()">Load other IGV</b-button> -->
        <b-container v-if="flag">
            <b-row v-if="enhancerIGV">
                <b-col>
                    <b-form-group 
                        id="checkbox-group-1"
                    >  
                    <b-form-checkbox v-model="selections" v-for="option in chartoptions" :value="option.value" :key="option.value" :class="option.value" switch>
                        {{ option.text }}
                    </b-form-checkbox>
                    </b-form-group>               
                </b-col>
                <b-col>
                    <b-form-group 
                        id="checkbox-group-3"
                    >Histone Marks
                    <b-form-checkbox v-model="selections3" v-for="option in histoneoptions" :value="option.value" :key="option.value" :class="option.value" switch>
                        {{ option.text }}
                    </b-form-checkbox>
                    </b-form-group>               
                </b-col>
                <b-col>
                    <b-form-group 
                        id="checkbox-group-2"
                    >Ages To Compare With
                    <b-form-checkbox v-model="ageselections" v-for="option in ageoptions" :value="option.value" :key="option.value" :class="option.value" switch>
                        {{ option.text }}
                    </b-form-checkbox>
                    </b-form-group>               
                </b-col>
            </b-row>
            
            <b-row v-if="histoneIGV">
                <b-col>
                    <b-form-select v-model="histoneselected" :options="histoneoptions" @change="loadHistone()"></b-form-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button @click="saveIGV()">Save IGV Browser Image</b-button>
                </b-col>
            </b-row>
        </b-container>
        <div id="igvtest">
        </div>

    </div>
</template>

<script>
    import igv from 'igv';
    import $ from 'jquery';
    import * as _ from "lodash";
    export default {
        name:  "IGVTest",
        props: ['gene', 'type','age'],
        data: function() {
            return {
                selections: ['access','bedpe'],
                ageselections: [this.age],
                selections3: [],
                chartoptions: [
                { text: 'RNA', value: 'expr' },
                { text: 'Chromatin Accessibility', value: 'access' },
                { text: 'Prom-Enhancer Loops', value: 'bedpe' },
                ],
                ageoptions: [
                { text: 'E11', value: 'E11' },
                { text: 'E12', value: 'E12' },
                { text: 'E13', value: 'E13' },
                { text: 'E14', value: 'E14' },
                { text: 'E16', value: 'E16' },
                { text: 'E18', value: 'E18' },
                { text: 'P0', value: 'P0' },
                { text: 'Adult', value: 'Adult' },
                ],
                histoneselected: "h3k27ac",
                histoneprevious: "",
                histoneoptions: [
                    { value: "h3k4me1", text: "H3k4me1" },
                    { value: "h3k4me3", text: "H3k4me3" },
                    { value: "h3k27me3", text: "H3k27me3" },
                    { value: "h3k27ac", text: "H3k27ac" },
                    { value: "h3k9ac", text: "H3k9ac" },
                ],
                flag: false,
                histoneIGV: false,
                enhancerIGV: false,
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
                        "label": "E11 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E11_h3k27ac.bw",
                        "color": "#4682B4"
                    },
                    {
                        "label": "E12 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E12_h3k27ac.bw",
                        "color": "#800000"
                    },
                    {
                        "label": "E13 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E13_h3k27ac.bw",
                        "color": "#A52A2A"
                    },
                    {
                        "label": "E14 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E14_h3k27ac.bw",
                        "color": "#00B300"
                    },
                    {
                        "label": "E16 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E16_h3k27ac.bw",
                        "color": "#40E0D0"
                    },
                    {
                        "label": "E18 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/E18_h3k27ac.bw",
                        "color": "#ADD9E6"
                    },
                    {
                        "label": "P0 h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/P0_h3k27ac.bw",
                        "color": "#9900FF"
                    },         
                    {
                        "label": "Adult h3k27ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27ac/Adult_h3k27ac.bw",
                        "color": "black"
                    },         
                ],
                h3k4me1tracks: [
                    {
                        "label": "E11 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E11_merged_h3k4me1.bw",
                        "color": "#4682B4",
                    },
                    {
                        "label": "E12 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E12_merged_h3k4me1.bw",
                        "color": "#800000",
                    },
                    {
                        "label": "E13 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E13_merged_h3k4me1.bw",
                        "color": "#A52A2A",
                    },
                    {
                        "label": "E14 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E14_merged_h3k4me1.bw",
                        "color": "#00B300",
                    },
                    {
                        "label": "E16 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E16_merged_h3k4me1.bw",
                        "color": "#40E0D0",
                    },
                    {
                        "label": "E18 h3k4me1 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/E18_merged_h3k4me1.bw",
                        "color": "#ADD9E6",
                    },
                    {
                        "label": "P0 h3k4me1  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/P0_merged_h3k4me1.bw",
                        "color": "#9900FF",
                    },         
                    {
                        "label": "Adult h3k4me1  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me1/Adult_merged_h3k4me1.bw",
                        "color": "black",
                    },         
                ],
                h3k4me3tracks: [
                    {
                        "label": "E11 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E11_merged_h3k4me3.bw",
                        "color": "#4682B4",
                    },
                    {
                        "label": "E12 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E12_merged_h3k4me3.bw",
                        "color": "#800000",
                    },
                    {
                        "label": "E13 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E13_merged_h3k4me3.bw",
                        "color": "#A52A2A",
                    },
                    {
                        "label": "E14 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E14_merged_h3k4me3.bw",
                        "color": "#00B300",
                    },
                    {
                        "label": "E16 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E16_merged_h3k4me3.bw",
                        "color": "#40E0D0",
                    },
                    {
                        "label": "E18 h3k4me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/E18_merged_h3k4me3.bw",
                        "color": "#ADD9E6",
                    },
                    {
                        "label": "P0 h3k4me3  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/P0_merged_h3k4me3.bw",
                        "color": "#9900FF",
                    },         
                    {
                        "label": "Adult h3k4me3  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k4me3/Adult_merged_h3k4me3.bw",
                        "color": "black",
                    },         
                ],
                h3k9actracks: [
                    {
                        "label": "E12 h3k9ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/E12_h3k9ac.bw",
                        "color": "#800000",
                    },
                    {
                        "label": "E13 h3k9ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/E13_h3k9ac.bw",
                        "color": "#A52A2A",
                    },
                    {
                        "label": "E14 h3k9ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/E14_h3k9ac.bw",
                        "color": "#00B300",
                    },
                    {
                        "label": "E16 h3k9ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/E16_h3k9ac.bw",
                        "color": "#40E0D0",
                    },
                    {
                        "label": "E18 h3k9ac BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/E18_h3k9ac.bw",
                        "color": "#ADD9E6",
                    },
                    {
                        "label": "P0 h3k9ac  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k9ac/P0_h3k9ac.bw",
                        "color": "#9900FF",
                    },
                ],
                h3k27me3tracks: [
                    {
                        "label": "E11 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E11_merged_h3k27me3.bw",
                        "color": "#4682B4",
                    },
                    {
                        "label": "E12 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E12_merged_h3k27me3.bw",
                        "color": "#800000",
                    },
                    {
                        "label": "E13 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E13_merged_h3k27me3.bw",
                        "color": "#A52A2A",
                    },
                    {
                        "label": "E14 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E14_merged_h3k27me3.bw",
                        "color": "#00B300",
                    },
                    {
                        "label": "E16 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E16_merged_h3k27me3.bw",
                        "color": "#40E0D0",
                    },
                    {
                        "label": "E18 h3k27me3 BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/E18_merged_h3k27me3.bw",
                        "color": "#ADD9E6",
                    },
                    {
                        "label": "P0 h3k27me3  BAM",
                        "url" : "https://129.114.16.59.xip.io/website-data/IGV/dev-hist-h3k27me3/P0_merged_h3k27me3.bw",
                        "color": "#9900FF",
                    }
                ],
                currentTracks: [],
                currentHistoneTracks: [],
                counter: 0
            }
        },
        methods: {
            saveIGV(){
                let mysvg = this.igvbrowser.toSVG();
                this.igvbrowser.renderSVG(mysvg);
            },
            loadHistone(){
                this.flag = true;
                let currentMark = this.histoneselected;
                let previousMark = this.histoneprevious;
                let mybrowser = this.igvbrowser;
                console.log(currentMark)
                //this.$set(this.configuration, id, {'value': 'default value'})
                this[currentMark+"tracks"].forEach(function(track){
                    mybrowser 
                    .loadTrack(track)
                    .then(function (loadedtrack){
                        console.log("new tracks loaded")
                    })
                    .catch(err=>{console.log(err + " happened")})
                })
                this[previousMark+"tracks"].forEach(function(track){
                    mybrowser
                    .removeTrackByName(track.label);
                })
                this.histoneprevious = this.histoneselected;

            },
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
                    this.histoneIGV = true; 
                    return this.h3k27actracks;
                }
                else if (parent == 'enhancer'){
                    this.flag = true;
                    this.enhancerIGV = true;
                    let track1 = {
                        "label": this.age + ' Prom Access',
                        "url": `https://129.114.16.59.xip.io/website-data/IGV/${this.age}_merged_1bp.bw`,
                        "color": "#800000"
                    };

                    let track2 = {
                        "label": this.age + ' enhancer-promoter loops',
                        "url": `https://129.114.16.59.xip.io/website-data/IGV/${this.age}_enhancers.bedpe`, 
                        "type": "interaction",
                        "format": "bedpe",
                        "color": "#9900FF"
                    }

                    let enhancertrack = [track1,track2]

                    this.currentTracks
                       .push(track1.label, track2.label)

                    return enhancertrack
                }
                else {
                    console.log("page not connected with IGV")
                }
            },
            doSomething(mygene){
                console.log(mygene);
                this.igvbrowser.search(mygene)
                }
            },
            created() {
                this.histoneprevious = this.histoneselected;
            },
            watch: {
                'ageselections': function(){
                    let mybrowser = this.igvbrowser;
                    
                    if (this.currentTracks.length != 0){
                        this.currentTracks.forEach((tracklabel)=>{
                            mybrowser
                            .removeTrackByName(tracklabel);
                        })
                    }

                    this.ageselections.forEach((age)=>{

                       let rnatrack = {
                        "label": `${age} RNA`,
                        "url" : `https://129.114.16.59.xip.io/website-data/IGV/dev-rna-bam/${age}merged.bw`,
                        "color": "#4682B4"
                       }

                       let accesstrack = {
                        "label": `${age} Prom Access`,
                        "url" : `https://129.114.16.59.xip.io/website-data/IGV/${age}_merged_1bp.bw`,
                        "color": "#800000"
                       }

                        let bedpetrack = {
                            "label": `${age} enhancer-promoter loops`,
                            "url": `https://129.114.16.59.xip.io/website-data/IGV/${age}_enhancers.bedpe`, 
                            "type": "interaction",
                            "format": "bedpe",
                            "color": "#9900FF"
                        }

                       let trackset = [rnatrack, accesstrack, bedpetrack]

                       trackset.forEach((tracktype)=>{
                            mybrowser.loadTrack(tracktype)
                            .then(function(newtrack){
                            })
                            .catch((err)=>console.log(err))                       
                       })

                       this.currentTracks
                       .push(rnatrack.label,accesstrack.label)

                    }) 
                },
                'selections3': function(){
                    let mybrowser = this.igvbrowser;
                    if (this.currentHistoneTracks.length != 0){
                        this.currentHistoneTracks.forEach((tracklabel)=>{
                            mybrowser
                            .removeTrackByName(tracklabel);
                        })
                    }

                    let cht = this.currentHistoneTracks
                    let ages = this.ageselections;
                    this.selections3.forEach(function(histonemark){
                        ages.forEach((age)=>{
                            let label = `${age} ${histonemark}`
                            let url = `https://129.114.16.59.xip.io/website-data/IGV/dev-hist-${histonemark}/${age}_merged_${histonemark}.bw`
                            mybrowser.loadTrack(
                            {
                                "label": label,
                                "url" : url,
                                "color": "#00B300",
                            }
                            ).then(function(newtrack){
                            console.log("E11 histone loaded")
                            })
                            .catch((err)=>{
                                let errmsg = `${histonemark} for ${age} does not exist`
                                alert(errmsg)
                            })

                            cht.push(label)
                        })
                    })
                    this.currentHistoneTracks = cht
                }
            }
    }
</script>

<style scoped>
.bedpe {
    margin-left: 60px
}
.expr {
    margin-right: 65px
}
.access {
    margin-left: 70px
}
</style>