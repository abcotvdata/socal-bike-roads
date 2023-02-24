/* script.js 
   Author:
   Date:
*/

// var map = L.map('map', {minZoom: 3}).setView([50.8513826,-118.2170459], 3);
// var pane = map.createPane('fixedbg', document.getElementById('map'));
// var pane = map.createPane('fixed', document.getElementById('map'));
// var pane = map.createPane('bgfixed', document.getElementById('map'));

// map.getPane('bgfixed').style.zIndex = 300;

// //background layer
// var imageUrl = 'img/Background.png',
// imageBounds = [[30, -112], [37, -125]];
// L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1);


// //tile layer
// L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	subdomains: 'abcd',
// 	opacity: 0.25,
// 	pane: 'overlayPane',
// 	ext: 'png'
// }).addTo(map);


// var layer = L.leafletGeotiff("FloodDepthh_Composite.tif").addTo(map);


// https://dig.abclocal.go.com/kabc/flood-map/flood_cog.tif

$(document).ready(function(){ // begin document.ready block

  $('#radio_box').change(function(){

    selected_value = $("input[name='metric']:checked").val();
    console.log(selected_value);

    if(selected_value == "CM") {
      $(".legenditems").html('<div class="item"><div class="box ankle"></div><div class="label">Up to ankle-deep (3 to 11 cm)</div></div><div class="item"><div class="box knee"></div><div class="label">Ankle to knee-deep (11 to 45 cm)</div></div><div class="item"><div class="box waist"></div><div class="label">Knee to waist-deep (45 to 100 cm)</div></div><div class="item"><div class="box head"></div><div class="label">Waist to head-deep (100 to 170 cm)</div></div><div class="item"><div class="box overhead"></div><div class="label">Over head-deep (170 cm and up)</div></div>')
    } else if (selected_value == "IN") {
      $(".legenditems").html('<div class="item"><div class="box ankle"></div><div class="label">Up to ankle-deep (1.2 to 4.3 in)</div></div><div class="item"><div class="box knee"></div><div class="label">Ankle to knee-deep (4.3 in to 1.5 ft)</div></div><div class="item"><div class="box waist"></div><div class="label">Knee to waist-deep (1.5 to 3.3 ft)</div></div><div class="item"><div class="box head"></div><div class="label">Waist to head-deep (3.3 to 5.6 ft)</div></div><div class="item"><div class="box overhead"></div><div class="label">Over head-deep (5.6 ft and up)</div></div>')
    }

  });




	var map = L.map('map', {minZoom: 3}).setView([33.9864365,-118.1101426], 10);

  var pane = map.createPane('raster', document.getElementById('map'));



	//tile layer
	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		opacity: 0.8,
		pane: 'overlayPane',
		maxZoom: 20
	}).addTo(map);


  //HIN bike layer
  $.getJSON("HIN_bike.geojson",function(data){

    var bikeStyle = {
      "fillColor": "rgba(0,0,0,0)",
      "color": "#0058f6",
      "weight": 2,
      "fillOpacity": 0.9
    };

    var bike = L.geoJson(data, {
        style: bikeStyle,
        opacity:1,
    }).addTo(map)


  });


$("#justexplore").click(function(){
  $(".overlay").fadeOut();
  $("#searchagain").fadeIn();
  // $(".maptitle h3").html("How deep could flood waters be in your area?")
});

$("#searchagain").click(function(){
  $("#searchagain").fadeOut();
  $(".overlay").fadeIn();
  // $(".maptitle h3").html('This map, <a href="https://www.arcgis.com/home/webmap/viewer.html?webmap=3c17212bfc144a9a932d0341b9413fa3&extent=-118.7967,33.5916,-117.4406,34.2735" target="_Blank">originally created by researchers at UCI</a>, shows how deep flood waters could be in the Los Angeles metro area in the event of a severe flood, taking into account coastal, fainfall and river flooding. <br> Search for your zip code below to find out how deep flooding could be in your area.</h3>')
});



$("#submit").on("click", function(){


  // map.removeLayer(filtered_zip)

  var zipval = $("#zip").val()

    zipvallength = zipval.length
    console.log(zipval)

    if (zipvallength<5) {

      $(".tryagaintext p").html("Please type a valid zip code.")

      $(".tryagain").fadeIn()

      $("#oktryagain").click(function(){
        $(".tryagain").fadeOut()
      });

    } else {

      $(".overlay").fadeOut();
      $("#searchagain").fadeIn();

        // zip layer
        $.getJSON("SCAG-zips.json",function(data){

          var items = data;

          items = data.features.filter(function(obj) {
            // return the filtered value
            return obj.properties.name === zipval;
          });

          var items_length = items.length
          // console.log(items_length);

          if (items_length == 0) {
            $(".tryagaintext p").html("Sorry, this zip code was not in the area studied. Try another zip code!")
            $(".tryagain").fadeIn()

            $("#oktryagain").click(function(){
              $(".tryagain").sfadeOut()
            });
          }

          // $(".maptitle h3").html("How deep could flood waters be in your area?")

            var myStyle = {
              "fillColor": "rgba(0,0,0,0)",
              "color": "#ffba00",
              "weight": 3,
              "fillOpacity": 0.9
          };

            var filtered_zip = L.geoJson(items, {
                style: myStyle,
                // pane: "polygonsPane",
                opacity:1,
                className: "polygons"
            }).addTo(map)



            var svgs_in_overlay_pane = $(".leaflet-overlay-pane svg g path");

            svgs_in_overlay_pane_length = svgs_in_overlay_pane.length
            console.log(svgs_in_overlay_pane_length)

            if (svgs_in_overlay_pane_length > 1) {

              svgs_in_overlay_pane[0].remove()

              
            } else {
              
            }

            var bounds = filtered_zip.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-1));

          });


    }



});



    






// var data = [{"name":"Lenovo Thinkpad 41A4298","website":"google"},
// {"name":"Lenovo Thinkpad 41A2222","website":"google"},
// {"name":"Lenovo Thinkpad 41Awww33","website":"yahoo"},
// {"name":"Lenovo Thinkpad 41A424448","website":"google"},
// {"name":"Lenovo Thinkpad 41A429rr8","website":"ebay"},
// {"name":"Lenovo Thinkpad 41A429ff8","website":"ebay"},
// {"name":"Lenovo Thinkpad 41A429ss8","website":"rediff"},
// {"name":"Lenovo Thinkpad 41A429sg8","website":"yahoo"}]

// var data_filter = data.filter( element => element.website =="yahoo")
// console.log(data_filter)






	

}); //end document.ready block
