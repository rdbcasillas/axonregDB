<template>
    <div>
        <b-container fluid="md">
            <b-form-input v-if="chartExists" type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="updateChart" />
            <b-form-input v-else type="text" placeholder="Enter a gene name" v-model="genename" v-on:keyup.enter="drawLineChart" />
        </b-container>
        <br>
        <svg id="myLineChart" ref="myLineChart" width="600px" height="600px"></svg>
        <p>{{ genename }}</p>
    </div>
</template>

<script>

import * as d3 from "d3";
import * as _ from "lodash";
    export default {
       name: "MultiLine" ,
       props: ["expressionData"],
       data() {
           return {
               genename:"",
               height: 600,
               width: 600,
               mydata:[],
               testdata: [],
               chartExists: false,
               yScale: d3.scaleLinear(),
               xScale: d3.scalePoint(),
               yAxis: d3.axisLeft(),
               plotLine: d3.line()
           }
       },
        mounted() {
            this.loadData();
        },
        computed: {
        },
       methods: {
           loadData() {
               d3.tsv("./dev_fpkm.tsv").then((data)=>{
                   const mes = _.keys(data[0]).slice(1,);
                   const genedata = d3
                        .nest()
                        .key(d=>d.external_gene_name)
                        .entries(data);

                    this.mydata = genedata;
               })
           },
           formatData(){
               const newarray = _.find(this.mydata, (obj)=>obj.key==this.genename).values
               const means = _.omit(newarray["0"], "external_gene_name")
               const meansarray = Object.entries(means).map(([name, value]) => ({name,value}));
               return meansarray;
           },
           updateChart(){
               this.testdata = this.formatData();

               this.xScale
                    .domain(this.testdata.map(function(d) {
                        return d.name
                    }))
                    .range([50, this.width - 50])
                    .padding(0.5);

               this.yScale
                .domain([0, d3.max(this.testdata, function(d) {
                    return d.value
                }) * 1.1])
                .range([this.height - 50, 10]);

               this.yAxis = d3.axisLeft(this.yScale);

               d3.select('.y-axis').transition().duration(500).call(this.yAxis);
               d3.select('.line').transition().duration(500)
                    .attr("d", this.plotLine(this.testdata))

           },
            drawLineChart() {
                function transition(path) {
                    path.transition()
                        .duration(1000)
                        .attrTween("stroke-dasharray", tweenDash);
                }
                function tweenDash() {
                    var l = this.getTotalLength(),
                        i = d3.interpolateString("0," + l, l + "," + l);
                    return function (t) { return i(t); };
                }


               this.testdata = this.formatData();
               const margin =  { top: 10, right: 20, bottom: 30, left: 30 };
               
               this.width = 600 - margin.left - margin.right;
               this.height = 600 - margin.top - margin.bottom;

               const currState = this;

               this.xScale
                    .domain(this.testdata.map(function(d) {
                        return d.name
                    }))
                    .range([10, this.width])
                    .padding(0.6).round(true)

                this.yScale
                    .domain([0, d3.max(this.testdata, function(d) {
                        return d.value
                    }) * 1.8])
                    .range([this.height, 0]);

                this.plotLine
                    .x(function(d){ return currState.xScale(d.name)})
                    .y(function(d){ return currState.yScale(d.value)});                

                const svg = d3
                    .select("#myLineChart")
                    .append("svg")
                    .attr("width", this.width + margin.left + margin.right)
                    .attr("height", this.height + margin.top + margin.bottom)

                svg.append("path")
                    .classed("line",true)
                    .attr("d", this.plotLine(this.testdata))
                    .attr("stroke", "teal")
                    .attr("stroke-width", "3")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("fill", "none")
                    .call(transition)



                const xAxis = d3.axisBottom(currState.xScale)
                this.yAxis = d3.axisLeft(currState.yScale);
                
                const g = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                // g.selectAll(".dot")
                //     .data(this.testdata)
                //     .enter()
                //     .append("circle") // Uses the enter().append() method
                //     .attr("class", "dot") // Assign a class for styling
                //     .attr("cx", function(d, i) { return currState.xScale(d.name) })
                //     .attr("cy", function(d) { return currState.yScale(d.value) })
                //     .attr("r", 5);

                g.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(xAxis);

                g.append("g")
                    .attr("class", "y-axis")
                    .call(this.yAxis);

                this.chartExists = true;
           },
       }
    }
</script>

<style lang="scss" scoped>

</style>