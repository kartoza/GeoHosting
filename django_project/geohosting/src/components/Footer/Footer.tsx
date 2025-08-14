import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  List,
  ListItem,
  Text,
  Image,
  IconButton,
  HStack
} from "@chakra-ui/react";
import { ChevronUpIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import { Product } from '../../redux/reducers/productsSlice';

const Footer: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/app/${product.name}`);
  };

  const {
    products,
    loading
  } = useSelector(
    (state: RootState) => state.products
  );

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
    <Box 
      bg="#333" 
      color="white" 
      px={[4, 8, 16]} 
      py={10}
    >
      <Grid
        className="aaaa"
        templateAreas={{
          base: `
            "about"
            "quick"
            "services"
            "social"
            "github"
          `,
          md: `
            "about quick services"
            "about social github"
          `,
        }}
        gap={20}
        maxWidth="1200px"
        mx="auto"
        px={[4, 8, 16]}
        templateColumns={{ base: "1fr", md: "1.5fr 1fr 1fr" }}
      >
        {/* ABOUT & COUNTRY (spans 2 rows on desktop) */}
        <GridItem area="about">
          {/* Logo + description */}
          <Box>
            <Image
              src="/static/images/logos/kartoza.svg"
              alt="Kartoza Logo"
              style={{ cursor: "pointer" }}
              width="400px"
            />
            <Text mt={4} color="gray.300" textAlign={"justify"}>
              We are a Free and Open Source GIS service provider with registered
              offices in South Africa and Portugal. We develop and maintain
              geographic information systems and train teams to use geospatial
              software to its full potential.
            </Text>

            {/* South Africa */}
            <HStack mx="auto" gap={4} mt={4}>
              <Image src="https://www.worldometers.info/img/flags/sf-flag.gif" maxWidth="75px" borderRadius="5px" />
              <Text color="gray.300" textAlign={"justify"}>
                1st Floor, Block B, North Park, Black River Park, 2 Fir Street, Observatory, Cape Town, 7925, South Africa
              </Text>
            </HStack>

            {/* Portugal */}
            <HStack mx="auto" gap={4} mt={4}>
              <Image src="https://www.worldometers.info/img/flags/po-flag.gif" maxWidth="75px" borderRadius="5px" />
              <Text color="gray.300" textAlign={"justify"}>
                Bloco 1, Caixa 11, Vale de Rodão, Santa Maria de Marvão, Marvão, Portalegre, 7330-151, Portugal
              </Text>
            </HStack>
          </Box>
        </GridItem>

        {/* QUICK LINKS (desktop: column 2, row 1 | mobile: 2nd) */}
        <GridItem area="quick">
          <Box>
            <Heading size="sm" mb={4}>
              QUICK LINKS
            </Heading>
            <List spacing={2} color="gray.300">
              <ListItem>
                <Link href="https://kartoza.com/">Home</Link>
              </ListItem>
              <ListItem>
                <Link href="https://kartoza.github.io/GeoHosting-Documentation/">Documentation</Link>
              </ListItem>
              <ListItem>
                <Link href="https://kartoza.com/contact-us/new">Contact Us</Link>
              </ListItem>
            </List>
          </Box>
          <Box mt={8}>
            <Flex direction="column" h="100%" justifyContent="flex-start" mb={{base: 0, md: 2}}>
              <Box>
                <Text fontSize="md" color="white" mb={2}>
                  FIND US ON SOCIAL MEDIA
                </Text>
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
              </Box>
            </Flex>
          </Box>
        </GridItem>

        {/* SERVICES (desktop: column 3, row 1 | mobile: 3rd) */}
        <GridItem area="services">
          <Box>
            <Heading size="sm" mb={4}>
              PRODUCTS
            </Heading>
            <List spacing={2} color="gray.300" mb={6}>
              {!loading &&
                  products.map((product) => (
                    <ListItem >
                        <Link onClick={() => handleProductClick(product)}>{product.name}</Link>
                    </ListItem>
                  ))}
            </List>
          </Box>
          <Box mt={8}>
            <Flex direction="column" h="100%">
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
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      {/* Bottom Bar */}
      <Box borderTop="1px solid" borderColor="gray.500" mt={10} pt={6} textAlign="center">
        <Text fontSize="sm" color="gray.400">
          © 2025 Kartoza (Pty) Ltd | All Rights Reserved
        </Text>
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
          icon={<ChevronUpIcon />}
          onClick={scrollToTop}
        />
      )}
    </Box>
  );
};

export default Footer;
