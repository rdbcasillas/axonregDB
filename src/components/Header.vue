<template>
    <div>
        <b-navbar variant="dark" type="dark" style="margin-top:-45px">
            <b-navbar-brand tag="h1"> <b-link href="/">AxonRegDb</b-link> </b-navbar-brand>
            <b-navbar-nav class="ml-auto mx-auto" align="center">
                <b-nav-item href="http://ishvenkatesh.com/">Venkatesh Lab</b-nav-item>
                <b-nav-item href="https://www.blackmorelab.com/">Blackmore Lab</b-nav-item>
            </b-navbar-nav>
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-url="https://axonregdb.netlify.com/" data-hashtags="#axonregdb #spinalcordinjury" data-show-count="false">Tweet</a>
        </b-navbar>
        <br>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style lang="css" scoped>
a {
    color:snow;
    text-decoration: none;
}
a:hover {
    color:grey
}
li.nav-item {
    margin-left: 55px;
}
</style>