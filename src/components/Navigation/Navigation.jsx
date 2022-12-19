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
import DashboardMenu from './components/DashboardMenu/DashboardMenu';
import Imprint from '../Imprint/Imprint';
import NavigationTitle from './components/NavigationTitle/NavigationTitle';
import { useApplicationContext } from '../../context';
import { ApplicationActionType } from '../../context/ApplicationActionType';
import { parseMenuItem } from './helpers/parseMenuItem';
import { ResourceType } from '../../enums/ResourceType';
import { TransitionType } from '../../enums/TransitionType';
import { PlayerActionType } from '../Player/context/PlayerActionType';
import { usePlayerContext } from '../Player/context';


function Navigation() {
    const { appState, dispatch: appDispatch } = useApplicationContext();

    const { dispatch: playerDispatch } = usePlayerContext();

    const [ menuItems ] = useState(() => getMenuItems());
    const [ isImprintOpen, setIsImprintOpen ] = useState(false);

    const [ filter, setFilter ] = useQueryParam(UrlState.FILTER);
    const [ playlist, setPlaylist ] = useQueryParam(UrlState.PLAYLIST);

    /**
     * Update state from url state on mount
     */
    useEffect(() => {
        const filterType = filter || FilterType.POPULAR;
        setFilter(filterType);
        appDispatch({
            type: ApplicationActionType.SET_SELECTED_CONFIG,
            payload: {
                filterType,
                resourceType: !playlist ? ResourceType.VIDEO : ResourceType.PLAYLIST,
                selectedPlaylistId: playlist,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ filter, playlist ]);

    const onMenuItemClick = useCallback((menuItem) => {
        if (appDispatch === null) {
            return;
        }
        const config = parseMenuItem(menuItem);

        setFilter(config.filterType);
        setPlaylist(config.selectedPlaylistId);

        playerDispatch({
            type: PlayerActionType.STOP,
        });
        appDispatch({
            type: ApplicationActionType.SET_VIDEO_STARTED,
            payload: false,
        });
        appDispatch({
            type: ApplicationActionType.SET_SELECTED_CONFIG,
            payload: config,
        });
        appDispatch({
            type: ApplicationActionType.SET_CURRENT_TRANSITION,
            payload: TransitionType.SLIDE_OUT,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ appDispatch ]);

    return (
        <>
            <StyledNavigation isOpen={appState.isMenuOpen}>
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
                                <DashboardMenu
                                    key={index}
                                    className="nav-dashboard"
                                    menuItem={menuItem}
                                    options={menuItem.options}
                                    selectedOptionValue={playlist}
                                    onMenuItemClick={onMenuItemClick}
                                >
                                    {menuItem.label}
                                </DashboardMenu>
                            );
                        default:
                            return <div>unknown menu item type</div>;
                    }
                })}
            </StyledNavigation>

            <StyledSidebar>
                <Button
                    className="sidebar-burger-button"
                    onClick={() => {
                        window.scroll(0, 0);
                        appDispatch({
                            type: ApplicationActionType.SET_MENU_OPEN,
                            payload: !appState.isMenuOpen,
                        });
                    }}
                >
                    <BurgerIcon showCancelIcon={appState.isMenuOpen}/>
                </Button>
                <Button
                    className="sidebar-imprint-button"
                    onClick={() => setIsImprintOpen(true)}
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

            {!appState.isMobile && <NavigationTitle/>}

            <Imprint
                open={isImprintOpen}
                onClose={() => setIsImprintOpen(false)}
            />
        </>
    );
}

export default Navigation;