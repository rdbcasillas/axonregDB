<template>
    <div>
        <b-navbar class="mynavbar" variant="light" type="light" style="margin-top:-45px">
            <b-navbar-brand href="#"> 
                <b-img src="./logo.png" alt="axon image"></b-img>
            </b-navbar-brand>
            <b-navbar-brand tag="h1"> <b-link href="/"><b>AxonRegDb</b></b-link> </b-navbar-brand>
            <b-navbar-nav class="mx-auto ml-auto">
                <b-nav-item href="http://ishvenkatesh.com/"><b>Venkatesh Lab</b></b-nav-item>
                <b-nav-item href="https://www.blackmorelab.com/"><b>Blackmore Lab</b></b-nav-item>
            </b-navbar-nav>
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-url="https://axonregdb.netlify.com/" data-hashtags="#axonregdb #spinalcordinjury" data-show-count="false">Tweet</a>
                <a href="https://github.com/rdbcasillas/axonregDB"> <b-img class="githublogo" src="./Github-Mark.png"></b-img> </a>
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
    color:grey;
    text-decoration: none;
}
a:hover {
    color:grey
}
.b-navbar-nav {
    margin-right: 55px;
}
li.nav-item {
    margin-right:84px
}
.githublogo {
    margin-left: 10px;
}
</style>