import React, { useEffect } from "react";
import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Link as ChakraLink,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import LoginForm from "../LoginForm/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/reducers/productsSlice";
import { FaUser } from "react-icons/fa";
import Help from "../Help";

interface NavbarContentProps {
  isDrawer: boolean;
  onOpen: () => void;
}

const STYLES = {
  linkHovered: { textDecoration: "none", opacity: 0.8 },
};

/** Content of navbar
 * @param onOpen
 * @constructor
 */
const NavbarContent: React.FC<NavbarContentProps> = ({ onOpen, isDrawer }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.products);
  return (
    <>
      <ChakraLink
        as={RouterLink}
        to="https://kartoza.com"
        fontSize="md"
        _hover={STYLES.linkHovered}
        target="_blank"
      >
        Kartoza
      </ChakraLink>
      <ChakraLink
        as={RouterLink}
        to="https://kartoza.com/about"
        fontSize="md"
        _hover={STYLES.linkHovered}
        target="_blank"
        whiteSpace="nowrap"
      >
        About us
      </ChakraLink>

      {isDrawer ? (
        <Box
          width="100%"
          height="1px"
          borderBottom="1px solid"
          borderColor="gray.200"
        />
      ) : (
        <Box flexGrow={1} />
      )}

      {products.map((product) => (
        <ChakraLink
          key={product.name}
          as="button"
          onClick={() => navigate("/app/" + product.name)}
          fontSize="md"
          _hover={STYLES.linkHovered}
        >
          {product.name}
        </ChakraLink>
      ))}

      {isDrawer ? (
        <Box
          width="100%"
          height="1px"
          borderBottom="1px solid"
          borderColor="gray.200"
        />
      ) : null}

      {token ? (
        <ChakraLink
          as="button"
          onClick={() => navigate("/dashboard")}
          fontSize="md"
          style={{ display: "flex", alignItems: "center" }}
          _hover={STYLES.linkHovered}
        >
          <Box
            boxSize={6}
            marginRight={2}
            border={isDrawer ? "1px solid #1A202C" : "1px solid white"}
            borderRadius={50}
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FaUser />
          </Box>
          Dashboard
        </ChakraLink>
      ) : (
        <ChakraLink
          as="button"
          onClick={() => onOpen()}
          fontSize="md"
          style={{ display: "flex", alignItems: "center" }}
          _hover={STYLES.linkHovered}
        >
          Login
        </ChakraLink>
      )}
      <Help isDrawer={isDrawer} />

      {isDrawer ? <Box width="100%" height="1px" /> : null}
    </>
  );
};
const Navbar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Box
      top={0}
      width="100%"
      as="nav"
      padding="10px 20px"
      bg="gray.500"
      zIndex={1000}
      textColor={"white"}
    >
      <Container
        maxW="container.xl"
        textAlign="center"
        bg="transparent"
        paddingX={{ base: 0, lg: 4 }}
      >
        <Flex justify="space-between" align="center">
          <HStack spacing="24px" marginRight="24px">
            <ChakraLink
              as={RouterLink}
              to="/"
              fontSize="md"
              _hover={STYLES.linkHovered}
              display="flex"
              style={{
                fontWeight: 900,
                fontSize: "1.125rem",
                padding: 0,
              }}
            >
              <Image
                src="/static/images/logos/geohosting-full-white.svg"
                alt="Kartoza Logo"
                style={{ cursor: "pointer" }}
                mr={2}
              />
            </ChakraLink>
          </HStack>

          <HStack
            spacing="24px"
            display={{ base: "none", lg: "flex" }}
            marginLeft="auto"
            flexGrow={1}
          >
            <NavbarContent onOpen={onOpen} isDrawer={false} />
          </HStack>

          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={{ base: "flex", lg: "none" }}
            backgroundColor={"gray.500"}
            _hover={{ backgroundColor: "gray.500" }}
            onClick={onDrawerOpen}
          />
        </Flex>

        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader></DrawerHeader>

            <DrawerBody>
              <VStack spacing="24px" align="start">
                <NavbarContent onOpen={onOpen} isDrawer={true} />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <LoginForm isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
};

export default Navbar;
