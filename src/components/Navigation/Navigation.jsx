import { StyledNavigation } from './styled-components/StyledNavigation';
import Button from '@mui/material/Button';
import { useQueryParam } from 'use-query-params';
import { useCallback, useEffect, useState } from 'react';
import { StyledSidebar } from './styled-components/StyledSidebar';
import BurgerIcon from './components/BurgerIcon/BurgerIcon';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from '../Image/Image';
import { UrlState } from '../../enums/UrlState';
import { getMenuItems } from './helpers/getMenuItems';
import { MenuItemType } from '../../enums/MenuItemType';
import { FilterType } from '../../enums/FilterType';
import { editorService } from '../../services/editorService';
import SubMenu from './components/SubMenu/SubMenu';

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


function Navigation({ onMenuItemSelect, onToggleOpen }) {
    const [ menuItems ] = useState(() => getMenuItems());
    const [ isNavigationOpen, setIsNavigationOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const [ filter, setFilter ] = useQueryParam(UrlState.FILTER);
    const [ playlist, setPlaylist ] = useQueryParam(UrlState.PLAYLIST);

    /**
     * Update state from url state on mount
     */
    useEffect(() => {
        if (!filter) {
            setFilter(FilterType.TRENDING);
        }
        if (!playlist) {
            setPlaylist(playlist)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ filter, playlist ]);

    useEffect(() => onToggleOpen(isNavigationOpen), [ onToggleOpen, isNavigationOpen ]);

    const onMenuItemClick = useCallback((menuItem) => {
        editorService.onMenuItemSelect(menuItem);

        setFilter(editorService.filterType);
        setPlaylist(editorService.selectedPlaylistId);

        onMenuItemSelect();

        setIsNavigationOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ onMenuItemSelect ]);

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
                {menuItems.map((menuItem, index) => {
                    switch (menuItem.type) {
                        case MenuItemType.FILTER:
                            return (
                                <Button
                                    className="nav-button"
                                    key={index}
                                    variant={!playlist && menuItem.value === filter ? 'outlined' : ''}
                                    onClick={() => onMenuItemClick(menuItem)}
                                >
                                    {menuItem.label}
                                </Button>
                            );
                        case MenuItemType.DASHBOARD:
                            return (
                                <SubMenu
                                    key={index}
                                    className="nav-dashboard"
                                    menuItem={menuItem}
                                    isSelected={!!playlist}
                                    options={menuItem.options}
                                    onMenuItemClick={onMenuItemClick}
                                >
                                    {menuItem.label}
                                </SubMenu>
                            );
                        default:
                            return <div>unknown menu item type</div>;
                    }
                })}
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