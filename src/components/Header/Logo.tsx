import { Text } from "@chakra-ui/react";
import Link from "next/link";

interface LogoProps {
  title: string;
}

export function Logo({ title }: LogoProps) {
  return (
    <Link href="/" passHref>
      <a>
        <Text
          fontSize={["2xl", "3xl"]}
          fontWeight="bold"
          letterSpacing="tight"
          w="64"
        >
          {title}
          <Text as="span" ml="1" color="pink.500">
            .
          </Text>
        </Text>
      </a>
    </Link>
  );
}
