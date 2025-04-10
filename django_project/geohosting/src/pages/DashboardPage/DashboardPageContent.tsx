import React, { ReactNode } from 'react';
import { Box, Flex, Heading, IconButton, } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

interface Props {
  title: string;
  toggleSidebar: () => void;
  element: ReactNode;
}

const DashboardPageContent = (
  { title, toggleSidebar, element }: Props
) => {

  return (
    <Flex
      ml={{ base: 0, md: 60 }} transition="0.3s ease" minH='100vh'
      flexDirection={'column'}
    >
      <Flex
        as="header"
        align="center"
        justify="space-between"
        w="full"
        px={4}
        bg="#3e3e3e"
        borderBottomWidth="1px"
        borderColor="gray.200"
        h="14"
      >
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon/>}
          display={{ base: 'inline-flex', md: 'none' }}
          color="#3e3e3e"
          onClick={toggleSidebar}
        />
        <Heading size="md" textAlign="center"
                 color={'#ffffff'}>{title}</Heading>
      </Flex>

      {/* Main content area below the header */}
      <Box p={8} flexGrow={1} position='relative'>
        {element}
      </Box>
    </Flex>
  );
};

export default DashboardPageContent;
