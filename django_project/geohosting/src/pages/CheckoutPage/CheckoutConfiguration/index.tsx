import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Grid,
  GridItem,
  Input,
  Spinner,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { useParams } from "react-router-dom";
import axios from "axios";
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
  const [appName, setAppName] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const { token } = useSelector((state: RootState) => state.auth);

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

  useEffect(() => {
    if (salesOrderDetail) {
      setAppName(salesOrderDetail.app_name)
      if (salesOrderDetail.app_name) {
        setDisabled(true)
      }
    }
  }, [salesOrderDetail]);

  const submit = async () => {
    setDisabled(true)
    try {
      await axios.patch(`/api/orders/${id}/`, { app_name: appName }, {
        headers: { Authorization: `Token ${token}` }
      });
      // @ts-ignore
    } catch ({ message }) {
    }
  };

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
              <CheckoutTracker activeStep={1}/>
            </Box>
            <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`}>
              <OrderSummary
                product={salesOrderDetail.product}
                pkg={salesOrderDetail.package}
                invoice_url={salesOrderDetail.invoice_url}
              />
              <GridItem>
                <Box>
                  <Text fontSize={22} color={'black'}>
                    App name
                  </Text>
                </Box>
                <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
                  <Input
                    defaultValue={salesOrderDetail.app_name}
                    backgroundColor="white"
                    placeholder='Name just contains letter, number and dash'
                    size='lg'
                    isDisabled={disabled}
                    onChange={(evt) => setAppName(evt.target.value)}
                  />
                  <Box>
                    <Text
                      fontSize={12} color={'gray'} fontStyle={"italic"}
                      marginTop={'1rem'}>
                      <i>
                        This will be used for subdomain and also application
                        name.
                        e.g: appname.geonode.kartoza.com
                      </i>
                    </Text>
                  </Box>
                </Box>
              </GridItem>
            </Grid>

            <Box mt={4}>
              <Button
                w='100%'
                colorScheme="orange"
                isDisabled={!appName || disabled}
                onClick={() => {
                  submit()
                }}
              >
                Save configuration and deploy
              </Button>
            </Box>
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
