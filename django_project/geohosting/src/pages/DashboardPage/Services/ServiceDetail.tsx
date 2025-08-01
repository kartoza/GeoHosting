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
  Image,
  Link,
  Spinner,
  Table,
  Td,
  Tr
} from "@chakra-ui/react";
import { RenderInstanceStatus } from "./ServiceList";
import { FaLink } from "react-icons/fa";
import SubscriptionDetail from "../../../components/Subscription/Detail";
import InstanceCredential from "../../../components/Instance/Credential";
import { formatDateDMY, packageName } from "../../../utils/helpers";
import { DeleteInstance } from "./Delete";
import { ServiceOrders } from "./ServiceOrder";

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

  const { data, loading, error } = useSelector(
    (state: RootState) => state.instance.detail,
  );
  const notFound = error === "No Instance matches the given query.";

  const specification = instance?.package?.package_group?.specification;

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
        <>
          Your next payment is{" "}
          {instance.subscription?.current_period_end
            ? formatDateDMY(instance.subscription.current_period_end)
            : "–"}
        </>
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

  if (notFound) {
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
        No product found for this name.
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
  const Notification = () => {
    if (!["Deploying", "Starting Up", "Deleting"].includes(instance.status)) {
      return null;
    }
    return (
      <Box
        backgroundColor="gray.200"
        borderColor="gray.300"
        textAlign="center"
        borderWidth={1}
        borderRadius={4}
        color="orange.500"
        px={8}
        py={4}
        mb={4}
      >
        {instance.status === "Deploying" && (
          <Box>Hang in there, we're spinning things up for you!</Box>
        )}
        {instance.status === "Starting Up" && (
          <Box>We’re setting things up for you. Almost there!</Box>
        )}
        {instance.status === "Deleting" && (
          <Box>
            Deleting your instance now. We’ll let you know once it’s fully
            removed.
          </Box>
        )}
      </Box>
    );
  };
  return (
    <Box width={{ base: "100%", xl: "75%", "2xl": "50%" }}>
      <Notification />
      <Box px={4} mb={2} display="flex" alignItems="end" gap={4}>
        <Box fontSize="2xl" fontWeight="bold" color={"#3e3e3e"}>
          Product Information
        </Box>
        <Flex mb="3px">
          <RenderInstanceStatus instance={instance} />
        </Flex>
      </Box>
      <Box height="2px" bg="blue.500" width="100%" mb={4} />
      <Box px={4}>
        <Flex align="flex-start" justifyContent="space-between">
          <Box>
            <Link href={instance.url} target="_blank">
              <Flex
                wrap="wrap"
                gap={1}
                alignItems="center"
                color="blue.500"
                mb={4}
              >
                <FaLink /> {instance.url}
              </Flex>
            </Link>
            <Table variant="noline" width="auto">
              <tbody>
                <Tr>
                  <Td className="table-title" paddingLeft={0} paddingRight={8}>
                    Product:
                  </Td>
                  <Td>
                    {instance.product.name} {packageName(instance.package)}
                  </Td>
                </Tr>
                <Tr>
                  <Td className="table-title" paddingLeft={0} paddingRight={8}>
                    Product name:
                  </Td>
                  <Td>{instance.name}</Td>
                </Tr>
                <Tr>
                  <Td className="table-title" paddingLeft={0} paddingRight={8}>
                    Creation date:
                  </Td>
                  <Td>
                    {instance.created_at
                      ? formatDateDMY(instance.created_at)
                      : "–"}
                  </Td>
                </Tr>
                {instance.applications?.map((application) => {
                  return (
                    <Tr>
                      <Td paddingLeft={0} paddingRight={8}>
                        <Link href={application.url} target="_blank">
                          <Flex
                            wrap="wrap"
                            gap={1}
                            direction={{ base: "column", md: "row" }}
                            color="blue.500"
                          >
                            <FaLink /> {application.name}
                          </Flex>
                        </Link>
                      </Td>
                      <Td>
                        <Box display="flex" gap={2}>
                          <InstanceCredential
                            instance={instance}
                            product={application.upstream_id}
                          />
                          <Box>(username: {application.username})</Box>
                        </Box>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
          >
            <Image
              src={instance.product.image}
              alt={`${instance.product.name} logo`}
              boxSize="120px"
              borderRadius="full"
            />
          </Box>
        </Flex>
      </Box>

      {/* Features */}
      <Box
        fontSize="2xl"
        fontWeight="bold"
        mt={4}
        px={4}
        mb={2}
        color={"#3e3e3e"}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>Features</Box>
      </Box>
      <Box height="2px" bg="blue.500" width="100%" mb={4} />
      <Box px={4}>
        {instance.package.feature_list?.spec &&
          instance.package.feature_list.spec.map(
            (feature: string, idx: number) =>
              feature && <Box mb={4}>{feature}</Box>,
          )}
      </Box>

      {/* Specifications */}
      {specification && (
        <>
          <Box
            fontSize="2xl"
            fontWeight="bold"
            mt={8}
            px={4}
            mb={2}
            color={"#3e3e3e"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Specifications</Box>
          </Box>
          <Box height="2px" bg="blue.500" width="100%" mb={4} />
          <Box px={4}>
            {Object.entries(specification).map(([sectionKey, sectionValue]) => (
              <Box mb={4} key={sectionKey}>
                <Box mb={4}>
                  <b>{sectionKey}</b>
                </Box>
                <Box>
                  {Object.entries(sectionValue).map(([specKey, specValue]) => (
                    <Box
                      mb={4}
                      ml={4}
                      key={specKey}
                    >{`${specValue} ${specKey}`}</Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Payment Detail */}
      <Box
        fontSize="2xl"
        fontWeight="bold"
        mt={8}
        px={4}
        mb={2}
        color={"#3e3e3e"}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>Payment Detail</Box>
      </Box>
      <Box height="2px" bg="blue.500" width="100%" mb={4} />
      <Box px={4}>
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
            Payment Detail
          </Button>
        </Box>
        {instance.subscription && (
          <SubscriptionDetail
            subscription_id={instance.subscription.id}
            ref={paymentModalRef}
          />
        )}
      </Box>
      {/* Orders */}
      <>
        <Box
          fontSize="2xl"
          fontWeight="bold"
          mt={8}
          px={4}
          mb={2}
          color={"#3e3e3e"}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>Order Details</Box>
        </Box>
        <Box height="2px" bg="blue.500" width="100%" mb={4} />
        <Box px={4}>
          <Box>
            <ServiceOrders instance={instance} />
          </Box>
        </Box>
      </>
      {["Online", "Offline", "Starting Up"].includes(instance.status) && (
        <>
          <Box
            fontSize="2xl"
            fontWeight="bold"
            mt={8}
            px={4}
            mb={2}
            color={"#3e3e3e"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Delete product</Box>
          </Box>
          <Box height="2px" bg="blue.500" width="100%" mb={4} />
          <Box px={4}>
            <Box mt="-20px">
              <DeleteInstance instanceInput={instance} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ServiceDetail;
