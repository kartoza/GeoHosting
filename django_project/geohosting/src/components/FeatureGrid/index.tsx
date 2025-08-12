import { Box, SimpleGrid, Flex, Heading, Text, Icon, Grid, Container } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FaCloudUploadAlt, FaRocket, FaBrain, FaHandshake } from "react-icons/fa";

interface FeatureProps {
  icon: ReactElement;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureProps) => (
  <Box
    p={6}
    borderRadius="lg"
    boxShadow="md"
    bg="white"
  >
    <Grid templateColumns="auto 1fr" gap={4} alignItems="start">
      {/* Icon Column */}
      <Box color="blue.500" fontSize="3xl">
        {icon}
      </Box>

      {/* Title + Description Column */}
      <Box>
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600">{description}</Text>
      </Box>
    </Grid>
  </Box>
);


export default function FeaturesGrid() {
  const features: FeatureProps[] = [
    {
      icon: <FaCloudUploadAlt />,
      title: "Hassle Free Hosting",
      description:
        "We will help you set up and deploy your custom geospatial platforms",
    },
    {
      icon: <FaRocket />,
      title: "Geospatial-first Infrastructure",
      description:
        "We don’t just host servers — we host spatial tools and platforms that work out of the box",
    },
    {
      icon: <FaBrain />,
      title: "Knowledge and Experience",
      description:
        "We have decades of experience designing, building and hosting geospatial tools for the web",
    },
    {
      icon: <FaHandshake />,
      title: "Support and Reliability",
      description:
        "Your services stay online, stable, and production-ready — always.",
    },
  ];

  return (
    <Box>
      <Container maxW="container.lg">
        <Text
          color="gray.700"
          fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: '4xl' }}
          marginTop="20px"
          fontWeight="bold"
          paddingX={{ base: 2, md: 50 }}
        >
          What Makes GeoSpatial Hosting Different?
        </Text>
      </Container>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
