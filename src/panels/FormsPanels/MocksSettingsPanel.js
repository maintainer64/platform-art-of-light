import {
    Alert,
    Button,
    FormItem,
    FormLayout,
    FormLayoutGroup,
    FormStatus,
    Group,
    Input,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderButton,
    Spinner
} from "@vkontakte/vkui";
import { Icon28DeleteOutline } from '@vkontakte/icons';
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Map} from "../MapPanels/MapsEmpty";

const AlertDeletePopout = ({onConfirm, onClose}) => {
    return (
        <Alert
            actions={[{
                title: 'Отмена',
                autoclose: true,
                mode: 'cancel'
            }, {
                title: 'Удалить',
                autoclose: true,
                mode: 'destructive',
                action: onConfirm
            }]}
            actionsLayout="horizontal"
            onClose={onClose}
            header="Удаление данных"
            text="Вы уверены, что хотите удалить эти данные?"
        />
    );
}

const FormItemMinMax = ({name, min, max}) => {
    return (
        <FormLayoutGroup mode="horizontal">
            <FormItem top={name} bottom="Min">
                <Input defaultValue={min.value} getRef={min.ref}/>
            </FormItem>
            <FormItem top="..." bottom="Max">
                <Input defaultValue={max.value} getRef={max.ref}/>
            </FormItem>
        </FormLayoutGroup>
    )
}

const NameInput = ({name, setName, isUpdated}) => {
    if (isUpdated){
        return name;
    }
    const loadData = (event) => {
        setName(event.target.value)
    }
    return (
        <div style={{paddingLeft: "16px"}}>
            <Input onChange={loadData.bind(this)} placeholder={name}/>
        </div>
    )
}

const MocksSettingsPanel = ({id, name, onSave, onDelete, data, buttonLoadingState, globalSetModalView}) => {
    const isUpdated = (id !== null) && (id !== undefined);
    const [textError, setError] = useState(false);
    const [viewData, setViewData] = useState({ref_dats: null, components: null});
    const [identifier, setIdentifier] = useState(id);

    // function logic clear/validate
    const SettingsForms = [
        ["light", "Уровень освещения", {type: "int"}],
        ["Tamb_degC", "Tamb_degC", {type: "int"}],
        ["latitude", "latitude", {type: "float"}],
        ["longitude", "longitude", {type: "float"}]
    ];

    const GenerateDataRefForms = (data) => {
        const createDataDefault = (data) => {
            if ((data === null) || (data === undefined)){
                const default_ = {min: "", max: ""};
                let default_data_generate = {};
                for (const field of SettingsForms) {
                    default_data_generate[field[0]] = default_;
                }
                return default_data_generate;
            }
            return data;
        }
        const generateAndRefDefaultData = (data) => {
            let ans = [];
            for (const field of SettingsForms) {
                ans.push({
                    name: field[1],
                    min: {
                        ref: React.createRef(),
                        value: data[field[0]].min
                    },
                    max:{
                        ref: React.createRef(),
                        value: data[field[0]].max
                    },
                });
            }
            return ans;
        }
        return generateAndRefDefaultData(createDataDefault(data));
    }

    const ValidateDataRefForms = (ref_dats) => {
        const validate_on_params = (params, value) => {
            let error = false;
            let new_value = undefined;
            if (params.type === "int"){
                new_value = parseInt(value);
                error = isNaN(new_value) ? "должно быть целым числом": error;
            }
            if (params.type === "float"){
                new_value = parseFloat(value);
                error = isNaN(new_value) ? "должно быть числом": error;
            }
            if (error){
                return [undefined, error];
            }
            if ((params.min !== undefined) && (new_value < params.min)){
                return [undefined, "должно быть не меньше " + params.min.toString()];
            }
            if ((params.max !== undefined) && (new_value > params.max)){
                return [undefined, "должно быть не больше " + params.max.toString()];
            }
            return [new_value, false];
        }
        let ans = {};
        for (let i = 0; i < ref_dats.length; i++){
            const field = SettingsForms[i];
            let [min, error1] = validate_on_params(field[2], ref_dats[i].min.ref.current.value);
            if (error1 !== false){
                setError(`Параметр '`+field[1]+`' `+error1);
                return null;
            }
            let [max, error2] = validate_on_params(field[2], ref_dats[i].max.ref.current.value);
            if (error2 !== false){
                setError(`Параметр '`+field[1]+`' `+error2);
                return null;
            }
            ans[field[0]] = {min, max};
        }
        setError(false);
        return ans;
    }

    const ValidateIdentifierOnCreate = (uuid) => {
        if (!((typeof uuid === 'string') && (uuid.toString().trim().length > 0))){
            setError("Идетификатор устройства должен быть заполнен");
            return null;
        }
        setError(false);
        return uuid.toString().trim();
    }

    // SetUp
    useEffect(() => {
        if (data === null){
            return true;
        }
        const ref_dats = GenerateDataRefForms(data);

        const components = ref_dats.map((i, key) => {
            return (<FormItemMinMax key={key} name={i.name} min={i.min} max={i.max}/>);
        });
        setViewData({
            ref_dats,
            components
        });
    }, [data, buttonLoadingState]);

    // Btn handlers
    const onSubmit = () => {
        let uuid = id;
        const values = ValidateDataRefForms(viewData.ref_dats);
        if (!isUpdated){
            uuid = ValidateIdentifierOnCreate(identifier);
        }
        if ((values !== undefined) && (values !== null) && (uuid !== null) && (uuid !== undefined)){
            typeof onSave === 'function' ? onSave(values, uuid) : null;
        }

    }
    const onRemove = () => {
        typeof onDelete === 'function' ? onDelete(id) : null;
    }
    const modalDelete = {
        open: () => {
            globalSetModalView(<AlertDeletePopout onClose={modalDelete.close.bind(this)} onConfirm={onRemove.bind(this)}/>);
        },
        close: () => {globalSetModalView(null);}
    }

    const ViewForms = viewData.components === null ? <Spinner size="large"/> : (
        <FormLayout>
            {textError ? (
                <FormStatus header="Некорректное заполнение формы" mode="error">
                    {textError}
                </FormStatus>
            ):null}
            {viewData.components}
            <FormItem>
                <Map height={"400px"}/>
            </FormItem>
            <FormItem>
                <Button disabled={buttonLoadingState} onClick={onSubmit} size="l" stretched>
                    {buttonLoadingState ? <Spinner size="small"/> : (data === undefined ? "Сохранить" : "Обновить")}
                </Button>
            </FormItem>
        </FormLayout>
    )

    return (
        <Group separator='hide' mode='plain'>
            <PanelHeader
                fixed={false} separator={false}
                left={isUpdated ?(
                    <PanelHeaderButton onClick={modalDelete.open.bind(this)}>
                        <Icon28DeleteOutline/>
                    </PanelHeaderButton>
                ) : null}
            ><NameInput name={name} isUpdated={isUpdated} setName={(uuid) => {setIdentifier(uuid)}}/></PanelHeader>
            <div className="scrolling-form">
                {ViewForms}
            </div>
        </Group>
    );
}

const TMinMax = PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
});

const TRefProp = PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
]);

const TRefAndValueInput = PropTypes.shape({
    ref: TRefProp.isRequired,
    value: PropTypes.string.isRequired,
})

FormItemMinMax.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.shape({
        min: TRefAndValueInput.isRequired,
        max: TRefAndValueInput.isRequired,
    })
}

AlertDeletePopout.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}

MocksSettingsPanel.propTypes = {
    id: PropTypes.string, // ID - Обратный реф. Если null или undefined, будет создаваться новый элемент
    name: PropTypes.string.isRequired, // Название панели
    onDelete: PropTypes.func, // Функция при удалении датчика
    globalSetModalView: PropTypes.func, // Функция глобальной установки модального окна
    data: PropTypes.shape({
        light: TMinMax,
        Tamb_degC: TMinMax,
        latitude: TMinMax,
        longitude: TMinMax,
    }), // Если null, тогда будет прелоудер, Если undefined, тогда значения по умолчнаию вставятся в форму
    onSave: PropTypes.func, // Событие при сохранении (передаётся объект с данными как в data)
    buttonLoadingState: PropTypes.bool.isRequired, // true - кнопка будет в состоянии загрузки, false - в обычном состоянии

};

export default MocksSettingsPanel;