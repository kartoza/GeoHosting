import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { fetchTickets, Ticket } from "../../../redux/reducers/supportSlice";
import { PagintationPage } from "../PaginationPage";

const stripHtmlTags = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/** Card for support **/
const Card = (ticket: Ticket) => {
  return <Box
    key={ticket.id}
    p={4}
    mb={4}
    bg={useColorModeValue('white', 'gray.700')}
    borderRadius="md"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.200', 'gray.600')}
    boxShadow="sm"
    position="relative"
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Text fontWeight="bold" fontSize="lg">
        {ticket.subject}
      </Text>
      <Flex alignItems="center" ml="auto" gap={2}>
        <Box
          width="12px"
          height="12px"
          bg={ticket.status === 'open' ? 'blue.500' : ticket.status === 'closed' ? 'red.500' : 'orange.500'}
          borderRadius="full"
        />
        <Text
          fontFamily="'Roboto', sans-serif"
          fontWeight="300"
          fontSize="16px"
          color={ticket.status === 'open' ? 'blue.500' : ticket.status === 'closed' ? 'red.500' : 'orange.500'}
        >
          {ticket.status === 'open' ? 'Open' : ticket.status === 'closed' ? 'Closed' : 'Pending'}
        </Text>
      </Flex>
    </Box>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Text>{stripHtmlTags(ticket.details)}</Text>
    </Box>
    <Text
      fontSize="sm"
      color="gray.500"
      mt={2}
    >
      Last
      updated: {new Date(ticket.updated_at).toLocaleDateString()}
    </Text>
  </Box>
}

/** Support List Page in pagination */
const SupportList: React.FC = () => {
  return (
    <PagintationPage
      title='Supports'
      url='/api/tickets/'
      action={fetchTickets}
      stateKey='support'
      searchPlaceholder='Search by Title'
      renderCard={Card}
    />
  );
};

export default SupportList;
