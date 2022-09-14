import styled from 'styled-components';
import { SPACES } from '../../../theme';

export const ExchangeInfoStyled = styled.div`
  & .MuiCardContent-root .MuiTypography-root {
    margin-top: ${SPACES.m};

    &:first-child {
      margin-top: 0;
    }
  }
`;
