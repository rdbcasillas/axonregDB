<template>
    <div>
        <b-navbar class="mynavbar"  style="margin-top:-45px">
            <b-navbar-brand href="/"> 
                <b-img class="icon" src="./mbd.png" alt="axon image"></b-img>
            </b-navbar-brand>
            <!-- <b-navbar-brand tag="h1"> <b-link href="/"><b>AxonRegDb</b></b-link> </b-navbar-brand> -->
            <b-navbar-nav class="mx-auto ml-auto">
                <b-nav-item class="current" @click="checkroute" v-for="link in links" 
                :to="{name: link.route, 
                params: {plotType: link.route}}"
                :key="link.name"
                :active="link.state">
                    {{ link.name }}
                </b-nav-item>
            <b-dropdown :variant="tfstate ? 'outline-success' : 'outline-secondary'" @click="dropdownClick" text="TF-Binding" left>
                <b-dropdown-item :to="{ name: 'selectenhanceranalysis'}">Enhancer</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item :to="{ name: 'promotertf'}">Promoter</b-dropdown-item>
            </b-dropdown>
            </b-navbar-nav>
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-url="https://mousebraindev.com/" data-hashtags="#mousebrain #spinalcordinjury" data-show-count="false">Tweet</a>
                <a href="https://github.com/rdbcasillas/axonregDB"> <b-img class="githublogo" src="./Github-Mark.png"></b-img> </a>
                <a href="ishvenkatesh.com"
                style="font-size:12px;"> Venkatesh Lab </a>
        </b-navbar>
        <br>
    </div>
</template>

<script>
    import * as _ from "lodash";
    import * as $  from "jquery";
    export default {
        name: "Header",
        data: function() {
            return {
                links: [
                    {
                        name: 'Expression',
                        route: 'expression',
                        state: false
                    },
                    {
                        name: 'Accessibility',
                        route: 'featurecount',
                        state: false
                    },
                    {
                        name: 'Histone Enrichment',
                        route: 'histone',
                        state: false
                    },
                    {
                        name: 'Enhancers',
                        route: 'enhancer',
                        state: false
                    },
                ],
                tfstate: false

            }
        },
        methods: {
            checkroute(){
                console.log(this.$route.name)
                this.links.forEach((link)=>{
                    link.state = false
                })
                let currlink = _.find(this.links,{route: this.$route.name})
                currlink.state = true;
            },
            dropdownClick() {
                console.log("hi")
            }
        },
        watch: {
            $route: function(){
               this.tfstate = false;
               let currlink = _.find(this.links,{route: this.$route.name})
               if (currlink) {
                currlink.state = true;
               }
               else {
                this.tfstate = true;
                this.links.forEach((link)=>{
                    link.state = false
                })
               }
            }
        }
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
.nav-link.active
{
    color: #28a745 !important;
    font-weight: bold;
}
</style>