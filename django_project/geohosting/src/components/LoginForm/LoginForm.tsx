import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../redux/store";
import {
  login,
  logout,
  register,
  resetPassword,
} from "../../redux/reducers/authSlice";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  formType?: "login" | "signup" | "forgotPassword";
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isOpen,
  onClose,
  formType = "login",
  onSuccess,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(
    formType === "forgotPassword",
  );
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);

  const handleClick = () => setShow(!show);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsEmailTouched(true);
    setIsEmailValid(emailValue === "" || validateEmail(emailValue));
  };

  const handleLogin = () => {
    dispatch(login({ email, password })).then((result: any) => {
      if (result.meta.requestStatus === "fulfilled") {
        onClose();
        if (!onSuccess) {
          location.reload();
        } else {
          onSuccess();
        }
      } else if (result.meta.requestStatus === "rejected") {
        const errorMessages = result.payload
          ? Object.entries(result.payload)
              .map(([key, value]) => `${value}`)
              .join("\n")
          : "Login failed. Please try again.";
        toast.error(errorMessages);
      }
    });
  };

  const handleSignUp = () => {
    dispatch(
      register({
        email,
        password,
        firstName,
        lastName,
      }),
    ).then((result: any) => {
      if (result.meta.requestStatus === "fulfilled") {
        if (!onSuccess) {
          location.reload();
        } else {
          onSuccess();
        }
      } else if (result.meta.requestStatus === "rejected") {
        const errorMessages = result.payload
          ? Object.entries(result.payload)
              .map(([key, value]) => `${value}`)
              .join("\n")
          : "Sign up failed. Please try again.";
        toast.error(errorMessages);
      }
    });
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      toast.success("Successfully logged out.");
      onClose();
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isForgotPassword) {
        handlePasswordReset();
      } else if (isSignUp || formType === "signup") {
        handleSignUp();
      } else {
        handleLogin();
      }
    }
  };

  const handlePasswordReset = () => {
    dispatch(resetPassword(email)).then((result: any) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("An email has been sent to reset your password.");
        setIsForgotPassword(false);
      } else if (result.meta.requestStatus === "rejected") {
        const errorMessages = result.payload
          ? Object.entries(result.payload)
              .map(([key, value]) => `${value}`)
              .join("\n")
          : "Password reset failed. Please try again later.";
        toast.error(errorMessages);
      }
    });
  };

  const isFormValid = () => {
    if (isSignUp || formType === "signup") {
      return email && password && firstName && lastName && isEmailValid;
    } else if (isForgotPassword) {
      return email && isEmailValid;
    }
    return email && password && isEmailValid;
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsEmailTouched(false);
    setEmail("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={true}
      preserveScrollBarGap={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {token
            ? "Welcome"
            : isSignUp || formType === "signup"
              ? "Sign Up"
              : isForgotPassword
                ? "Reset Password"
                : "Log in"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {token ? (
            <Text>You are already logged in.</Text>
          ) : (
            <form>
              <VStack spacing={4}>
                {(isSignUp || formType === "signup") && (
                  <>
                    <FormControl id="first-name" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onKeyUp={handleKeyPress}
                      />
                    </FormControl>
                    <FormControl id="last-name" isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onKeyUp={handleKeyPress}
                      />
                    </FormControl>
                  </>
                )}
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    autoFocus={true}
                    onChange={handleEmailChange}
                    onKeyUp={handleKeyPress}
                  />
                  {isEmailTouched && !isEmailValid && (
                    <Text color="red.500">Invalid email address.</Text>
                  )}
                </FormControl>
                {!isForgotPassword && (
                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={handleKeyPress}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={handleClick}
                          colorScheme="blue"
                        >
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                )}
                {!isForgotPassword && formType !== "signup" && (
                  <Link
                    href="#"
                    fontSize="sm"
                    color="purple.500"
                    display="block"
                    alignSelf="flex-end"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent page reload
                      setIsForgotPassword(true);
                    }}
                  >
                    Forgot your password?
                  </Link>
                )}
              </VStack>
            </form>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center" flexDirection="column">
          {token ? (
            <Button
              colorScheme="blue"
              onClick={handleLogout}
              isLoading={loading}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                colorScheme="blue"
                onClick={
                  isForgotPassword
                    ? handlePasswordReset
                    : isSignUp || formType === "signup"
                      ? handleSignUp
                      : handleLogin
                }
                isLoading={loading}
                isDisabled={!isFormValid()}
              >
                {isForgotPassword
                  ? "Reset Password"
                  : isSignUp || formType === "signup"
                    ? "Sign Up"
                    : "Login"}
              </Button>
              {!isForgotPassword && formType !== "signup" && (
                <Button
                  variant="ghost"
                  size="sm"
                  mt={2}
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp
                    ? "Have an account? Log in"
                    : "Need an account? Sign up"}
                </Button>
              )}
              {isForgotPassword && (
                <Button
                  variant="ghost"
                  size="sm"
                  mt={2}
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginForm;
