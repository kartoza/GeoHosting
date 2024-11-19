import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { Box, Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import Pagination from '../../../components/Pagination/Pagination';
import DashboardTitle from "../../../components/DashboardPage/DashboardTitle";
import TopNavigation from "../../../components/DashboardPage/TopNavigation";
import { fetchTickets } from "../../../redux/reducers/supportSlice";

const stripHtmlTags = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const SupportList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rowsPerPage = 10;
  const {
    listData,
    loading,
    error
  } = useSelector((state: RootState) => state.support);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(
      fetchTickets('/api/tickets/?page_size=' + rowsPerPage)
    );
  }, [dispatch]);

  if (loading) {
    return (
      <Box display={'flex'} justifyContent={'center'} width={'100%'}
           height={'100%'} alignItems={'center'}>
        <Spinner size='xl'/>
      </Box>
    );
  }

  if (error) {
    return <Box color='red'>{error.toString()}</Box>;
  }

  const data = listData?.results

  return (
    <Box>
      <Box minHeight={{ base: 'auto', md: '80vh' }}>

        {/* Dashboard title */}
        <DashboardTitle title={'Orders'}/>

        {/* Top navigation of dashboard */}
        <TopNavigation
          onSearch={setSearchTerm} placeholder='Search by Order ID'
        />

        <Box mt={4}>
          {
            loading && <Text>Loading...</Text>
          }
          {
            !loading && (
              <Box>
                {
                  data.map((ticket) => (
                    <Box
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
                        <Text fontWeight="bold"
                              fontSize="lg">{ticket.subject}</Text>
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
                  ))
                }
              </Box>
            )
          }
        </Box>


      </Box>
      {/* Pagination */}
      <Flex justifyContent="center" mt={4}>
        <Pagination
          totalItems={listData.count}
          itemsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Flex>
    </Box>
  );
};

export default SupportList;
