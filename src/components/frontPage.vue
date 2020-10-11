<template>

        <!-- <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="2000"
        fade
        controls
        indicators
        background="#ababab"
        img-width="800px"
        img-height="600px"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
        >
        <b-carousel-slide class="myclass" v-for="img in images" :key=img.id
        :img-src="img.path">
        </b-carousel-slide>
        </b-carousel> -->
        <v-app>
        <v-carousel 
        dark
        cycle
        interval="4000" 
         :show-arrows="true"
         reverse-transition="fade-transition"
         transition="fade-transition"
         height="650"
         width="600"
         hide-delimiter-background
         >
            <v-carousel-item 
            contain
            class="myimage" v-for="img in images" :key="img.id"
            :src="img.path">
            </v-carousel-item>
        </v-carousel>
        </v-app>
</template>

<script>
    export default {
        name: 'frontPage',
        data: function() {
            return {
                slide: 0,
                sliding: null,
                images:[
                    {'id': 1,
                    'path': './images/FrontFig-1-mod.png'},
                    {'id': 2,
                    'path': './images/FrontFig-2-modified.png'},
                    {'id': 3,
                    'path': './images/FrontFig-3-mod.png'},
                    {'id': 4,
                    'path': './images/FrontFig-4-mod.png'},
                    {'id': 5,
                    'path': './images/FrontFig-5-mod.png'},
                    {'id': 6,
                    'path': './images/FrontFig-6-mod.png'},
                    {'id': 7,
                    'path': './images/FrontFig-7-mod.png'},
                ]
            };
        },
        methods: {
        onSlideStart(slide) {
            this.sliding = true
        },
        onSlideEnd(slide) {
            this.sliding = false
        }
        }
    }
</script>

<style scoped>
.carouseldiv {
    height: 800px;
}
.v-carousel {
    border: 1px solid;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}
</style>