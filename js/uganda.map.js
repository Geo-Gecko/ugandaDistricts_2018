var cbounds;
(function (d3, $, queue, window) {
  'use strict';
  $("#filters").css("height",$(window).height()-$("#filters").offset().top-10+"px")
  // https://www.humanitarianresponse.info/en/operations/afghanistan/cvwg-3w
  // https://public.tableau.com/profile/geo.gecko#!/vizhome/Districtpolygon/v1?publish=yes
  'use strict';
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
  // function capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }
    var _selectedDataset;
    var dataset;
    var dataset1;
    var filteredDistricts = [];
    var country;
    var zoom;
  queue()
    // .defer(d3.json, "./UgandaDistricts.geojson")//DNAME_06
    .defer(d3.json, "./data/UgandaDistricts.geojson") //dist
    .defer(d3.csv, "./data/WASH_HEALTH.csv")
    .defer(d3.csv, "./data/filterList.csv")
    .await(ready);





    var global = {};
    global.selectedDistrict = []; // name
    global.selectedTheme = []; // ID
    global.selectedFilter = []; //undefined; //[]; // ID
    global.districtCount;
    global.currentEvent;
  // global.needRefreshDistrict;


  function refreshCounts() {
      d3.select("#district-count").text(global.districtCount);
      d3.select("#population-count").text(global.populationCount.toLocaleString());
      d3.select("#household-count").text(global.householdCount.toLocaleString());
      // global.selectedDistrict = [];
      global.selectedSettlement = []; //undefined; //[];
      global.selectedSector = [];
      global.selectedAgency = [];
      global.selectedUn = [];
      global.selectedIp = [];
      global.selectedOp = [];

      _selectedDataset = dataset1;
  }

    function ready(error, ugandaGeoJson, washCSV, filterList) {
        //standard for if data is missing, the map shouldnt start.
    if (error) {
      throw error;
    };
    // console.log(ugandaGeoJson, ActorID, SettlementID, SectorID, AllID)
        //console.log(washCSV);
        var filterListKays = d3.keys(filterList[0]);
        var washCSVKays = d3.keys(washCSV[0]);
        //console.log(washCSVKays);
    ugandaGeoJson.features.map(function (d) {
      d.properties.DNAME_06 = d.properties.dist.toLowerCase().capitalize();
    });
    //need join all data
        //console.log(filterList);
    dataset1 = washCSV.map(function (d) {
        //console.log(d);
        var i;
        for (i = 0; i < ugandaGeoJson.length; i++) {
            if (ugandaGeoJson[i].dist === d.DNAME2016) {
                washCSVKays.map(function (k) {
                    d[k] = ugandaGeoJson[i][k];
                });
                break;
            }
        }
        return d;
    });
    //console.log(dataset1);
    /*dataset = relationship.map(function (d) {
      var i;
      for (i = 0; i < nameAbb.length; i++) {
        if (nameAbb[i].Actor_ID === d.Actor_ID) {
          nameAbbKays.map(function (k) {
            d[k] = nameAbb[i][k];
          });
          break;
        }
      }
      for (i = 0; i < districtSettlement.length; i++) {
        if (districtSettlement[i].Settlement_ID === d.Settlement_ID) {
          districtSettlementKays.map(function (k) {
            d[k] = districtSettlement[i][k];
          });
          break;
        }
      }
      for (i = 0; i < sector.length; i++) {
        if (sector[i].Sector_ID === d.Sector_ID) {
          sectorKays.map(function (k) {
            d[k] = sector[i][k];
          });
          break;
        }
      }
      return d;
    });
    */// console.log(dataset);

    // http://bl.ocks.org/phoebebright/raw/3176159/
    var districtList = d3.nest().key(function (d) {
        return d.DNAME2016;
    }).sortKeys(d3.ascending).entries(washCSV);

    var themeList = d3.nest().key(function(d) {
        return d.Theme;
    }).sortKeys(d3.ascending).entries(filterList);

    var filterList = d3.nest().key(function(d) {
        return d.Name;
    }).sortKeys(d3.ascending).entries(filterList);
        // console.log(filterList);

    var educationList = filterList.filter(function (d) {
            if (d.values[0].Theme === "Education (% of population)") {
                return d.key; //return d.Actor_Type["UN"];
            }
        });
    var socioEconomicList = filterList.filter(function (d) {
            if (d.values[0].Theme === "Socio-Economic (% of households)") {
                return d.key; //return d.Actor_Type["UN"];
            }
        })

    var washAndHealthList = filterList.filter(function (d) {
            if (d.values[0].Theme === "WASH & Health (% of households)") {
                return d.key; //return d.Actor_Type["UN"];
            }
        });
    var energyList = filterList.filter(function (d) {
            if (d.values[0].Theme === "Energy (% of households)") {
                return d.key; //return d.Actor_Type["UN"];
            }
        });

    var totalPopulation = 0;
    var totalHouseholds = 0;

        for (var j = 0; j < dataset1.length; j++) {
            // console.log(+(dataset1[j]));
            var Population = +(dataset1[j]["Population_2014"]);
            var Household = +(dataset1[j]["Households_2014"])
            // console.log(Population);
            totalPopulation = totalPopulation + Population;
            totalHouseholds = totalHouseholds + Household;
        }

    // console.log(totalPopulation);
    // console.log(totalHouseholds);
    //console.log(districtList);
        //append " district" to each district name.
        // districtList.forEach(function(d){
        //     d.key = d.key + " district";
        // });
        // console.log(districtList);
    // var sectorList = d3.nest().key(function (d) {
    //   return d.Sector;
    // }).sortKeys(d3.ascending).entries(sector);
    // var settlementList = d3.nest().key(function (d) {
    //   return d.Settlement;
    // }).sortKeys(d3.ascending).entries(districtSettlement);
    // var agencyList = d3.nest().key(function (d) {
    //     // console.log(d);
    //   return d.Name;
    // }).sortKeys(d3.ascending).entries(nameAbb);
    //     var unAgencyList = nameAbb.filter(function (d) {
    //         if (d.Actor_Type === "UN") {
    //             return d.Actor_Type; //return d.Actor_Type["UN"];
    //         }
    //     });
    //     var ipAgencyList = nameAbb.filter(function (d) {
    //         if (d.Actor_Type === "IP") {
    //             return d.Actor_Type; //return d.Actor_Type["UN"];
    //         }
    //     });
    //     var opAgencyList = nameAbb.filter(function (d) {
    //         if (d.Actor_Type === "OP") {
    //             return d.Actor_Type; //return d.Actor_Type["UN"];
    //         }
    //     });
        //console.log(unFiltered);

        /* var unAgencyList = d3.nest().key(function (d) {
                 return d.Actor_Type; //return d.Actor_Type["UN"];
         }).sortKeys(d3.ascending).entries(unFiltered);
         var ipAgencyList = d3.nest().key(function (d) {
                 return d.Actor_Type;
         }).key(function (d) { return d[0]; }).sortKeys(d3.ascending).entries(ipFiltered);
         var opAgencyList = d3.nest().key(function (d) {
                 return d.Actor_Type;
         }).sortKeys(d3.ascending).entries(opFiltered);*/
        //console.log(nameAbb);

        //console.log(unAgencyList);
        //console.log(ipAgencyList);

        global.districtCount = districtList.length;
        global.populationCount = totalPopulation;
        global.householdCount = totalHouseholds;


    refreshCounts();
    updateLeftPanel(districtList, dataset1);
    // updateLeftPanel(districtList, null, null, null, dataset);



        // d3.selectAll('.custom-list-header').on("click", function(){
        //   var customList = d3.select(this.parentNode).select("div");
        //   // if (customList.node().getBoundingClientRect().width===0){}
        //   console.log(customList.node().getBoundingClientRect());
        // });
        /*$(".custom-list-header").click(function () {
          // d3.select(this.parentNode).selectAll("p").style("background", "transparent");
          $(this).siblings(".custom-list").toggleClass('collapsed');
          // $(this).find("span").toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right');
        });
    */
        // Collapses all the boxes apart from district
        //$(".custom-list-header").siblings(".custom-list").addClass('collapsed');
        //$("#district-list.custom-list").removeClass('collapsed');



        var h = (window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight);
    if (h > 540) {
      d3.select(".list-container").style("height", h + "px");
      d3.select("#d3-map-container").style("height", h + "px");
    }
    var w = (window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth);
    d3.select(".list-container").style("height", h - 0 + "px")

    var map = new L.Map("d3-map-container", {
        center: [1.367, 32.305],
        zoom: 6,
        zoomControl: false
      });

        // L.control.zoom({
        //     position:'topright'
        // }).addTo(map);

        var _3w_attrib = 'Created by <a href="http://www.geogecko.com">Geo Gecko</a> and © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Powered by <a href="https://d3js.org/">d3</a>';
        var basemap = L.tileLayer("https://api.mapbox.com/styles/v1/gecko/cj27rw7wy001w2rmzx0qdl0ek/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2Vja28iLCJhIjoidktzSXNiVSJ9.NyDfX4V8ETtONgPKIeQmvw", {attribution: _3w_attrib});

        basemap.addTo(map);
    //temporarily disable the zoom
    //map.scrollWheelZoom.disable();
     map.doubleClickZoom.disable();
    // map.boxZoom.disable();
    // map.keyboard.disable();
    // map.touchZoom.disable();
    // map.dragging.disable();

        map.bounds = [],
        map.setMaxBounds([
               [5.5,28.0],
               [-2.5,35.5]
            ]);
        map.options.maxZoom=12;
        map.options.minZoom=6;
       /* map.on("moveend", function(d){
            var zoomlevel = map.getZoom()
            //console.log(zoomlevel);
            d3.selectAll(".label").each(function () {
                var element = d3.select(this);
                element.remove();
            });
            // var mapTransform = $(".leaflet-pane").css("transform");
            // console.log(mapTransform);
            // var tfMatrix = mapTransform.split("(")[1].split(")")[0].split(", ");
            // var toX = 0 - tfMatrix[4],
            //     toY = 0 - tfMatrix[5];
            // $(".leaflet-pane").css("transform-origin", toX + "px " + toY + "px");
            // mapTransform = $(".leaflet-pane").css("transform");
            // console.log(mapTransform);
/!*
        if (zoomlevel >= 10){
            d3.selectAll(".settlement").each(function () {
                var element = d3.select(this);
                //console.log(element);
                element.append("text")
                    .attr("class", "label")
                    .attr("dy", "1.5em")
                    .attr("transform", "rotate(+90)")
                    .attr("font-size", "12px")
                    .style("color", "black")
                    .style("pointer-events", "none")
                    .text(function (d) {
                        //console.log(d);
                        return d.Settlement
                    });
            });

            ugandaPath.style("opacity", 0.7);*!/


       /!* }
        else if (zoomlevel < 10) {
        d3.selectAll(".label").each(function () {
                var element = d3.select(this);
                element.remove();
            });
            //ugandaPath.style("opacity", 1);

        }
*!/
        });*/
        //zoom level 10, display text.



    var ugandaPath;
    var domain = [+Infinity, -Infinity];
    var opacity = 0.7;
//    var wrapper = d3.select("#d3-map-wrapper");
//    var width = wrapper.node().offsetWidth || 960;
//    var height = wrapper.node().offsetHeight || 480;
//      var width = $(window).width();
//      var height = $(window).height()-100; 
      var width = $(window).width();
      var height = $(window).height()-25;  
      $(".toggler").css("height",height+25);
      $("#d3-map-container").css("width",width);
      $("#d3-map-container").css("height",height);
      $("#right").find(".toggler").append("<div id = 'rtitle'></div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>F</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>I</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>L</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>T</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>E</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>R</div>");
      $("#right").find("#rtitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>S</div>");
    var ht = $("#rtitle").height();
    ht = (height - ht)/2;
    $("#rtitle").css("margin-top",ht+"px")
      $("#left").find(".toggler").append("<div id = 'ltitle'></div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>S</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>T</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>A</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>T</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>I</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>S</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>T</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>I</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>C</div>");
      $("#left").find("#ltitle").append("<div style = 'font-weight:bolder;padding-left:3px;text-align:center;'>S</div>");
    var ht = $("#ltitle").height();
    ht = (height - ht)/2;
    $("#ltitle").css("margin-top",ht+"px")

    var color = d3.scale.linear().domain(domain) //http://bl.ocks.org/jfreyre/b1882159636cc9e1283a
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#f7fcfd"), d3.rgb('#00441b')]); //#f597aa #a02842
    var tooltip = d3.select(map.getPanes().overlayPane)
      .append("div")
      .attr("class", "d3-tooltip d3-hide");
    var datasetNest = d3.nest().key(function (d) {
        //console.log(d);
      return d.DNAME2016;
    }).entries(dataset1);
    //console.log(datasetNest);


    var countries = [];
    var countriesOverlay = L.d3SvgOverlay(function (sel, proj) {
      var projection = proj.pathFromGeojson.projection;
      var path = d3.geo.path().projection(projection);

      // console.log(proj, proj.pathFromGeojson.projection, d3.geo.mercator().scale(proj.scale).translate([0, 0]));
      // console.log("proj.scale", proj);

      ugandaPath = sel.selectAll('.district').data(countries);
      ugandaPath.enter()
        .append('path')
        .attr('d', proj.pathFromGeojson)
        // .attr('stroke', 'black')
        // .attr('fill', function(){ return d3.hsl(Math.random() * 360, 0.9, 0.5) })
         .attr('fill-opacity', '0.5')
        .attr("z-index", "600")
        .attr("style", "pointer-events:all!important")
        .style("cursor", "pointer")
        .style("stroke", "#000")
        .each(function (d) {
            //console.log(d);
          d.properties.centroid = projection(d3.geo.centroid(d)); // ugandaCentroid = d.properties.centroid;
          // console.log(d, d.properties.centroid);
          datasetNest.map(function (c) {
            if (c.key === d.properties.dist) {
                //console.log(c);
              d.properties._Population_2014 = d3.nest().key(function (a) {
                  //console.log(a);
                return a.Population_2014;
              }).entries(c.values);
              d.properties._Household_2014 = d3.nest().key(function (a) {
                  // console.log(a);
                return a.Households_2014;
              }).entries(c.values);
              //console.log(d);
              var filterValue = +(d.properties._Population_2014[0].key);
              domain[0] = filterValue < domain[0] ? filterValue :
                domain[
                  0];
              domain[1] = filterValue > domain[1] ? filterValue :
                domain[
                  1];
              color.domain(domain);
                //console.log(domain);
            }
          });
        })
        /*.on("mousemove", function (d) {
          var svg = d3.select(this.parentNode.parentNode.parentNode);
          var mouse = d3.mouse(svg.node()).map(function (d) {
            return parseInt(d);
          });
          var shift = d3.transform(svg.attr("transform"))
          mouse[0] = mouse[0] + shift.translate[0] + shift.translate[0] * (shift.scale[0] - 1);
          mouse[1] = mouse[1] + shift.translate[1] + shift.translate[1] * (shift.scale[1] - 1);
          // console.log(sel, mouse);
          var str = "<p><span>District:</span> <b>" + d.properties.DNAME_06 + "</b></p>"
          if (d.properties._settlementList && d.properties._sectorList && d.properties._agencyList) {
            str = str + "<p><span>Settlements:</span> <b>" + d.properties._settlementList.length + "</b></p>" +
              "<p><span>Sectors:</span> <b>" + d.properties._sectorList.length + "</b></p>" +
              "<p><span>Agencies:</span> <b>" + d.properties._agencyList.length + "</b></p>";
          }
          tooltip.html(str);
          var box = tooltip.node().getBoundingClientRect() || {
            height: 0
          };
          tooltip
            .classed("d3-hide", false)
            .attr("style", "left:" + (mouse[0] + 15) + "px;top:" + (mouse[1] < height / 2 ? mouse[1] : mouse[1] - box.height) + "px");
        })*/
        .on("mouseover", function (d) {
          // d3.select(this).style("stroke", "#000")"fill", "#aaa");
        //tooltip.classed("d3-hide", false);
        })
        .on("mouseout", function (d) {
         /* d3.select(this).style("fill", function(d){
              //console.log(color(d.properties._HH_Improved_Toilet_2014[0].key));
              //console.log(d.properties._HH_Improved_Toilet_2014[0].key);
              var filterValue = +(d.properties._Population_2014[0].key);
              return filterValue ? color(filterValue) : "#ccc";
          });//"none");*/
          //tooltip.classed("d3-hide", true);
        })
        .on("click", function (d) {
            // console.log(d);
            //console.log(d3.select('#left'));
            if ($("#left").attr("data-status") =="closed")
            {
                $("#left").find(".toggler").trigger("click");
            }



            var needRemove = $(d3.select(this).node()).hasClass("d3-active"); //d3.select(this).attr("class");//d3-active
            d3.select(this).classed("d3-active", !needRemove).style("fill", needRemove ? "#E3784A" :
                "#41b6c4");
            // console.log(d.properties);

            var header = d3.select("#districtHeader");
            var str = "National Average versus " + d.properties.DNAME_06 + " district";

            header.html(str);

            ugandaPath.style("fill", function (d) {
                for (var k = 0; k < filteredDistricts.length; k++) {
                    // console.log(filteredDistricts[k]);
                    if (d.properties.dist === filteredDistricts[k]) {
                        return "none";
                    }
                }
                return "#e3784a";
            });
            d3.select(this).style("fill", "#41b6c4");



            d3.select("#dist-population-count").text((+(d.properties._Population_2014[0].key)).toLocaleString());
            d3.select("#dist-household-count").text((+(d.properties._Household_2014[0].key)).toLocaleString());

            $("#distStats").show();
            var ugChart = d3.select(".statUG").selectAll("rect");
            // console.log(ugChart);
            ugChart.attr("height", "20");/*function(d) {

            })*/
            /*var ugChartText = d3.select(".statUG").selectAll("text");
            // console.log(ugChart);
            ugChartText.attr("dy", "0");*/

            d3.selectAll(".districtLegend").remove();

            var legend = d3.select('#statistics-legend').select("svg");
            var rectangles = legend.select('g');


            rectangles.append("rect")
                .attr("transform", "translate(0,25)")
                .attr("class", "districtLegend")
                .attr("width", "100px")
                .attr("height", "20px")
                .attr("fill", "#41b6c4");
            rectangles.append("text")
                .attr("class", "districtLegend")
                .attr("x", 6.33)
                .attr("y",  35)
                .attr("dy", ".35em")
                .style('fill', 'white')
                .text("District Averages");


            d3.select(".statDist").remove();
            //console.log(chart);
            var sliders = document.getElementsByClassName('sliders')
            var header = [];
            var values = [];

            // console.log(d);
            for (var i = 0; i < sliders.length; i++) {
                var headerValues = 0;
                for (var j = 0; j < dataset1.length ; j++) {
                    // console.log(dataset1);
                    // console.log(sliders[j].__data__.key);
                    header.push(sliders[i].__data__.key);

                    if (dataset1[j]["DNAME2016"]===d.properties.dist) {
                        // console.log(dataset1[i]);
                        headerValues = +(dataset1[j][sliders[i].__data__.values[0].FieldNames]) + headerValues;
                        // console.log(districtValue, +(sliderData[1][j][0]), +(sliderData[1][j][1]));
                        //console.log(+(sliderData[1][j][0]));
                        // console.log(+((sliderData[1][j][0]).replace('%', '')), sliderData[1][j][0]);
                    }
                    //console.log(sliders[j].__data__.key);
                    //console.log(headerValues);
                }
                values.push(headerValues / +(d.properties._Household_2014[0].key) * 100);
            }
            var headerList = header.filter(function (item, pos) {
                return header.indexOf(item) === pos;
            });
            // console.log(headerList);
            // console.log(values);
            var chartDist = [headerList].concat([values]);


            var valueLabelWidth = 40; // space reserved for value labels (right)
            var barHeight = 25; // height of one bar
            var barLabelWidth = 200; // space reserved for bar labels
            // var barLabelPadding = 5; // padding between bar and bar labels (left)
            var gridLabelHeight = 18; // space reserved for gridline labels
            var gridChartOffset = 3; // space between start of grid and first bar
            var maxBarWidth = 190; // width of the bar with the max value

// accessor functions
//             var barLabel = function(d) {  return d; };
            var barValue = function(d) { return parseFloat(d); };

// scales
            var yScale = d3.scale.ordinal().domain(d3.range(0, chartDist[0].length)).rangeBands([0, chartDist[0].length * barHeight]);
            var y = function(d, i) { return yScale(i); };
            // var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
            var x = d3.scale.linear().domain([0, 100/*d3.max(data, barValue)*/]).range([0, maxBarWidth]);
// svg container element
            var chart = d3.select('#statistics-list').select("svg");
//                 .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
//                 .attr('height', gridLabelHeight + gridChartOffset + chartDist[0].length * barHeight);
// bars
            var barsContainer = chart.append('g')
                .attr("class", "statDist")
                .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset +10) + ')');
            barsContainer.selectAll("rect").data(chartDist[1]).enter().append("rect")
                .attr('y', y)
                .attr('height', yScale.rangeBand() / 2 *0.8)
                .attr('width', function(d) { return x(barValue(d)); })
                .attr('stroke', 'white')
                .attr('fill', '#41b6c4');

            {
            // bar value labels
 /*           barsContainer.selectAll("text").data(chartDist[1]).enter().append("text")
                .attr("x", function(d) { return x(barValue(d)); })
                .attr("y", yText)
                .attr("dx", 3) // padding-left
                .attr("dy", "0") // vertical-align: middle
                .attr("text-anchor", "start") // text-align: right
                .attr("fill", "black")
                .attr("stroke", "none")
                .text(function(d) { return d3.round(barValue(d), 2); });
*/
            // console.log(chartData);

          /*var needRemove = $(d3.select(this).node()).hasClass("d3-active");
          ugandaPath.style("opacity", function (a) {
            if (a.properties.DNAME_06 === d.properties.DNAME_06) {
              a.properties._selected = !needRemove;
              return (a.properties._selected ? 1 : opacity);
            } else {
              return (a.properties._selected ? 1 : opacity);
            }
          });
          d3.select(".district-list-" + d.properties.DNAME_06.replaceAll('[ ]', "_")).style("background",
            "#E3784A");
          refreshCounts();
          global.currentEvent = "district";
          myFilter({
            "key": d.properties.DNAME_06
          }, global.currentEvent);

          settlements.style("opacity", opacity);
          if (global.selectedDistrict && global.selectedDistrict.length > 0) {
            global.selectedDistrict.map(function (dd) {
              d3.selectAll(".settlement-district-" + dd.key.toLowerCase().replaceAll("[ ]", "-")).style(
                "opacity", 1);
            });
          }
          d3.selectAll(".settlement-district-" + d.properties.DNAME_06.toLowerCase().replaceAll("[ ]", "-")).style(
            "opacity", 1);*/
            /*var svg = d3.select(this.parentNode.parentNode.parentNode);
            var mouse = d3.mouse(svg.node()).map(function (d) {
                return parseInt(d);
            });
            var str = "<tr><button type='button' class='close' onclick='$(this).parent().hide();'>×</button></tr>" +
                "<th><br/></th><tr><th>District:</th> <th style='right: 0;'>" + d.properties.DNAME_06 + "</th></tr>"
            if (d.properties._Population_2014) {

                //console.log(d.properties._agencyList);
                var agencyListAbb = d3.values(d.properties._agencyList).map(function (d) {
                    return d.values.map(function (v) {
                        return v.Abb;
                    });
                });

                //console.log(agencyListAbb);
                var tooltipList = "";
                var i = 0;
                while (i < agencyListAbb.length) {
                    //console.log(d.properties._agencyList[i].key);
                    tooltipList = tooltipList + ("<p>" + agencyListAbb[i][0] + "</p>");
                    i++
                }
                //console.log(tooltipList);
                //console.log(d.properties);

                str = str + "<table style='width:100%'><tr><th>Population_2014:</th> <th>" + d.properties._Population_2014[0].key + "</th></tr></table></div>";
                //console.log(d.properties._agencyList);
            }
            tooltip.html(str);

            var box = tooltip.node().getBoundingClientRect() || {
                height: 0
            };


            tooltip
                .classed("d3-hide", false)
                .style("cursor", "pointer")
                .attr("style", "left:" + (mouse[0] - 15) + "px;top:" + (mouse[1] < height / 2 ? mouse[1] - 5 : mouse[1] - 5 -
                    box.height) + "px; min-width: 200px; max-width: 200px; height: 150px; overflow-y: auto;");
            tooltip
                .on("mouseover", function () {
                  tooltip.classed("d3-hide", false);
                    tooltip.style("cursor", "pointer");
                    map.scrollWheelZoom.disable();
                })
                .on("mouseout", function () {
                  tooltip.classed("d3-hide", true);
                    map.scrollWheelZoom.enable();
                });*/
            }
        })
        .style("fill", "#e3784a")/*function(d){
            //console.log(color(d.properties._HH_Improved_Toilet_2014[0].key));
            //console.log(d.properties._HH_Improved_Toilet_2014[0].key);
            // var filterValue = +(d.properties._Population_2014[0].key);
            return "#e3784a";
        })*/
        .attr("class", function (d) {
          return "district district-" + d.properties.DNAME_06.replaceAll('[ ]', "_");
        });

      ugandaPath.attr('stroke-width', 1 / proj.scale)
        .each(function (d) {
          d.properties.centroid = projection(d3.geo.centroid(d)); // ugandaCentroid = d.properties.centroid;
            datasetNest.map(function (c) {
                if (c.key === d.properties.dist) {
                    //console.log(c);
                    d.properties._Population_2014 = d3.nest().key(function (a) {
                        //console.log(a);
                        return a.Population_2014;
                    }).entries(c.values);
                    d.properties._Household_2014 = d3.nest().key(function (a) {
                        // console.log(a);
                        return a.Households_2014;
                    }).entries(c.values);
                    //console.log(d);
                    var filterValue = +(d.properties._Population_2014[0].key);
                    domain[0] = filterValue < domain[0] ? filterValue :
                        domain[
                            0];
                    domain[1] = filterValue > domain[1] ? filterValue :
                        domain[
                            1];
                    color.domain(domain);
                    //console.log(domain);
                }
            });
        })
        .style("fill", function(d){
            //console.log(color(d.properties._HH_Improved_Toilet_2014[0].key));
            //console.log(d.properties._HH_Improved_Toilet_2014[0].key);
            var filterValue = +(d.properties._Population_2014[0].key);
            return "#e3784a";
        })//"none")
        .attr("class", function (d) {
          return "district district-" + d.properties.DNAME_06.replaceAll('[ ]', "_");
        });
      ugandaPath.exit().remove();
    });
    // var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    //   attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    // });
    // L.control.layers({
    //   "Geo Tiles": tiles
    // }, {
    //   "Countries": countriesOverlay
    // }).addTo(map);
    countries = ugandaGeoJson.features;
    country = L.geoJson(ugandaGeoJson)
    cbounds = country.getBounds();
    countriesOverlay.addTo(map);
    setTimeout(function(){
       zoom = map.getBoundsZoom(cbounds);
       map.setView(cbounds.getCenter(),zoom,{pan: {animate: true,duration: 1.5},zoom: {animate: true} });
       map.fitBounds(cbounds);
       map.invalidateSize();
    },1000)  




//create slider function.
       /*{
            noUiSlider.create(slider, {
                start: domain,
                behaviour: "drag",
                connect: true,
                range: {
                    min: domain[0],
                    max: domain[1]
                }
            });

            var range, rangeMin, rangeMax;
            $("#slider").click(function (event) {
                range = slider.noUiSlider.get();
                rangeMin = range.slice(0, 1);
                rangeMax = range.slice(1);

                ugandaPath.style("fill", function (d) {
                    var filterValue = +(d.properties._HH_Improved_Toilet_2014[0].key) / +(d.properties._Number_of_HH[0].key) * 100;
                    return filterValue >= rangeMin && filterValue <= rangeMax ? color(filterValue) : "none";
                })

                /!*console.log(range);
                console.log(rangeMin);
                console.log(rangeMax);*!/

            });
        }*/


    function refreshMap() {
      // ugandaPath.style("opacity", 1);
        /*$(".custom-list-header").siblings(".custom-list").addClass('collapsed');
              $("#district-list.custom-list").removeClass('collapsed');
               */
      // global.selectedDistrict = [];
      // ugandaPath.style("opacity", function (a) {
      //   a.properties._selected = false;
      //   return 0.7;
      // });
      // d3.selectAll('.labels').style("opacity", 1);
      // d3.select("#district-list").selectAll("p").style("background", "transparent");
      // d3.select("#theme-list").selectAll("p").style("background", "transparent")
      //updateLeftPanel(districtList, dataset1);
      // updateLeftPanel(districtList, [], [], [], dataset);
      refreshCounts();
    }
    d3.select("#d3-map-refresh").on("click", refreshMap);


        function makePdf() {
            if ($("#d3-map-make-pdf").hasClass('disabled')) {
                return;
            }
            var lat_tmp = 1.367;
            var lng_tmp = 32.305;
            map.setMaxBounds(null);
            map.setView([lat_tmp, lng_tmp], 7);
            $("#d3-map-make-pdf").addClass('disabled');
            var spinner = new Spinner({length: 3, radius: 4, width: 2}).spin(document.body);
            document.getElementById('d3-map-make-pdf').appendChild(spinner.el);

            var filters = [];
            if (global.selectedDistrict.length > 0) {
                filters.push({"name": "District", "values": global.selectedDistrict})
            }
            if (global.selectedSettlement.length > 0) {
                filters.push({"name": "Settlements", "values": global.selectedSettlement})
            }
            if (global.selectedSector.length > 0) {
                filters.push({"name": "Sector", "values": global.selectedSector})
            }
            if (global.selectedAgency.length > 0) {
                filters.push({"name": "Agency", "values": global.selectedAgency})
            }
            //console.log(_selectedDataset);
            var $xhr = $.ajax({
                type: "HEAD",
                url: "https://ugandarefugees.org/wp-content/uploads/Map5_T4.csv?GD_NONCE",
            }).done(function () {
                var lastModified = new Date($xhr.getResponseHeader("Last-Modified"));
                basemap.on("load", setTimeout(function(){console.log("all visible tiles have been loaded...");
                    generatePdf(map, _selectedDataset, filters, lastModified, function () {
                        map.setMaxBounds([
                            [4.5,29.5],
                            [-1.5,34.5]
                        ]);
                        $("#d3-map-make-pdf").removeClass('disabled');
                        spinner.stop();
                    });

                    }, 5000));
            })
        }

        //d3.select("#d3-map-make-pdf").on("click", makePdf);



    // function onlyUnique(value, index, self) {
    //   console.log(value, index, self)
    //   return self.indexOf(value) === index;
    // }
    function onlyUniqueObject(data) {
      data = data.filter(function (d, index, self) {
        return self.findIndex(function (t) {
          return t.key === d.key;
        }) === index;
      });
      return data;
    }

    function filterSelectedItem(item, c, needRemove) {
      if (needRemove) {
        global[item] = global[item].filter(function (a) {
          return a !== c;
        });
      } else {
        global[item].push(c);
      }
      global[item] = onlyUniqueObject(global[item]); //global[item].filter(onlyUnique);;
    }




    function myFilter(c, flag, needRemove) {
      if (flag === "district") {
        filterSelectedItem("selectedDistrict", c, needRemove);
      }
      if (flag === "theme") {
        // global.selectedSettlement = c;
        filterSelectedItem("selectedTheme", c, needRemove);
      }

      var selectedDataset = dataset1.filter(function (d) {
          //global.selectedDataset
        var isDistrict = false; //global.selectedDistrict ? global.selectedDistrict.key === d.District : true;
        if (global.selectedDistrict.length > 0) {
          global.selectedDistrict.map(function (c) {
            if (c.key === d.DNAME2016) {
              isDistrict = true;
            }
          });
        } else {
          isDistrict = true;
        }
        // var isSettlement = global.selectedSettlement ? global.selectedSettlement.values[0].Settlement_ID === d.Settlement_ID : true;
        var isTheme = false;
        if (global.selectedTheme.length > 0) {
          global.selectedTheme.map(function (c) {
               //console.log(c);
               //console.log(d);

            if (c.values[0].Settlement_ID === d.Settlement_ID) {
              isTheme = true;
            }
          });
        } else {
          isTheme = true;
        }
        // var isSector = global.selectedSector ? global.selectedSector.values[0].Sector_ID === d.Sector_ID : true;
        var isFilter = false;
        if (filterList.length > 0) {
          filterList.map(function (c) {
            //console.log(d);
            if (c.key === d.Sector_ID) {
              isTheme = true;
            }
          });
        } else {
          isFilter = true;
        }
        // var isAgency = global.selectedAgency ? global.selectedAgency.values[0].Actor_ID === d.Actor_ID : true;

        return isDistrict && isTheme && isFilter;
      });

        _selectedDataset = selectedDataset;
      // console.log(selectedDataset.length, global.selectedDistrict, global.selectedSettlement, global.selectedSector, global.selectedAgency);
      //     global.selectedDistrict = []; // name
      // global.selectedSector = []; // ID
      // global.selectedSettlement = []; //undefined; //[]; // ID
      // global.selectedAgency = []; // ID


      var districtList = null;
      if (flag !== "district") {
        districtList = d3.nest().key(function (d) {
          return d.DNAME2016;
        }).sortKeys(d3.ascending).entries(selectedDataset);
      }

      var sectorList = null;
      if (flag !== "sector") {
        sectorList = d3.nest().key(function (d) {
          return d.Sector;
        }).sortKeys(d3.ascending).entries(selectedDataset);
      }

      var agencyList = null;
      if (flag !== "agency") {
        agencyList = d3.nest().key(function (d) {
          return d.Name;
        }).sortKeys(d3.ascending).entries(selectedDataset);
      }
      // global.selectedDistrict = districtList;
      updateLeftPanel(districtList, dataset1);

      if (flag === "district") {
        d3.select("#district-count").text(global.selectedDistrict.length);
      } else {
        // global.selectedDistrict = districtList;
        d3.select("#district-count").text(districtList.length);
      }
      if (flag === "theme") {
        d3.select("#theme-count").text(global.selectedTheme.length); //.text("1");
      } else {
        // global.selectedSettlement = settlementList;
        d3.select("#theme-count").text(themeList.length);
      }
      if (flag === "filter") {
        d3.select("#filter-count").text(global.selectedFilter.length);
      } else {
        d3.select("#filter-count").text(filterList.length);
      }


    }





    function updateLeftPanel(districtList, dataset1) {
      if (global.currentEvent !== "district") {
        d3.selectAll(".district").style("opacity", opacity);
        d3.selectAll(".labels").style("opacity", opacity);
        districtList.map(function (a) {
          d3.select(".district-" + a.key.replaceAll('[ ]', "_")).style("opacity", 1);
          d3.select(".district-" + a.key.toLowerCase().replaceAll('[ ]', "-")).style("opacity", 1);
          a.values.map(function (b) {
            d3.select(".settlement-" + b.Settlement_ID).style("opacity", 1);
          });
        });
      }
      if (districtList) {
        d3.select("#district-count").text(districtList.length);
        var _districtList = d3.select("#district-list").selectAll("p")
          .data(districtList);
        _districtList.enter().append("p")
          .text(function (d) {
            return d.key;
          })
          .on("click", function (c) {
              d3.selectAll(".labels").style("opacity", opacity);
              var needRemove = $(d3.select(this).node()).hasClass("d3-active"); //d3.select(this).attr("class");//d3-active
              d3.select(this).classed("d3-active", !needRemove).style("background", needRemove ? "transparent" :
                  "#E3784A");
              global.currentEvent = "district";
              myFilter(c, global.currentEvent, needRemove);
              // myFilterBySettlement(c, undefined);
              ugandaPath.style("opacity", function (a) {
                  if (a.properties.DNAME_06 === c.key) {
                      //console.log(a);
                      //console.log(c);
                      a.properties._selected = !needRemove;
                      return a.properties._selected ? 1 : opacity;
                  }
                  return a.properties._selected ? 1 : opacity;
              });
              /*// settlements.style("opacity", function (a) {
              //   if (a.Settlement_ID === c.values[0].Settlement_ID) {
              //     a._selected = !needRemove;
              //     return a._selected ? 1 : opacity;
              //   }
              //   return a._selected ? 1 : opacity;
              // });
              // d3.select(".settlement").style("opacity", 0);
              // d3.select(".settlement-" + c.values[0].Settlement_ID).style("opacity", 1);
              global.selectedDistrict.map(function (a) {
                  //console.log(a);
                  d3.selectAll(".settlement-district-" + a.key.toLowerCase().replaceAll("[ ]", "-")).style("opacity", 1);
                  d3.selectAll(".district-" + a.key.toLowerCase().replaceAll('[ ]', "-")).style("opacity", 1);
              });
              //console.log(global.selectedDistrict.length);
              if(global.selectedDistrict.length === 0){refreshCounts(); refreshMap();}
              var secList = d3.select("#sector-list").selectAll("p");
              //console.log(disList, secList, setList, ageList);
              { secList.style("background", secList[0].length === 1 ? "#E3784A" : "transparent");}*/
              });
          _districtList
              .attr("class", function (d) {
                  return "district-list-" + d.key.replaceAll('[ ]', "_");
              })
              .text(function (d) {
                  return d.key;
              });
          _districtList.exit().remove();
      }
      /*if (themeList) {
            d3.select("#theme-count").text(themeList.length);
            var _themeList = d3.select("#theme-list").selectAll("p")
                .data(themeList);
            _themeList.enter().append("p")
                .text(function (d) {
                    return d.key;
                })
                .on("click", function (c) {
                    d3.selectAll(".labels").style("opacity", opacity);
                    var needRemove = $(d3.select(this).node()).hasClass("d3-active"); //d3.select(this).attr("class");//d3-active
                    d3.select(this).classed("d3-active", !needRemove).style("background", needRemove ? "transparent" :
                        "#E3784A");
                    //global.currentEvent = "theme";
                    //myFilter(c, global.currentEvent, needRemove);
                    // myFilterBySettlement(c, undefined);
                    ugandaPath.style("opacity", function (a) {
                        if (a.properties.DNAME_06 === c.key) {
                            //console.log(a);
                            //console.log(c);
                            a.properties._selected = !needRemove;
                            return a.properties._selected ? 1 : opacity;
                        }
                        return a.properties._selected ? 1 : opacity;
                    });
                    // settlements.style("opacity", function (a) {
                    //   if (a.Settlement_ID === c.values[0].Settlement_ID) {
                    //     a._selected = !needRemove;
                    //     return a._selected ? 1 : opacity;
                    //   }
                    //   return a._selected ? 1 : opacity;
                    // });
                    // d3.select(".settlement").style("opacity", 0);
                    // d3.select(".settlement-" + c.values[0].Settlement_ID).style("opacity", 1);
                    /!*global.selectedDistrict.map(function (a) {
                        //console.log(a);
                        d3.selectAll(".settlement-district-" + a.key.toLowerCase().replaceAll("[ ]", "-")).style("opacity", 1);
                        d3.selectAll(".district-" + a.key.toLowerCase().replaceAll('[ ]', "-")).style("opacity", 1);
                    });
                    //console.log(global.selectedDistrict.length);
                    if(global.selectedDistrict.length === 0){refreshCounts(); refreshMap();}
                    var secList = d3.select("#sector-list").selectAll("p");
                    //console.log(disList, secList, setList, ageList);
                    { secList.style("background", secList[0].length === 1 ? "#E3784A" : "transparent");}*!/
                });
            _themeList
                .attr("class", function (d) {
                    return "theme-list-" + d.key.replaceAll('[ ]', "_");
                })
                .text(function (d) {
                    return d.key;
                });
            _themeList.exit().remove();
        }*/
      if (educationList) {
            var _educationList = d3.select("#education-list").selectAll("p")
                  .data(educationList);
            _educationList.enter().append("p")
              .text(function (d) {
                  return d.key;
              })
          _educationList
              .attr("class", function (d) {
                  return "education-list-" + d.key.replaceAll('[ ]', "_");
              })
              .text(function (d) {
                  return d.key;
              });
          _educationList.exit().remove();
              //console.log(educationList);
        }

        if (socioEconomicList) {
            var _socioEconomicList = d3.select("#socio-economic-list").selectAll("p")
                .data(socioEconomicList);
            _socioEconomicList.enter().append("p")
                .text(function (d) {
                    return d.key;
                })
            _socioEconomicList
                .attr("class", function (d) {
                    return "socio-economic-list-" + d.key.replaceAll('[ ]', "_");
                })
                .text(function (d) {
                    return d.key;
                });
            _socioEconomicList.exit().remove();
            //console.log(educationList);
        }
        if (washAndHealthList) {
            var _washAndHealthList = d3.select("#wash-and-health-list").selectAll("p")
                .data(washAndHealthList);
            _washAndHealthList.enter().append("p")
                .text(function (d) {
                    return d.key;
                })
            _washAndHealthList
                .attr("class", function (d) {
                    return "wash-and-health-list-" + d.key.replaceAll('[ ]', "_");
                })
                .text(function (d) {
                    return d.key;
                });
            _washAndHealthList.exit().remove();
            //console.log(educationList);
        }
        if (energyList) {
            var _energyList = d3.select("#energy-list").selectAll("p")
                .data(energyList);
            _energyList.enter().append("p")
                .text(function (d) {
                    return d.key;
                })
            _energyList
                .attr("class", function (d) {
                    return "energy-list-" + d.key.replaceAll('[ ]', "_");
                })
                .text(function (d) {
                    return d.key;
                });
            _energyList.exit().remove();
            //console.log(educationList);
        }
    }
        d3.select("#education-list").selectAll("p").append("div").attr("class", "sliders");
        d3.select("#socio-economic-list").selectAll("p").append("div").attr("class", "sliders");
        d3.select("#wash-and-health-list").selectAll("p").append("div").attr("class", "sliders");
        d3.select("#energy-list").selectAll("p").append("div").attr("class", "sliders");
       // console.log(1);
      //console.log(createSliders)
        // createSliders.append("div")
        //     .attr("class", "sliders");

        var sliders = document.getElementsByClassName('sliders');
        // console.log(sliders);
        var fieldName = [];

        for ( var i = 0; i < sliders.length; i++ ) {
            var domain =[+Infinity, -Infinity];

            // console.log([sliders[i].__data__.values[0].FieldNames]);
            fieldName.push([sliders[i].__data__.values[0].FieldNames]);
            //console.log(sliders[i].__data__.key);


        //console.log(sliders[i].__data__);
        for (var j = 0; j < dataset1.length; j++) {
            // console.log((dataset1[j]));
            var Population = +(dataset1[j]["Population_2014"]);
            var Household = +(dataset1[j]["Households_2014"]);
            var filterValue;

            if (sliders[i].__data__.values[0].Theme === "Education (% of population)") {
                filterValue = +(dataset1[j][sliders[i].__data__.values[0].FieldNames])  / Population * 100 ;
            } else {
                filterValue = +(dataset1[j][sliders[i].__data__.values[0].FieldNames])  / Household * 100 ;
            }
            domain[0] = filterValue < domain[0] ? filterValue :
                domain[
                    0];
            domain[1] = filterValue > domain[1] ? filterValue :
                domain[
                    1];


            // console.log(dataset1[j]["DNAME2016"], filterValue, realValue);


        }
        // if (sliders[i].__data__.key)
        // var filterValue = +(d.properties._HH_Improved_Toilet_2014[0].key)/ +(d.properties._Number_of_HH[0].key) * 100;
        // domain[0] = filterValue < domain[0] ? filterValue :
        //     domain[
        //         0];
        // domain[1] = filterValue > domain[1] ? filterValue :
        //     domain[
        //         1];
        //console.log(domain);


            //console.log(domain);

            noUiSlider.create(sliders[i], {
                start: [0,100],
                behaviour: "drag",
                margin: 5,
                connect: true,
                orientation: "horizontal",
                range: {
                    'min': 0,
                    'max': 100
                },
                tooltips: true,
                format: {
                    to: function (value) {
                        // console.log(value);
                        return value.toFixed(2) + '%';
                    },
                    from: function (value) {
                        return value.replace('%', '');
                    }
                }
            });

            var activeFilters = [];
            sliders[i].noUiSlider.on('slide', addValues);

        }

        //console.log(fieldName);

        /*function updateSliderValue(sliders, handle) {
            var children, i, val, values, _results;
            if (handle == null) {
                handle = 0;
            }

            console.log(sliders);
            children = document.getElementsByClassName('noUi-handle');

            values = sliders.noUiSlider.get();

            i = 0;
            _results = [];
            while (i < children.length) {
                if (children.length === 1) {
                    val = parseInt(values);
                } else {
                    val = parseInt(values[i]);
                }
                children[i].dataset.value = val;
                _results.push(i++);
            }
            return _results;
        }*/

        function addValues() {
            var allValues = [];
            var range, rangeMin, rangeMax;
            var realRange = [];

            //console.log(fieldName);
            //console.log(filterValue);

            for (var i = 0; i < sliders.length; i++) {
                // console.log([sliders[i].noUiSlider.get()[0] * Population / 100]);
                // console.log([sliders[i].noUiSlider.get()[1] * Population / 100]);
                allValues.push([sliders[i].noUiSlider.get()]);
                range = sliders[i].noUiSlider.get();
                rangeMin = range.slice(0, 1);
                rangeMax = range.slice(1);

                //console.log([rangeMin, rangeMax]);
                realRange.push(rangeMin.concat(rangeMax));


                if (sliders[i].__data__.values[0].Theme === "Education (% of population)") {
                    rangeMin = [+(rangeMin) * Population / 100];
                    rangeMax = [+(rangeMax) * Population / 100];
                } else {
                    rangeMin = [+(rangeMin) * Household / 100];
                    rangeMax = [+(rangeMax) * Household / 100];
                }
                //console.log(rangeMin, rangeMax);


            }
            //console.log(realRange);
            // console.log(fieldName);

            var sliderData = [fieldName].concat([realRange]);
            //console.log(sliderData);
            //console.log(dataset1);


            var filtered = [];

            var filteredPop = 0;
            var filteredHH = 0;


            for (var i = 0; i < dataset1.length; i++) {

                for (var j = 0; j < sliderData[0].length; j++) {
                    // console.log(dataset1);
                    //console.log(sliderData[0]);
                    if (dataset1[i][sliderData[0][j]]) {
                        // console.log(dataset1[i]);
                        var districtValue = +(dataset1[i][sliderData[0][j]]) / +(dataset1[i]["Households_2014"]) * 100;
                        // console.log(districtValue, +(sliderData[1][j][0]), +(sliderData[1][j][1]));
                        //console.log(+(sliderData[1][j][0]));
                        // console.log(+((sliderData[1][j][0]).replace('%', '')), sliderData[1][j][0]);
                        if (districtValue < +((sliderData[1][j][0]).replace('%', '')) - 1 || districtValue > +((sliderData[1][j][1]).replace('%', '')) + 1) {
                            filtered.push(dataset1[i].DNAME2016);
                        }
                    }
                }
            }
            filteredDistricts = filtered.filter(function (item, pos) {
                return filtered.indexOf(item) === pos;
            });
            //console.log(sliders);

            for (var i = 0; i < dataset1.length; i++) {
                for (var j = 0; j < filteredDistricts.length; j++) {
                    if (filteredDistricts[j] === dataset1[i].DNAME2016) {
                        var filtPopulation = +(dataset1[i]["Population_2014"]);
                        var filtHousehold = +(dataset1[i]["Households_2014"]);
                        // console.log(Population);
                        filteredPop = filteredPop + filtPopulation;
                        filteredHH = filteredHH + filtHousehold;
                    }
                }

            }
            d3.select("#district-count").text(global.districtCount - filteredDistricts.length);
            d3.select("#population-count").text((global.populationCount - filteredPop).toLocaleString());
            d3.select("#household-count").text((global.householdCount - filteredHH).toLocaleString());



                ugandaPath.style("fill", function (d) {
                    //var clicked = d3.select(".d3-active");
                    //console.log(clicked[0][0].__data__.properties.dist);
                // console.log(a);
                    /*if (a.properties. === c.key) {
                        //console.log(a);
                        //console.log(c);
                        a.properties._selected = !needRemove;
                        return a.properties._selected ? 1 : opacity;
                    }
                    return a.properties._selected ? 1 : opacity;
                });*/
                for (var k = 0; k < filteredDistricts.length; k++) {
                    // console.log(filteredDistricts[k]);
                    if (d.properties.dist === filteredDistricts[k]) {
                        return "none";
                    }
                }
                return "#e3784a";


            });


            //console.log(sliderData);

            var activeFilters = [];
            var filterValues = [];

            // console.log(sliderData);
            for (var i = 0; i < sliderData[0].length; i++) {
                if (sliderData[1][i][0] !== "0.00%" || sliderData[1][i][1] !== "100.00%") {
                    activeFilters.push(sliderData[0][i][0]);
                    filterValues.push(sliderData[1][i]);
                }
            }
            // console.log(activeFilters);
            //var active = [activeFilters].concat([filterValues]);
            // console.log(active);

        }

        // console.log(fieldName);
        //console.log(sliders);

        var header = [];
        var values = [];


        for (var i = 0; i < sliders.length; i++) {
            var headerValues = 0;
            for (var j = 0; j < dataset1.length ; j++) {
                // console.log(dataset1);
                // console.log(sliders[j].__data__.key);
                header.push(sliders[i].__data__.key);

                if (dataset1[j][sliders[i].__data__.values[0].FieldNames]) {
                    // console.log(dataset1[i]);
                    headerValues = +(dataset1[j][sliders[i].__data__.values[0].FieldNames]) + headerValues;
                    // console.log(districtValue, +(sliderData[1][j][0]), +(sliderData[1][j][1]));
                    //console.log(+(sliderData[1][j][0]));
                    // console.log(+((sliderData[1][j][0]).replace('%', '')), sliderData[1][j][0]);
                }
                //console.log(sliders[j].__data__.key);
                //console.log(headerValues);
            }
            values.push(headerValues / global.householdCount * 100);
        }
        var headerList = header.filter(function (item, pos) {
            return header.indexOf(item) === pos;
        });
        // console.log(headerList);
        // console.log(values);
        var chartData = [headerList].concat([values]);

        var valueLabelWidth = 40; // space reserved for value labels (right)
        var barHeight = 25; // height of one bar
        var barLabelWidth = 200; // space reserved for bar labels
        var barLabelPadding = 5; // padding between bar and bar labels (left)
        var gridLabelHeight = 18; // space reserved for gridline labels
        var gridChartOffset = 3; // space between start of grid and first bar
        var maxBarWidth = 190; // width of the bar with the max value

// accessor functions
        var barLabel = function(d) {  return d; };
        var barValue = function(d) { return parseFloat(d); };

// scales
        var yScale = d3.scale.ordinal().domain(d3.range(0, chartData[0].length)).rangeBands([0, chartData[0].length * barHeight]);
        var y = function(d, i) { return yScale(i); };
        var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
        var x = d3.scale.linear().domain([0, 100/*d3.max(data, barValue)*/]).range([0, maxBarWidth]);
// svg container element
        var chart = d3.select('#statistics-list').append("svg")
            .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
            .attr('height', gridLabelHeight + 20 + gridChartOffset + chartData[0].length * barHeight);
// grid line labels
        var gridContainer = chart.append('g')
            .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')');
        gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
            .attr("x", x)
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(String);
// vertical grid lines
        gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
            .style("stroke", "#ccc");
// bar labels
        var labelsContainer = chart.append('g')
            .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')');
        labelsContainer.selectAll('text').data(chartData[0]).enter().append('text')
            .attr('y', yText)
            .attr('stroke', 'none')
            .attr('fill', 'black')
            .attr("dy", ".35em") // vertical-align: middle
            .attr('text-anchor', 'end')
            .text(barLabel);
// bars
        var barsContainer = chart.append('g')
            .attr("class", "statUG")
            .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');
        barsContainer.selectAll("rect").data(chartData[1]).enter().append("rect")
            .attr('y', y)
            .attr('height', yScale.rangeBand() - 5)
            .attr('width', function(d) { return x(barValue(d)); })
            .attr('stroke', 'white')
            .attr('fill', '#E3784A');
// bar value labels
/*        barsContainer.selectAll("text").data(chartData[1]).enter().append("text")
            .attr("x", function(d) { return x(barValue(d)); })
            .attr("y", yText)
            .attr("dx", 3) // padding-left
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "start") // text-align: right
            .attr("fill", "black")
            .attr("stroke", "none")
            .text(function(d) { return d3.round(barValue(d), 2); });*/
// start line
        barsContainer.append("line")
            .attr("y1", -gridChartOffset)
            .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
            .style("stroke", "#000");

        var legend = d3.select('#statistics-legend').append("svg")
            .attr("width", 100)
            .attr("height", 45);
        var rectangles = legend.append('g');


        rectangles.append("rect")
            .attr("width", "100px")
            .attr("height", "20px")
            .attr("fill", "#E3784A");
        rectangles.append("text")
            .attr("x", 3.01)
            .attr("y",  10)
            .attr("dy", ".35em")
            .style('fill', 'white')
            .text("National Averages");

        //http://jsfiddle.net/hibbard_eu/5y9zn6p5/
        //http://jsfiddle.net/jayblanchard/nBdkU/
        //https://codepen.io/paulobrien/pen/AByuk
        //https://hibbard.eu/display-ui-blocking-overlay-on-page-load/






    window.addEventListener("resize", function () {
      var wrapper = d3.select("#d3-map-wrapper");
//      var width = wrapper.node().offsetWidth || 960;
//      var height = wrapper.node().offsetHeight || 480;
      var width = $(window).width();
      var height = $(window).height()-25;  
      $(".toggler").css("height",height+25);
      var ht = $("#rtitle").height();
      ht = (height - ht)/2;
      $("#rtitle").css("margin-top",ht+"px")

      var ht = $("#ltitle").height();
      ht = (height - ht)/2;
      $("#ltitle").css("margin-top",ht+"px")

      if ($("#right").width()+$("#left").width() > width-20)
         {
          if ($("#left").attr("data-status") =="opened")
             {
              $("#left").find(".toggler").trigger("click");
             } 
         }     
      if (width < 400)
         {  
          $("#right").css("max-width","307px");
          $("#right").css("min-width","307px");
          $("#left").css("max-width","307px");
          $("#left").css("min-width","307px");
          if ($("#left").attr("data-status") =="opened")
             {
              $("#left").find(".toggler").trigger("click");
             }
          if ($("#right").attr("data-status") =="opened")
             {
              $("#right").find(".toggler").trigger("click");
             }  
         }   
      else
         {
          $("#right").css("max-width","372px");
          $("#right").css("min-width","372px");
          $("#left").css("max-width","372px");
          $("#left").css("min-width","372px");
         }    
      $("#d3-map-container").css("width",width);
      $("#d3-map-container").css("height",height);
      if (width) {
        d3.select("#d3-map-container").select("svg")
          .attr("viewBox", "0 0 " + width + " " + height)
          .attr("width", width)
          .attr("height", height);
      }
     setTimeout(function(){
        zoom = map.getBoundsZoom(cbounds); 
        map.setView(cbounds.getCenter(),zoom,{pan: {animate: true,duration: 1.5},zoom: {animate: true} });
        map.fitBounds(cbounds);
        map.invalidateSize();
     },2000);

    });
    var triggerclick = false;
     $(document).on("click",".toggler",function(e){ 
      if (triggerclick)
         {
          triggerclick = false;  
          return;  
         }
      e.stopPropagation();
      e.preventDefault(); 
      if ($(window).width() < 400)
         {  
          setTimeout(function(){   
             if ($("#left").attr("data-status") =="opened" && $("#right").attr("data-status") =="opened")
                {
                 if ($("#right").width()+$("#left").width() > $(window).width()-20)
                    {
                     $("#left").find(".toggler").trigger("click");
                    } 
                }
             else
                {
                }  
          },500) 
         } 
      else
         {
          if ($("#left").attr("data-status") =="opened" && $("#right").attr("data-status") =="opened")
             {
              if ($("#right").width()+$("#left").width() > $(window).width()-20)
                 {
                  if ($("#left").attr("data-status") =="opened")
                     {
                      $("#left").find(".toggler").trigger("click");
                     } 
                 }   
             }
         }
     });


      if ($(window).width() > 400)
         {  
          $("#right").css("max-width","372px");
          $("#right").css("min-width","372px");
          $("#left").css("max-width","372px");
          $("#left").css("min-width","372px");
          $("#left").find(".toggler").trigger("click");
          $("#right").find(".toggler").trigger("click");
          setTimeout(function(){   
             if ($("#right").width()+$("#left").width() > $(window).width()-20)
                {
                 if ($("#left").attr("data-status") =="opened")
                    {
                     $("#left").find(".toggler").trigger("click");
                    } 
                } 
          },1000)
         } 
      else
         {
          $("#left").find(".toggler").css("margin-top","-35px") 
          $("#right").css("max-width","301px");
          $("#right").css("min-width","301px");
          $("#left").css("max-width","303px");
          $("#left").css("min-width","303px");
         }   
    } // ready



})(d3, $, queue, window);