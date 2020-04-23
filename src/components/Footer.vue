<template>
    <div class="footer">
        <b-container>
            <b-row>
                <b-col cols="10">
                    <p class="ack">
                        <b>Acknowledgement</b>: This database and underlying analyses are powered by 
                        Extreme Science and Engineering Discovery Environment (XSEDE) supported <br> 
                        by the National Science Foundation. Resource name: Jetstream. 
                        <b>Allocation ID: Venkatesh_IBN180005</b>.
                    </p>
                </b-col>
                <b-col>
                    <b-img right src="./xsedelogo.png"></b-img>
                </b-col>
                <b-col>
                    <b-img right src="./NSFlogo.png"></b-img>
                </b-col>
            </b-row>
        </b-container>
    </div>

</template>

<script>
    export default {
       name: 'Footer' 
    }
</script>

<style scoped>
.footer {
    margin-top:20px;
    position:fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 20px;
    background-color: #f5f5f5;
}
p {
    font-size: 12px;
    margin-bottom: 0px;
}
</style>