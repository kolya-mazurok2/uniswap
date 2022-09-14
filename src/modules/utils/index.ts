import {
  DEFAULT_ERROR,
  primaryExchangeContract,
  primaryTokenContract,
  secondaryExchangeContract,
  secondaryTokenContract,
  SOLIDITY_ERRORS,
  SOLIDITY_ERRORS_KEYS
} from '../common/consts';
import { Token } from '../types';

interface IGetSolidityErrorPayload {
  message?: string;
}

export const getSolidityErrorMessage = ({ message }: IGetSolidityErrorPayload) => {
  if (!message) {
    return DEFAULT_ERROR;
  }

  const matches = message.match(/execution reverted: E\d{1}/);
  if (!matches) {
    return DEFAULT_ERROR;
  }

  const parts = matches[0].split(':');
  const code = parts.length === 2 ? parts[1].trim() : '';
  const errorMessage = SOLIDITY_ERRORS[code as SOLIDITY_ERRORS_KEYS];

  return errorMessage ? errorMessage : DEFAULT_ERROR;
};

export const getTokenContract = (tokenName: Token) => {
  switch (tokenName) {
    case 'Primary':
      return primaryTokenContract;
    case 'Secondary':
      return secondaryTokenContract;
    default:
      return undefined;
  }
};

export const getExchangeContract = (tokenName: Token) => {
  switch (tokenName) {
    case 'Primary':
      return primaryExchangeContract;
    case 'Secondary':
      return secondaryExchangeContract;
    default:
      return undefined;
  }
};

export const debounce = (fn: any, timeout = 500) => {
  let timer: NodeJS.Timeout | undefined;

  return (...args: any) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
};
