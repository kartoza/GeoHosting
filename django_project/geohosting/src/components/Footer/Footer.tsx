import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  List,
  ListItem,
  Text,
  Image,
  IconButton
} from "@chakra-ui/react";
import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Box bg="#333" color="white" px={[4, 8, 16]} py={10}>
      {/* Top Section */}
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr 1fr 1fr" }}
        gap={5}
        maxW="1200px"
        mx="auto"
      >
        {/* Logo + description + newsletter */}
        <Box>
          <Image
            src="/static/images/logos/kartoza.svg"
            alt="Kartoza Logo"
            style={{ cursor: "pointer" }}
            width="261px"
          />
          <Text mt={4} color="gray.300" textAlign={"justify"}>
            We are a Free and Open Source GIS service provider with registered
            offices in South Africa and Portugal. We develop and maintain
            geographic information systems and train teams to use geospatial
            software to its full potential.
          </Text>
        </Box>

        {/* Navigation */}
        <Box>
          <Heading size="sm" mb={4}>
            NAVIGATION
          </Heading>
          <List spacing={2} color="gray.300">
            <ListItem>
              <Link href="#">Home</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/about">About Us</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/portfolio">Our Work</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/training-courses">Courses</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/blog">Blog</Link>
            </ListItem>
          </List>
        </Box>

        {/* Quick Links */}
        <Box>
          <Heading size="sm" mb={4}>
            QUICK LINKS
          </Heading>
          <List spacing={2} color="gray.300">
            <ListItem>
              <Link href="https://kartoza.com/crowdfunding">Crowdfunding</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/careers">Careers</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/internships">Internships</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/policies">Company Policies</Link>
            </ListItem>
            <ListItem>
              <Link href="https://kartoza.com/contact-us/new">Contact Us</Link>
            </ListItem>
          </List>
        </Box>

        {/* Services + GitHub */}
        <Box>
          <Heading size="sm" mb={4}>
            SERVICES
          </Heading>
          <List spacing={2} color="gray.300" mb={6}>
            <ListItem>
              <Link href="#">GeoSpatial Hosting</Link>
            </ListItem>
            <ListItem>
              <Link href="#">GIS Software Support</Link>
            </ListItem>
            <ListItem>
              <Link href="#">Hosting and System Maintenance</Link>
            </ListItem>
            <ListItem>
              <Link href="#">Consultancy Services</Link>
            </ListItem>
            <ListItem>
              <Link href="#">Software Development</Link>
            </ListItem>
          </List>
        </Box>
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr 1fr 1fr" }}
        gap={5}
        maxW="1200px"
        mx="auto"
      >
        <Box>
          {/* <Box mt={8}>
            <Heading size="sm" mb={2}>
              NEWSLETTER SIGN UP
            </Heading>
            <Flex>
              <Input
                placeholder="Email"
                bg="white"
                color="black"
                borderRadius="md"
                mr={2}
              />
              <Button bg="#f8b54b" color="white" _hover={{ bg: "#57a0c7" }} fontSize={14}>
                SUBSCRIBE
              </Button>
            </Flex>
          </Box> */}
        </Box>

        <Box>
        </Box>

        <Box>
        </Box>

        {/* Services + GitHub */}
        <Box>
          <Flex align="start" gap={3}>
            <Box>
              <Heading size="sm" mb={1}>
                <Flex align="center" gap={2}>
                  <Icon as={FaGithub} boxSize={6} />
                  <Link href="https://github.com/kartoza/" isExternal>
                    OUR GITHUB REPOSITORY
                  </Link>
                </Flex>
              </Heading>
              <Text color="gray.300" fontSize="sm" textAlign="justify">
                Driven by our mission to promote open source, we share code for many of
                our projects on GitHub.
              </Text>
            </Box>
          </Flex>
        </Box>

      </Grid>

      {/* Bottom Bar */}
      <Box borderTop="1px solid" borderColor="gray.500" mt={10} pt={6}>
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          maxW="1200px"
          mx="auto"
          gap={4}
        >
          {/* Social Icons */}
          <Flex gap={4}>
            <Link href="https://www.facebook.com/kartozaGIS" isExternal>
              <Icon as={FaFacebook} boxSize={6} />
            </Link>
            <Link href="https://www.instagram.com/kartozageo/" isExternal>
              <Icon as={FaInstagram} boxSize={6} />
            </Link>
            <Link href="https://www.linkedin.com/company/kartoza-pty-ltd" isExternal>
              <Icon as={FaLinkedin} boxSize={6} />
            </Link>
            <Link href="https://www.youtube.com/user/kartozachannel/feed" isExternal>
              <Icon as={FaYoutube} boxSize={6} />
            </Link>
            <Link href="https://twitter.com/KartozaGeo" isExternal>
              <Icon as={FaTwitter} boxSize={6} />
            </Link>
          </Flex>

          {/* Copyright */}
          <Text fontSize="sm" color="gray.400">
            © 2025 Kartoza (Pty) Ltd | All Rights Reserved
          </Text>
        </Flex>
      </Box>

      {/* Scroll to Top Button */}
      {showScrollButton && (
          <IconButton
          position="fixed"
          bottom={{ base: "10px", md: "30px" }}
          right={{ base: "10px", md: "30px" }}
          bg="#f8b54b"
          color="white"
          fontSize="2.5rem"
          opacity={0.3}
          _hover={{ bg: '#57a0c7', opacity: 1 }}
          aria-label="Scroll to top"
          icon={<ChevronUpIcon/>}
          onClick={scrollToTop}
          />
      )}

    </Box>
  );
};

export default Footer;
