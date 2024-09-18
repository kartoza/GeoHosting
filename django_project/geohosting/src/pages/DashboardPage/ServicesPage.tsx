import React, { useEffect, useState } from 'react';
import { Box, Spinner, Image, Text, Input, FormControl, FormLabel, Flex, Switch, IconButton, Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchOrders } from '../../redux/reducers/ordersSlice';

import Geoserver from '../../assets/images/GeoServer.svg';
import Geonode from '../../assets/images/GeoNode.svg';

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const dispatch = useDispatch<AppDispatch>();

  const Placeholder = 'https://via.placeholder.com/60'

  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrders(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (orders) {
      // Filter orders based on search term
      const filtered = orders.filter((order: any) => 
        order.id.toString().includes(searchTerm) || 
        order.package.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm]);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredOrders.slice(indexOfFirstCard, indexOfLastCard);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredOrders.length / cardsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleStatus = (id: number) => {
    const updatedOrders = filteredOrders.map((order: any) => 
      order.id === id ? { ...order, isActive: !order.isActive } : order
    );
    setFilteredOrders(updatedOrders);
  };

  // Function to determine the correct image based on package name
  const getImageForPackage = (packageName: string) => {
    if (packageName.toLowerCase().includes('geoserver')) {
      return Geoserver;
    } else if (packageName.toLowerCase().includes('geonode')) {
      return Geonode;
    } else {
      return Placeholder;
    }
  };

  return (
    <Box p={5} display="flex" flexDirection="column">
      {/* Search bar */}
      <FormControl mb={4}>
        <FormLabel>Search Services</FormLabel>
        <Input 
          placeholder="Search by domain, name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {loading ? <Spinner /> : error ? <Text>Error loading orders</Text> : (
        <>
          {/* Cards */}
          <Flex wrap="wrap" justify="flex-start" gap={6}
            direction={{ base: 'column', md: 'row' }}
          >
            {currentCards.map((order: any) => (
              <Box 
                key={order.id} 
                borderWidth="1px" 
                borderRadius="lg" 
                p={6} 
                width={{ base: "100%", md: "320px" }}
                bg="white" 
                boxShadow="lg"
              >
                {/* Logo and Switch */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Image 
                    src={getImageForPackage(order.package.name)} 
                    alt={`${order.package.name} logo`} 
                    boxSize="80px" 
                    borderRadius="full" 
                  />
                  <Flex align="center">
                    <Switch
                      size="lg"
                      colorScheme={order.isActive ? "blue" : "red"}
                      isChecked={order.isActive}
                      onChange={() => toggleStatus(order.id)}
                      mr={2}
                    />
                  </Flex>
                </Flex>

                {/* Package name and Edit Icon */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold" isTruncated>{order.package.name}</Text>
                  <IconButton 
                    aria-label="Edit package" 
                    icon={<EditIcon />} 
                    onClick={() => console.log(`Edit order ${order.id}`)}
                    color="blue.500" 
                    size="sm"
                  />
                </Flex>

                {/* Package details */}
                <Flex justify="space-between">
                <Text fontSize="sm">
                  Storage: {order.package.feature_list.spec[0].split(' ')[0]}
                </Text>
                <Text fontSize="sm" textAlign="right">
                  Memory: {order.package.feature_list.spec[2].split(' ')[1]}
                </Text>
              </Flex>

              {/* CPU */}
              <Text fontSize="sm" mt={2}>
                CPUs: {order.package.feature_list.spec[1].split(' ')[2]}
              </Text>

              </Box>
            ))}
          </Flex>

          {/* Pagination controls */}
          <Flex justify="space-between" align="center" mt="auto" py={6} width="100%">
            {/* Back button aligned to the left */}
            <Button 
              onClick={handlePrevPage} 
              isDisabled={currentPage === 1} 
              colorScheme="orange"
              _disabled={{ bg: 'orange.300', cursor: 'not-allowed' }}
            >
              Back
            </Button>

            {/* Page numbers centered */}
            <Flex justify="center" flex="1">
              {Array.from({ length: Math.ceil(filteredOrders.length / cardsPerPage) }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  bg={currentPage === index + 1 ? "orange" : "transparent"}
                  color={currentPage === index + 1 ? "white" : "black"} 
                  border="1px solid" 
                  borderColor={currentPage === index + 1 ? "orange" : "gray"}
                  _hover={{ bg: currentPage === index + 1 ? "orange" : "gray.100" }}
                  mx={1}
                >
                  {index + 1}
                </Button>
              ))}
            </Flex>

            {/* Next button aligned to the right */}
            <Button 
              onClick={handleNextPage} 
              isDisabled={currentPage === Math.ceil(filteredOrders.length / cardsPerPage)} 
              colorScheme="orange"
              _disabled={{ bg: 'orange.300', cursor: 'not-allowed' }}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default ServicesPage;
