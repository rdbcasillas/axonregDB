<template>
    <div>
        <b-container class="bv-example-row">
        <br>
        <b-row class="text-center">
            <b-col> <b-img thumbnail src="./mousedev-small.png" fluid alt="Responsive image"></b-img></b-col>
            <b-col cols="8">
                <p align="justify">We have analyzed murine whole cortex time-series RNA-Seq and ATAC-Seq datasets from ENCODE consortia spanning 9 time-points between E11 and Adult. Using these data, we have performed time-series RNA-Seq and ATAC-Seq analyses to capture temporal patterns of gene expression and chromatin accessibility across cortical development. We have also "footprinted" for transcription factors to capture genome-wide patterns of binding across cortical development. We have supplied these data in an interactive format allowing users to retrieve regulatory information for any genes/TFs of interest either genome-wide or within the context of axon growth. </p>
            </b-col>
        </b-row>
        <br>
        <b-row class="guide" style="margin-left:-5px"><h4>Quickstart Guide</h4></b-row>
        <b-row class="guide">
            <p align="justify">
                We've organized the data into six regulatory categories, with widgets below to access each type of data. You can either input individual genes/TFs to retrieve corresponding data or feed in gene lists (upto 100 genes per list) for certain categories. We have an integrated genome browser to visualize patterns in data, and also offer links to view data on external browsers like UCSC and WashU epigenome browser. 
            </p>
        </b-row>
        <b-row>
            <b-col> <b-link :to="{name: 'expression',params: {plotType:'expression'} }"><b-img thumbnail src="./geneExpr-2.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
            <b-col> <b-link :to="{name: 'featurecount',params: {plotType:'featureCount'} }"><b-img thumbnail src="./chrom_access-2.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
        </b-row>
        <b-row>
            <b-col> <b-link :to="{name: 'enhancer', params: {plotType:'enhancer'} }"><b-img thumbnail src="./funenhanc.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
            <b-col> <b-link :to="{name: 'enhancer', params: {plotType:'enhancer'} }"><b-img thumbnail src="./transbind-2.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
        </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "Choose",
        data: function(){
            return {
            }
        }

    }
</script>

<style scoped>
img {
    width: 400px; /* You can set the dimensions to whatever you want */
    height: 180px;
    object-fit: cover;
}
.guide {
    margin-left: -5px;
}

</style>