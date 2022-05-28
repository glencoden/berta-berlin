import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


function SubMenu({ className, menuItem, options, selectedOptionValue, onMenuItemClick, children }) {
    const [ anchorEl, setAnchorEl ] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (selectedOption) => {
        if (selectedOption === null) {
            setAnchorEl(null);
            return;
        }
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
                variant={!!selectedOptionValue ? 'outlined' : ''}
                onClick={handleClick}
            >
                {children}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {options.map((item, index) => (
                    <MenuItem
                        selected={item.value === selectedOptionValue}
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