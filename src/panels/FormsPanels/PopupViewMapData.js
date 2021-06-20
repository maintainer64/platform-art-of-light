import React, {useEffect, useState} from "react";
import {Group, Cell, Switch, FormItem, FormLayoutGroup, Slider, Spinner} from "@vkontakte/vkui";
import './PopupViewMapData.css'
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import PropTypes from 'prop-types';
import * as client from "../../api/client";
const url = process.env.PUBLIC_URL + '/map-leaflet/';

const AutoLight = ({checked, disabled, setChecked}) => {
    return (
        <div className="auto-light">
            <div className="auto-light__text">
                Автояркость
            </div>
            <div className="auto-light__switch">
                <Switch disabled={disabled} onChange={setChecked.bind(this, !checked)} defaultChecked={checked} value={checked}/>
            </div>
        </div>
    )
}

const LevelLightControl = ({disabled, value, setValue}) => {
    return (
        <div className="level_light_control">
            <FormItem top={
                <div className="text">
                    Яркость
                </div>
            }>
                <Slider
                    disabled={disabled}
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    onChange={v => setValue(v)}
                />
            </FormItem>
        </div>
    )
}

const TemperatureBlock = ({temperature}) => {
    return (
        <div className="auto-light">
            <div className="text-temp">
                Температура на улице
            </div>
            <div className="temperature">
                {temperature.toFixed(0)} °С
            </div>
        </div>
    )
}

const ResourceAny = ({name, min, max, value}) => {
    return (
        <div className="level_light_control indicator">
            <FormItem top={
                <div>
                    <div className="text">
                        {name}
                    </div>
                    <div className="text__bottom">
                        {value} / {max}
                    </div>
                </div>
            }>
                <Slider
                    disabled={true}
                    min={min}
                    max={max}
                    value={value}
                />
            </FormItem>
        </div>
    )
}

const ResourceLed = ({min, max, value}) => {
    return (
        <ResourceAny name="Ресурс лампы" min={min} max={max} value={value}/>
    )
}

const ResourceController = ({min, max, value}) => {
    return (
        <ResourceAny name="Ресурс контроллера" min={min} max={max} value={value}/>
    )
}


const MetaInfoBlock = ({lat, lng}) => {
    const [addressName, setAddressName] = useState(null);

    useEffect(() => {
        async function LoadAddress(){
            const key = lat + "," + lng;
            if (window.FunctionCustomLoadAddress === undefined){
                window.FunctionCustomLoadAddress = {};
            }
            if (window.FunctionCustomLoadAddress[key] != undefined){
                setAddressName(window.FunctionCustomLoadAddress[key]);
            } else {
                setAddressName(<Spinner size="small"/>)
                const ans = await client.GetDataGeoCode(lat, lng);
                window.FunctionCustomLoadAddress[key] = ans;
                setAddressName(ans);
            }
        }
        LoadAddress();
    }, []);

    return (
        <div className={"meta"}>
            <Cell disabled>
                <div style={{overflowY: 'scroll'}} className="info-marker">{addressName}</div>
                <div className="info-marker">
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                    <CopyToClipboard text={lat + ", " + lng}>
                                <span className="info-marker-copy">
                                    <img src={url + "copy.svg"} alt="Copy.svg"/>
                                </span>
                    </CopyToClipboard>

                </div>
            </Cell>
        </div>
    )
}


const HeaderBlock = ({id, value, onChange}) => {
    return (
        <div className={"header"}>
            <Cell disabled after={<Switch value={value} defaultChecked={value} onChange={onChange.bind(this, !value)}/>}>
                <h1>ID {id}</h1>
            </Cell>
        </div>
    )
}

const SettingsBlock = ({light, temperature, autoLight}) => {
    return (
        <div className="settings">
            <Cell disabled>
                <AutoLight disabled={autoLight.disabled} checked={autoLight.checked} setChecked={autoLight.setChecked}/>
                <LevelLightControl disabled={light.disabled} value={light.value} setValue={light.setValue}/>
                <TemperatureBlock temperature={temperature.temperature}/>
                <ResourceLed max={500} value={300} min={0}/>
                <ResourceController  max={5000} value={300} min={0}/>
            </Cell>
        </div>
    )
}
const PopupViewMapData = ({data, onChangeCommand}) => {
    const [popUpLoad, setPopUpLoad] = useState(true);
    const [autoLight, setAutoLight] = useState(true);
    const [autoLightDisabled, setAutoLightDisabled] = useState(false);
    const setLightUpdatable = (value) => {
        setLight(value);
        onChangeCommand({auto: !value.disabled, level: value.value === undefined ? 0 : value.value});
    }
    const onChangeAutoLight = (state) => {
        setAutoLight(state);
        setLightUpdatable({
            value: light.value,
            disabled: state,
        });
    }

    const [lampEnabled, setLampEnabled] = useState(true);
    const onChangeHeaderSwitch = (state) => {
        setLampEnabled(state);
        setAutoLight(state ? autoLight: false);
        setLightUpdatable({
            value: state ? light.value : 0,
            disabled: state ? autoLight : true
        });
        setAutoLightDisabled(!state);
    }

    const [light, setLight] = useState({value: 0, disabled: true});

    useEffect(() => {
        setAutoLight(data.autoLight);
        setLampEnabled(data.light !== 0);
        setLight({
            value: data.light,
            disabled: data.light !== 0 ? data.autoLight : false,
        });
        setPopUpLoad(false);
    }, []);

    const GroupViewData = () => {
        return (
            <Group>
                <HeaderBlock id={data.uuid} value={lampEnabled} onChange={onChangeHeaderSwitch}/>
                <MetaInfoBlock lat={data.positionMarker.latitude} lng={data.positionMarker.longitude}/>
                <SettingsBlock
                    light={{
                        value: light.value,
                        disabled: light.disabled,
                        setValue: (v) => {setLightUpdatable({value: v, disabled: light.disabled})},
                    }}
                    autoLight={{
                        checked: autoLight,
                        disabled: autoLightDisabled,
                        setChecked: onChangeAutoLight,
                    }}
                    temperature={{temperature: data.temperature}}
                />
            </Group>
        )
    }

    return (
        <div className={"PopupViewMapData"}>
            {popUpLoad ? (<Spinner size="small"/> ) : <GroupViewData/>}
        </div>
    )
}

MetaInfoBlock.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
}

TemperatureBlock.propTypes = {
    temperature: PropTypes.number.isRequired,
}

LevelLightControl.propTypes = {
    value: PropTypes.number.isRequired,
    setValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
}

AutoLight.propTypes = {
    checked: PropTypes.bool,
    setChecked: PropTypes.func,
    disabled: PropTypes.bool,
}

const ResourceAnyComposition = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

ResourceAny.propTypes = {
    name: PropTypes.string.isRequired,
    ...ResourceAnyComposition
}
ResourceLed.propTypes = ResourceAnyComposition;
ResourceController.propTypes = ResourceAnyComposition

HeaderBlock.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

SettingsBlock.propTypes = {
    light: PropTypes.shape(LevelLightControl.propTypes),
    temperature: PropTypes.shape(TemperatureBlock.propTypes),
    autoLight: PropTypes.shape(AutoLight.propTypes),
}

export const PopupViewMapDataShape = {
    positionMarker: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
    }).isRequired,
    temperature: PropTypes.number.isRequired,
    uuid: PropTypes.instanceOf([PropTypes.number, PropTypes.string]).isRequired,
    autoLight:  PropTypes.bool.isRequired,
    light:  PropTypes.number.isRequired,
}

PopupViewMapData.propTypes = {
    data: PropTypes.shape(PopupViewMapDataShape).isRequired,
    onChangeCommand: PropTypes.func.isRequired,
}
export default PopupViewMapData;