import React from "react";
import { Box, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import customTheme from "../../theme/theme";
import DashboardSidePanel from "../../components/DashboardSidePanel";

const CloudBenchPage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const cloudbenchUrl = "/cloudbench";

  return (
    <ChakraProvider theme={customTheme}>
      <Box minH="100vh">
        <DashboardSidePanel
          onClose={toggleSidebar}
          display={{ base: isOpen ? "block" : "none", md: "block" }}
        />
        <Box ml={{ base: 0, md: 60 }} h="100vh">
          {cloudbenchUrl ? (
            <iframe
              src={cloudbenchUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="CloudBench"
            />
          ) : (
            <Flex h="100%" alignItems="center" justifyContent="center">
              <Text color="gray.500">
                CloudBench URL is not configured. Set the{" "}
                <strong>CLOUDBENCH_URL</strong> environment variable.
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default CloudBenchPage;
