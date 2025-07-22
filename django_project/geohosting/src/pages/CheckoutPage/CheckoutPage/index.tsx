import React, { Suspense, useEffect, useRef, useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import customTheme from "../../../theme/theme";
import Navbar from "../../../components/Navbar/Navbar";
import Background from "../../../components/Background/Background";
import { Package, Product } from "../../../redux/reducers/productsSlice";
import { FaCcStripe } from "react-icons/fa6";
import { StripePaymentModal } from "./Stripe";
import { PaystackPaymentModal } from "./Paystack";
import CheckoutTracker from "../../../components/ProgressTracker/CheckoutTracker";
import { OrderSummary } from "../OrderSummary";
import { getUserLocation, headerWithToken } from "../../../utils/helpers";
import { Agreement, AgreementModal } from "./Agreement";
import { PaymentMethods } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ProfileFormModal } from "../../../components/Profile/ProfileFormModal";
import { Company } from "../../../redux/reducers/companySlice";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import CompanyForm from "../../../components/Company/CompanyForm";
import Footer from "../../../components/Footer/Footer";

interface CheckoutPageModalProps {
  product: Product;
  pkg: Package;
  stripeUrl: string;
  paystackUrl: string;
  appName: string;
  companyId?: number | null;
  companyName?: string | null;
  activeStep?: number;
}

export const MainCheckoutPageComponent: React.FC<CheckoutPageModalProps> = ({
  product,
  pkg,
  stripeUrl,
  paystackUrl,
  appName,
  companyId,
  companyName,
}) => {
  /** For the payment component **/
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const companyModalRef = useRef(null);
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const [paymentMethods, setPaymentMethods] = useState<Array<string> | null>(
    null,
  );
  const stripePaymentModalRef = useRef(null);
  const paystackPaymentModalRef = useRef(null);
  const agreementModalRef = useRef(null);
  const [currentMethod, setCurrentMethod] = useState<string | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const { user, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    (async () => {
      const userLocation = await getUserLocation();
      if (userLocation === "ZA") {
        setPaymentMethods([PaymentMethods.PAYSTACK]);
      } else {
        setPaymentMethods([PaymentMethods.STRIPE]);
      }
    })();
  }, []);

  // Check if user has billing information
  useEffect(() => {
    if (!companyName) {
      if (
        !user?.billing_information?.erpnext_code ||
        !user?.billing_information?.address ||
        !user?.billing_information?.city ||
        !user?.billing_information?.country ||
        !user?.billing_information?.postal_code
      ) {
        onProfileOpen();
      } else {
        onProfileClose();
      }
    } else {
      onProfileClose();
    }
  }, [user]);

  function updateCompany() {
    setCompany(null);
    axios
      .get(`/api/companies/${companyId}/`, {
        headers: headerWithToken(),
      })
      .then((res) => {
        setCompany(res.data);
      });
  }

  // Check if company has billing information
  useEffect(() => {
    if (companyName) {
      if (!company) {
        updateCompany();
        return;
      }
      if (
        !company?.name ||
        !company?.email ||
        !company?.billing_information?.erpnext_code ||
        !company?.billing_information?.address ||
        !company?.billing_information?.city ||
        !company?.billing_information?.country ||
        !company?.billing_information?.postal_code
      ) {
        // @ts-ignore
        companyModalRef?.current?.open(company.id);
      }
    }
  }, [company]);

  // Checkout function
  async function agreement(method: string) {
    setAgreements([]);
    setCurrentMethod(method);
    // @ts-ignore
    agreementModalRef?.current?.open();
  }

  function checkout() {
    switch (currentMethod) {
      case PaymentMethods.STRIPE: {
        if (stripePaymentModalRef?.current) {
          // @ts-ignore
          stripePaymentModalRef?.current?.open();
        }
        break;
      }
      case PaymentMethods.PAYSTACK: {
        if (paystackPaymentModalRef?.current) {
          // @ts-ignore
          paystackPaymentModalRef?.current?.open();
        }
        break;
      }
    }
  }

  return (
    <>
      {companyName && !company && (
        <Box
          position={"fixed"}
          top={"0"}
          left={"0"}
          width={"100%"}
          height={"100%"}
          zIndex={100}
        >
          <Box
            position={"absolute"}
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            height={"100%"}
            alignItems={"center"}
            backgroundColor={"rgba(0,0,0,0.5)"}
          >
            <LoadingSpinner />
          </Box>
        </Box>
      )}
      <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`}>
        <OrderSummary
          product={product}
          pkg={pkg}
          appName={appName}
          companyName={companyName}
        />
        <GridItem gap={4} display={"flex"} flexDirection={"column"}>
          <Box>
            <Text fontSize={22} color={"black"}>
              Payment Method
            </Text>
          </Box>
          <Box
            padding={8}
            backgroundColor="gray.100"
            borderRadius={10}
            flexGrow={1}
          >
            <Box
              border="1px"
              borderColor="gray.300"
              borderRadius="md"
              p="4"
              height="100%"
            >
              <Text mt={2}>
                By purchasing this subscription and clicking "Continue", you
                agree to the <Link href="#">terms of service</Link>,{" "}
                <Link href="#">auto-renewal terms</Link>, electronic document
                delivery, and acknowledge the{" "}
                <Link href="#">privacy policy</Link>.
              </Text>
              <Box>
                {paymentMethods?.includes(PaymentMethods.STRIPE) ? (
                  <Button
                    mt={4}
                    leftIcon={<FaCcStripe />}
                    mr={1}
                    colorScheme="blue"
                    size="lg"
                    onClick={() => agreement(PaymentMethods.STRIPE)}
                  >
                    Pay with Stripe
                  </Button>
                ) : null}
                {paymentMethods?.includes(PaymentMethods.PAYSTACK) ? (
                  <Button
                    mt={4}
                    colorScheme="blue"
                    size="lg"
                    onClick={() => agreement(PaymentMethods.PAYSTACK)}
                  >
                    Pay with Paystack
                  </Button>
                ) : null}
                {!paymentMethods ? (
                  <Box paddingTop={5} fontStyle={"italic"} color={"gray"}>
                    Loading payment methods
                  </Box>
                ) : null}
              </Box>
              <Divider mt={4} />
              <Text mt={2} fontSize="sm">
                Payments are processed in {pkg.currency}. Payment provider fees
                may apply.
              </Text>
            </Box>
          </Box>
        </GridItem>
      </Grid>
      <StripePaymentModal
        ref={stripePaymentModalRef}
        url={stripeUrl}
        appName={appName}
        companyName={companyName}
        agreements={agreements}
      />
      <PaystackPaymentModal
        ref={paystackPaymentModalRef}
        url={paystackUrl}
        appName={appName}
        companyName={companyName}
        agreements={agreements}
      />
      <AgreementModal
        ref={agreementModalRef}
        companyName={companyName}
        paymentMethod={currentMethod}
        isDone={(agreements) => {
          setAgreements(agreements);
          checkout();
        }}
      />
      <ProfileFormModal
        isOpen={isProfileOpen}
        description={
          "Please complete your billing information before proceeding with the payment."
        }
      />
      <CompanyForm
        ref={companyModalRef}
        onDone={updateCompany}
        description={
          "Please complete your billing information before proceeding with the payment."
        }
      />
    </>
  );
};

const MainCheckoutPage: React.FC<CheckoutPageModalProps> = ({
  product,
  pkg,
  stripeUrl,
  paystackUrl,
  appName,
  companyId,
  companyName,
  activeStep = 0,
}) => {
  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar />
          <Background />
          <Container maxW="container.xl" mt="80px" mb="80px" bg="transparent">
            <Box mb={10}>
              <CheckoutTracker activeStep={activeStep} />
            </Box>
            <MainCheckoutPageComponent
              appName={appName}
              companyId={companyId}
              companyName={companyName}
              product={product}
              pkg={pkg}
              stripeUrl={stripeUrl}
              paystackUrl={paystackUrl}
            />
          </Container>
        </Box>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </Flex>
    </ChakraProvider>
  );
};

export default MainCheckoutPage;
