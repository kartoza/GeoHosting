import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/reducers/authSlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Box,
  CloseButton,
  Flex,
  Heading,
  Image,
  VStack,
} from "@chakra-ui/react";
import React, { CSSProperties, ReactNode } from "react";
import Help from "../Help";

import "./styles.scss";

interface SidebarItemProps {
  icon?: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  style?: CSSProperties | undefined;
  children: ReactNode;
}

const SidebarItem = ({
  icon,
  isSelected,
  onClick,
  style,
  children,
}: SidebarItemProps) => {
  return (
    <Flex
      className="SidebarItem"
      px={8}
      py={3}
      color="white"
      _hover={{ bg: "blue.500", cursor: "pointer" }}
      w="full"
      onClick={onClick ? onClick : () => {}}
      bg={isSelected ? "blue.500" : "transparent"}
      style={style}
      gap={3}
    >
      {icon && (
        <Box className="Side" fontSize="lg" display="flex" alignItems="center">
          {icon}
        </Box>
      )}
      <Box className="SidePanelText">{children}</Box>
    </Flex>
  );
};

const DashboardSidePanel = ({ onClose, ...rest }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathNames = location.pathname.split("/");
  const selected = pathNames[pathNames.length - 1];
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  return (
    <Box
      className={"DashboardSidePanel " + (collapsed ? "collapsed" : "")}
      bg="gray.500"
      zIndex={99}
      w={{ base: "full", md: 60 }}
      minHeight="100vh"
      maxHeight="100vh"
      overflowY="auto"
      {...rest}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          color={{ base: "white", md: "#3e3e3e" }}
        />
        <Heading
          fontSize={"1.5rem"}
          fontWeight="normal"
          color="white"
          cursor="pointer"
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={4}
          p={2}
          position="relative"
          mb={4}
        >
          <Image
            src="/static/images/logos/geohosting.svg"
            alt="Kartoza Logo"
            style={{ cursor: "pointer" }}
            mr={1}
            height={16}
            width={16}
            _hover={{ opacity: 0.5 }}
            onClick={() => navigate("/")}
          />
          <Box
            className="HeaderName"
            _hover={{ opacity: 0.5 }}
            onClick={() => navigate("/")}
          >
            GeoSpatialHosting
          </Box>
          {!collapsed ? (
            <Box
              display={{ base: "none", md: "flex" }}
              width="100%"
              justifyContent="end"
              position="absolute"
              top={8}
              right={2}
            >
              <Box
                fontSize={"6px"}
                p={1}
                className="CollapseButton"
                cursor={"pointer"}
                onClick={() => {
                  setCollapsed((t) => !t);
                }}
                backgroundColor={"white"}
                borderRadius={"50%"}
              >
                <FaChevronLeft color={"black"} />
              </Box>
            </Box>
          ) : (
            <Box
              display={{ base: "none", md: "flex" }}
              width="100%"
              justifyContent="end"
              position="absolute"
              bottom={"-10px"}
              right={2}
            >
              <Box
                fontSize={"6px"}
                p={1}
                className="CollapseButton"
                cursor={"pointer"}
                onClick={() => {
                  setCollapsed((t) => !t);
                }}
                backgroundColor={"white"}
                borderRadius={"50%"}
              >
                <FaChevronRight color={"black"} />
              </Box>
            </Box>
          )}
        </Heading>
      </Flex>
      <VStack spacing={0} align="start">
        <SidebarItem
          icon={
            <Image
              src="/static/images/hosted_products.svg"
              boxSize="6"
              alt="Hosted Products"
            />
          }
          isSelected={selected === "dashboard" || pathNames[2] === "instances"}
          onClick={() => navigate("/dashboard")}
        >
          Hosted Products
        </SidebarItem>
        <SidebarItem
          icon={
            <Image
              src="/static/images/agreements.svg"
              boxSize="6"
              alt="Agreements"
            />
          }
          isSelected={selected === "orders"}
          onClick={() => navigate("/dashboard/orders")}
        >
          Agreements
        </SidebarItem>
        <SidebarItem
          icon={
            <Image src="/static/images/support.svg" boxSize="6" alt="Support" />
          }
          isSelected={selected === "support"}
          onClick={() => navigate("/dashboard/support")}
        >
          Support
        </SidebarItem>
        <SidebarItem
          icon={
            <Image src="/static/images/profile.svg" boxSize="6" alt="Profile" />
          }
          isSelected={selected === "profile"}
          onClick={() => navigate("/dashboard/profile")}
        >
          Profile
        </SidebarItem>
        <SidebarItem
          style={{
            position: "relative",
            alignItems: "center",
            gap: "10px",
          }}
          icon={
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              focusable="false"
              className="chakra-icon css-qwa21a"
              height="24px"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
          }
          isSelected={selected === "cloudbench"}
          onClick={() => {
            navigate("/dashboard/cloudbench");
            setCollapsed(true);
          }}
        >
          CloudBench{" "}
          <span
            style={{
              fontSize: "0.6rem",
              backgroundColor: "green",
              marginTop: "-0.5rem",
              marginLeft: "-0.5rem",
              padding: "0 0.5rem",
              borderRadius: "0.25rem",
              color: "white",
              height: "fit-content",
            }}
          >
            Experimental
          </span>
        </SidebarItem>
        <SidebarItem style={{ padding: 0, paddingLeft: "18px" }}>
          <Help isDrawer={true} backgroundColor={"transparent"} />
        </SidebarItem>
        <SidebarItem
          icon={
            <Image src="/static/images/logout.svg" boxSize="6" alt="Logout" />
          }
          isSelected={false}
          onClick={handleLogout}
        >
          Logout
        </SidebarItem>
      </VStack>
    </Box>
  );
};

export default DashboardSidePanel;
