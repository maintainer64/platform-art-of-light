import axios from 'axios';

const headers = {
    'Content-type': 'application/json',
};

const instance = axios.create({
    headers,
    withCredentials: true,
});

const BaseUrl = "https://multi-univ.russu.xyz";
export const PathSubUrl = "/platform-art-of-light";
const Url = (path) => {
    const path_base = path.startsWith("/") ? path : "/" + path;
    return BaseUrl + path_base;
}
export async function MocksGet() {
    return await instance({
        method: 'get',
        url: Url("api/mock"),
    }).then((res) => (res.data));
}
export async function MocksSet(id, data){
    return await instance({
        method: 'post',
        data: {
            id,
            ...data
        },
        url: Url("api/mock"),
    }).then((res) => (res.data.status === "ok"));
}
export async function MocksDelete(id){
    return await instance({
        method: 'delete',
        data: {
            ids: [id],
        },
        url: Url("api/mock"),
    }).then((res) => (res.data.status === "ok"));
}

export async function GetDataGeoCode(lat, lng){
    return await instance({
        method: 'post',
        url: Url('/api/geocoder'),
        data: {lat, lng}
    }).then((res) => {
        try {
            return res.data.response["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["Address"]["formatted"]
        } catch (err) {
            console.log(err);
            return "Адрес не определён";
        }
    })
}

export async function LastTelemetriesSensors(){
    return await instance({
        method: 'get',
        url: Url('/api/sensor/list'),
    }).then((res) => {
        return res.data;
    })
}

export async function PushCommandTelemetriesSensor(uuid, auto, level){
    return await instance({
        method: 'post',
        url: Url('/api/command'),
        data: {
            id: uuid,
            auto: auto,
            level_light: level,
        }
    }).then((res) => {
        try {
            return res.data;
        } catch (err) {
            return "error";
        }
    })
}