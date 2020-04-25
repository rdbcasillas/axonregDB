<script>
  //Importing Line class from the vue-chartjs wrapper
  import { Line } from 'vue-chartjs'

  //Exporting this so it can be used in other components
  export default {
    extends: Line,
    props: ["labeldata","expressData", "genename","ylabel","title","color","state","datasets"],
    data () {
      return {
        datacollection: {
          //Data to be represented on x-axis
          labels: this.labeldata,
          datasets: this.datasets
        },
        //Chart.js options that controls the appearance of the chart
        options: {
          layout: {
            padding: {
              top: 20,
              bottom: 30
            }
          },
          title: {
            display: true,
            text:  this.title,
            fontSize: 14
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: this.ylabel,
                fontSize: 12
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Developmental time-point',
                fontSize: 12
              }
            }]
          },
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      this.renderChart(this.datacollection, this.options)
    },
    computed:{
        chartData:function(){
            return this.expressData
        }
    },
  }
</script>