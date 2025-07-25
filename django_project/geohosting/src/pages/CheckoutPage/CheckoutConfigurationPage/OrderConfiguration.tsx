import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Checkbox,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { debounce } from "debounce";
import axios from "axios";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Product } from "../../../redux/reducers/productsSlice";
import { headerWithToken } from "../../../utils/helpers";
import CompanyListSelector from "../../../components/Company/CompanyListSelector";
import { Company } from "../../../redux/reducers/companySlice";
import CompanyForm from "../../../components/Company/CompanyForm";

export interface OrderSummaryProps {
  product: Product;
  appName: string;
  setAppName: (appName: string) => void;
  companyId: number | null;
  companyName: string | null;
  setCompanyId: (companyId: number | null) => void;
  setCompanyName: (companyName: string | null) => void;
  setConfigurationOK: (val: boolean) => void;
}

const purchaseForTypes = {
  INDIVIDUAL: "INDIVIDUAL",
  COMPANY: "COMPANY",
};

let lastAppName = null;

export const OrderConfiguration: React.FC<OrderSummaryProps> = ({
  product,
  appName,
  setAppName,
  companyId,
  companyName,
  setCompanyName,
  setCompanyId,
  setConfigurationOK,
}) => {
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string>("App name is empty");
  const [purchaseFor, setPurchaseFor] = useState<string>(
    purchaseForTypes.COMPANY,
  );

  const companyFormRef = useRef<{ open: (id?: number) => void }>(null);

  /** Check app name */
  const debouncedChange = debounce((inputValue) => {
    if (lastAppName === inputValue) {
      axios
        .post(
          "/api/test-app-name/",
          { app_name: inputValue },
          {
            headers: headerWithToken(),
          },
        )
        .then((response) => {
          if (lastAppName === inputValue) {
            setChecking(false);
            setError("");
          }
        })
        .catch(function (error) {
          if (lastAppName === inputValue) {
            setChecking(false);
            setError(error.response.data);
          }
        });
    }
  }, 500);

  const handleChange = (val) => {
    lastAppName = val;
    setError("");
    setAppName(val);
    if (!val) {
      setError("App name is empty");
    } else {
      setChecking(true);
      debouncedChange(val);
    }
  };

  /** Set validation */
  useEffect(() => {
    if (purchaseFor === purchaseForTypes.INDIVIDUAL) {
      setCompanyName(null);
      setCompanyId(null);
    }
    const isValid =
      !error &&
      (purchaseFor === purchaseForTypes.INDIVIDUAL ||
        (purchaseFor === purchaseForTypes.COMPANY && companyName));
    setConfigurationOK(!!isValid);
  }, [error, purchaseFor, companyName]);

  /** Set validation */
  useEffect(() => {
    if (companyName) {
      handleChange(companyName.replaceAll(" ", "-").toLowerCase());
    }
  }, [companyName]);

  return (
    <>
    <GridItem>
      <Box fontSize={22} color={"black"} paddingY={2}>
        Purchase Details
      </Box>
      <Box
        h="90%"
        padding={8}
        backgroundColor="gray.100"
        borderRadius={10}
        flexDirection="column"
      >
        <Checkbox
          checked={purchaseFor === purchaseForTypes.INDIVIDUAL}
          _checked={{
            "& .chakra-checkbox__control": {
              background: "#4F9AC0",
              borderColor: "#4F9AC0",
              color: "white",
            },
            "& .chakra-checkbox__control:hover": {
              background: "#4F9AC0",
              borderColor: "#4F9AC0",
              color: "white",
            },
          }}
          sx={{
            "& .chakra-checkbox__label": {
              fontSize: "13px !important",
            },
            "& .chakra-checkbox__control": {
              background: "white",
              borderColor: "#777777",
            },
          }}
          onChange={() =>
            setPurchaseFor(
              purchaseFor === purchaseForTypes.INDIVIDUAL
                ? purchaseForTypes.COMPANY
                : purchaseForTypes.INDIVIDUAL,
            )
          }
        >
          Purchase in personal capacity
        </Checkbox>
        <Box
          fontSize={16}
          color={"black"}
          mt={2}
          mb={2}
          display="flex"
          alignItems="center"
        >
          Select Company
        </Box>
        {/* Scrollable list area */}
        <Box
          flex="1"
          pt={2}
        >
          {purchaseFor === purchaseForTypes.COMPANY ? (
            <Box
              bg="white"
              borderRadius="md"
              maxH="160px"
              overflowY="auto"  // inner box scroll
            >
              <CompanyListSelector
                companyId={companyId}
                setCompany={(c) => {
                  setCompanyId(c.id)
                  setCompanyName(c.name)
                }}
              />
           </Box>
          ) : null}
        </Box>
        <Box>
        {purchaseFor === purchaseForTypes.COMPANY && (
          <Box
            mt={4}
            display="flex"
            width="100%"
            justifyContent="space-between"
          >
            <Button
              colorScheme="yellow"
              onClick={() => {
                setCompanyId(null);
                setCompanyName(null);
              }}
              isDisabled={!companyName}
            >
              Remove Company
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                companyFormRef.current?.open();
              }}
            >
              Create Company
            </Button>
            </Box>
        )}
      </Box>
      </Box>
    </GridItem>
    <GridItem colSpan={{ base: 1, md: 2 }}>
      <Box>
          <Box fontSize={22} color={"black"} display="flex" alignItems="center">
            Application Name
          </Box>
        </Box>
        <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
          <Box display="flex" alignItems="center">
            <InputGroup>
              <Input
                textAlign="right"
                value={appName}
                backgroundColor="white"
                placeholder="Please provide a name for your application"
                size="lg"
                onChange={(evt) => handleChange(evt.target.value)}
                isInvalid={!!error}
              />
              {checking ? (
                <InputLeftElement height="100%">
                  <Spinner />
                </InputLeftElement>
              ) : error ? (
                <InputLeftElement height="100%">
                  <Icon as={WarningIcon} color="red.500" />
                </InputLeftElement>
              ) : (
                <InputLeftElement height="100%">
                  <Icon as={CheckCircleIcon} color="green.500" />
                </InputLeftElement>
              )}
            </InputGroup>
            &nbsp;.{product.domain}
          </Box>
          <Box color="red" fontSize={14} minHeight={8}>
            {error}
          </Box>
          <Box>
            <Text
              fontSize={13}
              color={"gray"}
              fontStyle={"italic"}
              marginTop={"1rem"}
            >
              <i>
                Name may only contain lowercase letters, numbers or dashes.
                <br />
                This will be used for subdomain and also application name. e.g:
                appname.geonode.kartoza.com
              </i>
            </Text>
          </Box>
        </Box>
      </GridItem>
      <CompanyForm
        ref={companyFormRef}
        onDone={(newName: string) => {
          // When they finish creating, auto-select it:
          setCompanyName(newName);
        }}
      />
    </>
  );
};
export default OrderConfiguration;
