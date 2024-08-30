import React, { useEffect } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchSalesOrderDetail
} from "../../../redux/reducers/salesOrdersSlice";
import { checkCheckoutUrl } from "../utils";
import MainCheckoutPage from "../CheckoutPage";


const CheckoutPayment: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { salesOrderDetail, detailError } = useSelector(
    (state: RootState) => state.salesOrders
  );

  useEffect(() => {
    if (detailError) {
      navigate('/');
    }
  }, [detailError]);

  useEffect(() => {
    if (id && salesOrderDetail?.id != id) {
      dispatch(fetchSalesOrderDetail(id));
    }
    // Check the url and redirect to correct page
    if (salesOrderDetail && salesOrderDetail.id + '' === id) {
      checkCheckoutUrl(salesOrderDetail)
    }
  }, [id, salesOrderDetail, dispatch]);


  if (!salesOrderDetail) {
    return (
      <Box
        position={'absolute'} display={'flex'}
        justifyContent={'center'} width={'100%'} height={'100%'}
        alignItems={'center'}>
        <Spinner size='xl'/>
      </Box>
    )
  }
  return (
    <MainCheckoutPage
      product={salesOrderDetail.product}
      pkg={salesOrderDetail.package}
      stripeUrl={`/api/orders/${salesOrderDetail.id}/payment/stripe`}
      paystackUrl={`/api/orders/${salesOrderDetail.id}/payment/paystack`}
    />
  )
};

export default CheckoutPayment;
