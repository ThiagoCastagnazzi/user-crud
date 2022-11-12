import { db } from "../../../services/db";

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

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Header } from "../../../components/Header";

import { GetServerSideProps } from "next";

import { useForm } from "react-hook-form";

import { ParsedUrlQuery } from "querystring";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useEffect, useState } from "react";
import { Input } from "../../../components/Form/Input";
import Link from "next/link";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface CreateUserFormData {
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

export default function User({ id }: IParams) {
  const [user, setUser] = useState<User>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserFormSchema),
  });

  useEffect(() => {
    async function getUser() {
      const user = await db.users.get(Number(id));
      setUser(user);
      setValue("name", user?.name || "");
      setValue("email", user?.email || "");
      setValue("password", user?.password || "");
      setValue("password_confirmation", user?.password || "");
    }

    getUser();
  }, [id, setValue]);

  const handleEditUser = async (values: CreateUserFormData) => {
    try {
      await db.users.update(Number(id), {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  return (
    <Box>
      <Header title="User Edit" />

      <ToastContainer />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={["4", "6"]}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(
            async (values) => await handleEditUser(values)
          )}
        >
          <Heading size="lg" fontWeight="normal">
            User Info
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                label="Name"
                error={errors.name}
                {...register("name")}
                defaultValue={user?.name}
              />

              <Input
                type="email"
                label="E-mail"
                error={errors.email}
                defaultValue={user?.email}
                {...register("email")}
              />

              <Input
                type="password"
                label="Password"
                error={errors.password}
                defaultValue={user?.password}
                {...register("password")}
              />

              <Input
                type="password"
                label="Password Confirmation"
                error={errors.password_confirmation}
                defaultValue={user?.password}
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
              <Button type="submit" colorScheme="pink">
                Save
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as IParams;

  return {
    props: {
      id,
    },
  };
};
