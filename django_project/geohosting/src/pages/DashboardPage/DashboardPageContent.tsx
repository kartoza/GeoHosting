import React, { ReactNode } from "react";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";

interface Props {
  title: string;
  toggleSidebar: () => void;
  element: ReactNode;
  content?: {
    p: number;
  };
}

const DashboardPageContent = ({
  title,
  toggleSidebar,
  element,
  content = { p: 8 },
}: Props) => {
  const { id } = useParams<{ id: string }>();
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Flex
        zIndex={99}
        as="header"
        align="center"
        justifyContent={{ base: "left", md: "space-between" }}
        w="full"
        px={4}
        bg="#3e3e3e"
        borderBottomWidth="1px"
        borderColor="gray.200"
        h="14"
        flexShrink={0}
      >
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: "inline-flex", md: "none" }}
          color="#3e3e3e"
          onClick={toggleSidebar}
        />
        <Heading size="md" textAlign="center" color={"#ffffff"} p={4}>
          {title}{" "}
          {id ? (
            <>
              <span style={{ margin: "0 0.5rem" }}>/</span>
              {id}
            </>
          ) : null}
        </Heading>
      </Flex>

      <Box flex={1} overflowY="auto" p={content.p}>
        {element}
      </Box>
    </Box>
  );
};

export default DashboardPageContent;
