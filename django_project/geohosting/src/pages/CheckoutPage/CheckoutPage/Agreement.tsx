import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SignatureCanvas from "react-signature-canvas";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getUserLocation, headerWithToken } from "../../../utils/helpers";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserProfile } from "../../../redux/reducers/profileSlice";
import "../../../assets/styles/Markdown.css";

interface CheckboxProps {
  name: string;
  onChange: (value: boolean) => void;
}

export const MarkdownCheckbox = forwardRef(
  ({ name, onChange }: CheckboxProps, ref) => {
    const [checked, setChecked] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      valueChange(value) {
        setChecked(value === name);
      },
    }));

    return (
      <td>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            name={name}
            type="checkbox"
            checked={checked}
            onChange={() => {
              setChecked(true);
              onChange(true);
            }}
          />
          {name}
        </label>
      </td>
    );
  },
);

const MarkdownInput = ({ children, name, onChange }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <td>
      {children.split(name).map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <>
              <input
                id={name.replace(/[\s\[\]]/g, "")}
                type="text"
                value={value}
                onChange={(evt) => setValue(evt.target.value)}
              />
              <span className="Read">{value}</span>
            </>
          )}
          {part}
        </React.Fragment>
      ))}
    </td>
  );
};

const SignaturePad = ({ onChange }) => {
  const sigCanvas = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  /** Clear signature */
  const clearSignature = () => {
    // @ts-ignore
    sigCanvas.current.clear();
    setImageURL(null);
    onChange(null);
  };

  /** The signature end **/
  const handleSignatureEnd = () => {
    if (!sigCanvas.current) {
      return;
    }
    // @ts-ignore
    const url = sigCanvas.current.getCanvas().toDataURL("image/png");
    setImageURL(url);
    onChange(url);
  };

  return (
    <td>
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
        className="Button"
        style={{ fontSize: "0.8rem", cursor: "pointer" }}
        onClick={clearSignature}
      >
        Clear
      </Box>
    </td>
  );
};

const MarkdownRenderer = memo(
  ({
    content,
    onChange,
  }: {
    content: string;
    onChange: (id: string, value: string) => void;
  }) => {
    const checkboxRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
      (async () => {
        const userLocation = await getUserLocation();
        const host =
          userLocation === "ZA" ? "Kartoza (Pty) Ltd" : "Kartoza, LDA";
        for (const key in checkboxRefs.current) {
          // @ts-ignore
          checkboxRefs.current[key].valueChange(host);
        }
        onChange("host", host);
      })();
    }, [checkboxRefs]);

    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          td: ({ children }) => {
            if (typeof children === "string") {
              // Rendering checkbox
              const checkboxMatch = children.match(/\☐\s*(.*)/);
              if (checkboxMatch) {
                const name = checkboxMatch[1];
                return (
                  <MarkdownCheckbox
                    // @ts-ignore
                    name={name}
                    onChange={(val) => {
                      onChange("host", name);
                      for (const key in checkboxRefs.current) {
                        // @ts-ignore
                        checkboxRefs.current[key].valueChange(name);
                      }
                    }}
                    ref={(el) => {
                      // @ts-ignore
                      checkboxRefs.current[checkboxMatch[1]] = el;
                    }}
                  />
                );
              }
              // SIGNATURE
              else if (children.includes("[Signature]")) {
                onChange("Signature", "");
                return (
                  <SignaturePad
                    onChange={(val) => onChange("Signature", val)}
                  />
                );
              } else {
                const match = children.match(/\[([^\]]+)\]/);
                if (match) {
                  const extractedText = match[1];
                  return (
                    <MarkdownInput
                      children={children}
                      name={`[${extractedText}]`}
                      onChange={(val) => onChange(extractedText, val)}
                    />
                  );
                }
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
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);

export interface Agreement {
  id: number;
  name: string;
  template: string;
  signed?: boolean;
  blob?: Blob;

  // We open this after able to change the pdf
  // file: string;
}

interface AgreementMarkdownProps {
  unassignAgreement: Agreement;
  onClose: () => void;
  onAgree: (blob: Blob) => void;
}

export const AgreementMarkdown = ({
  unassignAgreement,
  onClose,
  onAgree,
}: AgreementMarkdownProps) => {
  const [input, setInput] = useState<object>({ host: null });
  const [generating, setGenerating] = useState<boolean>(false);

  // Check input
  let allInputFilled = true;
  if (input) {
    Object.entries(input).forEach(([key, value]) => {
      if (!value) {
        allInputFilled = false;
      }
    });
  }

  /** Generate pdf blob **/
  const generatePdfBlob = async (element) => {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = 6;
    const imgWidth = pageWidth - 2 * marginX;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 0;

    while (yPosition < imgHeight) {
      pdf.addImage(imgData, "JPEG", marginX, -yPosition, imgWidth, imgHeight);
      yPosition += pageHeight;

      if (yPosition < imgHeight) {
        pdf.addPage();
      }
    }

    return pdf.output("blob");
  };
  return (
    <Box>
      <Box id="Markdown" padding={8} paddingTop={0}>
        <MarkdownRenderer
          content={unassignAgreement.template}
          onChange={(id, value) => {
            input[id] = value;
            setInput({ ...input });
          }}
        />
      </Box>
      <HStack justifyContent="space-between" padding={8} paddingTop={0}>
        <Button mt={4} colorScheme="red" size="lg" onClick={() => onClose()}>
          Decline
        </Button>
        <Button
          mt={4}
          colorScheme="blue"
          size="lg"
          isDisabled={!allInputFilled || generating}
          onClick={async () => {
            setGenerating(true);
            const element = document.getElementById("Markdown");
            if (!element) {
              return;
            }
            element.classList.add("Read");
            const blob = await generatePdfBlob(element);
            element.classList.remove("Read");
            setGenerating(false);
            onAgree(blob);
          }}
        >
          Accept
        </Button>
      </HStack>
    </Box>
  );
};

interface Props {
  companyName?: string | null;
  paymentMethod: string | null;
  isDone: (agreements: Agreement[]) => void;
}

export const AgreementModal = forwardRef(
  ({ companyName, paymentMethod, isDone }: Props, ref) => {
    const dispatch: AppDispatch = useDispatch();
    const { user, loading, error } = useSelector(
      (state: RootState) => state.profile,
    );

    // Get first name and last name
    let name = user ? user.first_name + " " + user.last_name : "";

    useEffect(() => {
      dispatch(fetchUserProfile());
    }, [dispatch]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [agreements, setAgreements] = useState<Agreement[] | null>(null);

    useEffect(() => {
      if (isOpen) {
        setAgreements(null);
        (async () => {
          try {
            const response = await axios.get(
              "/api/template/agreements/?payment_method=" + paymentMethod,
              {
                headers: headerWithToken(),
              },
            );
            const results = response.data.results;
            results.map((result: Agreement) => {
              if (companyName) {
                result.template = result.template.replaceAll(
                  "[Representative Name]",
                  name,
                );
              } else {
                result.template = result.template.replaceAll(
                  "Representative name: [Representative Name]",
                  "",
                );
              }
              result.template = result.template
                .replaceAll("[Client Name]", companyName ? companyName : name)
                .replaceAll("[Date]", new Date().toISOString().split("T")[0]);
            });
            setAgreements(results);
          } catch (error) {
            toast.error("There is error on loading term and condition.");
            onClose();
          }
        })();
      }
    }, [isOpen]);

    /**
     * Get unassigned agreement
     */
    let unassignAgreement: Agreement | null | undefined = null;
    if (agreements) {
      unassignAgreement = agreements.find((agreement) => !agreement.signed);
    }

    useEffect(() => {
      if (isOpen && agreements) {
        if (!unassignAgreement) {
          onClose();
          isDone(agreements);
        }
      }
    }, [agreements]);

    // Open
    useImperativeHandle(ref, () => ({
      open() {
        onOpen();
      },
    }));

    return (
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent maxWidth={{ md: "100%", xl: "80%", "2xl": "50%" }}>
          <ModalCloseButton />
          <ModalHeader>{unassignAgreement?.name}</ModalHeader>
          <ModalBody padding="0" minHeight={300}>
            {agreements === null || loading ? (
              <Box
                position={"absolute"}
                display={"flex"}
                justifyContent={"center"}
                width={"100%"}
                height={"100%"}
                alignItems={"center"}
              >
                <Spinner size="xl" />
              </Box>
            ) : error ? (
              <Box>There is error on fetching agreement, please refresh</Box>
            ) : unassignAgreement ? (
              <AgreementMarkdown
                unassignAgreement={unassignAgreement}
                onClose={onClose}
                onAgree={(blob) => {
                  setAgreements(
                    agreements.map((agreement) => {
                      if (agreement.id === unassignAgreement?.id) {
                        unassignAgreement.blob = blob;
                        unassignAgreement.signed = true;
                      }
                      return agreement;
                    }),
                  );
                }}
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  },
);
