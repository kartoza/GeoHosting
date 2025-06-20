import React, { useEffect, useRef, useState } from "react";
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
import SubscriptionDetail from "../../../components/Subscription/Detail";
import InstanceCredential from "../../../components/Instance/Credential";

/** Service Detail Page in pagination */
const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);
  const [instance, setInstance] = useState<Instance | null>(null);
  const isWaitingPayment =
    instance &&
    instance?.subscription &&
    instance?.subscription?.is_waiting_payment;
  const paymentModalRef = useRef(null);

  const isReady =
    instance && ["Online", "Offline"].includes(instance.status) && instance.url;

  const { data, loading, error } = useSelector(
    (state: RootState) => state.instance.detail,
  );

  const refresh = () => {
    setTimeout(() => {
      setLastRequest(new Date());
      refresh();
    }, 5000);
  };

  /** Do refresh */
  useEffect(() => {
    setInstance(null);
    refresh();
  }, []);

  /** Save instance instance */
  useEffect(() => {
    if (lastRequest && data?.status !== instance?.status) {
      setInstance(data);
    } else if (!lastRequest) {
      setLastRequest(new Date());
    }
  }, [data]);

  useEffect(() => {
    if (id && token) {
      dispatch(fetchUserInstanceDetail(id));
    }
  }, [dispatch, id, token, lastRequest]);

  const PaymentStatus = () => {
    if (!instance) {
      return null;
    }
    if (isWaitingPayment) {
      return (
        <>
          We were unable to process your subscription payment. Please update
          your payment information or the instance is scheduled for deletion on{" "}
          {instance.subscription?.current_expiry_at}.
        </>
      );
    } else if (instance.subscription && !instance.subscription?.is_active) {
      return (
        <>
          Your subscription has been canceled (End of subscription at{" "}
          {instance.subscription.current_period_end})
        </>
      );
    } else if (instance.subscription?.current_period_end) {
      return (
        <>Your next payment is {instance.subscription?.current_period_end}</>
      );
    } else {
      return (
        <>
          No subscription was found for this instance. Please contact us for
          assistance with this issue.
        </>
      );
    }
  };

  if (loading && !instance) {
    return (
      <Box
        top={0}
        left={0}
        position="absolute"
        display="flex"
        justifyContent="center"
        width="100%"
        height="100%"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        top={0}
        left={0}
        position="absolute"
        display="flex"
        justifyContent="center"
        width="100%"
        height="100%"
        alignItems="center"
        color="red"
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
        position="absolute"
        display="flex"
        justifyContent="center"
        width="100%"
        height="100%"
        alignItems="center"
      >
        No instance found
      </Box>
    );
  }

  return (
    <Box>
      <Flex
        wrap="wrap"
        justify="flex-start"
        gap={6}
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
                <Td className="table-title">Status:</Td>
                <Td px={4}>
                  <Flex align="center" gap={1}>
                    <RenderInstanceStatus instance={instance} />
                  </Flex>
                </Td>
              </Tr>
              <Tr>
                <Td className="table-title">Product:</Td>
                <Td px={4}>{instance.product.name}</Td>
              </Tr>
              <Tr>
                <Td className="table-title">Product name:</Td>
                <Td px={4}>{instance.name}</Td>
              </Tr>
              <Tr>
                <Td className="table-title">Creation date:</Td>
                <Td px={4}>{instance.created_at.split("T")[0]}</Td>
              </Tr>
            </tbody>
          </Table>
        </Box>
        <Box
          width="auto"
          borderWidth="1px"
          borderRadius="lg"
          position="relative"
          bg="white"
          boxShadow="lg"
        >
          <Table>
            <tbody>
              <Tr>
                <Td className="table-title">Features</Td>
              </Tr>
              {instance.package.feature_list?.spec &&
                instance.package.feature_list.spec.map(
                  (feature: string, idx: number) =>
                    feature && (
                      <Tr key={idx}>
                        <Td px={4}>{feature}</Td>
                      </Tr>
                    ),
                )}
            </tbody>
          </Table>
        </Box>
      </Flex>

      <Flex
        wrap="wrap"
        justify="flex-start"
        gap={6}
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
                <Td className="table-title">Applications</Td>
                <Td className="table-title">Username</Td>
              </Tr>
              {instance.applications?.map((application) => {
                return (
                  <Tr>
                    {isReady ? (
                      <>
                        <Td>
                          <Link href={application.url} target="_blank">
                            <Flex
                              wrap="wrap"
                              gap={1}
                              direction={{ base: "column", md: "row" }}
                              alignItems="center"
                              color="teal"
                            >
                              <FaLink /> {application.name}
                            </Flex>
                          </Link>
                        </Td>
                        <Td>{application.username}</Td>
                      </>
                    ) : (
                      <Td>{application.name}</Td>
                    )}
                    <Td>
                      <InstanceCredential
                        instance={instance}
                        product={application.upstream_id}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Box>
      </Flex>

      <Flex
        wrap="wrap"
        justify="flex-start"
        gap={6}
        width={{ base: "100%", xl: "75%", "2xl": "50%" }}
      >
        <Box
          flex="1"
          borderWidth="1px"
          borderRadius="lg"
          position="relative"
          bg="white"
          boxShadow="lg"
          p={8}
        >
          <PaymentStatus />
          <Box>
            <Button
              display={"block"}
              mt={4}
              width={"100%"}
              colorScheme="blue"
              onClick={
                //@ts-ignore
                () => paymentModalRef?.current?.open()
              }
            >
              Payment detail
            </Button>
          </Box>
        </Box>
      </Flex>
      {["Online", "Offline"].includes(instance.status) && (
        <DeleteInstance instanceInput={instance} />
      )}
      {instance.subscription && (
        <SubscriptionDetail
          subscription_id={instance.subscription.id}
          ref={paymentModalRef}
        />
      )}
    </Box>
  );
};

export default ServiceDetail;
