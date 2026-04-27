import React from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

const CloudBenchPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const cloudbenchUrl = "/cloudbench";

  return (
    <>
      {cloudbenchUrl ? (
        <Box width="100%" height="100%" position="relative">
          {isLoading && (
            <Flex
              position="absolute"
              width="100%"
              height="100%"
              inset={0}
              alignItems="center"
              justifyContent="center"
              bg="white"
              zIndex={1}
            >
              <Spinner size="xl" color="blue.500" />
            </Flex>
          )}
          <iframe
            src={cloudbenchUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="CloudBench"
            onLoad={() => setIsLoading(false)}
          />
        </Box>
      ) : (
        <Flex h="100%" alignItems="center" justifyContent="center">
          <Text color="gray.500">
            CloudBench URL is not configured. Set the{" "}
            <strong>CLOUDBENCH_URL</strong> environment variable.
          </Text>
        </Flex>
      )}
    </>
  );
};

export default CloudBenchPage;
