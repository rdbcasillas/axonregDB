function chartBuilder() {
    var oldgeneObject;
        var padding = .05;

    const mainGroup = d3.select(".mainviz").append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var updatecategory = false;

    // create ordinal scale range for arcs and chords using colorpalette from colors2.js
    var arcScale = d3.scaleOrdinal()
            .range(colorpalette.arcColors)
    var colorChordScale = d3.scaleOrdinal()
            .range(colorpalette.chordColors);

    var color_permutations;
        var counter = 0;
    // store all data in a new variable
	let currentdata = _.cloneDeep(rgdgenes);

    // function to create the main data structure with  
    // intersections, unique sets, labels etc.  
    function createDataStructure(rgdgenes, columns){
            //mysetObj stores <condition:[list of genes]> key-value pairs
            let mysetObj = {};
            mysetObj = rgdgenes;
            let allkeys = _.keys(mysetObj);
            let myobjlen = allkeys.length;
            let powerset = (arr) => {
                if (arr.length == 0) return [[]];
                else {
                    let e = arr[0];
                    let T = arr.slice(1);
                    return powerset(T).concat(powerset(T).map(X => X.concat([e])))
                }
            }
            keyIndexObj = {};
            keyLengthObj = {};
            for (key in allkeys) {
                keyIndexObj[key] = allkeys[key];
                keyLengthObj[key] = mysetObj[allkeys[key]].length;
            }
            keyIndexArr = _.keys(keyIndexObj);
            let myarr = keyIndexArr;
            //let myarr = allkeys;
            let mykeys = powerset(myarr)
                .filter(xs => xs.length >= 1) // filter out combinations of 0 length.
                .map(xs => xs.join('_')); 

            column_permutations = powerset(columns)
                .filter(xs => xs.length >= 1) // filter out combinations of 0 length.
                .map(xs => xs.join('_')); 
            let myobj = {};
            let myobj_genes = {};
            let intersectArrOfArr = _.spread(_.intersection);
            let brilset = (arrIntersect) => {
                let set = [];
                for (i in arrIntersect) {
                    let newkey = keyIndexObj[arrIntersect[i]];
                    set.push(mysetObj[newkey])
                }
                return set;
            }
            for (let key of mykeys) {
                myobj[key] = intersectArrOfArr(brilset(key.split("_"))).length;
                myobj_genes[key] = intersectArrOfArr(brilset(key.split("_")));
            } 

            if (counter === 0){
                colorChordScale.domain(column_permutations);
            }
            counter +=1;
            let myobj_keys = _.keys(myobj);	
            let connections = [];
            for (key in myobj_keys) { 
                let tinyarr = myobj_keys[key].split("_");
                grouparr = [];
                for (i in tinyarr) {
                    tmpobj = {};
                    tmpobj.group = parseInt(tinyarr[i]);
                    tmpobj.value = myobj[myobj_keys[key]];
                    grouparr.push(tmpobj); 
                }
                connections.push(grouparr);
            }
            
            uniqarr = [];
            for (i in allkeys) {
                let key = allkeys[i];
                currarr = [mysetObj[key]];
                tmpObj = _.omit(mysetObj, key);
                restkeys = _.keys(tmpObj);
                restarr = []
                for (k in restkeys) {
                    restarr.push(mysetObj[restkeys[k]]);
                }
                fullarr = currarr.concat(restarr)
                curruniqset = _.difference.apply(_, fullarr);
                uniqarr.push(curruniqset);
            }
            dataObj = {connections: connections, labels:keyIndexObj,
                        genecount: keyLengthObj, genelist: myobj_genes
                        , uniqgenes: uniqarr, genecountObj: myobj} 
            data = [dataObj];
            return data;
    }
    // end of createDataStructure


    var oldarcs,
        oldchords;

    // d3 is given a chord2 method that adds the capability to draw multichords 
    d3.chord2 = function() {
        var chord = {},
            chords,
            groups,
            connections,
            //padding = 0,
            sortGroups,
            sortSubgroups,
            sortChords,
            width = 1200,
            height = 1000,
            innerRadius = Math.min(width, height) * .60,
            outerRadius = innerRadius * 1.1,
            fontsize = 15,
            colPolyLenMapper = {},
            myarr2 = [],
            arcColors = d3.scaleOrdinal(d3.schemeDark2);
            var arc_counter = 0,
                labelarray = [],
                listarray = [];
        
        // labelset is added to each group's label key, it's defined inside chord2(selection) 
        var labelset;

        function chord2(selection){
            var availsubchords; //  stores chords filtered after operations like filter by gene count

            const lowopacity = 0.1,
                  highopacity = 0.9;

            const t = d3.transition().duration(600);

            selection.each(function (d, i) {
                var selection = d3.select(this);
                var labels = d.labels || (d3.range(chord2.groups().length)
                                          .map(function(n) {return "group" + n;}));
                labelset = labels; 
                connections = d.connections;
                var genecount = d.genecount;
                var genelist = d.genelist;
                var genecountObj = d.genecountObj
                var uniqgenes = d.uniqgenes;
                var labelarr = d.labels
                var last_chords;
                var chordangles = chord2.chords(); 
                var allpolygons = _.map(chordangles, "polygon");
                var arcFunction = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);

                arcData = chord2.groups();
                var arcG = selection.selectAll("g.group")
                    .data(
                        arcData, function(d){
                        return d.label;
                    })
                    .enter().append("g")
                    .attr("class", "group");

                arcG.select("path")
                    .transition(t)
                    .attrTween("d", arcTween(oldarcs));


                arcG.append("path")
                    .attr("class", "arcpath")
                    .attr("id",(d)=>"arc" + d.index)
                    .style("fill", (d,i) => 
                        {
                            return arcScale(d.label);
                        })
                    .style("opacity",0.8);


                d3.select(".mainGroup").selectAll("g.group")
                .data(arcData)
                .select("path")
                    .style("fill", (d,i) => 
                        {
                            return arcScale(d.label);
                        })
                    .transition(t)
                    .attrTween("d", arcTween(oldarcs));

                d3.select(".mainGroup").selectAll("g.group path")
                .data(arcData)
                    .on("mouseover", fadein) // only popover now, no fade
                    .on("mouseout", fadeout)
                    .on("click", clickArc);

                var arcangles = arcData;
                
                // tweening of angles for smooth arc update
                function arcTween(oldLayoutArcs){
                    var oldGroups = {};
                    if (oldLayoutArcs){
                        oldLayoutArcs.forEach(function(item){
                            let oldangles = {
                                startAngle: item.startAngle,
                                endAngle: item.endAngle
                            };
                            oldGroups[item.label] = item;
                        })
                    }
                    return function(d,i){
                        var tween;
                        var old = oldGroups[d.label];
                        if (old) {
                            tween = d3.interpolate(old, d)
                        }
                        else {
                            var emptyArc = {
                                    startAngle: d.startAngle,
                                    endAngle: d.startAngle
                                };
                            tween = d3.interpolate(emptyArc, d);
                        }

                    return function(t) {
                        return arcFunction(tween(t));
                    };
                  };
                }
                oldarcs = arcangles;

                var groupLabels = function (d) {
                    return {angle: (d.startAngle + d.endAngle) / 2,
                            label: labelarr[d.index]};
                };

                arcG
                    .append("g")
                    .attr("transform", function(d) {
                        let newd = groupLabels(d);
                        return "rotate(" + (newd.angle * 180 / Math.PI - 90) + ")"
                            + "translate(" + (outerRadius + 5) + ",0)";})
                    .append("text")
                    .attr("class", "labelstyle")
                    .attr("x", 8)
                    .attr("dy", ".35em");
           
                d3.selectAll("g.group")
                    .data(arcData)
                    .select("g")
                    .attr("transform", function(d) {
                        let newd = groupLabels(d);
                        return "rotate(" + (newd.angle * 180 / Math.PI - 90) + ")"
                            + "translate(" + (outerRadius + 5) + ",0)";})
                    .select("text")
                    .attr("class", "labelstyle")
                    .attr("transform",
                      function(d) { 
                         let newd = groupLabels(d);
                          return newd.angle > Math.PI ? 
                                "rotate(180)translate(-16)" : "rotate(0)"; })
                    .attr("text-anchor",
                           function(d) { 
                               let newd = groupLabels(d);
                               return newd.angle > Math.PI ? 
                                         "end" : "begin"; })
                    .text(function(d,i) { 
                               let newd = groupLabels(d);
                                return newd.label ; })

                d3.selectAll("g.group text")
                    .append('tspan')
                    .attr("x", "0")
                    .attr("dy", "1.3em")
                    .style("font", "italic bold 0.8em Arial")
                    .html(function(d,i){return genecountObj[i] + " genes";})

                d3.selectAll("g.group")
                .data(arcData)
                .exit()
                    .transition(t)
                    .attr("opacity",0)
                    .remove();

                var ribbon = d3.ribbon().radius(innerRadius - 5)
                           
                var chordPaths = selection
                    .selectAll("path.chordpath")
                    .data(chordangles)
                    .enter().append("path")
                    .attr("class", "chordpath");

                let labelvalues = _.values(labelarr);
                chordPaths
                    .attr("id", createId)
                    .attr("data-chord-value", (d)=>{
                        let labelarr = Object.keys(d.groups).reverse(); // helps in searching for gene 
                        let labelarrprop = labelarr.join("_");          
                        return labelarrprop;
                    })
                    .style("fill", (d)=>{
                        // create a <color: number-of-sides-of-polygon> mapper
                        // useful for filtering chords using radio buttons (intersection type)
                        let labelkeys = Object.keys(d.groups).reverse();
                        let labelkeyjoin = _.map(labelkeys, function(item){
                            return labelvalues[parseInt(item)] 
                        }).join("_");
                        return setChordColor(d, labelkeyjoin);
                        })
                    .style("opacity", highopacity)
                    .style("fill-opacity", 0.8)
                    .style("stroke-width", 1.5)
                    .style("stroke", (d)=>{
                        let labelkeys = Object.keys(d.groups).reverse();
                        let labelkeyjoin = _.map(labelkeys, function(item){
                            return labelvalues[parseInt(item)] 
                        }).join("_");

                        return setChordStroke(d, labelkeyjoin);
                    });

                chordPaths
                    .transition(t)
                    .attrTween("d", chordTween(oldchords))
                
                d3.select(".mainGroup")
                    .selectAll(".chordpath")
                    .data(chordangles)
                    .attr("id", createId)
                        .style("fill", (d)=> {
                            let sourceval = d.source.startAngle;
                            let targetval = d.target.startAngle;
                            let labelkeys = Object.keys(d.groups).reverse();
                            let labelkeyjoin = _.map(labelkeys, function(item){
                                return labelvalues[parseInt(item)] 
                            }).join("_");
                            curr_item = colorChordScale(labelkeyjoin);
                            if (!colPolyLenMapper.hasOwnProperty(curr_item)) {
                                colPolyLenMapper[curr_item] = (sourceval == targetval) ? 0 : 1;
                            }
                            else {
                                colPolyLenMapper[curr_item] ++ ;
                            }
                            return setChordColor(d, labelkeyjoin);
                        })
                        .style("stroke", (d)=> {
                            let labelkeys = Object.keys(d.groups).reverse();
                            let labelkeyjoin = _.map(labelkeys, function(item){
                                return labelvalues[parseInt(item)] 
                            }).join("_");
                            return setChordStroke(d, labelkeyjoin);
                        })
                    .on("click", clickChord)
                    .on("mouseover", mouseoverChord)
                    .on("mouseout", mouseoutChord);
                   
                availsubchords = d3.selectAll(".chordpath");
                d3.select(".mainGroup")
                    .selectAll(".chordpath")
                    .transition(t)
                    .attrTween("d", chordTween(oldchords));

                d3.selectAll(".chordpath")
                    .data(chordangles)
                    .exit()
                    .remove();

                oldchords = chordangles;
                
                function setChordStroke(d,labelkey){
                    if (d.source.index == d.target.index){
                        return d3.rgb(arcScale(labels[d.source.index])).darker();
                    }
                    else {
                       return d3.rgb(colorChordScale(labelkey)).darker();
                    }
                }

                function setChordColor(d, labelkey){
                    if (d.source.index == d.target.index){
                        return arcScale(labels[d.source.index]);
                    }
                    else {
                       return colorChordScale(labelkey);
                    }
                }

                function chordKey(data) {
                    return (data.source.index < data.target.index) ?
                        data.source.index  + "-" + data.target.index:
                        data.target.index  + "-" + data.source.index;
                }

                function chordTween(oldLayout) {
                    var oldChordObj = {};
                    if (oldLayout){
                        oldLayout.forEach(function(chordData){
                            oldChordObj[chordKey(chordData)] = chordData;
                        });
                    }
                    return function(d,i){
                        let tween;
                        var old = oldChordObj[chordKey(d)];
                        if (old){
                            if (d.source.index != old.source.index ){
                                //swap source and target to match the new data
                                old = {
                                    source: old.target,
                                    target: old.source
                                };
                            }
                            tween = d3.interpolate(old, d);

                        }
                        else {
                            var emptyChord = {
                                source: {
                                    startAngle: d.source.startAngle,
                                    endAngle: d.source.startAngle
                                },
                                target: {
                                    startAngle: d.target.startAngle,
                                    endAngle: d.target.startAngle
                                }
                            }
                            tween = d3.interpolate(emptyChord, d)
                        }	
                        return function(t) {
                            return ribbon(tween(t));
                        }
                    }
                }

                
                // a button that resets to default state of elements 
                d3.select('.resetbutton')
                .on("click", resetEverything);

                
                function resetEverything(){
                    resetchords();

                    d3.selectAll('.check')
                    .property("checked", false);

                    d3.select('#allcheck')
                    .property("checked", true);

                    d3.select('#genelist')
                    .html("Click on an arc or a chord to see the list of genes");

                    d3.select("#searchgene")
                    .html("");
                }

                // variable containing polygon types for drawing radiobuttons
                // (based on number of "sides") 
                let checkboxcount = _.uniq(Object.values(colPolyLenMapper)); 
                // add another item to draw "all" radiobutton
                checkboxcount.push("all");
            
                let checkdiv = d3.select('.radiobuttons')

                // each radiobutton gets its own div which will contain
                // both label and the corresponding radiobutton
                let divs = checkdiv.selectAll('div')
                    .data(checkboxcount)
                    .enter().append('div')
                    .attr('class', 'checkdiv');


                // draw labels
                divs.append('label')
                    .html((d)=>{
                        return (d === "all") ? "All" 
                        : (d===0) ? "Uniq" 
                        : (d===1) ? "2" 
                        : d;
                });
                
                var flag = "unchecked"
                // draw radiobuttons
                divs.append('input').attr('type', 'radio')
                    .attr('id', (d)=>{
                        return (d === "all") ? "allcheck"
                        : (d === 0) ? "unique"
                        : "common" + d;
                    })
                    .attr('class', 'check')
                    .attr('name', 'checkbox')
                    .property('checked', (d)=>{
                        return d === "all";
                    })
              
                
                d3.selectAll('.checkdiv')
                    .data(checkboxcount)
                    .select('label')
                    .html((d)=>{
                        return (d === "all") ? "All" 
                        : (d===0) ? "Unique" 
                        : (d===1) ? "2" 
                        : d;
                });

                d3.selectAll('.checkdiv')
                    .data(checkboxcount)
                    .select('.check')
                    .attr('id', (d)=>{
                        return (d === "all") ? "allcheck"
                        : (d === 0) ? "unique"
                        : "common" + d;
                    })
                    .property('checked', (d)=>{
                        return d === "all";
                    })
                    .on("change", filterChords);          

                d3.selectAll(".checkdiv").data(checkboxcount).exit().remove();
                // reduce opacity and remove mouse pointer event for 
                // chords not associated with radio button
                function filterChords(){
                    d3.selectAll(".arcpath")
                    .style("pointer-events", "none");
                    let id = d3.select(this).attr("id");
                    if (id === "unique") {
                            flag = "checked"
                            resetchords();
                            d3.selectAll('.chordpath')
                                .filter(function(){ return d3.select(this).attr('id').includes("comm");  })
                                .style("opacity", lowopacity)
                                .style("pointer-events", "none");
                            availsubchords = d3.selectAll('.chordpath')
                                .filter(function(){
                                    return d3.select(this).style('opacity') == highopacity;
                                })
                    }

                    else {
                        let currID = d3.select(this).attr("id").slice(-1);
                        if (currID === 'k'){
                            flag = "unchecked"
                            resetchords();
                            d3.selectAll(".arcpath")
                                .style("pointer-events", "auto");
                            availsubchords = d3.selectAll(".chordpath");
                        }
                        else {
                            flag = "checked"
                            resetchords();
                            currID = parseInt(currID);
                            fadechord(currID, lowopacity);
                            availsubchords = d3.selectAll('.chordpath')
                                .filter(function(){
                                    return d3.select(this).style('opacity') == highopacity;
                            })
                        }
                    }
                }

                // reset all the chords to default state (All radio button)
                function resetchords(){
                    d3.selectAll('.chordpath')
                        .style("opacity", highopacity)
                        .style("pointer-events", "auto")
                        .style('fill-opacity', 0.8)
                        .style('stroke-width', 1.5);

                }
                
                // function to filter chords based on polygon sides (radio buttons)
                function fadechord(numbersToFade, opacity) {
                    let myarr = [];

                    Object.keys(colPolyLenMapper).forEach(function(key) {
                        if (colPolyLenMapper[key] !== numbersToFade) {
                            myarr.push(d3.rgb(key).toString());
                        }
                    });

                    d3.selectAll('.chordpath')
                        .filter(function(){
                            return myarr.includes(d3.select(this).style("fill")) ||
                                d3.select(this).attr("id").includes("uniq");
                         })
                        .style("opacity", opacity)
                        .style("fill-opacity", 0.3)
                        .style("stroke-width", 0.3)
                        .style("pointer-events", (d)=>{
                            return (opacity === lowopacity) ? "none" : "auto";
                        });
                } 
            

                function clickArc(d,i) {
                    d3.selectAll('.chordpath').style("stroke-width", 1.5);
                    let arc = d3.select(this);
                    let strokewidth = d3.select(this).style("stroke-width");
                    if (strokewidth == 3) {
                        arc_counter -= 1;
                        arc.style("stroke-width", 0);
                        if (arc_counter == 0){
                            d3.select("#genelist")
                                .style("font-weight","normal")
                                .html("Click on an arc or a chord to see the gene list");
                            labelarray = [];
                            listarray = [];
                        }
                        else {
                            let listlen = genelist[d.index].length;
                            for (i=0;i<listarray.length;i++) {
                               if (listarray[i].length == listlen){
                                   listarray.splice(i,1);
                                   labelarray.splice(i,1)
                               }
                            }
                            let unionlist = _.sortBy(_.union.apply(_,listarray));
                            let unionmsg = labelarray.join(" UNION ")
                            d3.select("#genelist")
                                .style("font-weight","bold")
                                .html(unionmsg + "<br> Total genes: " 
                                    + unionlist.length + " <br /> " + unionlist);
                        }
                    }
                    else {
                        arc_counter += 1;
                        arc.style("stroke","black")
                        .style("stroke-width", 3);
                        //let genelistpara = genelist[d.index].join(", ");
                        listarray.push(genelist[d.index]);
                        labelarray.push(labels[d.index]);
                        let unionlist = _.sortBy(_.union.apply(_,listarray));
                        let unionmsg = labelarray.join(" UNION ")
                        d3.select("#genelist").
                            style("font-weight","bold")
                            .html(unionmsg + "<br><br> Total genes: " + 
                                unionlist.length +  "<br>" + unionlist );
                    }
                }

                function split( val ) {
                  return val.split( /,\s*/ );
                }

                function extractLast( term ) {
                  return split( term ).pop();
                }

                var allgenearray = _.uniq(_.flatten(_.values(genelist)));
                $( "#searchgene" )
                  .on( "keydown", function( event ) {
                      if (this.value == ""){
                        d3.selectAll('.chordpath')
                              .style("opacity", highopacity)
                              .style('pointer-events', "auto");

                        d3.selectAll(".arcpath")
                            .style('pointer-events', "auto");
                      }
                    if ( event.keyCode === $.ui.keyCode.TAB &&
                        $( this ).autocomplete( "instance" ).menu.active ) {
                      event.preventDefault();
                    }
                  })
                  .autocomplete({
                    minLength: 1,
                    source: function( request, response ) {
                      // delegate back to autocomplete, but extract the last term
                      response( $.ui.autocomplete.filter(
                        allgenearray, extractLast( request.term ) ).slice(0,15) );
                    },
                    focus: function() {
                      // prevent value inserted on focus
                      return false;
                    },
                    select: function( event, ui ) {
                      var terms = split( this.value );
                      // remove the current input
                      terms.pop();
                      // add the selected item
                      terms.push( ui.item.value );
                      // add placeholder to get the comma-and-space at the end
                      terms.push( "" );
                      this.value = terms.join( ", " );
                        let temp_terms = terms;
                        temp_terms.pop();
                        let mykeys = Object.keys(genelist);
                        d3.selectAll(".arcpath")
                            .style('pointer-events', "none");
                        mykeys.forEach(function(key){
                            let caseArray = _.map(genelist[key], function(item){return item;});
                            if (_.difference(temp_terms, caseArray).length === 0) {
                               d3.selectAll('.chordpath')
                                    .filter(function(){ 
                                        let thischord = d3.select(this);
                                        return thischord.attr("data-chord-value") === key; 
                                    })
                                    .style("opacity", highopacity) 
                                    .style('pointer-events', "auto");
                            }
                            else {
                               d3.selectAll('.chordpath')
                                    .filter(function(){ return d3.select(this)
                                        .attr("data-chord-value") === key })
                                        .style("opacity", lowopacity)
                                        .style('pointer-events', "none");
                            }
                        })
                        // chords representing unique genes need not be shown 
                        let filt_commonchords = d3.selectAll('.chordpath')
                            .filter(function(){
                                return d3.select(this).attr("id").includes("comm")
                            })
                            .filter(function(){
                                return d3.select(this).style('opacity') == highopacity;
                            })

                        if (filt_commonchords.data().length !== 0){

                            d3.selectAll('.chordpath')
                                .filter(function(){return d3.select(this)
                                        .attr("id").includes("uniq")})
                                .style("opacity", lowopacity)
                                .style('pointer-events', "none");
                        }
                        
                        availsubchords = d3.selectAll('.chordpath')
                            .filter(function(){
                                return d3.select(this).style('opacity') == highopacity;
                            });
                      return false;
                    }
                  });

                d3.select("#chordvalue").on("input", function(){
                      let filter = this.value;
                      let filterlen = this.value.length;
                    if (flag === "unchecked"){
                        availsubchords = d3.selectAll('.chordpath');
                    }
                    if (filter == 0 || filterlen == 0){
                       availsubchords 
                        .transition(t)
                        .style('opacity', highopacity)
                        .style('pointer-events', "auto");
                        d3.selectAll(".arcpath")
                            .style('pointer-events', "auto");
                    }
                    else {
                        d3.selectAll(".arcpath")
                            .style('pointer-events', "none");
                        if ($('#filter option:selected').val() === "smaller"){
                         availsubchords 
                            .filter((d)=> { return d.source.value > filter; })
                            .transition(t)
                            .style('opacity', lowopacity)
                            .style('pointer-events', "none");

                         availsubchords 
                            .filter((d)=> { return d.source.value < filter; })
                            .transition(t)
                            .style('opacity', highopacity)
                            .style('pointer-events', "auto");
                        }
                        else if ($('#filter option:selected').val() === "greater"){
                             availsubchords 
                                .filter((d)=> { return d.source.value < filter; })
                                .transition(t)
                                .style('opacity', lowopacity)
                                .style('pointer-events', "none");

                             availsubchords 
                                .filter((d)=> { return d.source.value > filter; })
                                .transition(t)
                                .style('opacity', highopacity)
                                .style('pointer-events', "auto");
                        }
                    }
                });
                
                function clickChord(d,i){
                    let id = d3.select(this).attr("id");
                    let labelarr = Object.keys(d.groups).reverse();
                    let labelcomm = [];
                    let labelarrprop = labelarr.join("_");
                    let genelistpara = genelist[labelarrprop].join(", ");
                    var chordcolor = d3.select(this).style('fill');
                    var chordlength = d3.select(this)["_groups"][0][0].getTotalLength();

                    notcurr_chord = d3.selectAll('.chordpath')
                        .filter(function(){ return d3.select(this)
                                .style('fill') !== chordcolor });
                    curr_chord = d3.selectAll('.chordpath')
                        .filter(function(){ return d3.select(this)
                                .style('fill') === chordcolor });
                    notcurr_chord.style("stroke-width", 0);
                    d3.selectAll('.arcpath').style("stroke-width", 0)
                    let strokewidth = curr_chord.style("stroke-width");
                    if (strokewidth == 3) {
                        curr_chord.style("stroke-width", 1.5);
                        curr_chord.style("fill-opacity", highopacity);
                        notcurr_chord.style("fill-opacity", highopacity);
                        notcurr_chord.style("stroke-width", 1.5);
                        d3.select("#genelist")
                            .style("font-weight","normal")
                            .html("Click on an arc or a chord to see the gene list");
                    }
                    else {
                        curr_chord.style("stroke-width", 3);
                        curr_chord.style("fill-opacity", 1);
                        notcurr_chord.style("fill-opacity", 0.6);
                        if (id.includes("comm")){
                            d3.select("#genelist")
                                .style("font-weight","bold")
                                .html("Gene count: " + genelist[labelarrprop].length +   "<br> <em>" + genelistpara + "</em>");
                        }
                        else {
                            let idnumber = parseInt(id.slice(-1));
                            d3.select("#genelist")
                                .style("font-weight","bold")
                                .html("Unique genes count " + uniqgenes[idnumber].length +   "<br> <em>" + uniqgenes[idnumber] + "</em>");
                        }
                    }
                }
                
                // create ID for chords to seperate unique and common 
                function createId(d,i){
                    if (d.source.index != d.target.index) {
                        return "comm" + i;
                    }
                    else {
                        return "uniq" + d.polygon;
                    }
                }

                let filt_chords = d3.selectAll('.chordpath')
                    .filter(function(){ return d3.select(this).style('opacity') == highopacity } )


                // When cursor over a chord, fade all other "available "chords
                function mouseoverChord(d,i) {
                    //Decrease opacity to all
                    if (
                        $("#allcheck").is(":checked") &&
                        $("#searchgene").val === "" &&
                        ($("#chordvalue").val() === "" || $("#chordvalue").val() === "0")
                        )
                        {
                            resetchords(); 
                        }
                    else {
                        var chordcolor = d3.select(this).style('fill');

                        availsubchords
                                .filter(function(){ return d3.select(this).style('fill') != chordcolor } )
                                .transition()
                                .style("opacity", lowopacity)
                                .style("fill-opacity", 0.6);
                    }
                    
                    let labelarr = Object.keys(d.groups);
                    let labelcomm = [];
                    for (i=0;i<labelarr.length;i++){
                        labelcomm.push(labels[labelarr[i]]);
                    }
                    $(this).popover({
                        placement: 'auto top',
                        container: 'body',
                        mouseOffset: 10,
                        followMouse: true,
                        trigger: 'hover',
                        html : true,
                        content: function() { 
                            if (d.source.index != d.target.index) {
                                return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"
                                + labelcomm.join(", ") +   
                                       "</span> have <span style='font-weight:900'>" + d.source.value + "</span> genes in common </p>"; 
                                }
                            else {
                                return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"
                                + labelcomm.join(", ") +   
                                       "</span> has <span style='font-weight:900'>" + uniqgenes[d.polygon].length + "</span> unique genes</p>"; 
                            }
                        }
                    });
                    $(this).popover('show');
                }
               
                // When cursor out of a chord, bring back all "available" chords to the foreground
                function mouseoutChord(d,i) {
                    var chordcolor = d3.select(this).style('fill');
                    availsubchords
                            .filter(function(){ return d3.select(this).style('fill') != chordcolor } )
                            .transition()
                            .style("opacity", highopacity)
                            .style("fill-opacity", 0.6);

                    d3.select("#genelist")
                        .style("font-weight","lighter");
                }
               
                // When cursor over an arc, fade all the chords not rooted in this arc
                function fadein(d,i) {
                        d3.selectAll(".chordpath")
                            .filter(function(d) { 
                                    return !((i + '') in d.groups); })
                            .transition()
                            .style("opacity", lowopacity);
                  }

                // When cursor out of an arc, bring brack all chords to foreground
                function fadeout(d,i){
                    //$(this).popover('hide');
                    d3.selectAll(".chordpath")
                        .filter(function(d) { 
                                return !((i + '') in d.groups); })
                        .transition()
                        .style("opacity", highopacity);
                }
            });
        }


        // The real deal starts here! 
        // Creation of multichords and arcs, along with their angles!
        // To get a general idea of how chord diagrams work in d3, 
        // read a brilliant SO answer by AmeliaBR here: 
        // https://stackoverflow.com/questions/21813723
        function relayout() {
            var subgroups     = [],
                groupSums     = {},
                subgroupIndex = [],
                polygons      = [],
                poly          = {edges:    [],
                         vertices: {}},
                samebase      = [],
                ngroups       = 0,
                groupIndex,
                pt1, pt2,
                pt, ep,
                k, x, x0, i, j, h;

            chords = [];
            groups = [];
            var numSeq;

            k = 0, i = -1; 
            while (++i < connections.length) {
                j = -1; 
                while (++j < connections[i].length) {
                    ep = connections[i][j].group;
                    if (ep in groupSums) {
                        groupSums[ep] += connections[i][j].value;
                    } else {
                        groupSums[ep] = connections[i][j].value;
                        ++ngroups;
                    }
                    k += connections[i][j].value;
                }
            }
            
            groupIndex = d3.range(ngroups);
          
            if (sortGroups) {
                groupIndex.sort(function(a, b) {
                    return sortGroups(groupSums[a], groupSums[b]);
                });
            }

            k = (2 * Math.PI - padding * ngroups) / k;
            
            i = -1; while (++i < connections.length) {
                // if singleton, make the source and target exactly same	
                if (connections[i].length == 1) {
                    poly.edges.push({
                source: connections[i][0],
                target: connections[i][0]
                });
                }

                if (connections[i].length >= 1) {
                j = 0; while (++j < connections[i].length) {
                    // the polygon keeps track of links which share groups.
                    poly.edges.push({
                source: connections[i][j-1],
                target: connections[i][j]
                });
                    // the only purpose of poly.vertices is later lookup,
                    // so I use it as a set. I convert vertices ID to string with + ''
                    poly.vertices[connections[i][j-1].group + ''] = '';
                }
                poly.vertices[connections[i][j-1].group + ''] = '';
                // close the polygon, unless it has only one side.
                if (poly.edges.length > 1) {
                    poly.edges.push({
                    source: connections[i][0],
                    target: connections[i][j-1]
                });
                }
                polygons.push(poly);
                poly = {edges: [],
                    vertices: {}};
                
            }};
            
            i = -1; while (++i < ngroups) {
                subgroups[i] = [];
                j = -1; while (++j < polygons.length) {
                samebase = {'ribbons': [],
                        'basevalue': 0};
                    h = -1; while (++h < polygons[j].edges.length) {
                    if (polygons[j].edges[h].source.group === polygons[j].edges[h].target.group) {
                    }
                    if (polygons[j].edges[h].source.group === i) {
                        samebase.ribbons.push(polygons[j].edges[h]);
                        samebase.basevalue = polygons[j].edges[h].source.value;
                    } else if (polygons[j].edges[h].target.group === i) {
                        samebase.ribbons.push(polygons[j].edges[h]);
                        samebase.basevalue = polygons[j].edges[h].target.value;
                    }
                }
                subgroups[i].push(samebase);
                let baseval = samebase.basevalue;
                    if (baseval !== 0){
                    }
                }
            }


            // Now I handle the empty spaces, i.e. singletons in connections
            i = -1; while (++i < connections.length) {
                if (connections[i].length === 1) {
               singletonbase = {'ribbons': [],
                            'basevalue':connections[i][0].value};
                    }
                }

            // last pass on subgroups to create indices
                i = -1; 
                while (++i < ngroups) {
                numSeq = [];
                for (var m = 0; m < ngroups; m++) {
                    numSeq[m] = (ngroups+(i-1))%ngroups;
                }
                subgroupIndex.push(d3.range(subgroups[i].length));
                //subgroupIndex.push(numSeq);
            }

            // Sort subgroups…
            if (sortSubgroups) {
                subgroupIndex.forEach(function(d, i) {
                    d.reverse(function(a, b) {
                        return sortSubgroups(subgroups[i][b].basevalue,
                                 subgroups[i][a].basevalue);
                    });
                });
            }

            x = 0, i = -1; while (++i < ngroups) {
                var di = groupIndex[i];
                x0 = x, j = -1; while (++j < subgroupIndex[di].length) {
                    var dj = subgroupIndex[di][j],
                        // take numerical ID as subgroup key
                    v = subgroups[di][dj].basevalue,
                    a0 = x,
                        a1 = x += v * k;
                    // here you should directly modify the "edges",
                // then access them back via polygons
                // I now extend polygons elements with new properties.
                h = -1; while(++h < subgroups[di][dj].ribbons.length) {
                    // pick the right end of the edge to be augmented
                    pt1 = subgroups[di][dj].ribbons[h].source;
                    pt2 = subgroups[di][dj].ribbons[h].target;
                    if (pt1.group === di) { pt = pt1; }
                    else { pt = pt2; }
                    // Only one of the two groups per iteration
                    // is augmented with the 'geometry' property.
                    // I will read this object back from the 'polygons' object.
                    pt['geometry'] = {
                        index: di,
                        subindex: dj,
                        startAngle: a0,
                        endAngle: a1,
                        value: v
                        };
                }
                }
                groups[di] = {
                index: di,
                    startAngle: x0,
                    endAngle: x,
                    value: (x - x0) / k,
                    label: labelset[di] 
                };
                x += padding;
            }
            // Generate chords for each (non-empty) subgroup-subgroup link.
            i = -1; while (++i < polygons.length) {
                j = -1; while (++j < polygons[i].edges.length) {
                    var source = polygons[i].edges[j].source.geometry,
                        target = polygons[i].edges[j].target.geometry;
                    if (source.value || target.value) {
                        chords.push(source.value < target.value
                                    ? {source: target, 
                                       target: source, 
                                       groups: polygons[i].vertices,
                                       polygon: i}
                                    : {source: source, 
                                       target: target, 
                                       groups: polygons[i].vertices,
                                       polygon: i});
                    }
                }
            }

            if (sortChords) resort();
        }

        function resort() {
            chords.sort(function(a, b) {
                return sortChords(
                    (a.source.value + a.target.value) / 2,
                    (b.source.value + b.target.value) / 2);
            });
        }


		// Not used in this program
        chord2.colorschemeArcs = function(x) {
            if (!arguments.length) return colorschemeArcs;
            colorschemeArcs = x;
            chords = groups = null;
            return chord2;
        };
        
        chord2.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            innerRadius = Math.min(width, height) * .30;
            outerRadius = innerRadius * 1.1;
            chords = groups = null;
            return chord2;
        };

        chord2.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            innerRadius = Math.min(width, height) * .30;
            outerRadius = innerRadius * 1.1;
            chords = groups = null;
            return chord2;
        };

        chord2.fontsize = function(x) {
            if (!arguments.length) return fontsize;
            fontsize = x;
            return chord2;
        };

        chord2.innerRadius = function(x) {
            if (!arguments.length) return innerRadius;
            innerRadius = x;
            outerRadius = innerRadius * 3.1,
            chords = groups = null;
            return chord2;
        };

        chord2.connections = function(x) {
            if (!arguments.length) return connections;
            connections = x;
            chords = groups = null;
            return chord2;
        };

        chord2.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            chords = groups = null;
            return chord2;
        };

        chord2.sortGroups = function(x) {
            if (!arguments.length) return sortGroups;
            sortGroups = x;
            chords = groups = null;
            return chord2;
        };

        chord2.sortSubgroups = function(x) {
            if (!arguments.length) return sortSubgroups;
            sortSubgroups = x;
            chords = null;
            return chord2;
        };

        chord2.sortChords = function(x) {
            if (!arguments.length) return sortChords;
            sortChords = x;
            if (chords) resort();
            return chord2;
        };

        chord2.chords = function() {
            if (!chords) relayout();
            return chords;
        };

        chord2.groups = function() {
            if (!groups) relayout();
            return groups;
        };
        return chord2;
    };
    // end of d3.chord2


    //  get default layout
    function getDefaultLayout(){
        return d3.chord2()
                .sortChords(d3.descending)
                .sortSubgroups(d3.ascending)
                .width(width)
                .height(height)
                .padding(padding);
        }

    // function to draw the viz used in commonchord.html
    this.drawChord = function(newdata){
        if (!updatecategory){
            let newgeneObject = createDataStructure(newdata, totalcolumns)
            newdata = newgeneObject;
        }
        let chart = getDefaultLayout(); 
            mainGroup
                .data(newdata)
                .attr('class', "mainGroup")
                .call(chart);
    }

    let currcolumns = _.keys(rgdgenes);
    let totalcolumns = _.keys(rgdgenes);
    var newgeneObject = createDataStructure(rgdgenes, totalcolumns)

    // attach domain to ordinal arcScale using condition names
    arcScale.domain(totalcolumns);

    // divs for creating checboxes for each condition
    var categorydivs = d3.select('.categorydiv')
                        .selectAll('div')
                        .data(totalcolumns)
                        .enter().append('div')
                        .attr('class', 'categorydivs')
                        .style("display", "inline")
                        .style("margin-left", "10px");

	// add checkboxes to those divs along with their "on change function" 
	// that calls addArc or removeArc
    categorydivs
        .append('input').attr('type', 'checkbox')
        .attr('id', (d)=>{d})
        .attr('class', (d)=>{d})
        .property("checked", true)
        .on('change', function(d){
            updatecategory = true;
            let checked = d3.select(this).property("checked");
            if (checked) {
                currcolumns.push(d);
                let finalcolumns = _.difference(totalcolumns, currcolumns)
                let genedata_clone = _.cloneDeep(rgdgenes);
                addArc(genedata_clone, finalcolumns, currcolumns)
            }
            else {
                _.remove(currcolumns, function(n){return n === d;})
                let currentdata_clone = _.cloneDeep(currentdata);
                removeArc(currentdata_clone, d, currcolumns);
            }
        });

	// labels for the checkboxes
    categorydivs
        .append('label')
        .attr('class', (d)=>{d})
        .html(function(d){return d ;});

    let newObject;

    // addArc called when the user checks the checkbox to bring back a condition
    // It recreates the datastructure and then adds an arc
    function addArc(moddata, labels, columns){
        labels.forEach(function(lab){
            delete moddata[lab];
        })
        let modstructure = createDataStructure(moddata, columns)
        chart.drawChord(modstructure);
		currentdata = _.cloneDeep(moddata);
		currcolumns = _.clone(columns);
    }

    // removeArc called when the user unchecks the checkbox to remove a condition
    // It recreates the datastructure and then removes the arc
    function removeArc(moddata, label, columns){
        delete moddata[label];
        let modstructure = createDataStructure(moddata, columns)
        chart.drawChord(modstructure);
		currentdata = _.cloneDeep(moddata);
    }

// chartBuilder ends here
}
