import {Popup} from "react-leaflet";
import './PopupSettings.css'
import PopupViewMapData, {PopupViewMapDataShape} from "../FormsPanels/PopupViewMapData";
import React from "react";
import PropTypes from "prop-types";

const PopupSettings = ({dataShape, onChangeCommand, onClose}) => {
    return (
        <div className={"PopupSettingWrapper"}>
            <Popup onClose={onClose} position={[dataShape.positionMarker.latitude, dataShape.positionMarker.longitude]}>
                <PopupViewMapData data={dataShape} onChangeCommand={onChangeCommand}/>
            </Popup>
        </div>
    )
}

PopupSettings.propTypes = {
    dataShape: PropTypes.shape(PopupViewMapDataShape).isRequired,
    onChangeCommand: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default PopupSettings