<template>
    <div class="carouseldiv">
        <b-img src="./images/frontstaticfig.png">

        </b-img>
        <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="2000"
        fade
        controls
        indicators
        background="#ababab"
        img-width="800"
        img-height="300"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
        >
        <!-- Text slides with image -->
        <b-carousel-slide
            img-src="./images/carousel1.png"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="./images/carousel2.png">
        </b-carousel-slide>

        <!-- Slides with image only -->
        <!-- <b-carousel-slide img-src="./images/carousel3.png"></b-carousel-slide> -->
        <b-carousel-slide img-src="./images/carousel4.png"></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <!-- <b-carousel-slide>
            <template v-slot:img>
            <img
                class="d-block img-fluid"
                width="400"
                height="400"
                src="https://www.bing.com/th?id=OHR.OkanaganSpots_EN-US8113040044_1920x1080.jpg&rf=LaDigue_1920x1080.jpg"
                alt="image slot"
            >
            </template>
        </b-carousel-slide> -->

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <!-- <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
            a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.
            </p>
        </b-carousel-slide> -->
        </b-carousel>

    </div>
</template>

<script>
    export default {
        name: 'frontPage',
        date: function() {
            return {
                slide: 0,
                sliding: null
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
    width: 500px;
    height: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>