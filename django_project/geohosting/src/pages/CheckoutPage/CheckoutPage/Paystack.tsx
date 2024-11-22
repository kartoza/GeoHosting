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
import axios from "axios";
import { useSelector } from "react-redux";
import PaystackPop from '@paystack/inline-js';
import { toast } from "react-toastify";
import { RootState } from "../../../redux/store";

interface StripePaymentModalProps {
  url: string,
  appName: string;
  companyName?: string | null;
}

export const PaystackPaymentModal = forwardRef(
  (props: StripePaymentModalProps, ref
  ) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
      if (isOpen) {
        (
          async () => {
            try {
              const response = await axios.post(
                props.url,
                {
                  app_name: props.appName,
                  company_name: props.companyName ? props.companyName : '',
                },
                {
                  headers: { Authorization: `Token ${token}` }
                }
              );
              onClose()
              const paystackInstance = new PaystackPop();
              const transaction = paystackInstance.resumeTransaction(response.data.key);
              transaction.callbacks.onSuccess = (_) => {
                window.location.replace(response.data.success_url);
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