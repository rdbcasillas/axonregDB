<template>
    <div>
        <b-container>
            <b-row>
                <p align="justify">
                    ATAC-Seq datasets from ENCODE consortia were footprinted using TOBIAS
                    algorithm to capture binding dynamics across nervous system development. 
                </p>
            </b-row>
            <b-row>
                <b-col> <b-img thumbnail src="./images/tfbind.png" fluid alt="Responsive image"></b-img></b-col>
            </b-row>
            <br>
            <b-row>
                <b-col>
                    <b-button variant="outline-primary">
                        Identify Gene Targets of TFs
                    </b-button>
                </b-col>
                <b-col>
                    <b-button variant="outline-primary">
                        Identify TFs bound to target genes
                    </b-button>
                </b-col>
            </b-row>
        </b-container>

    </div>
</template>

<script>
    export default {
       name: 'TFBind' 
    }
</script>

<style lang="scss" scoped>

</style>