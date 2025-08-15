import {
  Box,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CardProps } from "../Agreements/AgreementList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import Pagination from "../../../components/Pagination/Pagination";
import { Instance } from "../../../redux/reducers/instanceSlice";
import { formatDateDMY } from "../../../utils/helpers";
import {
  Agreement,
  fetchUserAgreements,
} from "../../../redux/reducers/agreementSlice";
import { AgreementDownload } from "../Orders/OrderList";

let session: string | null = null;

/** Card for order **/
const Card: React.FC<CardProps> = ({ agreement }) => {
  return (
    <Tr key={agreement.id} _hover={{ bg: "gray.100" }}>
      <Td width={"50%"}>{formatDateDMY(agreement.created_at)}</Td>
      <Td width={"50%"}>
        <AgreementDownload {...agreement} />
      </Td>
    </Tr>
  );
};
const renderCards = (agreements: Agreement[]) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Agreement</Th>
        </Tr>
      </Thead>
      <Tbody>
        {agreements.map((agreement) => (
          <Card key={agreement.id} agreement={agreement} />
        ))}
      </Tbody>
    </Table>
  );
};

interface Props {
  instance: Instance;
  stateKey?: string;
  url?: string;
}

/** Abstract for pagination page */
export const ServiceAgreement: React.FC<Props> = ({
  instance,
  stateKey = "agreements",
  url = "/api/agreements/",
}) => {
  const additionalFilters = {
    sales_order__instance__id: instance.id,
  };
  const dispatch = useDispatch<AppDispatch>();
  const rowsPerPage = 10;
  const {
    data: listData,
    loading,
    error,
  } = useSelector((state: RootState) => state[stateKey]["list"]);

  const { loading: createLoading, error: createError } = useSelector(
    (state: RootState) => state[stateKey]["create"],
  );
  const { loading: editLoading, error: editError } = useSelector(
    (state: RootState) => state[stateKey]["update"],
  );

  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = loading;
  const request = (force: boolean = false) => {
    const exampleDomain = "http://example.com/";
    let usedUrl = url;
    if (!url.includes("http")) {
      usedUrl = exampleDomain + url;
    }
    let _url = new URL(usedUrl);
    _url.searchParams.set("page_size", rowsPerPage.toString());
    _url.searchParams.set("page", currentPage.toString());
    if (additionalFilters) {
      for (const [key, value] of Object.entries(additionalFilters)) {
        if (value) {
          _url.searchParams.set(key, value.toString());
        }
      }
    }
    const urlRequest = _url.toString().replace(exampleDomain, "");
    if (force || session !== urlRequest) {
      dispatch(fetchUserAgreements(urlRequest));
    }
    session = urlRequest;
  };

  /** When create and edit is done, do request */
  useEffect(() => {
    if (session && !createLoading && !editLoading) {
      if (!createError && !editError) {
        request(true);
      }
    }
  }, [createLoading, editLoading]);

  /** When first dispatch created */
  useEffect(() => {
    request();
  }, [dispatch]);

  /** When first dispatch created */
  useEffect(() => {
    if (
      listData.total_page &&
      currentPage >= 1 &&
      currentPage <= listData.total_page
    ) {
      request();
    }
  }, [currentPage]);

  /** When first dispatch created */
  useEffect(() => {
    setCurrentPage(1);
    request();
  }, [additionalFilters]);

  const data = listData?.results;
  return (
    <Box>
      <Box>
        <Box mt={4}>
          {error ? (
            <Box color="red">{error.toString()}</Box>
          ) : isLoading ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"100%"}
              height={"100%"}
              alignItems={"center"}
              paddingY={8}
            >
              <Spinner size="xl" />
            </Box>
          ) : data.length ? (
            <>{renderCards(data)}</>
          ) : (
            <Box>No data exist</Box>
          )}
        </Box>
      </Box>
      {/* Pagination */}
      <Flex justifyContent="center" mt={4}>
        <Pagination
          totalItems={listData.count}
          itemsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Flex>
    </Box>
  );
};
