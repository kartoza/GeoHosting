import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Link,
  Text,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react';
import customTheme from "../../../theme/theme";
import Navbar from "../../../components/Navbar/Navbar";
import Background from "../../../components/Background/Background";
import { Package, Product } from "../../../redux/reducers/productsSlice";
import { FaCcStripe } from 'react-icons/fa6';
import { StripePaymentModal } from "./Stripe";
import { PaystackPaymentModal } from "./Paystack";
import CheckoutTracker
  from "../../../components/ProgressTracker/CheckoutTracker";
import { OrderSummary } from "../OrderSummary"
import { getUserLocation } from "../../../utils/helpers";

interface LocationState {
  productName: string;
  pkg: Package;
}

const PaymentMethods = {
  STRIPE: 'STRIPE',
  PAYSTACK: 'PAYSTACK',
}

interface CheckoutPageModalProps {
  product: Product;
  pkg: Package;
  stripeUrl: string;
  paystackUrl: string;
}

export const MainCheckoutPageComponent: React.FC<CheckoutPageModalProps> = (
  { product, pkg, stripeUrl, paystackUrl }
) => {
  /** For the payment component **/
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<[string] | null>(null);
  const stripePaymentModalRef = useRef(null);
  const paystackPaymentModalRef = useRef(null);

  useEffect(() => {
    (
      async () => {
        const userLocation = await getUserLocation()
        if (userLocation === 'ZA') {
          setPaymentMethod(PaymentMethods.PAYSTACK)
          setPaymentMethods([PaymentMethods.PAYSTACK])
        } else {
          setPaymentMethod(PaymentMethods.STRIPE)
          setPaymentMethods([PaymentMethods.STRIPE])
        }
      }
    )();
  }, []);

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
    <>
      <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`}>
        <GridItem>
          <Box>
            <Text fontSize={22} color={'black'}>
              Payment Method
            </Text>
          </Box>
          <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
            <VStack spacing={4} align="stretch">
              <Box border="1px" borderColor="gray.300" borderRadius="md"
                   p="4">
                <Text mt={2}>
                  By purchasing this subscription and clicking
                  "Continue", you agree to the <Link href="#">terms of
                  service</Link>, <Link href="#">auto-renewal
                  terms</Link>, electronic document delivery, and
                  acknowledge the <Link href="#">privacy policy</Link>.
                </Text>
                <Box style={{ minHeight: "106px" }}>
                  {
                    paymentMethods?.includes(PaymentMethods.STRIPE) ?
                      <Button
                        mt={4} leftIcon={<FaCcStripe/>} mr={1}
                        colorScheme={paymentMethod === PaymentMethods.STRIPE ? "blue" : "blackAlpha"}
                        size="lg"
                        onClick={() => setPaymentMethod(PaymentMethods.STRIPE)}
                      >
                        Pay with Stripe
                      </Button> : null
                  }
                  {
                    paymentMethods?.includes(PaymentMethods.PAYSTACK) ?
                      <Button
                        mt={4}
                        colorScheme={paymentMethod === PaymentMethods.PAYSTACK ? "blue" : "blackAlpha"}
                        size="lg"
                        onClick={() => setPaymentMethod(PaymentMethods.PAYSTACK)}
                      >
                        Pay with Paystack
                      </Button> : null
                  }
                  {!paymentMethods ?
                    <Box paddingTop={5} fontStyle={"italic"} color={"gray"}>
                      Loading payment methods
                    </Box> : null}
                </Box>
                <Divider mt={4}/>
                <Text mt={2} fontSize="sm">Payments are processed
                  in {pkg.currency}. Payment provider fees may
                  apply.</Text>
              </Box>
            </VStack>
          </Box>
        </GridItem>
        <OrderSummary product={product} pkg={pkg}/>
      </Grid>
      {
        paymentMethod ?
          <Box mt={4}>
            <Button
              w='100%'
              colorScheme="orange"
              onClick={checkout}
            >
              Pay with {paymentMethod.toLowerCase()}
            </Button>
          </Box> : null
      }
      <StripePaymentModal
        ref={stripePaymentModalRef}
        url={stripeUrl}
      />
      <PaystackPaymentModal
        ref={paystackPaymentModalRef}
        url={paystackUrl}
      />
    </>
  )
}

const MainCheckoutPage: React.FC<CheckoutPageModalProps> = (
  { product, pkg, stripeUrl, paystackUrl }
) => {
  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar/>
          <Background/>
          <Container maxW='container.xl' mt="80px" mb="80px" bg="transparent">
            <Box mb={10}>
              <CheckoutTracker activeStep={0}/>
            </Box>
            <MainCheckoutPageComponent
              product={product} pkg={pkg}
              stripeUrl={stripeUrl}
              paystackUrl={paystackUrl}/>
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

export default MainCheckoutPage;
