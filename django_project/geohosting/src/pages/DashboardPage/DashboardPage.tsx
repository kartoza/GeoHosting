import React from 'react';
import { Box, ChakraProvider, } from '@chakra-ui/react';
import customTheme from '../../theme/theme';
import DashboardSidePanel
  from "../../components/DashboardSidePanel/DashboardSidePanel";
import { Route, Routes, useLocation } from "react-router-dom";
import OrdersList from './Orders/OrderList';
import OrderDetail from "./Orders/OrderDetail";
import ProfilePage from './Profile/ProfilePage';
import ServiceList from "./Services/ServiceList";
import AgreementList from "./Agreements/AgreementList";
import DashboardPageContent from "./DashboardPageContent";
import SupportList from "./Support/SupportList";
import ServiceDetail from "./Services/ServiceDetail";

const DashboardPage = ({ title = "Dashboard" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();

  return (
    <ChakraProvider theme={customTheme}>
      <Box minH="100vh" bg="gray.200">
        <DashboardSidePanel
          selected={location.pathname.split('/').pop()}
          onClose={toggleSidebar}
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        />
        <Routes>
          <Route
            path="/instances/:id"
            element={
              <DashboardPageContent
                title='Hosted Service'
                element={<ServiceDetail/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/"
            element={
              <DashboardPageContent
                title='Hosted Services'
                element={<ServiceList/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/agreements"
            element={
              <DashboardPageContent
                title='Agreements'
                element={<AgreementList/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/orders/:id"
            element={
              <DashboardPageContent
                title='Order'
                element={<OrderDetail/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <DashboardPageContent
                title='Orders'
                element={<OrdersList/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardPageContent
                title='Profile'
                element={<ProfilePage/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/support"
            element={
              <DashboardPageContent
                title='Support'
                element={<SupportList/>}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </Routes>
      </Box>
    </ChakraProvider>
  );
};

export default DashboardPage;
