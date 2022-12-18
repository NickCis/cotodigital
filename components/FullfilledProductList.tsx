import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Product } from 'types/Product';
import ProductList from './ProductList';

function RemoveField({
  onClick,
  product,
}: {
  onClick: (v: number) => void;
  product: Product;
}) {
  const [value, setValue] = useState(Math.min(1, product.amount));
  const _value = `${value}`;
  return (
    <FormControl
      margin="dense"
      sx={{ width: `${5 + _value.length}ch` }}
      variant="standard"
    >
      <Input
        sx={{
          fontFamily: 'monospace',
        }}
        margin="dense"
        type="number"
        value={_value}
        onChange={(e) => setValue(Math.min(+e.target.value, product.amount))}
        endAdornment={
          <InputAdornment position="start" sx={{ margin: 0 }}>
            <IconButton onClick={() => onClick(value)}>
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export interface FullfilledProductListProps {
  products: Product[];
  onClear: (product: Product, amount?: number) => void;
}

function FullfilledProductList({
  products,
  onClear,
}: FullfilledProductListProps) {
  return (
    <ProductList
      title="Productos controlados"
      products={products}
      renderAction={(product) => (
        <>
          <RemoveField onClick={(v) => onClear(product, v)} product={product} />
          <IconButton
            edge="end"
            color="primary"
            onClick={() => onClear(product)}
          >
            <ClearIcon />
          </IconButton>
        </>
      )}
    />
  );
}

export default FullfilledProductList;
