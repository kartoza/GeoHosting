import React from "react";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const COOKIE_KEY = "cloudbench_disclaimer_dismissed";

export const useCloudBenchDisclaimer = () => {
  const dismissed = document.cookie
    .split("; ")
    .some((c) => c.startsWith(COOKIE_KEY + "="));
  return !dismissed;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CloudBenchDisclaimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [doNotShowAgain, setDoNotShowAgain] = React.useState(false);

  const handleClose = () => {
    if (doNotShowAgain) {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `${COOKIE_KEY}=true; expires=${expires.toUTCString()}; path=/`;
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to Kartoza Cloud Bench</ModalHeader>
        <ModalBody display="flex" flexDirection="column" gap={3}>
          <Text>
            Please note that this service is still{" "}
            <strong>EXPERIMENTAL</strong>.
          </Text>
          <Text>
            You are welcome to use it as an early preview and we hope that you
            already find it useful, but it is not covered as part of our
            customer Service Level Agreement (SLA) and we make no guarantees for
            the quality of experience you have using the platform yet.
          </Text>
          <Text>
            Once it graduates to a production application, we will include it in
            our SLA.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Checkbox
            isChecked={doNotShowAgain}
            onChange={(e) => setDoNotShowAgain(e.target.checked)}
          >
            Do not show this again!
          </Checkbox>
          <Button colorScheme="orange" onClick={handleClose}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CloudBenchDisclaimerModal;
