import { StyledNavigation } from './styled-components/StyledNavigation';
import Button from '@mui/material/Button';
import { useQueryParam } from 'use-query-params';
import { useEffect, useState } from 'react';
import { StyledSidebar } from './styled-components/StyledSidebar';
import BurgerIcon from './components/BurgerIcon';
import { EditorFilterValues } from '../../services/editorService';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from '../Image/Image';

const MODAL_BOX_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const URL_FILTER_KEY = 'filter';
const FILTER_VALUES = Object.values(EditorFilterValues);


function Navigation({ onFilterChange, onToggleOpen }) {
    const [ isNavigationOpen, setIsNavigationOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const [ filter, setFilter ] = useQueryParam(URL_FILTER_KEY);

    useEffect(() => {
        if (!filter) {
            setFilter(FILTER_VALUES[0]);
        }
        onFilterChange(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ onFilterChange, filter ]);

    useEffect(() => onToggleOpen(isNavigationOpen), [ onToggleOpen, isNavigationOpen ]);

    const onNavButtonClick = (filterValue) => {
        setFilter(filterValue);
        setIsNavigationOpen(false);
    };

    return (
        <>
            <StyledSidebar>
                <Button
                    className="sidebar-burger-button"
                    onClick={() => setIsNavigationOpen(prevState => !prevState)}
                >
                    <BurgerIcon showCancelIcon={isNavigationOpen}/>
                </Button>
                <Button
                    className="sidebar-imprint-button"
                    onClick={() => setIsModalOpen(true)}
                    title="imprint"
                >
                    <Image
                        className="sidebar-imprint-button-image"
                        url="https://yt3.ggpht.com/ytc/AKedOLR5OTVSAD0TZcHUptjIRaZxc33qPhiyrHW0jb6X=s240-c-k-c0x00ffffff-no-rj"
                        width={48}
                        height={48}
                        title="berta berlin icon"
                    />
                </Button>
            </StyledSidebar>

            <StyledNavigation isOpen={isNavigationOpen}>
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

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Box sx={MODAL_BOX_STYLE}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Imprint
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                        ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
                        sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
                        justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet.
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}

export default Navigation;