import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { BillingInformation } from "../../redux/reducers/profileSlice";
import { returnAsString } from "../../utils/helpers";
import BillingInformationForm from "../../components/BillingInformation";
import { thunkAPIFulfilled, thunkAPIRejected } from "../../utils/utils";
import { toast } from "react-toastify";
import {
  createUserCompany,
  fetchUserCompanies,
  fetchUserCompany,
  updateUserCompany
} from "../../redux/reducers/companySlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

/** Company controller */

interface Props {
  description?: string;
  onDone?: () => void;
}

export const CompanyForm = forwardRef(({ description, onDone }: Props, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, loading } = useSelector(
    (state: RootState) => state.company["detail"],
  );
  const { loading: createLoading } = useSelector(
    (state: RootState) => state.company["create"],
  );
  const [id, setId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});

  // Open
  useImperativeHandle(ref, () => ({
    open(id: number | null) {
      setDefault();
      setId(id);
      if (id) {
        dispatch(fetchUserCompany(id));
      }
      onOpen();
    },
  }));

  // Updated info values
  const [info, setInfo] = useState({
    name: "",
    email: "",
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

  const setDefault = () => {
    setInfo({
      name: returnAsString(""),
      email: returnAsString(""),
    });
    setBillingInfo({
      name: returnAsString(""),
      address: returnAsString(""),
      postal_code: returnAsString(""),
      country: null,
      city: returnAsString(""),
      region: returnAsString(""),
      tax_number: returnAsString(""),
    });
  };

  useEffect(() => {
    if (data) {
      const { name, email, billing_information } = data;
      setInfo({
        name: returnAsString(name),
        email: returnAsString(email),
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
  }, [data]);

  // Handle create company
  const submit = () => {
    if (!id) {
      dispatch(
        createUserCompany({
          companyData: { ...info, billing_information: billingInfo },
          files: [],
        }),
      ).then((result: any) => {
        if (thunkAPIRejected(result)) {
          setErrors(result.payload);
          toast.error("Failed to create company.");
        } else if (thunkAPIFulfilled(result)) {
          dispatch(fetchUserCompanies("/api/companies?page_size=1000"));
          onClose();
          if (onDone) {
            onDone();
          }
          toast.success("Your company has been successfully created.");
        }
      });
    }
    if (id) {
      dispatch(
        updateUserCompany({
          id,
          companyData: { ...info, billing_information: billingInfo },
          files: [],
        }),
      ).then((result: any) => {
        if (thunkAPIRejected(result)) {
          setErrors(result.payload);
          toast.error("Failed to update the company.");
        } else if (thunkAPIFulfilled(result)) {
          dispatch(fetchUserCompanies("/api/companies?page_size=1000"));
          onClose();
          if (onDone) {
            onDone();
          }
          toast.success("Your company has been successfully created.");
        }
      });
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={true}
      preserveScrollBarGap={true}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent bg={"white"}>
        <ModalCloseButton />
        <ModalBody m={4}>
          {description && (
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
              {description}
            </Box>
          )}
          <Box
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
            color={"#3e3e3e"}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Company</Box>
            <Button
              isDisabled={loading || createLoading}
              colorScheme="orange"
              alignSelf="flex-start"
              onClick={submit}
            >
              {!id ? "Create" : "Update"}
            </Button>
          </Box>
          <Box height="2px" bg="blue.500" width="100%" mb={8} />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Box width={{ base: "100%" }}>
                <FormControl
                  isInvalid={
                    errors.name &&
                    (!info.name || errors.name[0].includes("exists"))
                  }
                >
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    isDisabled={loading || createLoading}
                    value={info.name}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        name: e.target.value,
                      })
                    }
                    width={"100%"}
                  />
                  {errors.name &&
                    (!info.name || errors.name[0].includes("exists")) && (
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    )}
                </FormControl>
                <br />
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    disabled={loading}
                    value={info.email}
                    onChange={(e) =>
                      setInfo({
                        ...info,
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
                <Text fontSize="lg" fontWeight="bold" mt={8}>
                  Billing Information
                </Text>

                {/* Billing information */}
                <Box marginTop={5} marginBottom={4} width={{ base: "100%" }}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <BillingInformationForm
                      disable={loading || createLoading}
                      data={billingInfo}
                      setData={setBillingInfo}
                      errors={errors}
                    />
                  </SimpleGrid>
                </Box>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default CompanyForm;
