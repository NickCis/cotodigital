import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';

import type { Product } from 'types/Product';
import ProductList from './ProductList';

function AddField({ onClick }: { onClick: (v: number) => void }) {
  const [value, setValue] = useState(1);
  return (
    <FormControl
      margin="dense"
      sx={{ width: `${7 + `${value}`.length}ch` }}
      variant="standard"
    >
      <Input
        margin="dense"
        type="number"
        value={+value}
        onChange={(e) => setValue(+e.target.value)}
        endAdornment={
          <InputAdornment position="start" sx={{ margin: 0 }}>
            <IconButton onClick={() => onClick(value)}>
              <AddIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export interface PendingProductListProps {
  products: Product[];
  onFullfill: (product: Product, amount?: number) => void;
}

function PendingProductList({ products, onFullfill }: PendingProductListProps) {
  return (
    <ProductList
      title="Productos Pendientes"
      products={products}
      renderAction={(product) => (
        <>
          <AddField onClick={(v) => onFullfill(product, v)} />
          <IconButton
            edge="end"
            color="primary"
            onClick={() => onFullfill(product)}
          >
            <DoneIcon />
          </IconButton>
        </>
      )}
    />
  );
}

export default PendingProductList;
