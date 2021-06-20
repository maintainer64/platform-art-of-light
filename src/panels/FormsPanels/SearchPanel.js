import {Cell, Footer, Group, Search} from "@vkontakte/vkui";
import PropTypes from 'prop-types';
import React, {useEffect, useState} from "react";

const SearchPanel = ({rows, onSelect}) => {
    const [search, setSearch] = useState('');
    const [thematics, setThematics] = useState(rows);

    useEffect(() => {
        const get_thematics = (search) => {
            const search_l = search.toLowerCase();
            return rows.filter(({name}) => name.toLowerCase().indexOf(search_l) > -1);
        }
        setThematics(get_thematics(search));
    }, [rows, search]);

    const SearchThematics = (event) => {
        setSearch(event.target.value);
    }
    const SelectCell = (id) => {
        typeof onSelect === 'function' ? onSelect(id) : null;
    }
    return (
        <Group separator='hide' mode='plain'>
            <Search value={search} onChange={(e) => SearchThematics(e)}/>
            <div className='scrolling-cell'>
                {thematics.length > 0 && thematics.map(thematic => <Cell
                    key={thematic.id} onClick={SelectCell.bind(this, thematic.id)}>{thematic.name}</Cell>)}
                {thematics.length === 0 && <Footer>Ничего не найдено</Footer>}
            </div>
        </Group>
    )
}
SearchPanel.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    onSelect: PropTypes.func
};
export default SearchPanel;
