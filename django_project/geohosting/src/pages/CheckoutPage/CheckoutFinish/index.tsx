import React, { useEffect } from 'react';
import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import customTheme from "../../../theme/theme";
import Navbar from "../../../components/Navbar/Navbar";
import Background from "../../../components/Background/Background";
import CheckoutTracker
  from "../../../components/ProgressTracker/CheckoutTracker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchSalesOrderDetail
} from "../../../redux/reducers/salesOrdersSlice";
import OrderSummary from "../../CheckoutPage/OrderSummary";
import { checkCheckoutUrl } from "../utils";


const CheckoutConfiguration: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { salesOrderDetail } = useSelector(
    (state: RootState) => state.salesOrders
  );
  const columns = useBreakpointValue({ base: 1, md: 2 });

  useEffect(() => {
    // Check the url and redirect to correct page
    if (salesOrderDetail && salesOrderDetail.id === id) {
      checkCheckoutUrl(salesOrderDetail)
    }
  }, [salesOrderDetail]);

  useEffect(() => {
    if (id != null) {
      dispatch(fetchSalesOrderDetail(id));
    }
  }, [dispatch]);

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
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar/>
          <Background/>
          <Container maxW='container.xl' mt="80px" mb="80px" bg="transparent">
            <Box mb={10}>
              <CheckoutTracker activeStep={3}/>
            </Box>
            <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`}>
              <OrderSummary
                product={salesOrderDetail.product}
                pkg={salesOrderDetail.package}
                invoice_url={salesOrderDetail.invoice_url}
              />
              <GridItem>
                <Box>
                  <Text fontSize={22} color={'white'}>Title</Text>
                </Box>
                <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
                  Your service is ready! You can check it out here:
                  [link or location].
                </Box>
              </GridItem>
            </Grid>
          </Container>
        </Box>
        <Box
          width="100%"
          backgroundColor="blue.500"
          py="4"
          textAlign="center"
        >
          <Text color="white">Powered by Kartoza</Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default CheckoutConfiguration;
