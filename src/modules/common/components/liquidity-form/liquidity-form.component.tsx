import { LiquidityFormStyled } from './liquidity-form.styled';
import { useFormik } from 'formik';
import { Button, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Token } from '../../../types';
import { useMemo } from 'react';

export interface IFormValues {
  amount: number;
  price: number;
  token: Token;
}

export type IInitialValues = Omit<IFormValues, 'token'> & {
  token?: Token;
};

export const INITIAL_VALUES: IInitialValues = {
  amount: 1,
  price: 100
};

interface IProps {
  onSubmit: (values: IFormValues) => void;
  tokens: Token[];
}

export const LiquidityForm = ({ onSubmit, tokens = [] }: IProps) => {
  const initialValues = useMemo(() => ({ ...INITIAL_VALUES, token: tokens[0] }), [tokens]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values)
  });

  const handleSubmit = (values: IFormValues) => {
    onSubmit(values);
  };

  return (
    <LiquidityFormStyled onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {tokens.length > 0 && (
          <Grid item xs={12}>
            <InputLabel>Token</InputLabel>

            <Select
              name="token"
              value={formik.values.token}
              label="Token"
              fullWidth
              onChange={formik.handleChange}>
              {tokens.map((token) => (
                <MenuItem key={token} value={token}>
                  {token}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            name="amount"
            type="number"
            label="Tokens Amount"
            fullWidth
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="price"
            type="number"
            label="Wei Price"
            fullWidth
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="outlined" color="success">
            Add
          </Button>
        </Grid>
      </Grid>
    </LiquidityFormStyled>
  );
};
