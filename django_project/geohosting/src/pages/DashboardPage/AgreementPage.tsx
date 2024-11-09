import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";

const agreements = [
  {
    name: 'User Agreement',
    file: '/path/to/user-agreement.pdf',
    dateIssued: '2023-01-01'
  },
  {
    name: 'Privacy Policy',
    file: '/path/to/privacy-policy.pdf',
    dateIssued: '2023-02-15'
  },
  {
    name: 'Terms of Service',
    file: '/path/to/terms-of-service.pdf',
    dateIssued: '2023-03-10'
  },
];

const AgreementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(agreements.length).fill(false));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const isWithinDateRange = (dateIssued: string) => {
    const issuedDate = new Date(dateIssued);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && issuedDate < start) return false;
    if (end && issuedDate > end) return false;
    return true;
  };

  const filteredAgreements = agreements.filter(agreement =>
    agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    isWithinDateRange(agreement.dateIssued)
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentAgreements = filteredAgreements.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Box>
      <Box width="100%" margin="0 auto" textAlign="left">
        <Text fontSize="2xl" fontWeight="bold" mb={2}
              color={'#3e3e3e'}>
          Agreements
        </Text>
        <Box height="2px" bg="blue.500" width="100%" mb={4}/>

        <SearchBar
          onSearch={handleSearch}
          showDateFields={false}
          showClearButton={false}
          placeholder={'Search Title'}
        />

        {/* Responsive Table Container */}
        <Box
          overflowX="auto"
          mb={4}
        >
          <Table
            variant="simple"
            width={{ base: "100%", lg: "75%", xl: "60%" }}
            style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
          >
            <Thead>
              <Tr>
                <Th width="0" p={0} border={"none"}></Th>
                <Th border={"none"} padding={4}>
                  Title
                </Th>
                <Th padding={4} whiteSpace={'nowrap'} paddingLeft={0}
                    border={"none"}>
                  Date Issued
                </Th>
                <Th textAlign="left" border={"none"}>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentAgreements.map((agreement, index) => (
                <Tr key={index} height='40px' border={"none"}>
                  <Td padding={0} paddingRight={5}
                      border={"none"}>
                    <Checkbox
                      colorScheme="blue"
                      isChecked={checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                      borderColor="gray.500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Td>
                  <Td padding={0} backgroundColor='white' border={"none"}>
                    <Box
                      paddingLeft={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: checkedItems[index] || hoverIndex === index ? 'blue.500' : 'gray',
                        borderRadius: '4px 0 0 4px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      {agreement.name}
                    </Box>
                  </Td>
                  <Td
                    padding={0} backgroundColor='white' width='100px'
                    borderRadius='0 4px 4px 0' paddingRight={4}
                    border={"none"}
                  >
                    <Box
                      whiteSpace={'nowrap'}
                      style={{
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'gray',
                        borderRadius: '0 10px 10px 0',
                      }}>
                      {agreement.dateIssued}
                    </Box>
                  </Td>
                  <Td textAlign="left" padding={0} paddingLeft={4}
                      width='40px'
                      border={"none"}>
                    <Tooltip label="Download">
                      <IconButton
                        as="a"
                        href={agreement.file}
                        download
                        aria-label={`Download ${agreement.name}`}
                        icon={<DownloadIcon/>}
                        colorScheme="orange"
                        bg="orange.300"
                        color="white"
                        variant="solid"
                        _hover={{ bg: 'orange.400' }}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>


      </Box>
      {filteredAgreements.length > rowsPerPage && (
        <Pagination
          totalItems={filteredAgreements.length}
          itemsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </Box>
  );
};

export default AgreementPage;
