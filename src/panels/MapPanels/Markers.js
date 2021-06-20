import L from 'leaflet';
import './Markers.css';
const url = process.env.PUBLIC_URL + '/map-markers/';
const iconDefault = new L.Icon({
    iconUrl: (url + "default.svg"),
    iconRetinaUrl: (url + "default.svg"),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 67),
    className: 'leaflet-custom-icon'
});

export { iconDefault };