<template>
  <div>
    <b-container class="bv-example-row">
      <br />
      <b-row class="text-center">
        <b-col class="mouseimage">
          <b-img thumbnail src="./mousedev-small.png" fluid alt="Responsive image"></b-img>
        </b-col>
        <b-col cols="8">
          <p align="justify">
            We have analyzed murine whole cortex time-series RNA-Seq and
            ATAC-Seq datasets from ENCODE consortia spanning 9 time-points
            between E11 and Adult. Using these data, we have performed
            time-series RNA-Seq and ATAC-Seq analyses to capture temporal
            patterns of gene expression and chromatin accessibility across
            cortical development. We have also "footprinted" for transcription
            factors to capture genome-wide patterns of binding across cortical
            development. We have supplied these data in an interactive format
            allowing users to retrieve regulatory information for any genes/TFs
            of interest either genome-wide or within the context of axon growth.
          </p>
        </b-col>
      </b-row>
      <br />
      <b-row class="guide" style="margin-left:-5px">
        <h4>Quickstart Guide</h4>
      </b-row>
      <b-row class="guide">
        <p align="justify">
          We've organized the data into six regulatory categories, with widgets
          below to access each type of data. You can either input individual
          genes/TFs to retrieve corresponding data or feed in gene lists (upto
          100 genes per list) for certain categories. We have an integrated
          genome browser to visualize patterns in data, and also offer links to
          view data on external browsers like UCSC and WashU epigenome browser.
        </p>
      </b-row>
      <b-row>
        <b-col>
          <h5>Gene Expression</h5>
          <b-link :to="{ name: 'expression', params: { plotType: 'expression' } }">
            <b-img thumbnail src="./images/devexp.png" fluid alt="Responsive image"></b-img>
              <div class="middle">
                <div class="text">Explore temporal patterns of expression for multiple genes</div>
              </div>
          </b-link>
        </b-col>
        <b-col>
          <h5>Chromatin Accessibility</h5>
          <b-link :to="{ name: 'featurecount', params: { plotType: 'featureCount' } }">
            <b-img thumbnail src="./images/chromaccess.png" fluid alt="Responsive image"></b-img>

              <div class="middle">
                <div class="text">Explore temporal patterns of promoter accessibility for multiple genes</div>
              </div>
          </b-link>
        </b-col>
        <b-col>
          <h5>Transcription Factor Binding</h5>
          <b-link :to="{ name: 'tfbind', params: { plotType: 'tfbind' } }">
            <b-img thumbnail src="./images/enhancers.png" fluid alt="Responsive image"></b-img>
              <div class="middle">
                <div class="text">Identify upstream TFs or downstream gene targets</div>
              </div>
          </b-link>
        </b-col>

      </b-row>
      <br />
      <b-row>
        <b-col>
          <h5>Functional Enhancers</h5>
          <b-link :to="{ name: 'enhancer', params: { plotType: 'enhancer' } }">
            <b-img thumbnail src="./images/tfbind.png" fluid alt="Responsive image">
            </b-img>
              <div class="middle">
                <div class="text">Identify relevant functional enhancers for genes of interest</div>
              </div>
          </b-link>
        </b-col>
        <b-col>
          <h5>Histone Enrichment</h5>
          <b-link :to="{ name: 'histone', params: { plotType: 'histone' } }">
            <b-img thumbnail src="./images/histonemodule.png" fluid alt="Responsive image"></b-img>
              <div class="middle">
                <div class="text">Explore various histone codes around gene promoters</div>
              </div>
          </b-link>
        </b-col>
        <b-col>
          <h5>Gene Network Analysis</h5>
          <!-- <b-link :to="{ name: 'featurecount', params: { plotType: 'featureCount' } }"> -->
            <b-img thumbnail src="./images/network3d-2.png" fluid alt="Responsive image"></b-img>
              <div class="middle">
                <div class="text">Perform gene network analyses (UNDER CONSTRUCTION)</div>
              </div>
          <!-- </b-link> -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "SelectModule",
  data: function() {
    return {};
  }
};
</script>

<style scoped>
.col .img-fluid {
  width: 350px; /* You can set the dimensions to whatever you want */
  height: 150px;
  transition: .5s ease
}
.col:hover:not(.mouseimage) .img-fluid{
  opacity: 0.2
}
.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.col:hover .middle {
  opacity: 1 
}

h5 {
  margin-bottom: 5px;
}
.guide {
  margin-left: -5px;
}
.text {
  background-color: transparent;
  color: black;
  font-size: 14px;
  font-weight: bold;
  font-family: Georgia, 'Times New Roman', Times, serif;
  padding: 16px 32px;
}
</style>
