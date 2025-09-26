import React, { Suspense } from "react";
import customTheme from "../../theme/theme";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import Footer from "../../components/Footer/Footer";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../components/Navbar/Navbar";

const PageNotFound: React.FC = () => {
  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Suspense fallback={<LoadingSpinner />}>
            <Navbar />
          </Suspense>
          <Box
            width="100%"
            textAlign="center"
            padding="5rem"
            paddingBottom="8rem"
          >
            <Box fontSize="8rem">404</Box>
            <Box fontSize="4rem">Page not found</Box>
          </Box>
        </Box>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </Flex>
    </ChakraProvider>
  );
};

export default PageNotFound;
