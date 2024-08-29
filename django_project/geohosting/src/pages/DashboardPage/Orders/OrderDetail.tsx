/*** ORDER DETAILS **/
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Box, Spinner } from "@chakra-ui/react";
import { FaPrint } from "react-icons/fa6";


interface DataProps {
  data?: {
    id: string,
    status: string,
    date: string,
    order_status: string,
    payment_method: string,
    package: {
      name: string,
      feature_list: {
        spec: Array<string>
      },
    },
    invoice_url: string
  },
  error?: string
}

const OrderDetail: React.FC = () => {
  /** Order Detail Component */
  const { id } = useParams<{ id: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [state, setState] = useState<DataProps>({});

  useEffect(() => {
    (
      async () => {
        try {
          const response = await axios.get(`/api/orders/${id}`, {
            headers: { Authorization: `Token ${token}` }
          });
          setState({ data: response.data })
          // @ts-ignore
        } catch ({ message }) {
          setState(
            {
              error: `${message}`
            }
          )
        }
      }
    )()
  }, []);

  return <div>
    {
      !state.data && !state.error ? (
        <Box display={'flex'} justifyContent={'center'}
             width={'100%'} height={'100%'} alignItems={'center'}>
          <Spinner size='xl'/>
        </Box>
      ) : state.error ? (
        <Box color='Red'>{state.error}</Box>
      ) : (
        <Box>
          You ordered at : {state.data?.date}
          <Box><b>Package</b> : {state.data?.package.name}</Box>
          <Box><b>Status</b> : {state.data?.order_status}</Box>
          <Box><b>Payment method</b> : {state.data?.payment_method}</Box>
          <Box>
            <b>Spec</b> : {state.data?.package.feature_list.spec.join(', ')}
          </Box>
          {
            state.data?.invoice_url ?
              <Box marginTop={5}>
                <a href={state.data?.invoice_url} target='_blank'>
                  Invoice <FaPrint style={{ display: "inline-block" }}/>
                </a>
              </Box> : null
          }
        </Box>
      )
    }
  </div>
}


export default OrderDetail;
