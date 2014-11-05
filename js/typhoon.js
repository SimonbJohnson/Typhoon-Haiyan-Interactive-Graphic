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

    g.selectAll("line").data(typhoonData).enter().append("line")
            .attr('x1',function(d){
                        var point = projection([ d.Lon, d.Lat ]);
                        return point[0];
                    })
            .attr('y1',function(d){
                        var point = projection([ d.Lon, d.Lat ]);
                        return point[1];
                    })
            .attr('x2',function(d){
                        var point = projection([ d.prevlon, d.prevlat ]);
                        return point[0];
                    })
            .attr('y2',function(d){
                        var point = projection([ d.prevlon, d.prevlat ]);
                        return point[1];
                    })                    
            .attr("stroke-width", 8)
            .attr("stroke", "red")
            .attr("class","pathline")
            .attr("id",function(d,i){
                return "pathline" + i;
                    })
            .attr("opacity",0);           
   
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
        .attr("r", 10)
        .attr("id",function(d,i){
            return "path";
        })
        .attr("fill","steelblue")
        .attr("opacity",0.7);
    
    var g = svg.append("g");
    
    g.selectAll("line").data(popups).enter().append("line")
            .attr('x1',function(d){
                        var point = projection([ d.lon, d.lat ]);
                        return point[0];
                    })
            .attr('y1',function(d){
                        var point = projection([ d.lon, d.lat ]);
                        return point[1];
                    })
            .attr('x2',function(d){
                        var point = projection([ d.showlon, d.showlat ]);
                        return point[0];
                    })
            .attr('y2',function(d){
                        var point = projection([ d.showlon, d.showlat ]);
                        return point[1];
                    })                    
            .attr("stroke-width", 1)
            .attr("stroke", "#bbbbbb")
            .attr("stroke-width",2)    
            .attr("class","popupline")
            .attr("class",function(d,i){
                return "popup" + d.time +" popupline";
                    })
            .attr("opacity",0);

    g.selectAll("circle").data(popups).enter().append("circle")
        .attr('cx',function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[0];
                })
        .attr('cy',function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[1];
                })
        .attr("r", 30)
        .attr("class",function(d,i){
            return "popup" + d.time +" popupcircle";
        })
        .attr("fill","white")
        .attr("stroke","#bbbbbb")
        .attr("stroke-width",2)
        .attr("opacity",0)
        .attr("id",function(d,i){
            return "popupcircle"+i;
        })
        .on('mouseover', function(d,i){
            d3.select(this).attr("fill","#bbbbbb");
            if(d.time==currentTime){
                d3.select("body").style("cursor", "pointer");
            }
        })
        .on('mouseout', function(d){
            d3.select(this).attr("fill","white");
            d3.select("body").style("cursor", "default");
        })
        .on('click',function(d,i){
            if(d.time==currentTime){
                $('#modal-body').html(d.popup);
                $("#myModal").modal('show');
            }
        });

    g.selectAll("text").data(popups).enter().append("text")
        .attr("x",function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[0]-18;
                })
        .attr("y",function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[1]+5;
                })
        .text(function(d){
           return d.text; 
        })
        .attr("class",function(d,i){
            return "popup"+d.time +" popuptext";
        })
        .attr("opacity",0)
        .attr("fill","#999999")
        .on('mouseover', function(d,i){
            d3.select("#popupcircle"+i).attr("fill","#bbbbbb");
        })
        .on('mouseout', function(d,i){
            d3.select("#popupcircle"+i).attr("fill","white");
        })
        .on('click',function(d,i){
            if(d.time==currentTime){
                $('#modal-body').html(d.popup);
                $("#myModal").modal('show');
            }
        });

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

function generateNavigation(){
    var width = $('#navigation').width();
    var height = 80;
    var r=Math.min(width/2,18)
    var svg = d3.select('#navigation')
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    svg.append("circle")
        .attr("cx", function(d) {
             return width/2;
        })
        .attr("cy", function(d) {
             return 20;
        })
        .attr("r", r)
        .attr("stroke","#cccccc")
        .attr("stroke-width",2)
        .attr("fill","#ffffff")
        .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
        .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
        .on('click',function(){
            transition(1);
        });    

    svg.append("circle")
        .attr("cx", function(d) {
             return width/2;
        })
        .attr("cy", function(d) {
             return 60;
        })
        .attr("r", r)
        .attr("stroke","#cccccc")
        .attr("stroke-width",2)
        .attr("fill","#ffffff")
        .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
            .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
        .on('click',function(){
            transition(-1);
        });              

    svg.append("line")
            .attr('x1',width/2+7)
            .attr('y1',20)
            .attr('x2',width/2-r+13)
            .attr('y2',20-r+7)                    
            .attr("stroke-width", 1)
            .attr("stroke", "#cccccc")
            .attr("stroke-width",2)
            .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
            .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
            .on('click',function(){
                transition(1);
            });  
    
    svg.append("line")
            .attr('x1',width/2+7)
            .attr('y1',20)
            .attr('x2',width/2-r+13)
            .attr('y2',20+r-7)                    
            .attr("stroke-width", 1)
            .attr("stroke", "#cccccc")
            .attr("stroke-width",2)
            .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
            .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
            .on('click',function(){
                transition(1);
            });      
    
    svg.append("line")
            .attr('x1',width/2-7)
            .attr('y1',60)
            .attr('x2',width/2+r-13)
            .attr('y2',60-r+7)                    
            .attr("stroke-width", 1)
            .attr("stroke", "#cccccc")
            .attr("stroke-width",2)
            .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
            .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
            .on('click',function(){
                transition(-1);
            });    
    
    svg.append("line")
            .attr('x1',width/2-7)
            .attr('y1',60)
            .attr('x2',width/2+r-13)
            .attr('y2',60+r-7)                    
            .attr("stroke-width", 1)
            .attr("stroke", "#cccccc")
            .attr("stroke-width",2)
            .on('mouseover', function(d,i){
                d3.select(this).attr("fill","#bbbbbb");
                d3.select("body").style("cursor", "pointer");
            })
            .on('mouseout', function(d,i){
                d3.select(this).attr("fill","white");
                d3.select("body").style("cursor", "default");
            })
            .on('click',function(){
                transition(-1);
            });        
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
    $('#text').html(typhoonData[currentTime].text);
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
        
        d3.selectAll('.pathline').transition()
            .attr('x1',function(d){
                        var point = projection([ d.Lon, d.Lat ]);
                        return point[0];
                    })
            .attr('y1',function(d){
                        var point = projection([ d.Lon, d.Lat ]);
                        return point[1];
                    })
            .attr('x2',function(d){
                        var point = projection([ d.prevlon, d.prevlat ]);
                        return point[0];
                    })
            .attr('y2',function(d){
                        var point = projection([ d.prevlon, d.prevlat ]);
                        return point[1];
                    })
            .attr('opacity',function(d,i){
                if(i<=currentTime){
                    return 0.2;
                } else {
                    return 0;
                }
                    });
                    
        d3.selectAll('.popupline').transition()
            .attr('x1',function(d){
                        var point = projection([ d.lon, d.lat ]);
                        return point[0];
                    })
            .attr('y1',function(d){
                        var point = projection([ d.lon, d.lat ]);
                        return point[1];
                    })
            .attr('x2',function(d){
                        var point = projection([ d.showlon, d.showlat ]);
                        return point[0];
                    })
            .attr('y2',function(d){
                        var point = projection([ d.showlon, d.showlat ]);
                        return point[1];
                    })
            .attr('opacity',function(d,i){
                if(d.time==currentTime){
                    return 1;
                } else {
                    return 0;
                }
            });                    
                    
    d3.selectAll('.popupcircle').transition()
        .attr('cx',function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[0];
                })
        .attr('cy',function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[1];
                })
            .attr('opacity',function(d,i){
                if(d.time==currentTime){
                    return 1;
                } else {
                    return 0;
                }
            });                    

    d3.selectAll('.popuptext').transition()
        .attr("x",function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[0]-18;
                })
        .attr("y",function(d){
                    var point = projection([ d.showlon, d.showlat ]);
                    return point[1]+5;
                })
            .attr('opacity',function(d,i){
                if(d.time==currentTime){
                    return 1;
                } else {
                    return 0;
                }
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
generateNavigation();
d3.selectAll(".time0").attr("opacity",1);
$('#text').html(typhoonData[0].text);

$('#myModal').on('hidden.bs.modal', function () {
    $('#modal-body').html("");
});
