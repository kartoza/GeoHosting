import React, { lazy, Suspense, useEffect } from "react";
import customTheme from "../../theme/theme";
import Navbar from "../../components/Navbar/Navbar";
import Background from "../../components/Background/Background";
import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  clearProductDetail,
  fetchProductDetailByName,
  Package,
} from "../../redux/reducers/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Footer from "../../components/Footer/Footer";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ProductOverview = lazy(
  () => import("../../components/ProductOverview/ProductOverview"),
);
const ProductPricing = lazy(
  () => import("../../components/ProductPricing/ProductPricing"),
);
const ProductFeatureGrid = lazy(
  () => import("../../components/ProductFeatureGrid/ProductFeatureGrid"),
);
const ProductSupportGrid = lazy(
  () => import("../../components/ProductSupportGrid/ProductSupportGrid"),
);

const OverviewPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { appName } = useParams<{ appName: string }>();
  const { detailLoading, detailError, productDetail } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    if (appName) {
      window.scrollTo(0, 0);
      dispatch(clearProductDetail());
      dispatch(fetchProductDetailByName(appName));
    }
  }, [dispatch, appName]);

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar />
          <Background />
          {detailLoading && (
            <Box
              width={"100%"}
              height={"80vh"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <LoadingSpinner />
            </Box>
          )}
          <Container
            maxW="100%"
            my={{ base: 8, md: 20 }}
            bg="transparent"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Box width={1240} maxWidth={"100%"}>
              {!detailLoading && productDetail && (
                <>
                  <Container
                    maxW="container.xl"
                    textAlign="center"
                    paddingX={{ base: 0, md: 1 }}
                    overflowX={{ base: "hidden", md: "auto" }}
                  >
                    <Heading
                      as="h1"
                      size="xl"
                      fontSize={{ base: 40, sm: 50 }}
                      display={{ base: "block", md: "flex" }}
                      justifyContent={"center"}
                      alignItems={"center"}
                      color={"gray.600"}
                    >
                      <Box justifyContent={"center"} display={"flex"}>
                        <img src={productDetail.image} width={115} />
                      </Box>
                      {productDetail.name} Hosting
                    </Heading>
                    <Container maxW="container.2lg">
                      <Heading
                        fontSize={{ base: 24, md: 32 }}
                        pt={6}
                        pb={3}
                        mb={12}
                        fontWeight={"bold"}
                        color={"gray.500"}
                      >
                        {productDetail.description}
                      </Heading>
                    </Container>
                    <Flex
                      wrap="wrap"
                      justify="center"
                      gap="30px"
                      mt={5}
                      mb={10}
                    >
                      {productDetail.packages.map((pkg: Package) => (
                        <Suspense fallback={<LoadingSpinner />} key={pkg.id}>
                          <ProductPricing product={productDetail} pkg={pkg} />
                        </Suspense>
                      ))}
                    </Flex>
                  </Container>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductOverview
                      productMeta={productDetail.product_meta}
                      medias={productDetail.images}
                      productName={productDetail.name}
                    />
                  </Suspense>
                  <Box width={"100%"} mb={10} textAlign={"center"} mx="auto">
                    <Text
                      color={"gray.700"}
                      fontWeight="bold"
                      fontSize={{ base: 24, md: 48 }}
                      mb={12}
                    >
                      Why Choose {productDetail.name}?
                    </Text>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductFeatureGrid product={productDetail} />
                    </Suspense>
                  </Box>
                  <Box width={"100%"} mt={5} mb={10} textAlign={"center"}>
                    <Text
                      color={"gray.700"}
                      fontWeight="bold"
                      fontSize={{ base: 24, md: 48 }}
                    >
                      Start Transforming your Data with {productDetail.name}{" "}
                      Today!
                    </Text>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProductSupportGrid product={productDetail} />
                    </Suspense>
                  </Box>
                </>
              )}
            </Box>
          </Container>
        </Box>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
};

export default OverviewPage;
