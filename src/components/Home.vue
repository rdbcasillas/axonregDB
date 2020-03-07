<template>
    <div>
        <b-container class="bv-example-row">
        <b-row>
            <b-col>1 of 3</b-col>
            <b-col>2 of 3</b-col>
            <b-col>3 of 3</b-col>
        </b-row>
        <br>
        <b-row>
            <b-col> <b-link to="/expression"><b-img thumbnail src="./mousedev.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
            <b-col> <b-link><b-img thumbnail src="./pyramidotomy.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
        </b-row>

        </b-container>
    </div>
</template>

<script>
    export default {
       name: "Home" 
    }
</script>

<style lang="scss" scoped>

</style>