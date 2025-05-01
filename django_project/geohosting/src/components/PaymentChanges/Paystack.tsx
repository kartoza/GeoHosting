import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { RootState } from "../../redux/store";
import PaystackPop from '@paystack/inline-js';


interface Props {
  subscription_id: string;
}

export const PaystackPaymentChangesModal = forwardRef(
  ({ subscription_id }: Props, ref
  ) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
      if (isOpen) {
        (
          async () => {
            try {
              const response = await axios.post(
                `/api/subscription/${subscription_id}/payment-changes/paystack/`,
                {
                  url: window.location.href
                },
                {
                  headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                  },
                });
              onClose()
              const paystackInstance = new PaystackPop();
              const transaction = paystackInstance.resumeTransaction(response.data.key);
              transaction.callbacks.onSuccess = (_) => {
                window.location.reload()
              }
            } catch (error) {
              toast.error("There is error on checkout, please try it again.");
              onClose()
            }
          }
        )()
      }
    }, [isOpen]);

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        onOpen()
      }
    }));

    return <Modal isOpen={isOpen} onClose={onClose} size={'sm'}>
      <ModalOverlay/>
      <ModalContent>
        <ModalCloseButton/>
        <ModalBody padding='0' minHeight={300}>
          <Box
            position={'absolute'} display={'flex'}
            justifyContent={'center'} width={'100%'} height={'100%'}
            alignItems={'center'}>
            <Spinner size='xl'/>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  }
)
export default PaystackPaymentChangesModal;