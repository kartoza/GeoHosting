import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  BillingInformation,
  fetchUserProfile,
  updateUserProfile,
} from "../../redux/reducers/profileSlice";
import { ChangePasswordModal } from "../../components/Profile/ChangePasswordModal";
import { thunkAPIFulfilled, thunkAPIRejected } from "../../utils/utils";
import { toast } from "react-toastify";
import { returnAsString } from "../../utils/helpers";
import { BillingInformationForm } from "../../components/BillingInformation";
import CompanyList from "../Company/CompanyList";

export interface Props {
  hide?: {
    avatar?: boolean;
    company?: boolean;
  };
}

const ProfileForm: React.FC<Props> = ({ hide }) => {
  const dispatch: AppDispatch = useDispatch();
  const resetPasswordModalRef = useRef(null);
  const { user, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const [errors, setErrors] = useState<any>({});

  const [avataSrc, setAvatarSrc] = useState<string>("");

  // Updated info values
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profile, setProfile] = useState({
    avatar: null,
  });
  const [billingInfo, setBillingInfo] = useState<BillingInformation>({
    name: "",
    address: "",
    postal_code: "",
    country: null,
    city: "",
    region: "",
    tax_number: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const { profile, billing_information } = user;
      setAvatarSrc(profile.avatar);
      setPersonalInfo({
        first_name: returnAsString(user.first_name),
        last_name: returnAsString(user.last_name),
        email: returnAsString(user.email),
      });
      setBillingInfo({
        name: returnAsString(billing_information.name),
        address: returnAsString(billing_information.address),
        postal_code: returnAsString(billing_information.postal_code),
        country: billing_information.country,
        city: returnAsString(billing_information.city),
        region: returnAsString(billing_information.region),
        tax_number: returnAsString(billing_information.tax_number),
      });
    }
  }, [user]);

  /** Image changed */
  const imageChanged = (event) => {
    if (user) {
      const [file] = event.target.files;
      const { profile } = user;
      if (file) {
        setAvatarSrc(URL.createObjectURL(file));
        setProfile({ avatar: file });
      } else {
        setAvatarSrc(profile.avatar);
        setProfile({ avatar: null });
      }
    }
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    setErrors({});
    const newErrors: any = {};
    if (!personalInfo.first_name) newErrors.first_name = "Name is required";
    if (!personalInfo.last_name) newErrors.last_name = "Surname is required";
    if (!personalInfo.email) newErrors.email = "Email is required";

    // Validate billing information
    if (!billingInfo.name) newErrors.name = "Billing name is required";
    if (!billingInfo.address) newErrors.address = "Billing address is required";
    if (!billingInfo.postal_code)
      newErrors.postal_code = "Postal code is required";
    if (!billingInfo.country) newErrors.country = "Country is required";
    if (!billingInfo.city) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(
        "Please fill in all required fields including billing information.",
      );
      return;
    }
    const payload = {
      profileData: { ...personalInfo },
      files: [{ name: "avatar", file: profile.avatar }],
    };
    payload.profileData["billing_information"] = billingInfo;

    dispatch(updateUserProfile(payload)).then((result: any) => {
      if (thunkAPIRejected(result)) {
        setErrors(result.payload);
        toast.error("Failed to update your profile.");
      } else if (thunkAPIFulfilled(result)) {
        toast.success("Your profile has been successfully updated.");
      }
    });
  };

  return (
    <Box p={0}>
      <Box
        fontSize="2xl"
        fontWeight="bold"
        mb={2}
        color={"#3e3e3e"}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>Profile</Box>
        <Button colorScheme="orange" onClick={handleProfileUpdate}>
          Update Profile
        </Button>
      </Box>
      <Box height="2px" bg="blue.500" width="100%" mb={8} />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        gap={4}
      >
        {!hide?.avatar && (
          <VStack spacing={2} alignItems="center" padding="0 1rem">
            <Avatar size="2xl" src={avataSrc} />
            <Box pos="relative">
              <Input
                id={"avatar-input"}
                pos="absolute"
                top={0}
                left={0}
                height="100%"
                width="100%"
                opacity={0}
                type="file"
                name="avatar"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={imageChanged}
              />
              <Button
                disabled={true}
                colorScheme="orange"
                onClick={() => {
                  // @ts-ignore
                  document.getElementById("avatar-input").click();
                }}
              >
                Update Avatar
              </Button>
            </Box>
          </VStack>
        )}

        <VStack
          spacing={4}
          alignItems="flex-start"
          width={{ base: "100%", lg: "60%" }}
        >
          <Text fontSize="lg" fontWeight="bold">
            User Information
          </Text>
          <Box width={{ base: "100%" }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.first_name}>
                <FormLabel>Name</FormLabel>
                <Input
                  disabled={loading}
                  value={personalInfo.first_name}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      first_name: e.target.value,
                    })
                  }
                  bg="white"
                  width={"100%"}
                  isRequired
                />
                {errors.first_name && (
                  <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.last_name}>
                <FormLabel>Surname</FormLabel>
                <Input
                  disabled={loading}
                  value={personalInfo.last_name}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      last_name: e.target.value,
                    })
                  }
                  bg="white"
                  width={"100%"}
                  isRequired
                />
                {errors.last_name && (
                  <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  disabled={loading}
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      email: e.target.value,
                    })
                  }
                  bg="white"
                  width={"100%"}
                  isRequired
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </FormControl>
            </SimpleGrid>
          </Box>
          <Button
            disabled={loading}
            colorScheme="blue"
            mt={6}
            onClick={() => {
              // @ts-ignore
              resetPasswordModalRef?.current?.open();
            }}
          >
            Update Password
          </Button>

          <Accordion allowToggle width={{ base: "100%" }} defaultIndex={[0]}>
            <AccordionItem>
              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Billing Information
              </Text>
              <AccordionPanel p={0}>
                {/* Billing information */}
                <Box marginTop={5} width={{ base: "100%" }}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <BillingInformationForm
                      disable={loading}
                      data={billingInfo}
                      setData={setBillingInfo}
                      errors={errors}
                    />
                  </SimpleGrid>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {!hide?.company && (
            <>
              <Text mt={8} fontSize="lg" fontWeight="bold">
                Company List
              </Text>
              <CompanyList />
            </>
          )}

          {/* Reset password modal */}
          <ChangePasswordModal ref={resetPasswordModalRef} />
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProfileForm;
