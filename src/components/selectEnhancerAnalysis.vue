<template>
  <div>
    <b-container>
      <b-row>
        <p align="justify">
        </p>
      </b-row>
      <br />
      <b-row>
        <b-col class>
          <b-link :to="{ name: 'enhancertf'}">
            <b-img thumbnail src="./images/enhancerTF.png" fluid alt="Responsive image"></b-img>Identify and Visualize TFs for a single age
          </b-link>
        </b-col>
        <b-col class>
          <b-link :to="{ name: 'enhancertfcompare'}">
            <b-img src="./images/circos.png" fluid alt="Responsive image"></b-img>Compare TF activity across different ages
          </b-link>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "selectEnhancerAnalysis",
};
</script>

<style lang="css" scoped>
.colclass {
  border: 1px solid;
  max-width: 30%;
  margin: 30px 40px 0px 140px;
  background-color: snow;
}
.colclass:hover {
  background-color: lightblue;
}
img {
  width: 600px;
  height: 400px;
  border: 1px solid 
}
</style>