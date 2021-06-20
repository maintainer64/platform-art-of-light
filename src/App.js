import React, { useState, useEffect } from 'react';
import { View, AppRoot } from '@vkontakte/vkui';
import {HashRouter, Route} from 'react-router-dom';
import '@vkontakte/vkui/dist/vkui.css';
import './style.css'

import MocksSettings from './panels/MocksSettings';
import LeftMenuItem from "./panels/MenuItems";
import MainMap from "./panels/MainMap";
import {PathSubUrl} from "./api/client";

const App = () => {
	const [popout, setPopout] = useState(null);
	const [modalView, setModalView] = useState(null);

	useEffect(() => {
		async function fetchData() {
			setPopout(null);
		}
		fetchData();
	}, []);

	const Wrapper = (id, component) => (
		<View activePanel={id}>{component}</View>
	);

	const RouteMocksSettings = () => Wrapper('mocksSettings', <MocksSettings globalSetModalView={setModalView} id='mocksSettings'/>);
	const RouteMainMap = () => Wrapper('mainMap', <MainMap globalSetModalView={setModalView} id='mainMap'/>);


	return (
		<HashRouter basename='/'>
			<AppRoot>
				<LeftMenuItem/>
				{modalView}
				<div className={"Content"}>
					<Route path={"/mocks-settings/"} exact component={RouteMocksSettings} />
					<Route path={"/"} exact component={RouteMainMap} />
				</div>
			</AppRoot>
		</HashRouter>
	);

}

export default App;
