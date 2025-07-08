import React, { useRef } from "react";
import InstanceDeletion from "../../../components/Instance/Deletion";
import { Instance } from "../../../redux/reducers/instanceSlice";
import { Button } from "@chakra-ui/react";

interface Props {
  instanceInput: Instance;
}

export const DeleteInstance: React.FC<Props> = ({ instanceInput }) => {
  const modalRef = useRef(null);
  return (
    <Button
      colorScheme="red"
      mt={6}
      // @ts-ignore
      onClick={() => modalRef?.current?.open()}
    >
      <InstanceDeletion instance={instanceInput} ref={modalRef} />
      Delete
    </Button>
  );
};
