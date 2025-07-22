import React, { useEffect, useRef, useState } from "react";
import { Box, Checkbox } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon } from "@chakra-ui/icons";
import { AppDispatch, RootState } from "../../redux/store";
import { Company, fetchUserCompanies } from "../../redux/reducers/companySlice";
import CompanyForm from "./CompanyForm";

export interface OrderSummaryProps {
  companyId: number | null;
  setCompany: (companyName: Company) => void;
}

/** Company controller */
const CompanyListSelector: React.FC<OrderSummaryProps> = ({
  companyId,
  setCompany,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef(null);
  const { data, loading } = useSelector(
    (state: RootState) => state.company["list"],
  );
  const [newCompanyName, setNewCompanyName] = useState<string | null>(null);

  const request = () => {
    dispatch(fetchUserCompanies("/api/companies/?page_size=1000"));
  };

  /** When first dispatch created */
  useEffect(() => {
    request();
  }, [dispatch]);

  /** When first dispatch created */
  useEffect(() => {
    if (data?.results && data?.results[0]) {
      if (!newCompanyName) {
        setCompany(data?.results[0]);
      } else {
        const company = data?.results.find(
          (company) => company.name === newCompanyName,
        );
        if (company) {
          setCompany(company);
        }
      }
    }
  }, [data, newCompanyName]);

  if (loading) {
    return <Box paddingTop={4}>Loading</Box>;
  }
  return (
    <Box p={4} background={"white"} mt={4}>
      {!data?.results.length && (
        <Box fontSize="13px" textAlign="center" p={4}>
          You don't have any companies yet. Please create one.
          <Box
            color="orange.500"
            cursor="pointer"
            mt={4}
            _hover={{ opacity: 0.8 }}
            onClick={() => {
              if (!loading) {
                // @ts-ignore
                modalRef?.current?.open();
              }
            }}
          >
            + Create Company
          </Box>
        </Box>
      )}
      {data?.results.length ? (
        <Box>
          <Box
            mb={4}
            fontSize="13px"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>Select Company</Box>
            <Box
              color="orange.500"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={() => {
                if (!loading) {
                  // @ts-ignore
                  modalRef?.current?.open();
                }
              }}
            >
              + Create Company
            </Box>
          </Box>
          {data?.results.map((_company: Company) => (
            <Box
              display="flex"
              justifyContent="space-between"
              key={_company.id}
              py={4}
              fontSize="13px"
              cursor="pointer"
              whiteSpace="nowrap"
            >
              <Box>
                <Checkbox
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
                  isChecked={companyId === _company.id}
                  onChange={() => setCompany(_company)}
                >
                  {_company.name}
                </Checkbox>
              </Box>
              <EditIcon
                fontSize="13px"
                onClick={() => {
                  // @ts-ignore
                  modalRef?.current?.open(_company.id);
                }}
              />
            </Box>
          ))}
        </Box>
      ) : null}
      <CompanyForm ref={modalRef} onDone={setNewCompanyName} />
    </Box>
  );
};

export default CompanyListSelector;
