import React, { useEffect, useState } from 'react';
import { Box, Spinner, Image, Text, Input, FormControl, FormLabel, Flex, Switch, IconButton, Button } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

// Dummy data for demonstration
const dummyOrders = [
  {
    id: 1,
    package: { name: 'Service A', domain: 'service-a.com', storage: '100GB', memory: '16GB', cpu: '8 Cores', logoUrl: 'https://via.placeholder.com/60' },
    order_status: 'active',
    isActive: true,
  },
];

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    // Filter orders based on search term
    const filtered = dummyOrders.filter((order) => 
      order.id.toString().includes(searchTerm) || 
      order.package.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm]);

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
    const updatedOrders = filteredOrders.map((order) => 
      order.id === id ? { ...order, isActive: !order.isActive } : order
    );
    setFilteredOrders(updatedOrders);
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

      {/* Cards */}
      <Flex wrap="wrap" justify="flex-start" gap={6}
        direction={{ base: 'column', md: 'row' }}
      >
        {currentCards.map((order) => (
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
                src={order.package.logoUrl} 
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

            {/* Domain and Edit Icon */}
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" isTruncated>{order.package.domain}</Text>
              <IconButton 
                aria-label="Edit domain" 
                icon={<EditIcon />} 
                onClick={() => console.log(`Edit order ${order.id}`)}
                color="blue.500" 
                size="sm"
              />
            </Flex>

            {/* Storage and Memory */}
            <Flex justify="space-between">
              <Text fontSize="sm">Storage: {order.package.storage}</Text>
              <Text fontSize="sm" textAlign="right">Memory: {order.package.memory}</Text>
            </Flex>

            {/* CPU on the second row */}
            <Text fontSize="sm" mt={2}>CPU: {order.package.cpu}</Text>
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
            bg={currentPage === index + 1 ? "orange.400" : "transparent"}
            color={currentPage === index + 1 ? "white" : "black"} 
            border="1px solid" 
            borderColor={currentPage === index + 1 ? "orange.400" : "gray"}
            _hover={{ bg: currentPage === index + 1 ? "orange.500" : "gray.100" }}
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
    </Box>
  );
};

export default ServicesPage;
