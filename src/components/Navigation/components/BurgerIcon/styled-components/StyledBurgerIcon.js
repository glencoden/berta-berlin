import styled from '@emotion/styled';

export const StyledBurgerIcon = styled.div`
    .BurgerIcon {
        position: relative;
        width: 35px;
        height: 26px;
        transition: transform ${({ theme }) => (theme.transitions.duration.complex / 1000)}s;
    }
    
    .BurgerIcon span {
        opacity: 1;
        position: absolute;
        display: block;
        width: 55%;
        transition: 0.25s ease;
        transform: rotate(0deg);
        background-color: ${({ theme }) => theme.palette.primary.light};
    }
    
    .BurgerIcon span:nth-of-type(even) {
        left: 50%;
    }
    
    .BurgerIcon span:nth-of-type(odd) {
        left: 0;
    }
    
    .BurgerIcon span:nth-of-type(1), .BurgerIcon span:nth-of-type(2) {
        top: 0;
    }
    
    .BurgerIcon span:nth-of-type(3), .BurgerIcon span:nth-of-type(4) {
        top: 10px;
    }
    
    .BurgerIcon span:nth-of-type(5), .BurgerIcon span:nth-of-type(6) {
        top: 20px;
    }
    
    .BurgerIcon.close span:nth-of-type(1), .BurgerIcon.close span:nth-of-type(6) {
        transform: rotate(45deg);
    }
    
    .BurgerIcon.close span:nth-of-type(2), .BurgerIcon.close span:nth-of-type(5) {
        transform: rotate(-45deg);
    }
    
    .BurgerIcon.close span:nth-of-type(1) {
        top: 4px;
        left: 3px;
    }
    
    .BurgerIcon.close span:nth-of-type(2) {
        top: 4px;
        left: calc(50% - 3px);
    }
    
    .BurgerIcon.close span:nth-of-type(3) {
        opacity: 0;
        left: -50%;
    }
    
    .BurgerIcon.close span:nth-of-type(4) {
        opacity: 0;
        left: 100%;
    }
    
    .BurgerIcon.close span:nth-of-type(5) {
        top: 16px;
        left: 3px;
    }
    
    .BurgerIcon.close span:nth-of-type(6) {
        top: 16px;
        left: calc(50% - 3px);
    }
`;