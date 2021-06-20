import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './MenuItems.css'
import {Div, Footer} from "@vkontakte/vkui";
import { Icon28LocationMapOutline } from '@vkontakte/icons';
import { Icon28ListOutline } from '@vkontakte/icons';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { Icon28ArrowRightOutline } from '@vkontakte/icons';

import React, {useState} from "react";
import {localStorage} from "@vkontakte/vkjs";
import {PathSubUrl} from "../api/client";

function LinkTo(href) {
    const data = document.querySelector("#link-to");
    data.href = href
    data.click();
}

const MainMenuIcon = ({onClick, collapsed}) => {
    return (
        <div onClick={onClick} className={"CompanyNameSidebarMenu"}>
            <Div><h1>{collapsed ? (<Icon28ArrowRightOutline />) : "Art of Light"}</h1></Div>
        </div>
    );
}

const loadCollapsed = () => {
    let collapsed = localStorage.getItem("menuCollapsed");
    if (collapsed !== null){
        collapsed = collapsed.toString();
    }
    if (collapsed !== "true" && collapsed !== "false") {
        localStorage.setItem("menuCollapsed", "false");
        collapsed = "false";
    }
    return collapsed === "true";
}
const saveCollapsed = (collapsed) => {
    localStorage.setItem("menuCollapsed", collapsed ? "true" : "false");
}

const LeftMenuItem = () => {
    const [collapsed, setCollapsed] = useState(loadCollapsed());

    const saveAndSetCollapsed = (value) => {
        setCollapsed(value);
        saveCollapsed(value);
    }

    return (
        <ProSidebar collapsed={collapsed} width={270} className={"left-menu-sidebar"}>
            <Menu iconShape={null}>
                <div className={"container-menu"}>
                    <MainMenuIcon collapsed={collapsed} onClick={() => {saveAndSetCollapsed(!collapsed)}}/>
                    <MenuItem onClick={LinkTo.bind(this, PathSubUrl+"/#/")} icon={<Icon28LocationMapOutline/>}>Карта</MenuItem>
                    <MenuItem icon={<Icon28ListOutline/>}>Список устройств</MenuItem>
                    <SubMenu title="Настройки" icon={<Icon28SettingsOutline/>}>
                        <MenuItem onClick={LinkTo.bind(this, PathSubUrl+"/#/mocks-settings/")}>Вариационные данные</MenuItem>
                        <MenuItem>Платформа</MenuItem>
                    </SubMenu>
                    <Footer><div>
                        v 0.1
                        <a id="link-to" href="#" style={{display: "none"}} />
                    </div></Footer>
                </div>
            </Menu>
        </ProSidebar>
    );
}

export default LeftMenuItem;
