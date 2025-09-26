import React from "react";
import { Box, Spinner } from "@chakra-ui/react";

interface Props {}

const CheckoutDeployment: React.FC<Props> = () => {
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        p={24}
      >
        <Spinner size="xl" color="orange.500" />
        <Box
          color="orange.500"
          fontSize="lg"
          fontWeight="bold"
          mt={8}
          textAlign={"center"}
        >
          Please wait while we verify your payment and prepare your product.{" "}
          <Box>This may take a moment.</Box>
        </Box>
      </Box>
    </>
  );
};

export default CheckoutDeployment;
