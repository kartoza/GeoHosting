import React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import customTheme from "../../theme/theme";
import DashboardSidePanel from "../../components/DashboardSidePanel";
import { Route, Routes } from "react-router-dom";
import OrdersList from "./Orders/OrderList";
import OrderDetail from "./Orders/OrderDetail";
import ProfilePage from "./Profile/ProfilePage";
import ServiceList from "./Services/ServiceList";
import DashboardPageContent from "./DashboardPageContent";
import SupportList from "./Support/SupportList";
import ServiceDetail from "./Services/ServiceDetail";
import CloudBenchPage from "../CloudBenchPage";

const DashboardPage = ({ title = "Dashboard" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <ChakraProvider theme={customTheme}>
      <Box minH="100vh" display="flex">
        <DashboardSidePanel
          onClose={toggleSidebar}
          display={{ base: isOpen ? "block" : "none", md: "block" }}
          position={{ base: "absolute", md: "unset" }}
        />
        <Box flexGrow={1} minH="100vh">
          <Routes>
            <Route
              path="/instances/:id"
              element={
                <DashboardPageContent
                  title="Hosted Product"
                  element={<ServiceDetail />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route
              path="/"
              element={
                <DashboardPageContent
                  title="Hosted Products"
                  element={<ServiceList />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route
              path="/orders/:id"
              element={
                <DashboardPageContent
                  title="Order"
                  element={<OrderDetail />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <DashboardPageContent
                  title="Orders"
                  element={<OrdersList />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <DashboardPageContent
                  title="Profile"
                  element={<ProfilePage />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route
              path="/support"
              element={
                <DashboardPageContent
                  title="Support"
                  element={<SupportList />}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route path="/cloudbench" element={<CloudBenchPage />} />
          </Routes>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default DashboardPage;
