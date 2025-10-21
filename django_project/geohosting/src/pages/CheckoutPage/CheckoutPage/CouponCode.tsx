import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import { headerWithToken } from "../../../utils/helpers";

export interface Props {
  couponCode: string;
  setCouponCode: (couponCode: string) => void;
  isValid: (val: boolean) => void;
}

let lastCouponCode = "";

export const CouponCode: React.FC<Props> = ({
  couponCode,
  setCouponCode,
  isValid,
}) => {
  const [text, setText] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onValidateCoupon = () => {
    lastCouponCode = couponCode;
    axios
      .post(
        "/api/coupon-check/paystack/",
        { coupon_code: couponCode },
        {
          headers: headerWithToken(),
        },
      )
      .then((response) => {
        console.log(response);
        if (lastCouponCode === couponCode) {
          setChecking(false);
          setError("");
          setText(response.data);
        }
      })
      .catch(function (error) {
        if (lastCouponCode === couponCode) {
          setChecking(false);
          setError(error.response.data);
        }
      });
  };

  /** Set validation */
  useEffect(() => {
    isValid(!checking && !error);
  }, [checking, error]);

  /** Set validation */
  useEffect(() => {
    setText("");
    if (couponCode) {
      setError("Need to validate coupon code");
      isValid(false);
    } else {
      setError("");
      isValid(true);
    }
  }, [couponCode]);

  return (
    <>
      <InputGroup mt={4} width="100%">
        <Input
          backgroundColor="white"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          isInvalid={!!error}
        />
        <InputRightElement width="5.5rem">
          <Button
            h="1.75rem"
            size="sm"
            colorScheme="yellow"
            onClick={onValidateCoupon}
            isDisabled={checking}
          >
            Validate
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && (
        <Box color="red" fontSize={14} minHeight={8}>
          {error}
        </Box>
      )}
      {text && (
        <Box color="green" fontSize={14} minHeight={8}>
          {text}
        </Box>
      )}
    </>
  );
};
export default CouponCode;
