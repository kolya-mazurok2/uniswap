import { useFormik } from 'formik';
import { Button, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { TokenWithWei } from '../../../types';
import { SwapFormStyled } from './swap-form.styled';

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
  tokens: TokenWithWei[];
}

export const SwapForm = ({ onSubmit, tokens = [] }: IProps) => {
  const fromTokens = [...tokens];
  const toTokens = [...tokens];
  const initialValues = { ...INITIAL_VALUES, fromToken: fromTokens[0], toToken: toTokens[0] };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values)
  });

  const handleSubmit = (values: IFormValues) => {
    onSubmit(values);
  };

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
            label="Amount"
            value={formik.values.fromAmount}
            onChange={formik.handleChange}
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
            value={formik.values.toAmount}
            onChange={formik.handleChange}
            error={formik.touched.toAmount && Boolean(formik.errors.toAmount)}
            helperText={formik.touched.toAmount && formik.errors.toAmount}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="outlined" color="success">
            Swap
          </Button>
        </Grid>
      </Grid>
    </SwapFormStyled>
  );
};
