import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface Props {

}

export const PasswordResetModal = forwardRef(
  (props: Props, ref
  ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [passwords, setPasswords] = useState({
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
      oldPassword: false,
      newPassword: false,
      repeatPassword: false,
    });
    const [passwordError, setPasswordError] = useState('');

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        console.log('Open')
        onOpen()
      }
    }));

    const handlePasswordUpdate = () => {
      // Implement password update logic
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof passwords) => {
      const { value } = e.target;
      setPasswords({ ...passwords, [field]: value });

      if (field === 'repeatPassword') {
        if (passwords.newPassword !== value) {
          setPasswordError('Passwords do not match.');
        } else {
          setPasswordError('');
        }
      }
    };

    const renderInputField = (field: keyof typeof passwords, label: string) => (
      <FormControl position="relative">
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          <Input
            type={showPassword[field] ? 'text' : 'password'}
            value={passwords[field]}
            onChange={(e) => handlePasswordChange(e, field)}
            borderWidth="0px"
            bg="white"
            width="400px"
          />
          <InputRightElement>
            <IconButton
              aria-label={showPassword[field] ? 'Hide password' : 'Show password'}
              icon={showPassword[field] ? <ViewOffIcon color="gray.500"/> :
                <ViewIcon color="gray.500"/>}
              onClick={() => setShowPassword({
                ...showPassword,
                [field]: !showPassword[field]
              })}
              variant="link"
              color="gray.500"
              size="sm"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );

    return <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={true}
      preserveScrollBarGap={true}>
      <ModalOverlay/>
      <ModalContent bg={'gray.200'}>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={6} alignItems="flex-start" p={"3rem 2rem"}>
            {renderInputField('oldPassword', 'Old Password')}
            {renderInputField('newPassword', 'New Password')}
            {renderInputField('repeatPassword', 'Repeat New Password')}
            {passwordError && <Text color="red.500">{passwordError}</Text>}
            <Button
              w={'100%'}
              mt={2}
              colorScheme="blue"
              onClick={handlePasswordUpdate}
              alignSelf="flex-start"
              isDisabled={!!passwordError || passwords.newPassword !== passwords.repeatPassword}
            >
              Change Password
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  });
