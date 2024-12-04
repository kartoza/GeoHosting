import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  keyframes,
  Link,
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
import Geoserver from "../../../assets/images/GeoServer.svg";
import Geonode from "../../../assets/images/GeoNode.svg";
import { headerWithToken } from "../../../utils/helpers";

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
  instanceInput: Instance;
}

/** Card for support **/
const Card: React.FC<CardProps> = ({ instanceInput }) => {
  const columns = useBreakpointValue({ base: 1, md: 2 });
  const Placeholder = 'https://via.placeholder.com/60';

  const [instance, setInstance] = useState(instanceInput);
  const [fetchingCredentials, setFetchingCredentials] = useState<boolean>(false);

  // Function to determine the correct image based on package name
  const getImageForPackage = (packageName: string) => {
    if (packageName.toLowerCase().includes('geoserver')) {
      return Geoserver;
    } else if (packageName.toLowerCase().includes('geonode')) {
      return Geonode;
    } else {
      return Placeholder;
    }
  };

  const request = (_instance) => {
    let instance = _instance
    if (!currentIds.includes(instance.id)) {
      return
    }
    (
      async () => {
        try {
          const response = await axios.get(
            `/api/instances/${instance.id}/`,
            {
              headers: headerWithToken()
            }
          );
          if (JSON.stringify(response.data) !== JSON.stringify(instance)) {
            instance = response.data
            setInstance(response.data);
          }
        } catch (err) {

        }
        setTimeout(() => {
          request(instance)
        }, 5000);
      }
    )()
  }

  /** Fetch credential **/
  const fetchCredentials = async () => {
    if (fetchingCredentials) {
      return
    }
    setFetchingCredentials(true)
    try {
      const response = await axios.get(
        `/api/instances/${instance.id}/credential/`,
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

  /** Check app name */
  useEffect(() => {
    setTimeout(() => {
      request(instance)
    }, 5000);
  }, [instanceInput]);

  // Render instance status
  const RenderInstanceStatus = (props) => {
    const { instance } = props
    switch (instance.status) {
      case 'Offline':
        return <>
          <Box
            width='16px'
            height='16px'
            backgroundColor="var(--chakra-colors-red-300)"
            borderRadius='50'
            border='1px solid var(--chakra-colors-gray-600)'
          />
          <Text>Offline</Text>
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

  return <Box
    key={instance.id}
    borderWidth="1px"
    borderRadius="lg"
    p={6}
    width={{ base: "100%", md: "320px" }}
    bg="white"
    boxShadow="lg"
  >
    {/* Logo and Switch */}
    <Flex justify="space-between" mb={4}>
      <Image
        src={getImageForPackage(instance.product.name)}
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
      <Text fontWeight="bold" isTruncated>
        {
          instance.status === 'Online' && instance.url ?
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
      instance.package.feature_list && (
        <Grid templateColumns={`repeat(${columns}, 1fr)`}>
          <GridItem>
            <Text fontSize="sm">
              Storage: {instance.package.feature_list.spec[0]?.split(' ')[0]}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" textAlign="right">
              Memory: {instance.package.feature_list.spec[2]?.split(' ')[1]}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize="sm">
              CPUs: {instance.package.feature_list.spec[1]?.split(' ')[2]}
            </Text>
          </GridItem>
        </Grid>
      )
    }
    {
      instance.status == 'Online' &&
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
        return <Card key={instance.name} instanceInput={instance}/>
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
        title='Hosted Services'
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
      />
    </>
  );
};

export default ServiceList;
