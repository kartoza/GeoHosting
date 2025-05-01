import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { Subscription } from "../../redux/reducers/subscriptionSlice";

interface Props {
  subscription: Subscription;
}

/** Instance deletion */
export const SubscriptionDetail = forwardRef(
  ({ subscription }: Props, ref
  ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleting, setDeleting] = useState(false);

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        onOpen()
      }
    }));

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={true}
        preserveScrollBarGap={true}>
        <ModalOverlay/>
        <ModalContent bg={'gray.200'}>
          <ModalCloseButton/>
          <ModalBody m={4}>

          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

export default SubscriptionDetail;