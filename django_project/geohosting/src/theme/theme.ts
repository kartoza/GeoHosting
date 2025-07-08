// src/theme/theme.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    blue: {
      400: "#57A0C8",
      500: "#4F9AC0",
    },
    customOrange: {
      500: "#ECB44B",
      600: "#4F9AC0",
    },
    gray: {
      350: "#CCCCCC",
      200: "#eaeaea",
      500: "#414042",
      600: "#3E3E3E",
    },
  },
  fonts: {
    body: "Lato, sans-serif",
    heading: "Lato, sans-serif",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
  components: {
    Heading: {
      sizes: {
        h1: {
          fontSize: "5xl",
        },
        h2: {
          fontSize: "4xl",
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        _disabled: {
          bg: "blue.300",
          cursor: "not-allowed",
        },
      },
      sizes: {
        xl: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === "orange" ? "customOrange.500" : undefined,
          color: "white",
          _hover: {
            bg: props.colorScheme === "orange" ? "customOrange.600" : undefined,
          },
          _disabled: {
            bg: "blue.300",
          },
        }),
      },
    },

    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.350",
            _focus: {
              borderColor: "gray.350",
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.350",
            _focus: {
              borderColor: "gray.350",
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: "gray.350",
          _focus: {
            borderColor: "gray.350",
          },
        },
      },
    },

    Table: {
      variants: {
        simple: {
          th: {
            borderColor: "gray.350",
          },
          td: {
            borderColor: "gray.350",
          },
        },
      },
    },
  },
});

export default customTheme;
