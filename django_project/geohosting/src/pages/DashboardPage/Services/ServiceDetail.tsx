import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchUserInstanceDetail,
  Instance
} from "../../../redux/reducers/instanceSlice";
import { useParams } from "react-router-dom";
import { Box, Flex, Link, Spinner, Table, Td, Tr } from "@chakra-ui/react";
import { RenderInstanceStatus } from "./ServiceList";
import { FaLink } from "react-icons/fa";
import { DeleteInstance } from "./Delete";

/** Service Detail Page in pagination */
const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [lastRequest, setLastRequest] = useState(new Date());
  const [instance, setInstance] = useState<Instance | null>(null);
  const {
    data,
    loading,
    error
  } = useSelector((state: RootState) => state.instance.detail);

  useEffect(() => {
    if (id && token) {
      dispatch(fetchUserInstanceDetail(id));
    }
  }, [dispatch, id, token, lastRequest]);

  const refresh = () => {
    setTimeout(() => {
      setLastRequest(new Date())
      refresh()
    }, 5000);
  }

  /** Do refresh */
  useEffect(() => {
    refresh()
  }, []);

  /** Save instance instance */
  useEffect(() => {
    setInstance(data)
  }, [data]);

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
                <Td px={4} fontWeight={600}>
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
          <Tr>
            <Td px={4} fontWeight={600}>Features</Td>
          </Tr>
          {
            instance.package.feature_list?.spec && instance.package.feature_list.spec.map(
              (feature: string, idx: number) => <Tr><Td
                px={4}>{feature}</Td></Tr>
            )
          }
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
          <Tr>
            <Td px={4} fontWeight={600}>Payments</Td>
          </Tr>
          <Tr>
            <Td px={4} fontWeight={600}>Method:</Td>
            <Td px={4}>{instance.sales_order.payment_method}</Td>
          </Tr>
        </Table>
      </Box>
    </Flex>
    <DeleteInstance instanceInput={instance}/>
  </Box>
};

export default ServiceDetail;
