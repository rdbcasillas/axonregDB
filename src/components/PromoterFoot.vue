<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="colclass">
                        <b-link :to="{ name: 'genetarget'}">
                            Identify Gene Targets of TFs
                        </b-link>
                </b-col>
                <b-col class="colclass">
                        <b-link :to="{ name: 'boundtf'}">
                            Identify TFs bound to target genes
                        </b-link>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
       name: 'PromoterFoot' 
    }
</script>

<style scoped>
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