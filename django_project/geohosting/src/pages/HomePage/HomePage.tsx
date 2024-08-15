import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Img,
  Spinner,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import Navbar from '../../components/Navbar/Navbar';
import ProductCard from "../../components/ProductCard/ProductCard";
import GeonodeIcon from '../../assets/images/GeoNode.svg';
import customTheme from "../../theme/theme";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {fetchProducts, Product, fetchProductDetail, Package} from "../../redux/reducers/productsSlice";
import Background from "../../components/Background/Background";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, detailLoading, detailError, productDetail } = useSelector((state: RootState) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/app/${product.name}`);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex direction="column" minHeight="100vh">
        <Box flex="1">
          <Navbar />
          <Background />
          <Container maxW='container.xl' textAlign="center" mt="80px" mb="80px" bg="transparent">
            <Flex justify="center" align="center" flexDirection={{ base: 'column', md: 'row' }}>
              <Img src={'/static/images/logos/geohosting.svg'} width={{ base: '120px', md: '120px', xl: '200px' }} mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }}/>
              <Box textAlign={{ base: 'center', md: 'left' }}>
                <Heading as="h1" fontSize={{ base: '5xl', md: '6xl', xl: '7xl' }} fontWeight="500" color="blue.500">
                  GeoSpatialHosting
                </Heading>
                <Text fontSize={{ base: '20px', md: '2xl', xl: '3xl' }} color="blue.500">
                  YOUR ONLINE GEOSPATIAL WORKSPACE
                </Text>
              </Box>
            </Flex>
            <Container maxW='container.lg'>
              <Text color="gray.700" fontSize={{ base: 'xl', md: '2xl', xl: '3xl' }} marginTop="20px" fontWeight="bold" paddingLeft={50} paddingRight={50}>
                Professional GeoSpatial hosting for open-source GIS web applications.
              </Text>
            </Container>
            <Wrap spacing="30px" marginTop="50px" justify="center">
              {loading && <Spinner size='xl' />}
              {error && <Text color="red.500">{error}</Text>}
              {!loading && products.map((product) => (
                <WrapItem key={product.id}>
                  <ProductCard
                    image={product.image ? product.image : GeonodeIcon}
                    title={product.name}
                    description={product.description}
                    comingSoon={!product.available}
                    onClick={() => handleProductClick(product)}
                    selected={selectedProduct ? (selectedProduct.id == product.id) : false}
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Container>
        </Box>
        <Footer/>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;
