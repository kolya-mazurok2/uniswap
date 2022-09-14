import styled from 'styled-components';
import { FONTS, SPACES } from './modules/theme';

export const AppStyled = styled.div`
  & {
    h1,
    h2 {
      font-size: ${FONTS.SIZES.l};
    }

    h4 {
      font-size: ${FONTS.SIZES.m};
      font-weight: ${FONTS.WEIGHTS.bold};
    }
  }

  & .main {
    padding: ${SPACES.l};
  }

  & .section {
    margin: ${SPACES.l} auto 0;

    &:first-child {
      margin: 0 auto;
    }
  }

  & .section {
    & > div,
    h4 {
      margin: ${SPACES.l} auto 0;
    }
  }

  & form {
    margin: ${SPACES.l} auto 0;
  }
`;
