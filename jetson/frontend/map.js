var myTileServer = new ol.layer.Tile({
	source: new ol.source.OSM({
		crossOrigin: null,
		//url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	})
})

init_lonlat = [-87.3267108, 39.4833491]

var map = new ol.Map({
	layers: [ myTileServer ],
	target: 'map',
	view: new ol.View({
		center: ol.proj.fromLonLat(init_lonlat),
		zoom: 18
	})
})

function changeCenter(lat, lon) {
	new_view = new ol.View({
		center: ol.proj.fromLonLat([lon, lat]),
		zoom: 18
	})
	map.setView(new_view)
}
