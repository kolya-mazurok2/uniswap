import { useFormik } from 'formik';
import { Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { TokenWithWei } from '../../../types';
import { SwapFormStyled } from './swap-form.styled';
import { useEffect, useRef, useState } from 'react';
import { debounce } from '../../../utils';

export interface IFormValues {
  fromToken: TokenWithWei;
  toToken: TokenWithWei;
  fromAmount: number;
  toAmount: number;
}

export type IInitialValues = Omit<IFormValues, 'fromToken' | 'toToken'> & {
  from?: TokenWithWei;
  to?: TokenWithWei;
};

export const INITIAL_VALUES: IInitialValues = {
  fromAmount: 1,
  toAmount: 1
};

interface IProps {
  onSubmit: (values: IFormValues) => void;
  onFromAmountChange: (values: IFormValues) => void;
  onExchangeValuesChange: (fromToken: TokenWithWei, toToken: TokenWithWei) => void;
  tokens: TokenWithWei[];
  inputData: {
    toAmount: number;
    priceImpact?: number;
  };
}

type ExchangableValue = 'fromAmount' | 'toAmount';

export const SwapForm = ({
  onSubmit,
  onFromAmountChange,
  onExchangeValuesChange,
  tokens = [],
  inputData
}: IProps) => {
  const fromTokens = [...tokens];
  const toTokens = [...tokens];
  const initialValues = {
    ...INITIAL_VALUES,
    fromToken: fromTokens[0],
    toToken: toTokens[0],
    toAmount: inputData.toAmount
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values)
  });

  const [activeFieldName, setActiveFieldName] = useState<ExchangableValue>();

  const onFromAmountChangeDebounced = useRef(debounce(onFromAmountChange));

  const handleSubmit = (values: IFormValues) => {
    onSubmit(values);
  };

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      toAmount: inputData.toAmount
    });
  }, [inputData.toAmount]);

  useEffect(() => {
    if (activeFieldName === 'fromAmount') {
      onFromAmountChangeDebounced.current(formik.values);
    }
  }, [formik.values.fromAmount]);

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      fromAmount: 0,
      toAmount: 0
    });

    onExchangeValuesChange(formik.values.fromToken, formik.values.toToken);
  }, [formik.values.fromToken, formik.values.toToken]);

  return (
    <SwapFormStyled onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputLabel>From</InputLabel>

          <Select name="fromToken" value={formik.values.fromToken} onChange={formik.handleChange}>
            {fromTokens.map((token) => (
              <MenuItem key={token} value={token}>
                {token}
              </MenuItem>
            ))}
          </Select>

          <TextField
            name="fromAmount"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
            label="Amount"
            value={formik.values.fromAmount}
            onChange={formik.handleChange}
            onFocus={() => setActiveFieldName('fromAmount')}
            error={formik.touched.fromAmount && Boolean(formik.errors.fromAmount)}
            helperText={formik.touched.fromAmount && formik.errors.fromAmount}
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel>To</InputLabel>

          <Select name="toToken" value={formik.values.toToken} onChange={formik.handleChange}>
            {toTokens.map((token) => (
              <MenuItem key={token} value={token}>
                {token}
              </MenuItem>
            ))}
          </Select>

          <TextField
            name="toAmount"
            type="number"
            label="Amount"
            InputProps={{
              readOnly: true
            }}
            value={formik.values.toAmount}
            onChange={formik.handleChange}
            onFocus={() => setActiveFieldName('toAmount')}
            error={formik.touched.toAmount && Boolean(formik.errors.toAmount)}
            helperText={formik.touched.toAmount && formik.errors.toAmount}
          />
        </Grid>

        {inputData.priceImpact && (
          <Grid item xs={12}>
            <Typography variant="h4">Price Impact: ~{inputData.priceImpact}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button type="submit" variant="outlined" color="success">
            Swap
          </Button>
        </Grid>
      </Grid>
    </SwapFormStyled>
  );
};
