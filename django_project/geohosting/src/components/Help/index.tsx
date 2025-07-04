import React, { CSSProperties, FC } from "react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { DocsCrawlerPage } from "django-docs-crawler-react";

import "django-docs-crawler-react/dist/style.css";
import "./index.scss";

interface IHelp {
  isDrawer?: boolean;
  backgroundColor?: string;
  style?: CSSProperties | undefined;
}

const Help: FC<IHelp> = ({
  isDrawer,
  backgroundColor = "gray.500",
  style = {},
}) => {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const relativeUrl = (window.location.pathname + window.location.hash).replace(
    "/#",
    "",
  );

  return (
    <>
      {isDrawer ? (
        <Button
          aria-label="Open menu"
          leftIcon={<FaQuestionCircle />}
          onClick={onDrawerOpen}
          backgroundColor={backgroundColor}
          _hover={{ backgroundColor: backgroundColor, opacity: 0.8 }}
          minWidth={0}
          marginLeft={isDrawer ? 0 : "-0.5rem"}
          style={style}
        >
          Help
        </Button>
      ) : (
        <IconButton
          aria-label="Open menu"
          icon={<FaQuestionCircle />}
          onClick={onDrawerOpen}
          backgroundColor={backgroundColor}
          _hover={{ backgroundColor: backgroundColor, opacity: 0.8 }}
          minWidth={0}
          marginLeft={"-0.5rem"}
        />
      )}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent minWidth={"600px"}>
          <DrawerCloseButton />
          <DrawerBody>
            <DocsCrawlerPage
              dataUrl={"/docs_crawler/data"}
              open={true}
              setOpen={onDrawerClose}
              relativeUrl={relativeUrl}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Help;
