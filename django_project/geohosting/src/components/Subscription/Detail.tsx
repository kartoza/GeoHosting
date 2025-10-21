import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Table,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { fetchSubscriptionDetail } from "../../redux/reducers/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { FaCcStripe } from "react-icons/fa6";
import StripePaymentChangesModal from "../PaymentChanges/Stripe";
import PaystackPaymentChangesModal from "../PaymentChanges/Paystack";
import { formatDateDMY } from "../../utils/helpers";

interface Props {
  subscription_id: string;
}

/** Instance deletion */
export const SubscriptionDetail = memo(
  forwardRef(({ subscription_id }: Props, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const paymentChangesModalRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
      data: subscriptionData,
      loading,
      error,
    } = useSelector((state: RootState) => state.subscription.detail);
    // @ts-ignore
    const { detail: data } = subscriptionData ? subscriptionData : {};

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        onOpen();
      },
    }));

    useEffect(() => {
      if (isOpen) {
        dispatch(fetchSubscriptionDetail(subscription_id));
      }
    }, [isOpen]);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={true}
        preserveScrollBarGap={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody my={4}>
            {loading && (
              <Box
                my={8}
                display="flex"
                justifyContent="center"
                width="100%"
                height="100%"
                alignItems="center"
              >
                <Spinner size="xl" />
              </Box>
            )}
            {error && <Box m={8}>{error}</Box>}
            {data && !loading && !error && (
              <>
                <Table w="100%">
                  <tbody>
                    <Tr>
                      <Td className="table-title">Status: </Td>
                      <Td px={4}>
                        {subscriptionData?.is_active ? "Active" : "Not active"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-title">Renewal period: </Td>
                      <Td px={4}>
                        {!data.period?.includes("ly")
                          ? data.period + "ly"
                          : data.period}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-title">Cost: </Td>
                      <Td px={4}>
                        {data.amount} {data.currency}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td className="table-title">Next payment due: </Td>
                      <Td px={4}>{formatDateDMY(data.current_period_end)}</Td>
                    </Tr>
                    {data.billing_detail?.billing_type && (
                      <Tr>
                        <Td className="table-title">Payment type: </Td>
                        <Td px={4}>{data.billing_detail.billing_type}</Td>
                      </Tr>
                    )}

                    {/* PAYMENT */}
                    {data.billing_detail?.card && (
                      <Tr>
                        <Td className="table-title">Payment method: </Td>
                        <Td px={4}>
                          <Box>
                            **** **** **** {data.billing_detail.card.last4}
                          </Box>
                        </Td>
                      </Tr>
                    )}

                    {/* BILLING INFORMATION */}
                    {data.billing_detail?.address && (
                      <Tr>
                        <Td className="table-title">Billing information: </Td>
                        <Td px={4}>
                          {data.billing_detail.name && (
                            <Box>{data.billing_detail.name}</Box>
                          )}
                          {data.billing_detail.address.line1 && (
                            <Box>{data.billing_detail.address.line1}</Box>
                          )}
                          {data.billing_detail.address.line2 && (
                            <Box>{data.billing_detail.address.line2}</Box>
                          )}
                          {data.billing_detail.address.city && (
                            <Box>{data.billing_detail.address.city}</Box>
                          )}
                          {data.billing_detail.address.state && (
                            <Box>{data.billing_detail.address.state}</Box>
                          )}
                          {data.billing_detail.address.postal_code && (
                            <Box>{data.billing_detail.address.postal_code}</Box>
                          )}
                          {data.billing_detail.address.country && (
                            <Box>{data.billing_detail.address.country}</Box>
                          )}
                        </Td>
                      </Tr>
                    )}
                  </tbody>
                </Table>
                <Box>
                  {subscriptionData?.payment_method.toLocaleLowerCase() ===
                    "stripe" && (
                    <>
                      <Button
                        display={"block"}
                        mt={4}
                        width={"100%"}
                        leftIcon={<FaCcStripe />}
                        mr={1}
                        colorScheme="blue"
                        size="lg"
                        onClick={
                          //@ts-ignore
                          () => paymentChangesModalRef?.current?.open()
                        }
                      >
                        Update payment
                      </Button>
                      <StripePaymentChangesModal
                        subscription_id={subscription_id}
                        ref={paymentChangesModalRef}
                      />
                    </>
                  )}
                  {subscriptionData?.payment_method.toLocaleLowerCase() ===
                    "paystack" && (
                    <>
                      <Button
                        display={"block"}
                        mt={4}
                        width={"100%"}
                        mr={1}
                        colorScheme="blue"
                        size="lg"
                        onClick={
                          //@ts-ignore
                          () => paymentChangesModalRef?.current?.open()
                        }
                      >
                        Update payment
                      </Button>
                      <PaystackPaymentChangesModal
                        subscription_id={subscription_id}
                        ref={paymentChangesModalRef}
                      />
                    </>
                  )}
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }),
);

export default SubscriptionDetail;
