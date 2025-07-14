import React, { forwardRef } from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import ProfileForm, { Props } from "./ProfileForm";

interface ModalProps extends Props {
  description?: string;
  isOpen: boolean;
}

export const ProfileFormModal = forwardRef(
  ({ isOpen, description, hide }: ModalProps, ref) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        blockScrollOnMount={true}
        preserveScrollBarGap={true}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent p={12}>
          {description && (
            <Box
              backgroundColor="gray.200"
              borderColor="gray.300"
              textAlign="center"
              borderWidth={1}
              borderRadius={4}
              color="orange.500"
              px={8}
              py={4}
              mb={4}
            >
              {description}
            </Box>
          )}
          <ProfileForm hide={hide} />
        </ModalContent>
      </Modal>
    );
  },
);
