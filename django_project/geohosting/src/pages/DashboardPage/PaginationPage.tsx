import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "debounce";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, RootState } from "../../redux/store";
import TopNavigation from "../../components/DashboardPage/TopNavigation";
import Pagination from "../../components/Pagination/Pagination";
import { AsyncThunk } from "@reduxjs/toolkit";
import { Instance } from "../../redux/reducers/instanceSlice";
import { urlParameters } from "../../utils/helpers";

interface Props {
  searchPlaceholder: string;
  stateKey: string;
  action: AsyncThunk<any, string, AsyncThunkConfig>;
  url: string;
  leftNavigation?: React.ReactElement;
  rightNavigation?: React.ReactElement;
  renderCards: (data: any[]) => React.ReactElement;

  // Second of auto refresh
  autoRefresh?: number;

  // additional filters
  additionalFilters?: {};

  // No data text
  noDataText?: React.ReactElement;
}

let lastSearchTerm: string | null = null;
let session: string | null = null;
let isForce: boolean | null = null;
let lastTimeout: string | null = null;

interface RenderContentProps {
  data: Instance[];
  renderCards: (data: any[]) => React.ReactElement;
}

/** Rendering contents **/
const RenderContent: React.FC<RenderContentProps> = ({ data, renderCards }) => {
  return renderCards(data);
};

/** Abstract for pagination page */
export const PaginationPage: React.FC<Props> = ({
  searchPlaceholder,
  stateKey,
  action,
  url,
  leftNavigation,
  rightNavigation,
  renderCards,
  additionalFilters,
  autoRefresh = 0,
  noDataText,
}) => {
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
  const parameters = urlParameters();
  const [searchTerm, setSearchTerm] = useState(
    parameters["q"] ? parameters["q"] : "",
  );

  /** Check app name */
  const debouncedSearchTerm = debounce((inputValue) => {
    if (lastSearchTerm === inputValue) {
      request();
    }
  }, 500);

  const isLoading = isForce ? false : loading;
  const request = (force: boolean = false) => {
    const exampleDomain = "http://example.com/";
    let usedUrl = url;
    if (!url.includes("http")) {
      usedUrl = exampleDomain + url;
    }
    let _url = new URL(usedUrl);
    _url.searchParams.set("page_size", rowsPerPage.toString());
    _url.searchParams.set("page", currentPage.toString());
    if (searchTerm) {
      _url.searchParams.set("q", searchTerm);
    }
    if (additionalFilters) {
      for (const [key, value] of Object.entries(additionalFilters)) {
        if (value) {
          _url.searchParams.set(key, value.toString());
        }
      }
    }
    const urlRequest = _url.toString().replace(exampleDomain, "");
    if (force || session !== urlRequest) {
      dispatch(action(urlRequest));
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

  /** When create and edit is done, do request */
  useEffect(() => {
    if (autoRefresh && !loading) {
      // If looping
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      // @ts-ignore
      lastTimeout = setTimeout(() => {
        isForce = true;
        request(true);
      }, autoRefresh * 1000);
    } else {
      isForce = false;
    }
  }, [loading]);

  /** When first dispatch created */
  useEffect(() => {
    isForce = false;
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
    lastSearchTerm = searchTerm;
    debouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  /** When first dispatch created */
  useEffect(() => {
    setCurrentPage(1);
    request();
  }, [additionalFilters]);

  const data = listData?.results;
  return (
    <Box>
      <Box minHeight={{ base: "auto", md: "80vh" }}>
        {/* Top navigation of dashboard */}
        <TopNavigation
          initSearch={searchTerm}
          onSearch={setSearchTerm}
          placeholder={searchPlaceholder}
          leftElement={leftNavigation}
          rightElement={rightNavigation}
        />

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
            <RenderContent data={data} renderCards={renderCards} />
          ) : !noDataText ? (
            <Box>No data exist</Box>
          ) : (
            noDataText
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
