import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchUserProfile,
  updateUserProfile
} from '../../../redux/reducers/profileSlice';
import { PasswordResetModal } from '../../../components/Profile/Password';

const ProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const resetPasswordModalRef = useRef(null);
  const { user } = useSelector((state: RootState) => state.profile);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    email: '',
  });
  const [billingInfo, setBillingInfo] = useState({
    billingName: '',
    address: '',
    postalCode: '',
    country: '',
    city: '',
    region: '',
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const { profile, billing_information } = user;
      setPersonalInfo({
        name: user.first_name,
        surname: user.last_name,
        email: user.email,
      });
      setBillingInfo({
        billingName: billing_information.name,
        address: billing_information.address,
        postalCode: billing_information.postal_code,
        country: billing_information.country,
        city: billing_information.city,
        region: billing_information.region,
      });
    }
  }, [user]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleProfileUpdate = () => {
    dispatch(updateUserProfile({
      ...personalInfo,
      profileImage,
      billingInfo,
    }));
  };

  return (
    <Box p={0} mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={2} color={'#3e3e3e'}>
        Profile
      </Text>
      <Box height="2px" bg="blue.500" width="100%" mb={8}/>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="flex-start"
        gap={4}
      >
        <VStack spacing={2} alignItems="center" padding="0 1rem">
          <Avatar size="2xl" src={user?.profile.avatar}/>
          <Button
            disabled={true}
            colorScheme="orange"
            style={{
              cursor: "not-allowed",
              background: 'var(--chakra-colors-customOrange-600)'
            }}
            // onClick={() => console.log("Update Avatar")}
          >
            Update Avatar
          </Button>
        </VStack>

        <VStack
          spacing={4} alignItems="flex-start"
          width={{ base: '100%', lg: '60%' }}
        >
          <Text fontSize="lg" fontWeight="bold">User Information</Text>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={personalInfo.name}
              onChange={
                (e) => setPersonalInfo(
                  { ...personalInfo, name: e.target.value })
              }
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={'100%'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Surname</FormLabel>
            <Input
              value={personalInfo.surname}
              onChange={(e) => setPersonalInfo({
                ...personalInfo,
                surname: e.target.value
              })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={'100%'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({
                ...personalInfo,
                email: e.target.value
              })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={'100%'}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            mt={6}
            onClick={() => {
              console.log('Open')
              // @ts-ignore
              resetPasswordModalRef?.current?.open()
            }}
          >
            Update Password
          </Button>

          {/* FOr more information */}
          <Box marginTop={5} width={{ base: '100%' }}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Billing Information
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Institution Name</FormLabel>
                <Input
                  value={billingInfo.billingName}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    billingName: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Billing Address</FormLabel>
                <Input
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    address: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  value={billingInfo.postalCode}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    postalCode: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  value={billingInfo.country}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    country: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  value={billingInfo.city}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    city: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Region</FormLabel>
                <Input
                  value={billingInfo.region}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    region: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                />
              </FormControl>
              <FormControl>
                <FormLabel>VAT/Tax number</FormLabel>
                <Input
                  value={billingInfo.region}
                  onChange={(e) => setBillingInfo({
                    ...billingInfo,
                    region: e.target.value
                  })}
                  borderWidth="0px"
                  borderColor="gray.400"
                  bg="white"
                  width={'100%'}
                />
              </FormControl>
            </SimpleGrid>
            <Button colorScheme="orange" onClick={handleProfileUpdate} mt={4}>
              Update Profile
            </Button>
          </Box>

          {/* Reset password modal */}
          <PasswordResetModal ref={resetPasswordModalRef}/>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProfilePage;
