import React, { useEffect, useRef, useState } from 'react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package } from "../../redux/reducers/productsSlice";
import MainCheckoutPage from "./CheckoutPage";

interface LocationState {
  productName: string;
  pkg: Package;
}

const PaymentMethods = {
  STRIPE: 'STRIPE',
  PAYSTACK: 'PAYSTACK',
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const localStorageData = localStorage.getItem('selectedProduct');
  const selectedData = localStorageData ? JSON.parse(localStorageData) : state;
  const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMethods.STRIPE);
  const stripePaymentModalRef = useRef(null);
  const paystackPaymentModalRef = useRef(null);

  useEffect(() => {
    if (!selectedData) {
      navigate('/');
    }
  }, [selectedData, navigate]);

  if (!selectedData) {
    return null;
  }

  const { product, pkg } = selectedData;

  // Checkout function
  async function checkout() {
    switch (paymentMethod) {
      case PaymentMethods.STRIPE: {
        if (stripePaymentModalRef?.current) {
          // @ts-ignore
          stripePaymentModalRef?.current?.open();
        }
        break
      }
      case PaymentMethods.PAYSTACK: {
        if (paystackPaymentModalRef?.current) {
          // @ts-ignore
          paystackPaymentModalRef?.current?.open();
        }
        break
      }
    }
  }

  return (
    <MainCheckoutPage
      product={product}
      pkg={pkg}
      stripeUrl={`/api/package/${pkg.id}/checkout/stripe`}
      paystackUrl={`/api/package/${pkg.id}/checkout/paystack`}
    />
  )
};

export default CheckoutPage;
