// Initiate pym
var pymChild = new pym.Child();

// define globals first
var statesPlusGlobal = [];
var countriesGlobal = [];

//indexes, Width and height, Padding, parameters
var q = 0; // Number of runs?
var o = 0;
var j = 1; // this is the index of which "type" of data we're looking at. Gross=0, PerCap=1
var add = 0; // index How many countries are added.
var AxisPaddingTop = 20;
var AxisPaddingLeft = 200;
var StandardPadding = 20;
var BubblePadding = 3;
var r = 5;
var AddCountries = 10; //How many countries can be added		
var totes = 51 + AddCountries
var w = parseInt(d3.select("#master_container").style("width"))
var h = (AxisPaddingTop + StandardPadding/2 + ((totes)*2*r) + (totes*BubblePadding)+BubblePadding*1.5+20)

var statesPlus;
var countries;

//Create SVG element
var svg = d3.select("#master_container")
			.append("svg")
			.attr("width", w)
			.attr("height", h);  	

svg.append("g")
    .attr("class", "axis")  //Assign "axis" class
    .attr("transform", "translate(0," + (AxisPaddingTop + 10) + ")")

var linez = svg
	.append("line")
	.attr("class","dotted1")
	.attr("x1",AxisPaddingLeft - StandardPadding)
	.attr("x2",AxisPaddingLeft - StandardPadding)
	.attr("y1","0")
	.attr("stroke","rgb(61,57,58)")
	.attr("stroke-width","2px")
	.attr("stroke-dasharray","1,4")
	.attr("stroke-linecap","round");

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// d3.json("/data/usaco2test.json", function(error, usdata) {
// 	d3.json("/data/worldco2test.json", function(error, worlddata) {
d3.json("data/usaco2test.json", function(error, usdata) {
	d3.json("data/worldco2test.json", function(error, worlddata) {			

		var stData = usdata.states;

		for (i in stData) {
			statesPlusGlobal.push(stData[i])
		};

		var LookCountry = worlddata.countries;

		for (i in LookCountry) {
			
			if (LookCountry[i].id === "WWWW" || LookCountry[i].id === "EU28" || LookCountry[i].id === "GG20" || LookCountry[i].id === "GG08" ) {
				countriesGlobal.push(LookCountry[i])	
			}
			else if(LookCountry[i].type === "EXCL" || LookCountry[i].type === "ECON" || LookCountry[i].id === "USA") {
			} else {
				countriesGlobal.push(LookCountry[i])	
			};
		}					

		statesPlus = statesPlusGlobal;

		countries = worlddata.countries;

		initial(statesPlus)

		d3.selectAll(".tab").on("click", function() {
			d3.selectAll(".tab").attr("class","tab");
			this.className = "tab active";
			d3.select("#about_extend").attr("class","");
			d3.select("#about").attr("class","about_tab")

			// set the metric title
			var emissions = d3.select('#emissions')[0][0];
			if (j === 1) {
				emissions.innerHTML = "Annual Carbon Dioxide Emissions 2013 (Million Metric Tons of CO<sub>2</sub> per geography, logarithmic)";
			} else {
				emissions.innerHTML = "Annual Carbon Dioxide Emissions 2013 (Metric Tons of CO<sub>2</sub> per Person) ";	
			};
			

			MetricClick(statesPlus, this.id)
		});
	
		d3.select("#about").on("click", function() {
			// d3.selectAll(".tab").attr("class","tab")
			this.className = "about_tab active"			
			// d3.select("#about_extend").attr("class","active");
			$("#about_extend").addClass("active");
			$("#about_extend").css("display","block");
		});

		//remove about on click out
		$(document).on('click', function(event) {
		  if (!$(event.target).closest('#about').length) {
		    // d3.select("#about_extend").attr("class","");
			d3.select("#about").attr("class","about_tab")
			$("#about_extend").css("display","none");
		  }
		});

		

		$('#autocompletez').autocomplete({
		    lookup: countriesGlobal,
		    lookupLimit: 10,
		    maxHeight:350,
		    showNoSuggestionNotice: true,
		    noSuggestionNotice: function(){		    	
		    	return "Can't find your country? Click About the Data below to learn more."	
		    },
		    onSelect: function (suggestion) {
		    	
		    	var indexy = suggestion.indexy;

		 		CountryClick(statesPlusGlobal,indexy)
		    }
		});		
	pymChild.sendHeight();
	});
});

		// Fires on Initial Load.
		function initial(data) {
			CountryClick(data,160) //add World
			CountryClick(data,156) // EU
			CountryClick(data,117) // China
			CountryClick(data,153) // UAE
			CountryClick(data,124) // Small Country... Morrocco?

			// update(data,j)
		};

		// Fires when a new country is added or subtracted
		function CountryClick(data,x) {	
				// How to prevent doubles?
				// prevent XXXX's
				// Prevent USA			
			if (add === AddCountries) {
				add = 0;
				//Remove 53, 54, 55
				data.splice(52	,(AddCountries - 1))	
				d3.selectAll(".countryBox").remove();			
			};

			// first go from 0 to 1, then 1 to 2, 3 to 4, 4 to 0 (above ), 0 to 1;
			add +=1;
			var indexIs = 51+add;
		
			// or could switch to length
			data[indexIs] = countries[x];			
			d3.select("#countryBoxes")
				.append("div")
				.text(countries[x].value)
				.attr('class','countryBox')
					.append("div")
					.attr('class',"xBox")
					.attr('id',countries[x].id)
					.text("x")
					.on("click",function(d){
						d3.select(this.parentNode).remove();						
						add -=1;
						
						for (var i = 51; i < data.length; i++) {
							if (data[i].id === this.id) {
								data.splice(i,1)
							};
						};

						update(data,j)
					});			

			// Run it boyy
			update(data,j)
			pymChild.sendHeight();
		};

		//DONT DEFINE J HERE?!?!
		// Fires when the metric is switched
		function MetricClick(data, t) {
				//iterate between the options
				if (t === "percap") {
					j=1;
					q+=1; //number of times it has run?
				}
				
				else{
					j=0;
				};

			update(data,j)
			pymChild.sendHeight();
		};

		function update(x,j) {				
			var w = parseInt(d3.select("#master_container").style("width"))

			// interpret j
			if (j  === 0) {
				var type = "gross"
			} else if (j === 1) {
				var type = "percap"		
			};

			// update the sortID fields
			sortFunction(x,type)

			// reassign a reference of the data
			var	statesPlus = x;

			// Scales and Axis updates

			if (j===1) {
				var xScale1 = d3.scale.linear()				
	                .domain([0, d3.max(statesPlus, function(d) {                 	
	                	return +d.data[type].y13; })])                     
					// .range([AxisPaddingLeft, w - (StandardPadding*5) ,w-(StandardPadding*2)]);\
					.range([AxisPaddingLeft,w-(StandardPadding*2)]);

				var xAxis1 = d3.svg.axis()
					.scale(xScale1)
					.orient("top")
					.ticks(3)
			} else {
				var xScale1 = d3.scale.log()
					.domain([1, d3.max(statesPlus, function(d) {                 	
	                	return +d.data[type].y13; })]) 
	                .range([AxisPaddingLeft,w-(StandardPadding*2)]);	

	            var xAxis1 = d3.svg.axis()
						.scale(xScale1)
						.orient("top")

	            if (w <= 500) {
	            	console.log('g')
					xAxis1
						.ticks(2, ",.1s")	            	
	            } else {
					xAxis1
						.ticks(4, ",.1s")
	            };

			}

			svg.selectAll("g.axis")
				.transition() //maybe remove
				.duration(1000) 
				// .transform(translate(10,20))
				.attr("transform","translate(0,30)")
				.call(xAxis1)
			
			// define the svg variables
			var circles = svg.selectAll("circle.y13")
				.data(statesPlus)

			var textN = svg.selectAll("text.names")
			   .data(statesPlus)	

			// Do the updated things first! This is what happens to an update
			circles
				.transition()
			   	.duration(1000)
			   	.attr("cx", function(d) {
			   		return xScale1(d.data[type].y13)
			    })
			    .attr("valu",function(d) {
			   		return d.data[type].y13;
			   	})
			   	.attr("class", function(d) {			    	
			    	if (d.type === "CTRY" || d.type === "ECON") {			    		
			    		return "ctry y13 " + type	
			    	} 
			    	else {			    
			    		// console.log(type)		
			    		return "y13 " + type
			    	};		
			    });

			textN
				.transition()
				.duration(1000)
				.text(function(d) {
					return d.value;
				})
				.attr("valu",function(d) {
			   		return d.data[type].y13;
			   	})
			   	.attr("valux",function(d) {
			   		return xScale1(d.data[type].y13);
			   	})

			// Now you tell it what to do when something ENTERS for the first time!
			circles   
			    .enter()
			    .append("circle")
			    .attr("id",function(d){
			   		return "a"+d.indexy;
			   	})
			   	.attr("valu",function(d) {
			   		return d.data[type].y13;
			   	})
			    .attr("r", r)
			    .attr("cx", function(d) {
			   		return xScale1(d.data[type].y13)
			    })
			    .attr("cy",function(d,i){			    	
			   		return (AxisPaddingTop + StandardPadding/2 + ((i)*2*r) + (i*BubblePadding))
				})
				.attr("class", function(d) {			    	
			    	if (d.type === "CTRY" || d.type === "ECON") {    		
			    		return "ctry y13 " + type	
			    	} 
			    	else {			    		
			    		return "y13 " + type
			    	};			    	
			    })
			    .on("mouseover",function(d){		
					var cx = this.cx.animVal.value;
			    	var cy = this.cy.animVal.value;
			    	var valu = $(this).attr('valu')	    	

			    	svg.append("text")
			    		.attr("class","popup")
			  			.text(function(d) {		
			  				return valu;
					   	})
					   	.attr("y",function(d, i){
							return cy;
						})
					   	.attr("x", function(d) {
					   		return cx + 5;
					    })	

					svg.select("text#t" + d.nodeID)
						.attr("class",function(d){							
							if (d.nodeID <= 51) {
								return "names hov1"	
							} else {return "names hov2"};				
						})		
					
			    })
			    .on("mouseout",function(d){
			    	d3.selectAll("text.popup").transition().duration(1000).style("opacity", 0).remove();
			    	d3.selectAll("text.hov1").transition().duration(1000).attr("class","names")
			    	d3.selectAll("text.hov2").transition().duration(1000).attr("class","names econ")
			    })

			textN
			    .enter()
			    .append("text")
			    .attr("class", function(d) {			    	
			    	if (d.type === "CTRY") {
			    		return "names ctry"	
			    	} else if (d.type === "ECON") {
			    		return "names econ"
			    	} else {
			    		return "names"
			    	};			    	
			    })
			    .attr("id",function(d){
			   		return "t"+d.nodeID;
			   	})	    	
			    .text(function(d) {
					return d.value;
				})			
			    .attr("y",function(d, i){
					return (AxisPaddingTop + StandardPadding/2 + ((i)*2*r) + (i*BubblePadding)+BubblePadding*1.5)
				})
				.attr("x", function(d) {
					return 0
				})
				.attr("valu",function(d) {
			   		return d.data[type].y13;
			   	})
			   	.attr("valux",function(d) {
			   		return xScale1(d.data[type].y13);
			   	})
				.on("mouseover",function(d){		

					var cx = this.x.animVal[0].value;
			    	var cy = this.y.animVal[0].value;
			    	var valu = $(this).attr('valu')	    	
			    	var valux = $(this).attr('valux')	    	

			    	svg.append("text")
			    		.attr("class","popup")
			  			.text(function(d) {		
			  				return valu;
					   	})
					   	.attr("y",function(d){
							return cy -3;
						})
					   	.attr("x", function(d) {
					   		// return cx + 5;
							return +valux + 5;
					    })	
			    })
			    .on("mouseout",function(d){
			    	d3.selectAll("text.popup").transition().duration(1000).style("opacity", 0).remove();
			    })

			// update A DOTTED LINE HERE
			linez
				.attr("y2", function(){
					var i = statesPlus.length
					return (AxisPaddingTop + StandardPadding/2 + ((i)*2*r) + (i*BubblePadding)+BubblePadding*1.5)
				});
			// update height of graphic
			svg.attr("height",function(){
					var i = statesPlus.length
					return (AxisPaddingTop + StandardPadding/2 + ((i)*2*r) + (i*BubblePadding)+BubblePadding*1.5)
				});
				

			// Do the second layer of transitions after the first fires
			circles
				.transition().duration(1000).delay(1000)
			    .attr("cy",function(d,i){			  
			   		return (AxisPaddingTop + StandardPadding/2 + ((d.sortID)*2*r) + (d.sortID*BubblePadding)+BubblePadding/2)
				})

			textN
				.transition().duration(1000).delay(1000)
				.attr("y",function(d, i){
			   		return (AxisPaddingTop + StandardPadding/2 + ((d.sortID)*2*r) + (d.sortID*BubblePadding)+BubblePadding*1.5)
				})

		  	// Remove old elements as needed.
			circles.exit().remove();			
			textN.exit().remove();	
			pymChild.sendHeight();
		}			

		function sortFunction (statesPlus,type) {		
			//define the rename
			var copy = JSON.parse(JSON.stringify(statesPlus)); //maybe don't need for json?
			//index the rename
			for (var i = 0; i < copy.length; i++) {
				copy[i].nodeID = i;
				copy[i].sortID = 0;
				statesPlus[i].nodeID = i; //will this update itself?
				statesPlus[i].sortID = 0;
			};			

			function sortList (data, type) {			
				data = data.sort(function(a,b){
					a = +a.data[type].y13
					b = +b.data[type].y13
					if (a < b) {
					    return -1;
					} else if (a > b) { 
					    return 1;
					}
				});
				// create sorted index ... sortID
				for (var i = 0; i < data.length; i++) {		
					data[i].sortID = i;
				};
				return data;
			}

			var newList = sortList(copy,type)			

			for (var i = 0; i < statesPlus.length; i++) {
				for (var k = 0; k < newList.length; k++) {
					if (statesPlus[i].nodeID === newList[k].nodeID) {
						statesPlus[i].sortID = newList[k].sortID
					};			
				};
			};
		
			return statesPlus
		}