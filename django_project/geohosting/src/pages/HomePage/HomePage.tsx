import React, { lazy, Suspense, useRef, useState } from 'react';
import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Img,
  Text,
  Wrap,
  WrapItem,
  Button
} from '@chakra-ui/react';
import customTheme from '../../theme/theme';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../redux/reducers/productsSlice';
import { useNavigate } from 'react-router-dom';

import Background from '../../components/Background/Background';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Navbar = lazy(() => import('../../components/Navbar/Navbar'));
const ProductCard = lazy(() => import('../../components/ProductCard/ProductCard'));
const HostingPlans = lazy(() => import('../../components/HostingPlans/index'));
const FeaturesGrid = lazy(() => import('../../components/FeatureGrid/index'));
const Footer = lazy(() => import('../../components/Footer/Footer'));

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    detailLoading,
    detailError,
    productDetail
  } = useSelector(
    (state: RootState) => state.products
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/app/${product.name}`);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Suspense fallback={<LoadingSpinner/>}>
            <Navbar/>
          </Suspense>
          <Background/>
          <Container
            maxW="container.xl"
            textAlign="center"
            bg="transparent"
            marginY={{ base: "20px", md: "80px" }}
            overflowX={{ base: "hidden", md: "auto" }}
          >
            <Flex justify="center" align="center"
                  flexDirection={{ base: 'column', md: 'row' }}>
              <Img
                src={'/static/images/logos/geohosting-full.svg'}
                width={{ base: '620px', md: '620px', xl: '700px' }}
                mb={{ base: 4, md: 0 }}
                mr={{ base: 0, md: 4 }}
              />
            </Flex>
            <Text
              color="#555555"
              fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: '2xl' }}
              marginTop="20px"
              paddingX={{ base: 2, md: 50 }}
            >
              GSH is purpose-built for the spatial world. With more than a decade of expertise, Kartoza has been at the forefront of FOSS software development, hosting, maintenance, and support.
            </Text>
            <Flex justify="center" align="center"
                  flexDirection={{ base: 'column', md: 'row' }}>
              <Img
                src={'/static/images/landing_main_image.svg'}
                width={{ base: '620px', md: '620px', xl: '700px' }}
                mb={{ base: 4, md: 0 }}
                mr={{ base: 0, md: 4 }}
              />
            </Flex>
            <Container maxW="container.lg">
              <Text
                color="gray.700"
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: '4xl' }}
                marginTop="20px"
                fontWeight="bold"
                paddingX={{ base: 2, md: 50 }}
              >
                Professional GeoSpatial hosting for open-source GIS web
                applications.
              </Text>
            </Container>
            <Wrap spacing="30px" marginY="50px" justify="center" overflowX='visible'>
              <Suspense fallback={<LoadingSpinner/>}>
                {loading && <LoadingSpinner/>}
                {error && <Text color="red.500">{error}</Text>}
                {!loading &&
                  products.map((product) => (
                    <WrapItem key={product.id}>
                      <ProductCard
                        image={product.image}
                        title={product.name}
                        description={product.description}
                        comingSoon={!product.available}
                        onClick={() => handleProductClick(product)}
                        selected={selectedProduct ? selectedProduct.id === product.id : false}
                      />
                    </WrapItem>
                  ))}
              </Suspense>
            </Wrap>
            <HostingPlans/>
            <FeaturesGrid/>
            
            <Container maxW="container.lg">
              <Text
                color="gray.700"
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: '4xl' }}
                marginTop="20px"
                fontWeight="bold"
                paddingX={{ base: 2, md: 50 }}
              >
                Need a Custom Solution?
              </Text>
              <Text
                color="#555555"
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: 'xl' }}
                marginTop="20px"
                paddingX={{ base: 2, md: 50 }}
              >
                We’ll help design, setup and deploy the right GeoSpatial solution for your needs.
              </Text>
              <Button 
                background="#ECB44B" 
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: 'xl' }}
                onClick={() => {
                  window.open("https://kartoza.com/contact-us/new")
                }}
              >
                Contact Us
              </Button>
            </Container>
          </Container>
        </Box>
        <Suspense fallback={<LoadingSpinner/>}>
          <Footer/>
        </Suspense>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;
