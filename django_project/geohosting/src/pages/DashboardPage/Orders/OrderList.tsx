import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../../redux/reducers/ordersSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Box, Spinner, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const OrdersList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrders(token));
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <Box display={'flex'} justifyContent={'center'} width={'100%'} height={'100%'} alignItems={'center'}>
        <Spinner size='xl' />
      </Box>
    );
  }

  if (error) {
    return <Box color='red'>{error}</Box>;
  }

  const handleRowClick = (id: string) => {
    navigate(`${id}`);
  };

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Package</Th>
            <Th>Status</Th>
            <Th>Payment Method</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order: any) => (
            <Tr 
              key={order.id} 
              onClick={() => handleRowClick(order.id)}
              style={{ cursor: 'pointer' }}
              _hover={{ bg: 'gray.100' }}
            >
              <Td>{order.id}</Td>
              <Td>{order.package.name}</Td>
              <Td>{order.order_status}</Td>
              <Td>{order.payment_method}</Td>
              <Td>{order.date}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrdersList;
