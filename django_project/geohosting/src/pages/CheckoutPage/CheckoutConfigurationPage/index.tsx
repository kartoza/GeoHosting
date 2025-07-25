import React, { Suspense, useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Grid,
  GridItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import OrderSummary from "../../CheckoutPage/OrderSummary";
import OrderConfiguration from "./OrderConfiguration";
import { useLocation, useNavigate } from "react-router-dom";
import { Package } from "../../../redux/reducers/productsSlice";
import customTheme from "../../../theme/theme";
import Navbar from "../../../components/Navbar/Navbar";
import Background from "../../../components/Background/Background";
import CheckoutTracker from "../../../components/ProgressTracker/CheckoutTracker";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import Footer from "../../../components/Footer/Footer";

interface LocationState {
  productName: string;
  pkg: Package;
}

const CheckoutConfiguration: React.FC = () => {
  /** Checkout configuration */
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState;
  const localStorageData = localStorage.getItem("selectedProduct");
  const selectedData = localStorageData ? JSON.parse(localStorageData) : state;
  const { product, pkg } = selectedData;

  const columns = useBreakpointValue({ base: 1, md: 2 });

  // App name is ok
  const [appName, setAppName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [configurationOK, setConfigurationOK] = useState<boolean>(false);

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar />
          <Background />
          <Container maxW="container.xl" mt="80px" mb="80px" bg="transparent">
            <Box mb={10}>
              <CheckoutTracker activeStep={0} />
            </Box>
            <>
              <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`} alignItems="stretch">
                <GridItem>
                  <OrderSummary product={product} pkg={pkg} />
                </GridItem>
                <OrderConfiguration
                  product={product}
                  appName={appName}
                  setAppName={setAppName}
                  setConfigurationOK={setConfigurationOK}
                  companyId={companyId}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  setCompanyId={setCompanyId}
                />
              </Grid>

              <Box mt={4}>
                <Button
                  w="100%"
                  colorScheme="blue"
                  isDisabled={!configurationOK}
                  onClick={() => {
                    navigate("/checkout");
                    localStorage.setItem("appName", appName);
                    localStorage.setItem(
                      "companyName",
                      companyName ? companyName : "",
                    );
                    localStorage.setItem(
                      "companyId",
                      "" + (companyId ? companyId : ""),
                    );
                  }}
                >
                  Next
                </Button>
              </Box>
            </>
          </Container>
        </Box>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </Flex>
    </ChakraProvider>
  );
};

export default CheckoutConfiguration;
