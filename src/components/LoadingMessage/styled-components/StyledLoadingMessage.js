import styled from '@emotion/styled';

export const StyledLoadingMessage = styled.div`
    @keyframes is-loading {
        0% {
            opacity: 0.3;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes fade-out {
        0% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
        }
    }

    animation: ${({ visible }) => visible ? 'is-loading 0.7s linear infinite alternate' : 'fade-out 1s linear'};

    position: absolute;
    left: 0;
    top: 50vh;
    transform: translateY(-50%);
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    opacity: 0;
`;