import { StyledNavigation } from './styled-components/StyledNavigation';
import Button from '@mui/material/Button';
import { useQueryParam } from 'use-query-params';
import { useCallback, useEffect, useState } from 'react';
import { StyledSidebar } from './styled-components/StyledSidebar';
import BurgerIcon from './components/BurgerIcon/BurgerIcon';
import Image from '../Image/Image';
import { UrlState } from '../../enums/UrlState';
import { getMenuItems } from './helpers/getMenuItems';
import { MenuItemType } from '../../enums/MenuItemType';
import { FilterType } from '../../enums/FilterType';
import { editorService } from '../../services/editorService';
import SubMenu from './components/SubMenu/SubMenu';
import Imprint from './components/Imprint/Imprint';


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
                                    options={menuItem.options}
                                    selectedOptionValue={playlist}
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

            <Imprint
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

export default Navigation;