import React, {useEffect} from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  List,
  ListItem,
  ChakraProvider,
  Flex,
  Container,
  Image,
  Select,
  SimpleGrid,
  Grid, GridItem, useBreakpointValue, VStack, HStack, IconButton, Divider, Link
} from '@chakra-ui/react';
import {CheckIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {useLocation, useNavigate} from 'react-router-dom';
import customTheme from "../../theme/theme";
import Navbar from "../../components/Navbar/Navbar";
import Background from "../../components/Background/Background";
import {formatPrice, packageName} from "../../utils/helpers";
import {Package} from "../../redux/reducers/productsSlice";
import GeonodeIcon from "../../assets/images/GeoNode.svg"
import { FaStripeS, FaCcStripe } from 'react-icons/fa6';


interface FeatureList {
  spec: { [key: string]: string };
}

interface LocationState {
  productName: string;
  pkg: Package;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const columns = useBreakpointValue({ base: 1, md: 2 });

  const localStorageData = localStorage.getItem('selectedProduct');
  const selectedData = localStorageData ? JSON.parse(localStorageData) : state;

  useEffect(() => {
    if (!selectedData) {
      navigate('/');
    }
  }, [selectedData, navigate]);

  if (!selectedData) {
    return null;
  }

  const { product, pkg } = selectedData;

  return (
     <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar />
          <Background />
          <Container maxW='container.xl' mt="80px" mb="80px" bg="transparent">
             <Grid gap={6} templateColumns={`repeat(${columns}, 1fr)`}>
               <GridItem>
                 <Box>
                    <Text fontSize={22} color={'black'}>
                      Payment Method
                    </Text>
                 </Box>
                 <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
                  <VStack spacing={4} align="stretch">
                    <Box border="1px" borderColor="gray.300" borderRadius="md" p="4">
                      <HStack justifyContent="space-between">
                        <HStack>
                          <FaCcStripe size="30px"/>
                        </HStack>
                        <IconButton aria-label={'icon'} variant="ghost" />
                      </HStack>
                      <Text mt={2}>
                        By purchasing this subscription and clicking "Continue", you agree to the <Link href="#">terms of service</Link>, <Link href="#">auto-renewal terms</Link>, electronic document delivery, and acknowledge the <Link href="#">privacy policy</Link>.
                      </Text>
                      <Button mt={4} leftIcon={<FaCcStripe />} colorScheme="blackAlpha" size="lg">
                        Pay with Stripe
                      </Button>
                      <Divider mt={4} />
                      <Text mt={2} fontSize="sm">Payments are processed in {pkg.currency}. Payment provider fees may apply.</Text>
                    </Box>
                  </VStack>
                 </Box>
               </GridItem>
               <GridItem>
                 <Box>
                    <Text fontSize={22} color={'black'}>
                      Order Summary
                    </Text>
                  </Box>
                  <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
                    <Box border="1px" borderColor="gray.300" borderRadius="md" p="4">
                    <Box display="flex" alignItems="center" pr={4} pb={4}>
                      <Image
                        src={product.image ? product.image : GeonodeIcon}
                        alt={product.name}
                        boxSize="50px"
                      />
                      <Text fontSize="2xl" fontWeight="bold" ml={2}>
                        {product.name} {packageName(pkg)}
                      </Text>
                    </Box>
                    <Text fontSize="xl" mb={4} fontWeight="bold">
                      {formatPrice(pkg.price, pkg.currency)} / month
                    </Text>
                    <Heading as="h3" size="md" mb={2}>
                      Features
                    </Heading>
                    <List spacing={2}>
                      {pkg.feature_list &&
                        pkg.feature_list['spec'] &&
                        Object.entries(pkg.feature_list['spec']).map(([key, value]: any) => (
                          <ListItem key={key} display="flex" alignItems="center">
                            <CheckIcon color="green.500" mr={2} /> {value}
                          </ListItem>
                        ))}
                    </List>
                    </Box>
                  </Box>
               </GridItem>
             </Grid>
          </Container>
        </Box>
        <Box
          width="100%"
          backgroundColor="blue.500"
          py="4"
          textAlign="center"
        >
          <Text color="white">Powered by Kartoza</Text>
        </Box>
      </Flex>
     </ChakraProvider>
  );
};

export default CheckoutPage;
