import {FormLayout, Group, Link, Placeholder} from "@vkontakte/vkui";
import {Icon56CheckCircleDeviceOutline} from "@vkontakte/icons";
import React from "react";
import PropTypes from "prop-types";

const MocksSettingsPanelEmpty = ({onClick}) => {
    return (
        <FormLayout>
            <Group separator='hide' mode='plain'>
                <div className="scrolling-form-no-header">
                    <Placeholder
                        icon={<Icon56CheckCircleDeviceOutline />}
                        stretched={true}
                    >
                        Выберите устройство или <Link onClick={onClick} href="#">создайте новые данные</Link>
                    </Placeholder>
                </div>
            </Group>
        </FormLayout>
    );
}
MocksSettingsPanelEmpty.propTypes = {
    onClick: PropTypes.func.isRequired
}
export default MocksSettingsPanelEmpty;