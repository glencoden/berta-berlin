import styled from '@emotion/styled';

export const StyledPlayer = styled.div`
    opacity: ${({ hasVideoStarted }) => hasVideoStarted ? 1 : 0};
    transition: opacity ${({ theme }) => (theme.transitions.duration.shorter / 1000)}s;
`;