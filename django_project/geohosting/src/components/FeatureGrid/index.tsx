import { Box, SimpleGrid, Flex, Image, Heading, Text, Icon, Grid, Container } from "@chakra-ui/react";
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
      <Box textAlign="left">
        <Heading size="md" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600" mt={{base: 0, md: 5}}>{description}</Text>
      </Box>
    </Grid>
  </Box>
);


export default function FeaturesGrid() {
  const features: FeatureProps[] = [
    {
      icon: <Image
        src="/static/images/why_gsh/hassle_free.svg"
        alt="Hassle Free Hosting"
      />,
      title: "Hassle Free Hosting",
      description:
        "We will help you set up and deploy your custom geospatial platforms",
    },
    {
      icon: <Image
        src="/static/images/why_gsh/geospatial-first.svg"
        alt="Geospatial-first Infrastructure"
      />,
      title: "Geospatial-first Infrastructure",
      description:
        "We don’t just host servers — we host spatial tools and platforms that work out of the box",
    },
    {
      icon: <Image
        src="/static/images/why_gsh/knowledge.svg"
        alt="Knowledge and Experience"
      />,
      title: "Knowledge and Experience",
      description:
        "We have decades of experience designing, building and hosting geospatial tools for the web",
    },
    {
      icon: <Image
        src="/static/images/why_gsh/support.svg"
        alt="Support and Reliability"
      />,
      title: "Support and Reliability",
      description:
        "Your services stay online, stable, and production-ready — always.",
    },
  ];

  return (
    <Box py={10} px={[4, 8, 16]}>
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} marginTop="40px">
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
