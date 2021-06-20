import React from 'react';
import './PanelsLeafletMap.css';
const url = process.env.PUBLIC_URL + '/map-leaflet/';
const Zoom = ({maps}) => {
    return(
        <div onClick={() => {
            maps.zoomIn();
        }} className="zoom-top-bar-up zoom-top-bar-btn">
            <img src={url + "plus.svg"} alt="PlusZoom"/>
        </div>
    )
}
const Zoom2 = ({maps}) => {
    return(
        <div onClick={() => {
            maps.zoomOut();
        }} className="zoom-top-bar-down zoom-top-bar-btn">
            <img src={url + "minus.svg"} alt="MinusZoom"/>
        </div>
    )
}

export const ZoomPanel = ({maps}) => {
    return (
        <div className="zoom-top-bar">
            <Zoom maps={maps}/>
            <Zoom2 maps={maps}/>
        </div>
    );
}
export const MyLocation = ({handler}) => {
    return (
        <div onClick={handler} className="to-image-btn btn-my-location">
            <img src={url + "find.svg"} alt="MyLocation"/>
        </div>
    )
}
export default ZoomPanel;