import React, { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  keyframes,
  Link,
  Link as ChakraLink,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import { PaginationPage } from "../PaginationPage";
import {
  fetchUserInstances,
  Instance,
} from "../../../redux/reducers/instanceSlice";
import { FaLink } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg)
  }
`;

let currentIds: number[] = [];
const spinAnimation = `${spin} infinite 2s linear`;

interface CardProps {
  instance: Instance;
}

// Render instance status
export const RenderInstanceStatus = ({ instance }) => {
  switch (instance.status) {
    case "Offline":
    case "Deleted":
      return (
        <Box
          backgroundColor="red.500"
          borderColor="red.700"
          borderWidth="1px"
          borderRadius="4px"
          color="white"
          px={4}
        >
          <Text>{instance.status}</Text>
        </Box>
      );
    case "Online":
      return (
        <Box
          backgroundColor="green.500"
          borderColor="green.700"
          borderWidth="1px"
          borderRadius="4px"
          color="white"
          px={4}
        >
          <Text>Online</Text>
        </Box>
      );
    default:
      return (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          backgroundColor="gray.100"
          borderColor="gray.200"
          borderWidth="1px"
          borderRadius="4px"
          px={4}
        >
          <Box
            animation={spinAnimation}
            width="fit-content"
            height="fit-content"
          >
            <FaGear />
          </Box>
          <Text>{instance.status}</Text>
        </Box>
      );
  }
};

/** Card for support **/
const Card: React.FC<CardProps> = ({ instance }) => {
  const navigate = useNavigate();
  const columns = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Box
      key={instance.id}
      borderWidth="1px"
      borderRadius="lg"
      position="relative"
      p={6}
      width={{ base: "100%", md: "320px" }}
      style={{ transition: "margin .1s ease" }}
      _hover={{
        cursor: "pointer",
        margin: "-3px 3px 3px -3px",
      }}
      bg="white"
      boxShadow="lg"
      onClick={(e) => {
        navigate("/dashboard/instances/" + instance.name);
      }}
    >
      {/* Logo and Switch */}
      <Flex justify="space-between" mb={4}>
        <Image
          src={instance.product.image}
          alt={`${instance.product.name} logo`}
          boxSize="80px"
          borderRadius="full"
        />
        <Box paddingTop={2}>
          {/* TODO: We enable this after the feature has been developed*/}
          {/*<Switch*/}
          {/*  size="lg"*/}
          {/*  colorScheme={instance.isActive ? "blue" : "red"}*/}
          {/*  isChecked={instance.isActive}*/}
          {/*  onChange={() => toggleStatus(instance.id)}*/}
          {/*  mr={2}*/}
          {/*/>*/}
          <Box>
            <Flex align="center" gap={1}>
              <RenderInstanceStatus instance={instance} />
            </Flex>
          </Box>
        </Box>
      </Flex>

      {/* Package name and Edit Icon */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text
          fontWeight="bold"
          isTruncated
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {["Online", "Offline"].includes(instance.status) && instance.url ? (
            <Link href={instance.url} target="_blank">
              <Flex
                wrap="wrap"
                gap={1}
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                color="blue.500"
              >
                <FaLink /> {instance.name}
              </Flex>
            </Link>
          ) : (
            instance.name
          )}
        </Text>
        {/* TODO: We enable this after the feature has been developed*/}
        {/*<IconButton*/}
        {/*  aria-label="Edit instance"*/}
        {/*  icon={<EditIcon/>}*/}
        {/*  onClick={() => console.log(`Edit instance ${instance.id}`)}*/}
        {/*  color="blue.500"*/}
        {/*  size="sm"*/}
        {/*/>*/}
      </Flex>

      {/* Package details */}
      {instance.package.feature_list?.spec && (
        <Grid templateColumns={`repeat(${columns}, 1fr)`}>
          {instance.package.feature_list.spec.map(
            (feature: string, idx: number) => (
              <GridItem key={idx}>
                <Text fontSize="sm" textAlign={idx % 2 != 0 ? "right" : "left"}>
                  {feature}
                </Text>
              </GridItem>
            ),
          )}
        </Grid>
      )}
      {!["Deleting", "Deleted"].includes(instance.status) &&
        !instance.subscription?.is_active &&
        !instance.subscription?.is_waiting_payment &&
        instance.subscription?.current_expiry_at && (
          <Box
            width="100%"
            backgroundColor="yellow.50"
            mt={4}
            border="1px solid"
            borderColor="yellow.100"
            color="yellow.600"
            p={2}
            fontSize={14}
            justifyContent="center"
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            This subscription has been cancelled, and the instance is scheduled
            for deletion on {instance.subscription?.current_expiry_at}.
          </Box>
        )}
      {!instance.subscription?.is_active &&
        instance.subscription?.is_waiting_payment &&
        instance.subscription?.current_expiry_at && (
          <Box
            width="100%"
            backgroundColor="yellow.50"
            mt={4}
            border="1px solid"
            borderColor="yellow.100"
            color="yellow.600"
            p={2}
            fontSize={14}
            justifyContent="center"
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            Unable to process subscription payment, please click here to check
            the instance detail and update payment button or the instance is
            scheduled for deletion on {instance.subscription?.current_expiry_at}
            .
          </Box>
        )}
    </Box>
  );
};

const renderCards = (instances: Instance[]) => {
  currentIds = instances.map((instance) => instance.id);
  return (
    <Flex
      wrap="wrap"
      justify="flex-start"
      gap={6}
      direction={{ base: "column", md: "row" }}
      mb={8}
    >
      {instances.map((instance: Instance) => {
        return <Card key={instance.name} instance={instance} />;
      })}
    </Flex>
  );
};

/** Service List Page in pagination */
const ServiceList: React.FC = () => {
  const [filters, setFilters] = useState({
    status: "",
  });
  return (
    <>
      <PaginationPage
        url="/api/instances/"
        action={fetchUserInstances}
        stateKey="instance"
        searchPlaceholder="Search by name"
        renderCards={renderCards}
        additionalFilters={filters}
        leftNavigation={
          <Select
            placeholder="Filter by status"
            backgroundColor="white"
            width={250}
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
          >
            <option value="Deploying">Deploying</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </Select>
        }
        autoRefresh={5}
        noDataText={
          <Box>
            Looks like you don’t have any active instances yet. You can get
            started by buying one
            <ChakraLink
              as={RouterLink}
              to="/"
              fontSize="md"
              target="_blank"
              ml={1}
              color={"blue.600"}
            >
              here
            </ChakraLink>
            .
          </Box>
        }
      />
    </>
  );
};

export default ServiceList;
