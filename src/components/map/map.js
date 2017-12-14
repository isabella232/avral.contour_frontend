import L from "leaflet";
import AreaSelect from "leaflet-areaselect/src/leaflet-areaselect";
import LeafletDraw from "leaflet-draw";
import OrderForm from "order-form/order-form";

export default class Map {
    constructor(options) {
    	this.mapId = options.mapId;
    	this.mapCenter = options.mapCenter;
    	this.mapZoom = options.mapZoom;
        this.formRegionGroup = document.getElementById("region-group");
        this.formSouthWest = document.getElementById("south-west-coord");
        this.formNorthEast = document.getElementById("nord-east-coord");
        this.formProccessBtn = document.getElementById("process-btn");

    	this.map = L.map(this.mapId).setView(this.mapCenter, this.mapZoom);
    	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        var that = this;

        var orderForm = new OrderForm();

        var areaSelect = L.areaSelect({width:200, height:200});
		areaSelect.on("change", function() {
            var bounds = this.getBounds();
            
            that.formSouthWest.value = Math.round(bounds.getSouthWest().lat*1000)/1000 + ", " + Math.round(bounds.getSouthWest().lng*1000)/1000;
            that.formSouthWest.setAttribute("data-minx", Math.round(bounds.getSouthWest().lng*1000)/1000);
            that.formSouthWest.setAttribute("data-miny", Math.round(bounds.getSouthWest().lat*1000)/1000);
            
            that.formNorthEast.value = Math.round(bounds.getNorthEast().lat*1000)/1000 + ", " +  Math.round(bounds.getNorthEast().lng*1000)/1000;
            that.formNorthEast.setAttribute("data-maxx", Math.round(bounds.getNorthEast().lng*1000)/1000);
            that.formNorthEast.setAttribute("data-maxy", Math.round(bounds.getNorthEast().lat*1000)/1000);

            that.checkArea(bounds);
            orderForm.cleanMessages();
        });        
		areaSelect.addTo(this.map);
    };

    checkArea(bounds){
        var geodesicArea = L.GeometryUtil.geodesicArea([bounds.getSouthWest(), bounds.getNorthWest(), bounds.getNorthEast(), bounds.getSouthEast()]);
        if (geodesicArea > 10000000000) {
            this.formProccessBtn.disabled = true;
            this.formRegionGroup.classList.add("is-invalid");
        } else {
            this.formProccessBtn.disabled = false;
            this.formRegionGroup.classList.remove("is-invalid");
        }
    };
};