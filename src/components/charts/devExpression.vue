<script>
  //Importing Line class from the vue-chartjs wrapper
  import { Line } from 'vue-chartjs'

  //Exporting this so it can be used in other components
  export default {
    extends: Line,
    props: ["labeldata","expressData","genename","ylabel","title"],
    data () {
      return {
        datacollection: {
          //Data to be represented on x-axis
          labels: this.labeldata,
          datasets: [
            {
              label: this.genename,
              backgroundColor: '#f87979',
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              //Data to be represented on y-axis
              data: this.expressData
            }
          ]
        },
        //Chart.js options that controls the appearance of the chart
        options: {
          title: {
            display: true,
            text:  this.title,
            fontSize: 20
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
                fontSize: 16
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Developmental time-point',
                fontSize: 16
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