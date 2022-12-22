import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import Frame from 'components/Frame';
import TextFieldScan from 'components/TextFieldScan';
import PendingProductList from 'components/PendingProductList';
import FullfilledProductList from 'components/FullfilledProductList';
import useFetchCart from 'hooks/useFetchCart';
import useCart, { Cart, CartSetter } from 'hooks/useCart';
import type { Product } from 'types/Product';
import BarCodeScannerIcon from 'icons/BarCodeScanner';
import ScannerDialog from 'components/ScannerDialog';
import { Html5QrcodeSupportedFormats } from 'components/Scanner';
import ProductBottomSheet, {
  ProductBottomSheetProps,
} from 'components/ProductBottomSheet';

function ScanFab({
  cart,
  onFullfill,
}: {
  cart: Cart;
  onFullfill: ProductBottomSheetProps['onFullfill'];
}) {
  const [open, setOpen] = useState(false);
  const [ean, setEan] = useState<string | undefined>();

  return (
    <>
      <ScannerDialog
        config={{
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
        }}
        open={open}
        onScanSuccess={(code: string) => {
          if (!ean) setEan(code);
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
      <ProductBottomSheet
        cart={cart}
        ean={ean}
        onClose={() => setEan(undefined)}
        onFullfill={onFullfill}
      />
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab color="primary" onClick={() => setOpen(true)}>
          <BarCodeScannerIcon />
        </Fab>
      </Box>
    </>
  );
}

function Content({ cart, setCart }: { cart: Cart; setCart: CartSetter }) {
  return (
    <Box sx={{ flex: 1 }}>
      <PendingProductList
        products={cart.pending}
        onFullfill={(product, amount) => {
          setCart('pending', product.code.plu, amount);
        }}
      />
      <FullfilledProductList
        products={cart.fullfilled}
        onClear={(product, amount) => {
          setCart('fullfilled', product.code.plu, amount);
        }}
      />
      <ScanFab
        cart={cart}
        onFullfill={(product, amount) => {
          setCart('pending', product.code.plu, amount);
        }}
      />
    </Box>
  );
}

export default function Home() {
  const [ticket, setTicket] = useState('');
  const { data, loading } = useFetchCart(ticket);
  const [cart, setCart] = useCart(data);
  const isLoading = loading; //  || !(data && cart.pending);
  const hasData = data && cart.pending;

  return (
    <Frame
      p={1}
      pt={2}
      pb={9}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TextFieldScan
        value={ticket}
        onChange={(t) => setTicket(t)}
        label="Ticket de compra"
        disabled={isLoading}
      />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : hasData ? (
        <Content cart={cart} setCart={setCart} />
      ) : null}
    </Frame>
  );
}
