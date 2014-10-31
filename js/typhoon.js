var currentTime = 0;

function generateMap(){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = $('#map').width() - margin.left - margin.right,
    height = 425;
   
    var projection = d3.geo.mercator()
        .center([124,12])
        .scale(750);

    var svg = d3.select('#map').append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");    

    g.selectAll("path")
        .data(phil.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke",'#cccccc')
        .attr("fill",'#cccccc')
        .attr("class","geo")
        .attr("opacity",1);

    var g = svg.append("g");
    
    g.append("circle")
        .attr('cx',function(){
                    var point = projection([ typhoonData[0].Lon, typhoonData[0].Lat ]);
                    return point[0];
                })
        .attr('cy',function(d){
                    var point = projection([ typhoonData[0].Lon, typhoonData[0].Lat ]);
                    return point[1];
                })
        .attr("r", 5)
        .attr("id",function(d,i){
            return "path";
        })
        .attr("fill","steelblue")
        .attr("opacity",1);

}

function generateWind(){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = $('#windspeed').width() - margin.left - margin.right,
        height = 80;

    var svg = d3.select('#windspeed').append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");

    g.append("rect")
        .attr("x", 0)
        .attr("y", function(){
            return height-height/195*typhoonData[0].windspeed;
        })
        .attr("width", width)
        .attr("height", function(){
            return height/195*typhoonData[0].windspeed;
        })
        .attr("id","windspeedbar")
        .attr("fill","steelblue");

    var g = svg.append("g");

    g.selectAll("text")
        .data(typhoonData)
        .enter()
        .append("text")
        .attr("x",(width-175)/2)
        .attr("y",40)
        .text(function(d){
           return d.windspeed + " mph"; 
        })
        .attr("class",function(d,i){
            return "time"+i+" windspeed";
        })
        .attr("opacity",0)
        .attr("fill","#bbbbbb");

    var g = svg.append("g");

    g.selectAll("text")
        .data(typhoonData)
        .enter()
        .append("text")
        .attr("x",(width-175)/2)
        .attr("y",70)
        .text(function(d){
           return d.stormtype; 
        })
        .attr("class",function(d,i){
            return "time"+i+" stormtype";
        })
        .attr("opacity",0)
        .attr("fill","#bbbbbb");    
    
}

function generateTimeline(){
    var width = $('#datetimeclass').width()-10;
    var height = 80;
    var svg = d3.select('#datetimeclass')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + 10 + ",0)");

    svg.append("line")
        .attr("x1", 0)
        .attr("y1", height-10)
        .attr("x2", width-20)
        .attr("y2", height-10)
        .attr("stroke-width", 2)
        .attr("stroke", "black");           
    
    svg.selectAll("circle")
        .data(typhoonData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
             return d.hours/162*(width-20);
        })
        .attr("cy", function(d) {
             return height-10;
        })
        .attr("r", 3.5)
        .attr("id",function(d,i){return "time"+i;})
        .attr("fill","#999999");
        
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", function(d) {
             return height-10;
        })
        .attr("r", 10)
        .attr("id","selectedcircle")
        .attr("opacity","0.5")
        .attr("fill","#4682B4");

    var g = svg.append("g");
    g.selectAll("text")
        .data(typhoonData)
        .enter()
        .append("text")
        .attr("x",10)
        .attr("y",40)
        .text(function(d){
           return d.philtime + " - " +d.dateLabel; 
        })
        .attr("class",function(d,i){
            return "time"+i+" datelabel";
        })
        .attr("opacity",0)
        .attr("fill","#bbbbbb");

       
}

function transition(delta){
    hidePath(currentTime);
    currentTime = currentTime+delta;
    if(currentTime<0){
        currentTime=0;
    }
    if(currentTime>16){
        currentTime=16;
    }    
    
    var projection = d3.geo.mercator()
        .center([typhoonData[currentTime].cx,typhoonData[currentTime].cy])
        .scale(typhoonData[currentTime].Scale);

    var path = d3.geo.path()
        .projection(projection);

    d3.selectAll('.geo').transition()
            .attr('d', path);
    
    d3.select('#path').transition()
        .attr('cx',function(){
                    var point = projection([ typhoonData[currentTime].Lon, typhoonData[currentTime].Lat ]);
                    return point[0];
                })
        .attr('cy',function(){
                    var point = projection([ typhoonData[currentTime].Lon, typhoonData[currentTime].Lat ]);
                    return point[1];
                });
    var height = 80;            
    d3.select("#windspeedbar").transition().attr("y", function(){
            return height-height/195*typhoonData[currentTime].windspeed;
        })
        .attr("height", function(){
            return height/195*typhoonData[currentTime].windspeed;
        });
    
    d3.select('#selectedcircle')
        .transition()
        .attr("cx", function() {
            var width = $('#datetimeclass').width()-10;
            return typhoonData[currentTime].hours/162*(width-20);
        });                
   
    showPath(currentTime);
}

function hidePath(i){
    d3.selectAll(".time"+i).attr("opacity",0);
}

function showPath(i){
    d3.selectAll(".time"+i).attr("opacity",1);
}


$(document).keydown(function(e) {
    switch(e.which) {
        case 37:
            transition(-1);
            break;
        case 39:  
            transition(1);
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

generateMap();
generateWind();
generateTimeline();
d3.selectAll(".time0").attr("opacity",1);