import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader,} from '@vkontakte/vkui';
import {Map} from "./MapPanels/MapsEmpty";
import {Marker} from 'react-leaflet'
import {iconDefault} from "./MapPanels/Markers";
import PopupSettings from "./MapPanels/PopupSettings";
import * as client from "../api/client";

const v = (i) => {return ((i !== null) && (i !== undefined))}


const MarkersList = ({coords, onClick}) => {
    if (!Array.isArray(coords)){
        return null;
    }
    return coords.map((item) => {
        return <Marker icon={iconDefault} key={item.id} position={[item.latitude, item.longitude]}
                       eventHandlers={{
                           click: onClick.bind(this, item.id)
                       }}
        />
    });
}

const MainMap = ({id, globalSetModalView}) => {
    const [telemetry, setTelemetry] = useState([]);
    const [mapsCoordsData, setMapsCoordsData] = useState([]);
    const [popupSettingsView, setPopupSettingsView] = useState(null);
    // Init data
    useEffect(() => {
        async function load() {
            const data = await client.LastTelemetriesSensors();
            setTelemetry(data);
        }
        load();
        setInterval(() => load(), 10000);
    }, [])

    // Перерасчёт координат на карте для меток:
    useEffect(() => {
        const ans = [];
        for (let row of telemetry){
            if (v(row.influx) && v(row.influx.ICCID) && v(row.influx.longitude) && v(row.influx.latitude)){
                ans.push({
                    id: row.influx.ICCID,
                    longitude: row.influx.longitude,
                    latitude: row.influx.latitude
                })
            }
        }
        setMapsCoordsData(ans);

    }, [telemetry])

    const HandlerMarker = (uuid) => {
        setPopupSettingsView(true);
        const fieldIndexTelemetry = telemetry.findIndex((e) => {
            if (v(e["influx"]) && v(e["influx"]["ICCID"])) {
                return e["influx"]["ICCID"] === uuid.toString();
            }
            return false;
        });
        if (fieldIndexTelemetry === -1){return false;}
        const telemetry_data = telemetry[fieldIndexTelemetry];
        const coords = {
            latitude: telemetry_data.influx.latitude,
            longitude: telemetry_data.influx.longitude,
        }
        const onChangeCommand = ({auto, level}) => {
            console.log({uuid, auto, level});
            client.PushCommandTelemetriesSensor(uuid, auto, level).then();
        }
        setPopupSettingsView(
            <PopupSettings onClose={setPopupSettingsView.bind(this, null)} dataShape={{
                positionMarker: coords,
                temperature: telemetry_data.influx.Tamb_degC,
                uuid: uuid.toString(),
                autoLight: telemetry_data.command.auto === undefined,
                light: telemetry_data.command === undefined ? telemetry_data.influx.level_light: telemetry_data.command.level_light
            }} onChangeCommand={onChangeCommand}/>
        );
    }


    return (
        <Panel id={id}>
            <PanelHeader>Вариационные данные</PanelHeader>
            <div className={"mocks_wrapper"}>
                <Map height={"100%"}>
                    <MarkersList onClick={HandlerMarker} coords={mapsCoordsData}/>
                    {popupSettingsView}
                </Map>
            </div>
        </Panel>
    );
}

MarkersList.propTypes = {
    coords: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        })
    ),
    onClick: PropTypes.func.isRequired,
}

MainMap.propTypes = {
    id: PropTypes.string.isRequired,
    globalSetModalView: PropTypes.func,
};

export default MainMap;
