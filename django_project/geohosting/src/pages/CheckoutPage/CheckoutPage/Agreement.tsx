import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import SignatureCanvas from "react-signature-canvas";

import { headerWithToken } from "../../../utils/helpers";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserProfile } from "../../../redux/reducers/profileSlice";

import '../../../assets/styles/Markdown.css';

interface Agreement {
  id: number,
  name: string;
  template: string;
  signed?: boolean;
  input?: object;

  // We open this after able to change the pdf
  // file: string;
}

interface Props {
  companyName?: string | null;
  isDone: (agreementsIds: number[]) => void;
}

const MarkdownInput = ({ children, name, onChange }) => {
  return (
    <td>
      {
        children.split(name).map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 &&
              <input
                type="text" id={name.replace(/[\s\[\]]/g, '')}
                onChange={(evt) => onChange(evt.target.value)}
              />}
            {part}
          </React.Fragment>
        ))
      }
    </td>
  );
}

const SignaturePad = ({ onChange }) => {
  const sigCanvas = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  /** Clear signature */
  const clearSignature = () => {
    // @ts-ignore
    sigCanvas.current.clear();
    setImageURL(null);
    onChange(null)
  };

  /** The signature end **/
  const handleSignatureEnd = () => {
    if (!sigCanvas.current) {
      return
    }
    // @ts-ignore
    const url = sigCanvas.current.getCanvas().toDataURL("image/png")
    setImageURL(url);
    onChange(url)
  };

  return <td>
    <Box>Signature:</Box>
    <SignatureCanvas
      ref={sigCanvas}
      penColor="black"
      onEnd={handleSignatureEnd}
      canvasProps={{
        width: 300,
        height: 100,
        className: "border rounded-lg shadow-md",
      }}
    />
    <Box
      style={{ fontSize: "0.8rem", cursor: "pointer" }}
      onClick={clearSignature}
    >
      Clear
    </Box>
  </td>
}

const MarkdownRenderer = memo(
  ({ content, onChange }: {
    content: string;
    onChange: (id: string, value: string) => void
  }) => {
    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          td: ({ children }) => {
            if (typeof children === "string") {
              if (children.includes("[Representative Name]")) {
                onChange('Representative Name', '')
                return <MarkdownInput
                  children={children}
                  name={"[Representative Name]"}
                  onChange={(val) => onChange('Representative Name', val)}
                />
              } else if (children.includes("[Title]")) {
                onChange('Title', '')
                return <MarkdownInput
                  children={children} name={"[Title]"}
                  onChange={(val) => onChange('Title', val)}
                />
              } else if (children.includes("[Signature]")) {
                onChange('Signature', '')
                return <SignaturePad
                  onChange={(val) => onChange('Signature', val)}
                />
              }
            }
            return <td>{children}</td>;
          },
        }}
      >
        {content}
      </Markdown>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

interface AgreementMarkdownProps {
  unassignAgreement: Agreement;
  onClose: () => void;
  onAgree: (setInput: object) => void
}

export const AgreementMarkdown = (
  { unassignAgreement, onClose, onAgree }: AgreementMarkdownProps
) => {
  const [input, setInput] = useState<object>({});

  // Check input
  let allInputFilled = true
  if (input) {
    Object.entries(input).forEach(([key, value]) => {
      if (!value) {
        allInputFilled = false
      }
    });
  }

  return <Box padding={8} paddingTop={0}>
    <Box className='Markdown'>
      <MarkdownRenderer
        content={unassignAgreement.template}
        onChange={
          (id, value) => {
            input[id] = value
            setInput({ ...input })
          }
        }
      />
    </Box>
    <HStack justifyContent='space-between'>
      <Button
        mt={4}
        colorScheme='red'
        size="lg"
        onClick={() => onClose()}
      >
        Decline
      </Button>
      <Button
        mt={4}
        colorScheme='blue'
        size="lg"
        isDisabled={!allInputFilled}
        onClick={() => {
          onAgree(input)
        }}
      >
        Accept
      </Button>
    </HStack>
  </Box>
}

export const AgreementModal = forwardRef(
  ({ companyName, isDone }: Props, ref
  ) => {
    const dispatch: AppDispatch = useDispatch();
    const {
      user,
      loading,
      error
    } = useSelector((state: RootState) => state.profile);

    // Get first name and last name
    let name = user ? user.first_name + ' ' + user.last_name : ''

    useEffect(() => {
      dispatch(fetchUserProfile());
    }, [dispatch]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [agreements, setAgreements] = useState<Agreement[] | null>(null);

    useEffect(() => {
      if (isOpen) {
        setAgreements(null);
        (
          async () => {
            try {
              const response = await axios.get(
                '/api/template/agreements/',
                {
                  headers: headerWithToken()
                }
              );
              const results = response.data.results;
              results.map((result: Agreement) => {
                result.template = result.template
                  .replaceAll(
                    '[Client Name]',
                    companyName ? companyName : name
                  ).replaceAll(
                    '[Date]',
                    new Date().toISOString().split('T')[0]
                  )
              })
              setAgreements(results)
            } catch (error) {
              toast.error("There is error on loading term and condition.");
              onClose()
            }
          }
        )()
      }
    }, [isOpen]);

    /**
     * Get unassigned agreement
     */
    let unassignAgreement: Agreement | null | undefined = null
    if (agreements) {
      unassignAgreement = agreements.find(agreement => !agreement.signed)
    }

    useEffect(() => {
      if (isOpen && agreements) {
        if (!unassignAgreement) {
          onClose()
          isDone(agreements.map(agreement => agreement.id))
        }
      }
    }, [agreements]);

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        onOpen()
      }
    }));

    return <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay/>
      <ModalContent maxWidth={{ md: '100%', xl: '80%', '2xl': '50%' }}>
        <ModalCloseButton/>
        <ModalHeader>{unassignAgreement?.name}</ModalHeader>
        <ModalBody padding='0' minHeight={300}>
          {
            agreements === null || loading ?
              <Box
                position={'absolute'} display={'flex'}
                justifyContent={'center'} width={'100%'} height={'100%'}
                alignItems={'center'}>
                <Spinner size='xl'/>
              </Box> : error ? <Box>
                There is error on fetching agreement, please refresh
              </Box> : unassignAgreement ?
                <AgreementMarkdown
                  unassignAgreement={unassignAgreement}
                  onClose={onClose}
                  onAgree={(input) => {
                    setAgreements(
                      agreements.map(agreement => {
                        if (agreement.id === unassignAgreement?.id) {
                          unassignAgreement.input = input
                          unassignAgreement.signed = true
                        }
                        return agreement
                      })
                    )
                  }}
                /> : null
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  }
)