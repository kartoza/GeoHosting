import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, GridItem } from "@chakra-ui/react";
import CompanyListSelector from "../../../components/Company/CompanyListSelector";
import CompanyForm from "../../../components/Company/CompanyForm";

export interface Props {
  setAppName: (appName: string) => void;
  companyId: number | null;
  companyName: string | null;
  setCompanyId: (companyId: number | null) => void;
  setCompanyName: (companyName: string | null) => void;
  isValid: (val: boolean) => void;
}

const purchaseForTypes = {
  INDIVIDUAL: "INDIVIDUAL",
  COMPANY: "COMPANY",
};

export const PurchaseDetail: React.FC<Props> = ({
  setAppName,
  companyId,
  companyName,
  setCompanyName,
  setCompanyId,
  isValid,
}) => {
  const [purchaseFor, setPurchaseFor] = useState<string>(
    purchaseForTypes.COMPANY,
  );

  const companyFormRef = useRef<{ open: (id?: number) => void }>(null);

  /** Set validation */
  useEffect(() => {
    if (purchaseFor === purchaseForTypes.INDIVIDUAL) {
      setCompanyName(null);
      setCompanyId(null);
    }
    isValid(
      !!(
        purchaseFor === purchaseForTypes.INDIVIDUAL ||
        (purchaseFor === purchaseForTypes.COMPANY && companyName)
      ),
    );
  }, [purchaseFor, companyName]);

  /** Set validation */
  useEffect(() => {
    if (companyName) {
      setAppName(companyName.replaceAll(" ", "-").toLowerCase());
    }
  }, [companyName]);

  return (
    <>
      <GridItem display={"flex"} flexDirection={"column"}>
        <Box fontSize={22} color={"black"} paddingY={2}>
          Purchase Details
        </Box>
        <Box
          padding={8}
          backgroundColor="gray.100"
          borderRadius={10}
          flexDirection="column"
          flexGrow={1}
          display={"flex"}
        >
          <Checkbox
            mb={4}
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

          {/* COMPANY PURCHASE */}
          {purchaseFor === purchaseForTypes.COMPANY && (
            <>
              {/* Scrollable list area */}
              <Box flex="1" pt={2} flexGrow={1}>
                <Box bg="white" borderRadius="md" flex="1" flexGrow={1}>
                  <CompanyListSelector
                    companyId={companyId}
                    setCompany={(c) => {
                      setCompanyId(c.id);
                      setCompanyName(c.name);
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Box
                  mt={4}
                  display="flex"
                  width="100%"
                  justifyContent="flex-end"
                >
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      companyFormRef.current?.open();
                    }}
                  >
                    Create Company
                  </Button>
                </Box>
              </Box>
            </>
          )}
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
export default PurchaseDetail;
