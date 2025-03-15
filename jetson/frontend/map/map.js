const WEB_MERCATOR_PROJ = "EPSG:3857";

const osmURL = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const arcGISURL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const myTileServer = new ol.layer.Tile({
	source: new ol.source.OSM({
		crossOrigin: null,
		url: arcGISURL
	})
})

const init_lonlat = [-87.3267108, 39.4833491]

const vectorSource = new ol.source.Vector({ wrapX: false });
const vectorLayer = new ol.layer.Vector({
	source: vectorSource,
});

let draw;
let currentLineString;
let currentPoint;

function enableDrawingLineOnMap() {
	map.removeInteraction(draw);
	currentLineString = null;
	vectorSource.clear();
	draw = new ol.interaction.Draw({
		source: vectorSource,
		type: 'LineString',
	});
	map.addInteraction(draw);
	draw.on('drawend', function (drawEvent) {
		currentLineString = drawEvent.feature;
		map.removeInteraction(draw);
	});
}

function enablePointSelectionOnMap() {
	map.removeInteraction(draw);
	currentPoint = null;
	vectorSource.clear();

	draw = new ol.interaction.Draw({
		source: vectorSource,
		type: 'Point',
	});
	map.addInteraction(draw);
	draw.on('drawend', function (drawEvent) {
		currentPoint = drawEvent.feature.getGeometry().getCoordinates();
		currentLonLat = ol.proj.toLonLat(currentPoint, ol.proj.Projection(WEB_MERCATOR_PROJ));
		$("#smart_direct_latitude").value = currentLonLat[0];
		$("#smart_direct_longitude").value = currentLonLat[1];
		map.removeInteraction(draw);
	});
}

$("#record_path").onclick = (event) => {
	enableDrawingLineOnMap();
};

$("#record_point").onclick = (event) => {
	enablePointSelectionOnMap();
};

var map = new ol.Map({
	layers: [myTileServer, vectorLayer],
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

function gpsData(state) {
	gps = state["gps"]
	changeCenter(gps[0], -1 * gps[1]);
}