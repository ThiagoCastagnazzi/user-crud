import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "../../components/Form/Input";

import { Header } from "../../components/Header";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { db } from "../../services/db";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreateUserFormData {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("E-mail is required").email("E-mail is invalid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "Passwords must match"),
});

export default function CreateUser() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserFormSchema),
  });

  async function handleCreateUser(values: CreateUserFormData) {
    const users = await db.users.toArray();

    if (users.find((user) => user.email === values.email)) {
      toast.error("E-mail already exists");
      return;
    }
    try {
      await db.users.add(values);

      toast.success("User created successfully");
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  return (
    <Box>
      <Header title="User Create" />

      <ToastContainer />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "6"]}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(
            async (values) => await handleCreateUser(values)
          )}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                label="Nome Completo"
                error={errors.name}
                {...register("name")}
              />
              <Input
                type="email"
                label="E-mail"
                error={errors.email}
                {...register("email")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                type="password"
                label="Senha"
                error={errors.password}
                {...register("password")}
              />
              <Input
                type="password"
                label="Confirmação de Senha"
                error={errors.password_confirmation}
                {...register("password_confirmation")}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/" passHref>
                <Button as="a" type="submit" colorScheme="whiteAlpha">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Confirm
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
