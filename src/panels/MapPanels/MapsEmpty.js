import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents, locationfound} from 'react-leaflet'
import {ZoomPanel, MyLocation} from "./PanelsLeafletMap";
import PropTypes from "prop-types";

const CustomZoomPanel = () => {
    const map = useMap();
    return (
        <ZoomPanel maps={map}/>
    )
}

const CustomLocationBtn = () => {
    const map = useMapEvents({
        locationfound(e) {
            map.flyTo(e.latlng, map.getZoom(), {
                animate: false,
            })
        },
    });
    const handler = () => {
        map.locate();
    }
    return <MyLocation handler={handler}/>;
}

export const Map = ({className, height, children}) => {
    return (
        <MapContainer zoomControl={false} style={{height}} className={"CustomMaps " + className} center={[37.3257279,-122.0372682]} zoom={13} scrollWheelZoom={false}>
            <CustomZoomPanel/>
            <CustomLocationBtn />
            <TileLayer
                boxZoom={true}
                attribution=''
                //url="https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.06.04-0-b210520094930&x={x}&y={y}&z={z}&scale=1&lang=ru_RU"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
};

Map.propTypes = {
    className: PropTypes.string,
    height: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ])
}