import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchUserInstanceDetail,
  Instance
} from "../../../redux/reducers/instanceSlice";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Link,
  Spinner,
  Table,
  Td,
  Tr
} from "@chakra-ui/react";
import { RenderInstanceStatus } from "./ServiceList";
import { FaLink } from "react-icons/fa";
import { DeleteInstance } from "./Delete";
import { FaCcStripe } from "react-icons/fa6";
import StripePaymentChangesModal
  from "../../../components/PaymentChanges/Stripe";

/** Service Detail Page in pagination */
const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);
  const [instance, setInstance] = useState<Instance | null>(null);
  const paymentChangesModalRef = useRef(null);
  const isWaitingPayment = instance && instance?.subscription && instance?.subscription?.is_waiting_payment;

  const {
    data,
    loading,
    error
  } = useSelector((state: RootState) => state.instance.detail);

  const refresh = () => {
    setTimeout(() => {
      setLastRequest(new Date())
      refresh()
    }, 5000);
  }

  /** Do refresh */
  useEffect(() => {
    setInstance(null)
    refresh()
  }, []);

  /** Save instance instance */
  useEffect(() => {
    if (lastRequest && data?.status !== instance?.status) {
      setInstance(data)
    } else if (!lastRequest) {
      setLastRequest(new Date())
    }
  }, [data]);

  useEffect(() => {
    if (id && token) {
      dispatch(fetchUserInstanceDetail(id));
    }
  }, [dispatch, id, token, lastRequest]);

  const PaymentStatus = () => {
    if (!instance) {
      return null
    }
    if (isWaitingPayment) {
      return <>
        We were unable to process your subscription payment. Please update your
        payment information to avoid service interruption.
        (End of subscription at {instance?.subscription?.current_period_end}).
        <Button
          display={'block'}
          mt={4} leftIcon={<FaCcStripe/>} mr={1}
          colorScheme='blue'
          size="lg"
          onClick={
            //@ts-ignore
            () => paymentChangesModalRef?.current?.open()
          }
        >
          Update payment
        </Button>

      </>
    } else if (instance.subscription && !instance.subscription?.is_active) {
      return <>
        Your subscription has been canceled
        (End of subscription at {instance.subscription.current_period_end})
      </>
    } else if (instance.subscription?.current_period_end) {
      return <>
        Your next payment
        is {instance.subscription?.current_period_end}
      </>
    } else {
      return <>
        No subscription was found for this instance.
        Please contact us for assistance with this issue.
      </>
    }
  }

  if (loading && !instance) {
    return (
      <Box
        top={0}
        left={0}
        position='absolute'
        display='flex'
        justifyContent='center'
        width='100%'
        height='100%'
        alignItems='center'
      >
        <Spinner size='xl'/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        top={0}
        left={0}
        position='absolute'
        display='flex'
        justifyContent='center'
        width='100%'
        height='100%'
        alignItems='center'
        color='red'
      >
        There is error when fetching data
      </Box>
    );
  }

  if (!instance) {
    return (
      <Box
        top={0}
        left={0}
        position='absolute'
        display='flex'
        justifyContent='center'
        width='100%'
        height='100%'
        alignItems='center'
      >
        No instance found
      </Box>
    );
  }

  return <Box>
    <Flex
      wrap="wrap"
      justify="flex-start" gap={6}
      width={{ base: "100%", xl: "75%", "2xl": "50%" }}
      mb={6}
    >
      <Box
        flex="1"
        borderWidth="1px"
        borderRadius="lg"
        position="relative"
        bg="white"
        boxShadow="lg"
      >
        <Table>
          <tbody>
          <Tr>
            <Td px={4} fontWeight={600}>Status:</Td>
            <Td px={4}>
              <Flex align='center' gap={1}>
                <RenderInstanceStatus instance={instance}/>
              </Flex>
            </Td>
          </Tr>
          <Tr>
            <Td px={4} fontWeight={600}>Product name:</Td>
            <Td px={4}>{instance.name}</Td>
          </Tr>
          <Tr>
            <Td px={4} fontWeight={600}>Creation date:</Td>
            <Td px={4}>{instance.created_at.split('T')[0]}</Td>
          </Tr>

          {
            ['Online', 'Offline'].includes(instance.status) && instance.url ?
              <Tr>
                <Td px={4} fontWeight={600} colSpan={2}>
                  <Link href={instance.url} target='_blank'>
                    <Flex
                      wrap="wrap" gap={1}
                      direction={{ base: 'column', md: 'row' }}
                      alignItems='center'
                      color='teal'
                    >
                      <FaLink/> {instance.name}
                    </Flex>
                  </Link>
                </Td>
              </Tr> : null
          }
          </tbody>
        </Table>
      </Box>
      <Box
        width='auto'
        borderWidth="1px"
        borderRadius="lg"
        position="relative"
        bg="white"
        boxShadow="lg"
      >
        <Table>
          <tbody>
          <Tr>
            <Td px={4} fontWeight={600}>Features</Td>
          </Tr>
          {
            instance.package.feature_list?.spec && instance.package.feature_list.spec.map(
              (feature: string, idx: number) => <Tr key={idx}><Td
                px={4}>{feature}</Td></Tr>
            )
          }
          </tbody>
        </Table>
      </Box>
    </Flex>
    <Flex
      wrap="wrap"
      justify="flex-start" gap={6}
      width={{ base: "100%", xl: "75%", "2xl": "50%" }}
    >
      <Box
        flex="1"
        borderWidth="1px"
        borderRadius="lg"
        position="relative"
        bg="white"
        boxShadow="lg"
      >
        <Table>
          <tbody>
          <Tr>
            <Td px={4} fontWeight={600} colSpan={2}>Payments</Td>
          </Tr>
          <Tr>
            <Td px={4} fontWeight={600}>Method:</Td>
            <Td px={4}>{instance.sales_order.payment_method}</Td>
          </Tr>
          <Tr>
            <Td px={4} colSpan={2}>
              <PaymentStatus/>
            </Td>
          </Tr>
          </tbody>
        </Table>
      </Box>
    </Flex>
    {
      ['Online', 'Offline'].includes(instance.status) &&
      <DeleteInstance instanceInput={instance}/>
    }
    {
      isWaitingPayment &&
      <StripePaymentChangesModal
        instance={instance} ref={paymentChangesModalRef}/>
    }
  </Box>
};

export default ServiceDetail;
