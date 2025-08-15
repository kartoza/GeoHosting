import React, { useState } from "react";
import {
  IconButton,
  Link,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { PaginationPage } from "../PaginationPage";
import {
  fetchSalesOrders,
  SalesOrder,
} from "../../../redux/reducers/ordersSlice";
import { checkCheckoutUrl } from "../../CheckoutPage/utils";
import { FaPrint } from "react-icons/fa";
import axios from "axios";
import { formatDateDMY, headerWithToken } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Agreement } from "../../../redux/reducers/agreementSlice";
import { DownloadIcon } from "@chakra-ui/icons";

export interface OrderCardProps {
  order: SalesOrder;
}

export const AgreementDownload = (agreement: Agreement) => {
  console.log(agreement);
  const [downloading, setDownloading] = useState(false);
  const downloadFile = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(agreement.download_url, {
        responseType: "blob",
        headers: headerWithToken(),
      });
      const filename = agreement.name + ".pdf";
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setDownloading(false);
    } catch (error) {
      toast.error("Error downloading the file.");
      setDownloading(false);
    }
  };

  return (
    <Tooltip label={agreement.name} placement="bottom-end">
      <IconButton
        size="xs"
        as="a"
        download
        aria-label={`Download ${agreement.name}`}
        icon={downloading ? <Spinner /> : <DownloadIcon />}
        isDisabled={downloading}
        onClick={downloadFile}
        colorScheme="orange"
        bg="orange.300 !important"
        color="white"
        variant="solid"
        cursor={downloading ? "progress! important" : "pointer"}
        _hover={{ bg: "orange.400" }}
      />
    </Tooltip>
  );
};

/** Card for order **/
const Card: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Tr key={order.id} _hover={{ bg: "gray.100" }}>
      <Td>
        <Link
          href={`/#${checkCheckoutUrl(order)}`}
          target="_blank"
          as="a"
          color="blue.500"
        >
          {order.erpnext_code}
        </Link>
      </Td>
      <Td>{order.package.name}</Td>
      <Td>{order.app_name}</Td>
      <Td>{order.order_status}</Td>
      <Td>{order.company_name}</Td>
      <Td>{formatDateDMY(order.date)}</Td>
      <Td>
        {order.invoice_url && (
          <Tooltip
            label={order.erpnext_code + " invoice"}
            placement="bottom-end"
          >
            <IconButton
              size="xs"
              as="a"
              href={order.invoice_url}
              download
              aria-label={`Download ${order.erpnext_code} invoice`}
              icon={<FaPrint />}
              colorScheme="orange"
              bg="orange.300 !important"
              color="white"
              variant="solid"
              _hover={{ bg: "orange.400" }}
            />
          </Tooltip>
        )}
      </Td>
      <Td>
        {order.agreements.map((agreement) => (
          <AgreementDownload {...agreement} />
        ))}
      </Td>
    </Tr>
  );
};

const renderCards = (orders: SalesOrder[]) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Package</Th>
          <Th>App Name</Th>
          <Th>Status</Th>
          <Th>Company</Th>
          <Th>Date</Th>
          <Th>Invoice</Th>
          <Th>Agreements</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order) => (
          <Card key={order.id} order={order} />
        ))}
      </Tbody>
    </Table>
  );
};
/** Support List Page in pagination */
const OrderList: React.FC = () => {
  const [filters, setFilters] = useState({
    order_status: "",
  });

  return (
    <>
      <PaginationPage
        url="/api/orders/?is_main_invoice=True"
        action={fetchSalesOrders}
        stateKey="orders"
        searchPlaceholder="Search by id or app name"
        renderCards={renderCards}
        additionalFilters={filters}
        leftNavigation={
          <Select
            placeholder="Filter by status"
            backgroundColor="white"
            width={250}
            value={filters.order_status}
            onChange={(e) =>
              setFilters({ ...filters, order_status: e.target.value })
            }
          >
            <option value="Waiting Payment">Waiting Payment</option>
            <option value="Waiting Deployment">Waiting Deployment</option>
            <option value="Deployed">Deployed</option>
          </Select>
        }
      />
    </>
  );
};

export default OrderList;
