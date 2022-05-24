import { StyledNavigation } from './styled-components/StyledNavigation';
import Button from '@mui/material/Button';
import { useQueryParam } from 'use-query-params';
import { useEffect, useState } from 'react';
import { StyledSidebar } from './styled-components/StyledSidebar';
import BurgerIcon from './components/BurgerIcon';
import { EditorFilterValues } from '../../services/editorService';

const URL_FILTER_KEY = 'filter';
const FILTER_VALUES = Object.values(EditorFilterValues);


function Navigation({ onFilterChange }) {
    const [ isOpen, setIsOpen ] = useState(false);

    const [ filter, setFilter ] = useQueryParam(URL_FILTER_KEY);

    useEffect(() => {
        if (!filter) {
            setFilter(FILTER_VALUES[0]);
        }
        onFilterChange(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ onFilterChange, filter ]);

    const onNavButtonClick = (filterValue) => {
        setFilter(filterValue);
        setIsOpen(false);
    };

    return (
        <>
            <StyledSidebar>
                <Button
                    className="sidebar-burger-button"
                    onClick={() => setIsOpen(prevState => !prevState)}
                >
                    <BurgerIcon showCancelIcon={isOpen} />
                </Button>
            </StyledSidebar>
            <StyledNavigation isOpen={isOpen}>
                {FILTER_VALUES.map((filterValue, index) => (
                    <Button
                        className="nav-button"
                        key={index}
                        variant={filterValue === filter ? 'outlined' : ''}
                        onClick={() => onNavButtonClick(filterValue)}
                    >
                        {filterValue}
                    </Button>
                ))}
            </StyledNavigation>
        </>
    );
}

export default Navigation;