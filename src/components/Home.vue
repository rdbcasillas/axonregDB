<template>
    <div>
        <b-navbar style="margin-top:-45px">
            <b-navbar-brand tag="h1">AxonRegDb</b-navbar-brand>
            <b-navbar-nav>
                <b-nav-item href="#">Venkatesh Lab</b-nav-item>
                <b-nav-item href="#" >Blackmore Lab</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <b-container class="bv-example-row">
        <br>
        <b-row>
            <b-col> <b-link to="/choose"><b-img thumbnail src="./mousedev.png" fluid alt="Responsive image"></b-img></b-link> </b-col>
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