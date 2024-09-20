import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  VStack,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchUserProfile, updateUserProfile } from '../../../redux/reducers/profileSlice';
import PasswordResetTab from '../../../components/Profile/Password';

const ProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.profile);
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    surname: '',
    email: '',
  });
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
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
      setPersonalInfo({
        name: user.name,
        surname: user.surname,
        email: user.email,
      });
      setBillingInfo({
        billingName: user.billingName,
        address: user.address,
        postalCode: user.postalCode,
        country: user.country,
        city: user.city,
        region: user.region,
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
    <Box p={0} mx="auto" >
      <Text fontSize="2xl" fontWeight="bold" mb={2} color={'#3e3e3e'}>Profile</Text>
      <Box height="2px" bg="blue.500" width="100%" mb={8} />

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="flex-start"
        gap={10}
      >
        <VStack spacing={4} alignItems="center" mb={{ base: 6, md: 0 }} mt={{ base: 'auto', md: 12}}>
          <Avatar size="2xl" src={user?.profileImageUrl} />
          <Button colorScheme="orange" onClick={() => console.log("Update Avatar")}>
            Update Avatar
          </Button>
        </VStack>

        <VStack spacing={4} alignItems="flex-start" width={{ base: '100%', md: '60%' }}>
          <Text fontSize="lg" fontWeight="bold">User Information</Text>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Surname</FormLabel>
            <Input
              value={personalInfo.surname}
              onChange={(e) => setPersonalInfo({ ...personalInfo, surname: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <Button colorScheme="blue" onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}>
            {showPasswordUpdate ? 'Close' : 'Update Password'}
          </Button>
        </VStack>
      </Flex>

      {showPasswordUpdate && (
        <Box mt={6}>
          <PasswordResetTab />
        </Box>
      )}

      <Box mt={14} width={{ base: '100%', md: '60%' }} ml={{base: 'auto', md: 44}}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>Billing Information</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>Institution Name</FormLabel>
            <Input
              value={billingInfo.billingName}
              onChange={(e) => setBillingInfo({ ...billingInfo, billingName: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Billing Address</FormLabel>
            <Input
              value={billingInfo.address}
              onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Postal Code</FormLabel>
            <Input
              value={billingInfo.postalCode}
              onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input
              value={billingInfo.country}
              onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input
              value={billingInfo.city}
              onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Region</FormLabel>
            <Input
              value={billingInfo.region}
              onChange={(e) => setBillingInfo({ ...billingInfo, region: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>VAT/Tax number</FormLabel>
            <Input
              value={billingInfo.region}
              onChange={(e) => setBillingInfo({ ...billingInfo, region: e.target.value })}
              borderWidth="0px"
              borderColor="gray.400"
              bg="white"
              width={{ base: '100%', md: '400px' }}
            />
          </FormControl>
        </SimpleGrid>
        <Button colorScheme="orange" onClick={handleProfileUpdate} mt={4}>
          Update Profile
        </Button>
      </Box>
      
    </Box>
  );
};

export default ProfilePage;
