import { StyledBurgerIcon } from './styled-components/StyledBurgerIcon';

function BurgerIcon({ showCancelIcon, strokeWidth = 4 }) {
    const classNames = [ 'BurgerIcon' ];
    if (showCancelIcon) {
        classNames.push('close');
    }
    return (
        <StyledBurgerIcon>
            <div className={classNames.join(' ')}>
                <span style={{ height: `${strokeWidth}px` }}/>
                <span style={{ height: `${strokeWidth}px` }}/>
                <span style={{ height: `${strokeWidth}px` }}/>
                <span style={{ height: `${strokeWidth}px` }}/>
                <span style={{ height: `${strokeWidth}px` }}/>
                <span style={{ height: `${strokeWidth}px` }}/>
            </div>
        </StyledBurgerIcon>
    );
}

export default BurgerIcon;