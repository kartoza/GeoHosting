import React, { useState } from 'react';
import {
  Box,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text
} from '@chakra-ui/react';
import { debounce } from "debounce";
import axios from "axios";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Product } from "../../../redux/reducers/productsSlice";

export interface OrderSummaryProps {
  product: Product;
  appName: string;
  setAppName: (appName: string) => void;
  appNameIsOk: boolean;
  setAppNameIsOk: (val: boolean) => void;
}

let lastAppName = null;

export const OrderConfiguration: React.FC<OrderSummaryProps> = (
  { product, appName, setAppName, appNameIsOk, setAppNameIsOk }
) => {
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string>('App name is empty');

  /** Check app name */
  const debouncedChange = debounce((inputValue) => {
    if (lastAppName === inputValue) {
      const token = localStorage.getItem('token');
      axios.post(
        '/api/test-app-name/',
        { app_name: inputValue },
        {
          headers: { Authorization: `Token ${token}` }
        }
      ).then((response) => {
        if (lastAppName === inputValue) {
          setChecking(false)
          setError('')
          setAppNameIsOk(true)
        }
      }).catch(function (error) {
        if (lastAppName === inputValue) {
          setChecking(false)
          setError(error.response.data)
          setAppNameIsOk(false)
        }
      })
    }
  }, 500);

  const handleChange = (evt) => {
    const val = evt.target.value;
    lastAppName = val
    setError('');
    setAppNameIsOk(false);
    setAppName(val);
    if (!val) {
      setAppNameIsOk(false)
      setError('App name is empty')
    } else {
      setChecking(true);
      debouncedChange(val);
    }
  };

  return (
    <>
      <GridItem>
        <Box>
          <Box
            fontSize={22} color={'black'} display='flex' alignItems='center'>
            Application name
          </Box>
        </Box>
        <Box padding={8} backgroundColor="gray.100" borderRadius={10}>
          <Box display='flex' alignItems='center'>
            <InputGroup>
              <Input
                textAlign='right'
                value={appName}
                backgroundColor="white"
                placeholder='Please provide a name for your application'
                size='lg'
                onChange={handleChange}
                isInvalid={!!error}
              />


              {
                checking ?
                  <InputLeftElement height='100%'>
                    <Spinner/>
                  </InputLeftElement> : error ?
                    <InputLeftElement height='100%'>
                      <Icon as={WarningIcon} color="red.500"/>
                    </InputLeftElement> : <InputLeftElement height='100%'>
                      <Icon as={CheckCircleIcon} color="green.500"/>
                    </InputLeftElement>
              }
            </InputGroup>
            &nbsp;.{product.domain}
          </Box>
          <Box color='red' fontSize={14} minHeight={8}>{error}</Box>
          <Box>
            <Text
              fontSize={13} color={'gray'} fontStyle={"italic"}
              marginTop={'1rem'}>
              <i>
                Name may only contain lowercase letters, numbers or
                dashes.<br/>
                This will be used for subdomain and also application
                name.
                e.g: appname.geonode.kartoza.com
              </i>
            </Text>
          </Box>
        </Box>
      </GridItem>
    </>
  );
};
export default OrderConfiguration;