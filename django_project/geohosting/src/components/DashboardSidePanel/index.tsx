import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/reducers/authSlice";
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

interface SidebarItemProps {
  isSelected?: boolean;
  onClick?: () => void;
  style?: CSSProperties | undefined;
  children: ReactNode;
}

const SidebarItem = ({
  isSelected,
  onClick,
  style,
  children,
}: SidebarItemProps) => {
  return (
    <Box
      p={4}
      color="white"
      _hover={{ bg: "blue.500", cursor: "pointer" }}
      w="full"
      onClick={onClick ? onClick : () => {}}
      bg={isSelected ? "blue.500" : "transparent"}
      style={style}
    >
      {children}
    </Box>
  );
};

const DashboardSidePanel = ({ onClose, ...rest }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathNames = location.pathname.split("/");
  const selected = pathNames[pathNames.length - 1];

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  return (
    <Box
      bg="gray.500"
      zIndex={99}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        alignItems="center"
        mx="3"
        justifyContent="space-between"
        h="14"
        marginBottom={"-1px"}
      >
        <Heading
          fontSize="xl"
          fontWeight="bold"
          color="white"
          cursor="pointer"
          _hover={{ opacity: 0.5 }}
          onClick={() => navigate("/")}
        >
          <Image
            src="/static/images/logos/geohosting-full-white.svg"
            alt="Kartoza Logo"
            style={{ cursor: "pointer" }}
            width="100%"
          />
        </Heading>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          color={{ base: "white", md: "#3e3e3e" }}
        />
      </Flex>
      <VStack spacing={0} align="start">
        <SidebarItem
          isSelected={selected === "dashboard" || pathNames[2] === "instances"}
          onClick={() => navigate("/dashboard")}
        >
          Hosted Services
        </SidebarItem>
        <SidebarItem
          isSelected={selected === "orders"}
          onClick={() => navigate("/dashboard/orders")}
        >
          Orders
        </SidebarItem>
        <SidebarItem
          isSelected={selected === "support"}
          onClick={() => navigate("/dashboard/support")}
        >
          Support
        </SidebarItem>
        <SidebarItem
          isSelected={selected === "profile"}
          onClick={() => navigate("/dashboard/profile")}
        >
          Profile
        </SidebarItem>
        <SidebarItem style={{ padding: 0 }}>
          <Help
            isDrawer={true}
            backgroundColor={"transparent"}
            style={{
              padding: "1rem",
              height: "auto",
              width: "100%",
              justifyContent: "flex-start",
            }}
          />
        </SidebarItem>
        <SidebarItem isSelected={false} onClick={handleLogout}>
          Logout
        </SidebarItem>
      </VStack>
    </Box>
  );
};

export default DashboardSidePanel;
