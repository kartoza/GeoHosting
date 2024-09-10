import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, List, ListItem, Text, Tooltip } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Package, Product } from '../../redux/reducers/productsSlice';
import { formatPrice, packageName } from "../../utils/helpers";

export interface PackageProps {
  product: Product;
  pkg: Package;
}



const ProductPricing: React.FC<PackageProps> = ({ product, pkg }) => {
  const navigate = useNavigate();
  const available = product.available;

  const [convertedPrice, setConvertedPrice] = useState<string>(pkg.price);
  const [currency, setCurrency] = useState<string>(pkg.currency); 

  useEffect(() => {
    const getCurrencyBasedOnLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();
        const userCountry = locationData.country_code;

        let newCurrency = 'USD';
        if (userCountry === 'ZA') newCurrency = 'ZAR';
        else if (['AT', 'BE', 'FR', 'DE', 'IT', 'ES', 'NL', 'PT'].includes(userCountry)) newCurrency = 'EUR';

        setCurrency(newCurrency);
        await fetchNewPrice(newCurrency);

      } catch (error) {
        console.error('Error determining location or currency:', error);
      }
    };

    getCurrencyBasedOnLocation();
  }, [pkg.price]);

  async function fetchNewPrice(newCurrency: string) {
    // TODO fetch currency from ERP or use an API to convert price to location currency
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${newCurrency}`);
      const rates = await response.json();
      const exchangeRate = rates.rates[newCurrency] / rates.rates[pkg.currency];

      const convertedAmount = parseFloat(pkg.price) * exchangeRate;
      setConvertedPrice(convertedAmount.toFixed(2));

    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
    throw new Error('Function not implemented.');
  }

  const handleCheckout = () => {
    localStorage.setItem('selectedProduct', JSON.stringify({ product, pkg }));
    navigate('/checkout', { state: { product, pkg } });
  };

  return (
    <Box
      key={pkg.id}
      height={475}
      backgroundColor={'gray.200'}
      borderRadius={15}
      display={'flex'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      flexDirection="column"
      width={'100%'}
      boxShadow="0px 4px 6px rgba(0, 0, 0, 0.2)"
    >
      <Box
        backgroundColor={packageName(pkg) === 'Gold' ? 'customOrange.500' : 'blue.500'}
        textColor={'white'}
        width={'100%'}
        borderTopRadius={15}
        position="sticky"
        top="0"
        zIndex="1"
        pt={2}
        pb={2}
      >
        <Heading as="h4" fontSize={25} paddingTop={2} paddingBottom={2} textAlign="center" fontWeight={500}>
          {product.name} {packageName(pkg)}
        </Heading>
      </Box>
      <Box mt={10} mb={5}>
        <Box flexDirection={'row'} display={'flex'} alignItems={'end'}>
          <Text fontSize={{ base: '35', sm: '45', md: '32', xl: '45' }} fontWeight={'bold'} color={'gray.600'}>
            {formatPrice(convertedPrice, currency)}
          </Text>
        </Box>
      </Box>
      <Box mt={5} textAlign="center" width={{ base: "50%", md: '80%', xl: "50%" }} alignItems="center">
        <Text fontWeight={'bold'} fontSize={18}>
          {packageName(pkg)} Features
        </Text>
        <List spacing={2} mt={3} pl={5}>
          {pkg.feature_list &&
            pkg.feature_list['spec'] &&
            Object.entries(pkg.feature_list['spec']).map(([key, value]: any) => (
              <ListItem key={key} display="flex" alignItems="center">
                <CheckIcon color="blue.500" mr={2} /> {value}
              </ListItem>
            ))}
        </List>
      </Box>
      <Box mt={10} width="100%" pl={7} pr={7}>
        <Tooltip label="Product is not available" isDisabled={available}>
          <Button
            size={'xl'}
            width="100%"
            backgroundColor={packageName(pkg) === 'Gold' ? 'customOrange.500' : 'blue.500'}
            color={'white'}
            fontWeight={'bold'}
            paddingTop={5}
            paddingBottom={5}
            onClick={handleCheckout}
            _hover={{
              filter: 'brightness(1.1)',
              cursor: available ? 'pointer' : 'not-allowed'
            }}
            _disabled={{
              backgroundColor: packageName(pkg) === 'Gold' ? 'customOrange.500' : 'blue.500',
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
            transition="filter 0.3s ease"
            isDisabled={!available}
          >
            {`Get ${product.name} ${packageName(pkg)}`}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ProductPricing;

