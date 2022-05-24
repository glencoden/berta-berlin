import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


function SubMenu({ className, menuItem, isSelected, options, onMenuItemClick, children }) {
    const [ anchorEl, setAnchorEl ] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (selectedOption) => {
        onMenuItemClick({
            ...menuItem,
            value: selectedOption,
        });
        setAnchorEl(null);
    };

    if (!Array.isArray) {
        return null;
    }

    return (
        <div className={className}>
            <Button
                variant={isSelected ? 'outlined' : ''}
                onClick={handleClick}
            >
                {children}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {options.map((item, index) => (
                    <MenuItem
                        key={`${item.label}${index}`}
                        onClick={() => handleClose(item)}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default SubMenu;