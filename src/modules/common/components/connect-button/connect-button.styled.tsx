import styled from 'styled-components';
import { COLORS } from '../../../theme';

export const ConnectButtonStyled = styled.div`
  & button {
    &,
    &:hover {
      color: ${COLORS.white};
      border-color: ${COLORS.white};
    }
  }
`;
