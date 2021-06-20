import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
} from '@vkontakte/vkui';
import {Icon28AddOutline} from "@vkontakte/icons";
import SearchPanel from "./FormsPanels/SearchPanel";
import MocksSettingsPanel from "./FormsPanels/MocksSettingsPanel";
import * as client from "../api/client";
import MocksSettingsPanelEmpty from "./FormsPanels/MocksSettingsPanelEmpty";

const MocksSettings = ({id, globalSetModalView}) => {
	const defaultViewDetailModalInfo = {view: false, data: null, id: null, buttonLoadingState: false, name: null};
	const [payloadMocksSettings, setPayloadMocksSettings] = useState([]);
	const [dataSearch, setDataSearch] = useState([]);
	const [viewDetailModalInfo, setViewDetailModalInfo] = useState(defaultViewDetailModalInfo);
	const viewDetailModal = (id) => {
		if (id === null){
			// Create New
			setViewDetailModalInfo({...defaultViewDetailModalInfo, name: "Идентификатор устройства", data: undefined, view: true});
			return;
		}
		const field = payloadMocksSettings.find(e => e["id"] === id.toString());
		// Set active
		const newViewDetailModalInfo = JSON.parse(JSON.stringify(viewDetailModalInfo));
		newViewDetailModalInfo.data = field;
		newViewDetailModalInfo.name = field.id;
		newViewDetailModalInfo.id = field.id;
		newViewDetailModalInfo.view = true;
		setViewDetailModalInfo(newViewDetailModalInfo);
	}
	const DeleteDetailModalData = (uuid) => {
		setViewDetailModalInfo(defaultViewDetailModalInfo); // Очищаем активное окно
		const fieldIndexDeleted= payloadMocksSettings.findIndex(e => e["id"] === uuid.toString());
		if (fieldIndexDeleted !== -1){
			payloadMocksSettings.splice(fieldIndexDeleted, 1);
			setPayloadMocksSettings(JSON.parse(JSON.stringify(payloadMocksSettings)));
		}
		client.MocksDelete(uuid).then();
	}
	const SaveDetailModalData = (data, uuid) => {
		// Prepare and send server
		const isCreatedNew = viewDetailModalInfo.id !== uuid
		if (isCreatedNew){
			// Created
			setViewDetailModalInfo({view: true, id: uuid, name: uuid, data: data, buttonLoadingState: true});
		} else {
			// Updated
			setViewDetailModalInfo({...viewDetailModalInfo, buttonLoadingState: true});
		}
		client.MocksSet(
			uuid,
			data
		).then((ans) => {
			// Get answer server
			if (ans === true){
				let name = isCreatedNew ? uuid: viewDetailModalInfo.name;
				setViewDetailModalInfo({view: true, id: uuid, name, data, buttonLoadingState: false});
				const fieldIndexUpdated = payloadMocksSettings.findIndex(e => e["id"] === uuid.toString());
				if (fieldIndexUpdated !== -1){
					payloadMocksSettings[fieldIndexUpdated] = {
						id: uuid,
						...data,
					}
				} else {
					payloadMocksSettings.unshift({
						id: uuid,
						...data,
						name: uuid,
					});
				}
				setPayloadMocksSettings([]);
				setPayloadMocksSettings(payloadMocksSettings);
			}
		});
	}
	useEffect(() => {
		async function load(){
			const data = await client.MocksGet();
			if ((data !== null) && (data !== undefined) && (Array.isArray(data))){
				setPayloadMocksSettings(data);
			}
		}
		load();
	}, []);

	useEffect(() => {
		const searchData = payloadMocksSettings.map((item) => {
			return {id: item.id.toString(), name: item.id.toString()}
		});
		setDataSearch(searchData);
	}, [payloadMocksSettings]);

	return (
		<Panel id={id}>
			<PanelHeader>Вариационные данные</PanelHeader>
			<div className='mocks_wrapper'>
				<div className='left'>
					<SearchPanel after={
						<div className={"ddd"}>
							<Icon28AddOutline />
						</div>
					} onSelect={viewDetailModal} rows={dataSearch}/>
				</div>
				<div className='right'>
					{viewDetailModalInfo.view ?(
						<MocksSettingsPanel
							id={viewDetailModalInfo.id}
							name={viewDetailModalInfo.name}
							data={viewDetailModalInfo.data}
							onDelete={DeleteDetailModalData}
							onSave={SaveDetailModalData}
							globalSetModalView={globalSetModalView}
							buttonLoadingState={viewDetailModalInfo.buttonLoadingState}
						/>
					) : (
						<MocksSettingsPanelEmpty onClick={viewDetailModal.bind(this, null)}/>
					)}
				</div>
			</div>
		</Panel>
	);
}

MocksSettings.propTypes = {
	id: PropTypes.string.isRequired,
	globalSetModalView: PropTypes.func,
};

export default MocksSettings;
