import React, { forwardRef, useState } from "react";
import { Instance } from "../../redux/reducers/instanceSlice";
import axios from "axios";
import { headerWithToken } from "../../utils/helpers";
import { toast } from "react-toastify";
import { Box, Spinner } from "@chakra-ui/react";

interface Props {
  instance: Instance;
  product?: string;
}

/** Instance credential */
export const InstanceCredential = forwardRef(
  ({ instance, product }: Props, ref) => {
    const [fetchingCredential, setFetchingCredential] =
      useState<boolean>(false);
    let url = `/api/instances/${instance.name}/credential/`;
    if (product) {
      url += "?product=" + product;
    }

    /** Fetch credential **/
    const fetchCredential = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (fetchingCredential) {
        return;
      }
      setFetchingCredential(true);

      try {
        const response = await axios.get(url, {
          headers: headerWithToken(),
        });
        const { username, password } = response.data;
        navigator.clipboard
          .writeText(password)
          .then(() => {
            toast.success(
              "Please ensure that you change your password within the application for security purposes.",
            );
            toast.success(
              "Your credentials have been successfully copied to the clipboard.",
            );
          })
          .catch(() => {
            toast.error("Failed to get credentials, please retry.");
          });
      } catch (err) {
        toast.error("Failed to get credentials, please retry.");
      }
      setFetchingCredential(false);
    };

    return (
      <Box
        cursor="pointer"
        color="yellow.500"
        onClick={fetchCredential}
        _hover={{ opacity: 0.8 }}
      >
        Get password
        <>{fetchingCredential && <Spinner width={4} height={4} ml={1} />}</>
      </Box>
    );
  },
);

export default InstanceCredential;
