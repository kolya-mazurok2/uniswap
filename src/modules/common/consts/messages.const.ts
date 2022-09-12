export const DEFAULT_ERROR = 'Something went wrong';

export const DEFAULT_TRANSACTION_SUCCESS = 'Transaction succeeded';

export const SOLIDITY_ERRORS = {
  E1: 'Wrong address',
  E2: 'Insufficient amount',
  E3: 'Already exists'
};

export type SOLIDITY_ERRORS_KEYS = keyof typeof SOLIDITY_ERRORS;
