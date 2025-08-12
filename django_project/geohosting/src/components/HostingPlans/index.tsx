import React from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Container
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface Plan {
  title: string;
  features: string[];
}

const plans: Plan[] = [
  {
    title: "Basic",
    features: [
      "Ideal for personal use, learning, or small proof-of-concept projects",
      "Single-instance deployments",
      "Community-level support",
      "Affordable monthly pricing",
    ],
  },
  {
    title: "Advanced",
    features: [
      "Ideal for NGOs, researchers, and small teams needing simple, reliable hosting.",
      "Multi-instance support",
      "Enhanced monitoring & backups",
      "Balanced cost-to-performance",
    ],
  },
  {
    title: "Gold",
    features: [
      "Ideal for enterprise, government, and high-demand deployments.",
      "Full-stack support & SLAs",
      "Dedicated resources & expert onboarding",
      "Premium tier with white-glove service",
    ],
  },
];

const HostingPlans: React.FC = () => {
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
          Hosting That Fits Your Budget
        </Text>
        <Text
          color="#555555"
          fontSize={{ base: 'lg', sm: 'xl', md: '2xl', xl: 'xl' }}
          marginTop="20px"
          paddingX={{ base: 2, md: 50 }}
        >
          Have your pick of three scalable plans tailored to meet your specific budget and project requirements.
        </Text>
      </Container>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={0}>
        {plans.map((plan, index) => (
          <Box
            key={plan.title}
            borderLeft={{ md: "1px solid", base: "none" }}
            borderRight={
              index === plans.length - 1 ? { md: "1px solid", base: "none" } : "none"
            }
            borderColor="gray.300"
            px={6}
            py={4}
          >
            <Heading size="md" textAlign="center" mb={4}>
              {plan.title}
            </Heading>
            <VStack align="start" spacing={4}>
              {plan.features.map((feature, idx) => (
                <HStack key={idx} align="start" spacing={3}>
                  <Icon as={CheckIcon} color="blue.400" mt={1} />
                  <Text textAlign="left">{feature}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

    </Box>
  );
};

export default HostingPlans;
