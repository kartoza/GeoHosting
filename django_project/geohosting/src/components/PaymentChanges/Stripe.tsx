import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
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
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Instance } from "../../redux/reducers/instanceSlice";
import { RootState } from "../../redux/store";

interface EmbeddedCheckoutProviderProps {
  url?: string | null;
  fetchClientSecret?: (() => Promise<string>) | null;
  onComplete?: () => void;
}

interface Props {
  instance: Instance;
}

export const StripePaymentChangesModal = forwardRef(
  ({ instance }: Props, ref
  ) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [stripeOptions, setStripeOptions] = useState<EmbeddedCheckoutProviderProps | null>(null);
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    useEffect(() => {
      setStripeOptions(null);
      if (isOpen) {
        (
          async () => {
            try {
              // Get the stripe key
              if (!stripePromise) {
                const setting = await axios.get(`/api/settings?key=STRIPE_PUBLISHABLE_KEY`, {
                  headers: { Authorization: `Token ${token}` }
                })
                setStripePromise(loadStripe(setting.data))
              }
              const response = await axios.post(
                `/api/instances/${instance.id}/payment-changes/stripe`,
                {
                  url: window.location.href
                },
                {
                  headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                  },
                });
              window.location.href = response.data.url
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

    return <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
      <ModalOverlay/>
      <ModalContent>
        <ModalCloseButton/>
        <ModalBody padding='0'>
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
export default StripePaymentChangesModal;