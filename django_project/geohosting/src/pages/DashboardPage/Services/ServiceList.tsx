import React, { useRef, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  keyframes,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaGear } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import { PaginationPage } from "../PaginationPage";
import {
  fetchUserInstances,
  Instance
} from "../../../redux/reducers/instanceSlice";
import { FaLink } from "react-icons/fa";
import { headerWithToken } from "../../../utils/helpers";
import { MdDelete, MdMoreVert } from "react-icons/md";
import InstanceDeletion from "../../../components/Instance/Deletion";
import { useNavigate } from "react-router-dom";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg)
  }
`;

let currentIds: number[] = []
const spinAnimation = `${spin} infinite 2s linear`;

interface CardProps {
  instance: Instance;
}

const DeleteCard: React.FC<CardProps> = ({ instance }) => {
  const modalRef = useRef(null);
  return <>
    <InstanceDeletion instance={instance} ref={modalRef}/>
    <MenuItem
      icon={<MdDelete/>}
      color="red.600"
      _hover={{ bg: "red.100" }}
      onClick={
        // @ts-ignore
        () => modalRef?.current?.open()
      }
    >
      Delete
    </MenuItem>
  </>
}

// Render instance status
export const RenderInstanceStatus = ({ instance }) => {
  switch (instance.status) {
    case 'Offline':
    case 'Deleted':
      return <>
        <Box
          width='16px'
          height='16px'
          backgroundColor="var(--chakra-colors-red-300)"
          borderRadius='50'
          border='1px solid var(--chakra-colors-gray-600)'
        />
        <Text>{instance.status}</Text>
      </>
    case 'Online':
      return <>
        <Box
          width='16px'
          height='16px'
          backgroundColor="var(--chakra-colors-green-300)"
          borderRadius='50'
          border='1px solid var(--chakra-colors-gray-600)'
        />
        <Text>Online</Text>
      </>
    default:
      return <>
        <Box
          animation={spinAnimation}
          width='fit-content'
          height='fit-content'
        >
          <FaGear/>
        </Box>
        <Text>{instance.status}</Text>
      </>
  }
}

/** Card for support **/
const Card: React.FC<CardProps> = ({ instance }) => {
  const navigate = useNavigate();
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const [fetchingCredentials, setFetchingCredentials] = useState<boolean>(false);

  /** Fetch credential **/
  const fetchCredentials = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fetchingCredentials) {
      return
    }
    setFetchingCredentials(true)
    try {
      const response = await axios.get(
        `/api/instances/${instance.name}/credential/`,
        {
          headers: headerWithToken()
        }
      );
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 4))
        .then(() => {
          toast.success(
            'Please ensure that you change your password within the application for security purposes.'
          );
          toast.success(
            'Your credentials have been successfully copied to the clipboard.'
          );
        })
        .catch(() => {
          toast.error('Failed to get credentials, please retry.');
        });
    } catch (err) {
      toast.error('Failed to get credentials, please retry.');
    }
    setFetchingCredentials(false)
  }

  return <Box
    key={instance.id}
    borderWidth="1px"
    borderRadius="lg"
    position="relative"
    p={6}
    width={{ base: "100%", md: "320px" }}
    style={{ transition: "margin .1s ease" }}
    _hover={{
      cursor: "pointer",
      margin: "-3px 3px 3px -3px"
    }}
    bg="white"
    boxShadow="lg"
    onClick={(e) => {
      navigate('/dashboard/instances/' + instance.name)
    }}
  >
    {
      ['Online', 'Offline'].includes(instance.status) &&
      <Box
        position='absolute'
        top={0}
        left={0}
      >
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MdMoreVert/>}
            variant="ghost"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            padding={0}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <MenuList
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DeleteCard instance={instance}/>
          </MenuList>
        </Menu>
      </Box>
    }
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
          <Flex align='center' gap={1}>
            <RenderInstanceStatus instance={instance}/>
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
        {
          ['Online', 'Offline'].includes(instance.status) && instance.url ?
            <Link href={instance.url} target='_blank'>
              <Flex
                wrap="wrap" gap={1}
                direction={{ base: 'column', md: 'row' }}
                alignItems='center'
                color='teal'
              >
                <FaLink/> {instance.name}
              </Flex>
            </Link> :
            instance.name
        }
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
    {
      instance.package.feature_list?.spec && (
        <Grid templateColumns={`repeat(${columns}, 1fr)`}>
          {
            instance.package.feature_list.spec.map(
              (feature: string, idx: number) => <GridItem key={idx}>
                <Text fontSize="sm"
                      textAlign={idx % 2 != 0 ? 'right' : 'left'}>
                  {feature}
                </Text>
              </GridItem>
            )
          }
        </Grid>
      )
    }
    {
      ['Online', 'Offline'].includes(instance.status) &&
      <Box
        width='100%' color='yellow.500' mt={4} justifyContent='center'
        cursor='pointer' display='flex' alignItems='center'
        onClick={fetchCredentials}
        _hover={{ opacity: 0.8 }}
      >
        Get credentials
        <>
          {fetchingCredentials && <Spinner width={4} height={4} ml={1}/>}
        </>
      </Box>
    }
    {
      !['Deleting', 'Deleted'].includes(instance.status) && !instance.subscription?.is_active && !instance.subscription?.is_waiting_payment && instance.subscription?.current_expiry_at &&
      <Box
        width='100%' backgroundColor='yellow.50' mt={4}
        border="1px solid"
        borderColor='yellow.100'
        color='yellow.600'
        p={2}
        fontSize={14}
        justifyContent='center'
        cursor='pointer' display='flex' alignItems='center'
      >
        This subscription has been cancelled, and the instance is scheduled for
        deletion on {instance.subscription?.current_expiry_at}.
      </Box>
    }
    {
      !instance.subscription?.is_active && instance.subscription?.is_waiting_payment && instance.subscription?.current_expiry_at &&
      <Box
        width='100%' backgroundColor='yellow.50' mt={4}
        border="1px solid"
        borderColor='yellow.100'
        color='yellow.600'
        p={2}
        fontSize={14}
        justifyContent='center'
        cursor='pointer' display='flex' alignItems='center'
      >
        Unable to process subscription payment, please click here to check the
        instance detail and update payment button
        or the instance is scheduled for deletion
        on {instance.subscription?.current_expiry_at}.
      </Box>
    }
  </Box>
}

const renderCards = (instances: Instance[]) => {
  currentIds = instances.map(instance => instance.id)
  return <Flex
    wrap="wrap"
    justify="flex-start" gap={6}
    direction={{ base: 'column', md: 'row' }}
    mb={8}
  >
    {
      instances.map((instance: Instance) => {
        return <Card key={instance.name} instance={instance}/>
      })
    }
  </Flex>
}

/** Service List Page in pagination */
const ServiceList: React.FC = () => {
  const [filters, setFilters] = useState({
    status: ''
  });
  return (
    <>
      <PaginationPage
        url='/api/instances/'
        action={fetchUserInstances}
        stateKey='instance'
        searchPlaceholder='Search by name'
        renderCards={renderCards}
        additionalFilters={filters}
        leftNavigation={
          <Select
            placeholder="Filter by status"
            backgroundColor='white'
            width={250}
            value={filters.status}
            onChange={
              (e) => setFilters(
                { ...filters, status: e.target.value }
              )
            }
          >
            <option value="Deploying">Deploying</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </Select>
        }
        autoRefresh={5}
      />
    </>
  );
};

export default ServiceList;
