<template>
  <div>
    <b-container v-if="flag">
      <b-row v-if="enhancerIGV">
        <b-col>
          <b-form-group id="checkbox-group-1">
            <b-form-checkbox
              v-model="selections"
              v-for="option in chartoptions"
              :value="option.value"
              :key="option.value"
              :class="option.value"
              switch
            >
              {{ option.text }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group id="checkbox-group-3"
            >Histone Marks
            <b-form-checkbox
              v-model="histselections"
              v-for="option in histoneoptions"
              :value="option.value"
              :key="option.value"
              :class="option.value"
              switch
            >
              {{ option.text }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group id="checkbox-group-2"
            >Ages To Compare With
            <b-form-checkbox
              v-model="ageselections"
              v-for="option in ageoptions"
              :value="option.value"
              :key="option.value"
              :class="option.value"
              switch
            >
              {{ option.text }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="histoneIGV">
        <b-col>
          <b-form-select
            v-model="histoneselected"
            :options="histoneoptions"
            @change="loadHistone()"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <a id="saveigv" @click="saveIGV()" class="btn btn-primary"
            >Save IGV Browser Image</a
          >
        </b-col>
      </b-row>
    </b-container>
    <div id="igvtest"></div>
  </div>
</template>

<script>
import igv from "igv";
import $ from "jquery";
import * as _ from "lodash";
import { saveAs } from "file-saver";
import { tracks } from "../../assets/scripts/igvpaths.js";
export default {
  name: "IGVTest",
  props: ["gene", "type", "age", "loc"],
  data: function() {
    return {
      selections: ["access", "bedpe"],
      ageselections: [this.age],
      histselections: [],
      chartoptions: [
        { text: "Gene Expression", value: "expr" },
        { text: "Chromatin Accessibility", value: "access" },
        { text: "Prom-Enhancer Loops", value: "bedpe" },
      ],
      ageoptions: [
        { text: "E11", value: "E11" },
        { text: "E12", value: "E12" },
        { text: "E13", value: "E13" },
        { text: "E14", value: "E14" },
        { text: "E16", value: "E16" },
        { text: "E18", value: "E18" },
        { text: "P0", value: "P0" },
        { text: "Adult", value: "Adult" },
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
      igvbrowser: {},
      options: {},
      genename: "",
      accesstracks: tracks.acctracks,
      exptracks: tracks.exptracks,
      h3k27actracks: tracks.h3k27actracks,
      h3k4me1tracks: tracks.h3k4me1tracks,
      h3k4me3tracks: tracks.h3k4me3tracks,
      h3k9actracks: tracks.h3k9actracks,
      h3k27me3tracks: tracks.h3k27me3tracks,
      currentTracks: [],
      currentHistoneTracks: [],
      counter: 0,
      histonesecretflag: false,
    };
  },
  methods: {
    saveIGV() {
      let but = document.getElementById("saveigv");
      let mysvg = this.igvbrowser.toSVG();
      this.svgToPng(mysvg, (imgData) => {
        $("img").remove();
      });
    },
    svgToPng(svg, callback) {
      const url = this.getSvgUrl(svg);
      this.svgUrlToPng(url, (imgData) => {
        callback(imgData);
        URL.revokeObjectURL(url);
      });
    },
    getSvgUrl(svg) {
      return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    },
    svgUrlToPng(svgUrl, callback) {
      const svgImage = document.createElement("img");
      document.body.appendChild(svgImage);
      svgImage.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.drawImage(svgImage, 0, 0);
        canvas.toBlob(function(blob) {
          saveAs(blob, "igv-visual.png");
        });
        const imgData = canvas.toDataURL("image/png");
        callback(imgData);
      };

      svgImage.src = svgUrl;
    },
    loadHistone() {
      this.flag = true;
      let currentMark = this.histoneselected;
      let previousMark = this.histoneprevious;
      let mybrowser = this.igvbrowser;
      console.log(currentMark);
      //this.$set(this.configuration, id, {'value': 'default value'})
      this[currentMark + "tracks"].forEach(function(track) {
        mybrowser
          .loadTrack(track)
          .then(function(loadedtrack) {
            console.log("new tracks loaded");
          })
          .catch((err) => {
            console.log(err + " happened");
          });
      });
      this[previousMark + "tracks"].forEach(function(track) {
        mybrowser.removeTrackByName(track.label);
      });
      this.histoneprevious = this.histoneselected;
    },
    loadH3k4me3() {
      let mybrowser = this.igvbrowser;
      this.h3k4me3tracks.forEach(function(track) {
        mybrowser
          .loadTrack(track)
          .then(function(loadedtrack) {
            console.log("new tracks loaded");
          })
          .catch((err) => {
            console.log(err + " happened");
          });
      });
    },
    loadH3k4me1() {
      let mybrowser = this.igvbrowser;
      this.h3k4me1tracks.forEach(function(track) {
        mybrowser
          .loadTrack(track)
          .then(function(loadedtrack) {
            console.log("new tracks loaded");
          })
          .catch((err) => {
            console.log(err + " happened");
          });
      });
    },
    loadBrowser(geneofinterest) {
      let parent = this.type;
      console.log(this.loc);
      //if (parent == 'featurecount' || parent == 'expression') {
      if (parent == "enhancertf") {
        this.options = {
          genome: "mm10",
          tracks: this.getTracks(),
          locus: this.loc,
          //locus : [geneofinterest]
        };
      } else {
        this.options = {
          genome: "mm10",
          tracks: this.getTracks(),
          //locus: this.loc
          locus: [geneofinterest],
        };
      }
      let currOptions = this.options;
      let currState = this;
      if (this.counter == 0) {
        igv
          .createBrowser($("#igvtest")[0], currOptions)
          .then(function(browser) {
            //browser.loadGenome(currOptions.reference);
            currState.igvbrowser = browser;
            console.log("Browser Loaded");
            //currState.doSomething(geneofinterest);
            // setTimeout(function()
            // {
            //     currState.doSomething(geneofinterest)
            // }, 1000);
          })
          .catch(function(err) {
            console.log(err);
            alert("browser couldn't load. Please refresh");
          });
        this.counter += 1;
      } else {
        this.doSomething(geneofinterest);
        console.log("new gene looked for...");
      }
    },
    getTracks() {
      let parent = this.type;
      if (parent == "expression") {
        return this.exptracks;
      } else if (parent == "featurecount") {
        return this.accesstracks;
      } else if (parent == "histone") {
        this.flag = true;
        this.histoneIGV = true;
        return this.h3k27actracks;
      } else if (parent == "enhancertf") {
        let footprintTrack = {
          label: this.age + " Footprints",
          url: `https://149-165-155-101.traefik.me/website-data/IGV/enhancer-footprints/${this.age}_enhancer_footprints.bw`,
          color: "#800000",
        };

        let conserveTrack = {
          label: "mm10 Cons60wayPlacental",
          url:
            "https://129.114.104.79.nip.io/Enhancer-files/mm10.60way.phastCons60wayPlacental.bw",
          color: "#9900FF",
        };

        let annotationTrack = {
          name: "Motifs",
          type: "annotation",
          format: "bigBed",
          sourceType: "file",
          //url: "https://cors-anywhere.herokuapp.com/http://expdata.cmmt.ubc.ca/JASPAR/downloads/UCSC_tracks/2018/mm10/JASPAR2018_mm10_all_chr.bb",
          url:
            "https://cors-anywhere.herokuapp.com/http://resources.altius.org/~jvierstra/projects/motif-clustering/releases/v1.0/mm10.archetype_motifs.v1.0.bb",
          displayMode: "EXPANDED",
        };
        let annotationTrack2 = {
          name: "Motifs",
          type: "annotation",
          format: "bigBed",
          sourceType: "file",
          url:
            "https://cors-anywhere.herokuapp.com/http://expdata.cmmt.ubc.ca/JASPAR/downloads/UCSC_tracks/2018/mm10/JASPAR2018_mm10_all_chr.bb",
          displayMode: "EXPANDED",
        };

        let trackset = [
          annotationTrack,
          annotationTrack2,
          footprintTrack,
          conserveTrack,
        ];
        return trackset;
      } else if (parent == "enhancer") {
        this.flag = true;
        this.enhancerIGV = true;
        let track1 = {
          label: this.age + " Prom Access",
          url: `https://149-165-155-101.traefik.me/website-data/IGV/${this.age}_merged_1bp.bw`,
          color: "#800000",
        };

        let track2 = {
          label: this.age + " enhancer-promoter loops",
          url: `https://149-165-155-101.traefik.me/website-data/IGV/${this.age}_enhancers.bedpe`,
          type: "interaction",
          format: "bedpe",
          color: "#9900FF",
        };

        let enhancertrack = [track1, track2];

        this.currentTracks.push(track1.label, track2.label);

        return enhancertrack;
      } else {
        console.log("page not connected with IGV");
      }
    },
    doSomething(mygene) {
      console.log(mygene);
      //this.igvbrowser.search(mygene.split("-")[0])
      this.igvbrowser.search(mygene);
    },
    giveBackTracks(age) {
      let histoneselections = [];
      if (this.histonesecretflag) {
        histoneselections = this.oldhistselections;
      } else {
        histoneselections = this.histselections;
      }
      console.log(histoneselections);
      let rnatrack = {
        label: `${age} RNA`,
        url: `https://149-165-155-101.traefik.me/website-data/IGV/dev-rna-bam/${age}merged.bw`,
        color: "#4682B4",
      };

      let accesstrack = {
        label: `${age} Prom Access`,
        url: `https://149-165-155-101.traefik.me/website-data/IGV/${age}_merged_1bp.bw`,
        color: "#800000",
      };

      let bedpetrack = {
        label: `${age} enhancer-promoter loops`,
        url: `https://149-165-155-101.traefik.me/website-data/IGV/${age}_enhancers.bedpe`,
        type: "interaction",
        format: "bedpe",
        color: "#9900FF",
      };
      let histonemarkarr = [];
      histoneselections.forEach((mark) => {
        let markobj = {
          label: `${age} ${mark} bam`,
          url: `https://149-165-155-101.traefik.me/website-data/IGV/dev-hist-${mark}/${age}_merged_${mark}.bw`,
          color: "#00B300",
        };
        histonemarkarr.push(markobj);
      });

      let tmpobj = {
        expr: rnatrack,
        access: accesstrack,
        bedpe: bedpetrack,
      };

      return [tmpobj, histonemarkarr];
    },
  },
  created() {
    this.histoneprevious = this.histoneselected;
    this.oldselections = this.selections;
    this.oldhistselections = this.histselections;
    this.oldageselections = this.ageselections;
  },
  watch: {
    ageselections: function() {
      let mybrowser = this.igvbrowser;
      let histoneselections = this.histselections;
      let generegmarks = this.selections;
      //console.log(histoneselections)
      // if (this.currentTracks.length != 0){
      //     this.currentTracks.forEach((tracklabel)=>{
      //         mybrowser
      //         .removeTrackByName(tracklabel);
      //     })
      // }

      let histonemarkarr = [];

      let addTracks = _.difference(this.ageselections, this.oldageselections);
      let removeTracks = _.difference(
        this.oldageselections,
        this.ageselections
      );

      if (addTracks.length != 0) {
        let tmparr = this.giveBackTracks(addTracks[0]);
        generegmarks.forEach((regmark) => {
          mybrowser
            .loadTrack(tmparr[0][regmark])
            .then((newtrack) => {})
            .catch((err) => console.log(err));
        });
        tmparr[1].forEach((histonetrack) => {
          mybrowser
            .loadTrack(histonetrack)
            .then((newtrack) => {})
            .catch((err) => console.log(err));
        });
      }

      if (removeTracks.length != 0) {
        let tmparr = this.giveBackTracks(removeTracks[0]);
        generegmarks.forEach((regmark) => {
          mybrowser.removeTrackByName(tmparr[0][regmark].label);
        });
        tmparr[1].forEach((histonetrack) => {
          mybrowser.removeTrackByName(histonetrack.label);
        });
      }

      this.oldageselections = this.ageselections;
    },
    histselections: function() {
      let mybrowser = this.igvbrowser;
      let ages = this.ageselections;
      let myfunction = this.giveBackTracks;
      ages.forEach((age) => {
        //     //let currTracks = this.currentTracks;

        let removeTracks = _.difference(
          this.oldhistselections,
          this.histselections
        );
        let addTracks = _.difference(
          this.histselections,
          this.oldhistselections
        );

        if (removeTracks.length != 0) {
          this.histonesecretflag = true;
        }
        let histonetrack = myfunction(age)[1];
        removeTracks.forEach((track) => {
          let removelabel = age + " " + track + " bam";
          let trackobj = _.filter(histonetrack, { label: removelabel })[0];
          mybrowser.removeTrackByName(_.filter(trackobj.label));
          this.histonesecretflag = false;
        });

        addTracks.forEach((track) => {
          let label = age + " " + track + " bam";
          let trackobj = _.filter(histonetrack, { label: label })[0];
          mybrowser.loadTrack(trackobj);
        });
      });

      this.oldhistselections = this.histselections;
    },
    selections: function() {
      let mybrowser = this.igvbrowser;
      let ages = this.ageselections;
      let myfunction = this.giveBackTracks;
      ages.forEach((age) => {
        let tmparr = myfunction(age);
        //     //let currTracks = this.currentTracks;

        let removeTracks = _.difference(this.oldselections, this.selections);
        let addTracks = _.difference(this.selections, this.oldselections);

        removeTracks.forEach((track) => {
          mybrowser.removeTrackByName(tmparr[0][track].label);
          //.removeTrackByName(tmpobj[track].label);
        });

        addTracks.forEach((track) => {
          mybrowser.loadTrack(tmparr[0][track]);
          //.loadTrack(tmpobj[track]);
        });
      });
      this.oldselections = this.selections;
    },
  },
};
</script>

<style scoped>
.bedpe {
  margin-left: 60px;
}
.expr {
  margin-right: 65px;
}
.access {
  margin-left: 70px;
}
</style>
