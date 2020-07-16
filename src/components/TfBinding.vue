<template>
    <div>
        <b-container>
            <b-row>
                <p align="justify">
                    ATAC-Seq datasets from ENCODE consortia were footprinted using TOBIAS
                    algorithm to capture TF binding dynamics across nervous system development. 
                </p>
            </b-row>
            <br>
            <b-row>
                <b-col> <b-img thumbnail src="./images/enhancers.png" fluid alt="Responsive image"></b-img></b-col>
            </b-row>
            <br>
            <b-row>
                <b-col class="colclass">
                        <b-link :to="{ name: 'enhancertf'}">
                            Identify TFs bound to gene Enhancers
                        </b-link>
                </b-col>
                <b-col class="colclass">
                        <b-link :to="{ name: 'promotertf'}">
                            Identify TFs bound to gene Promoters
                        </b-link>
                </b-col>
            </b-row>
        </b-container>

    </div>
</template>

<script>
    export default {
       name: 'TfBinding' 
    }
</script>

<style lang="css" scoped>
.colclass {
    border: 1px solid;
    max-width: 30%;
    margin: 30px 40px 0px 140px;
    background-color: snow;
}
.colclass:hover {
    background-color: lightblue;
}
</style>