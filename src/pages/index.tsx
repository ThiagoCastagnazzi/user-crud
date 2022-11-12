import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiRefreshLine, RiAccountPinBoxLine } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";
import { Header } from "../components/Header";
import { db } from "../services/db";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUsers } from "../hooks/useUsers";

export default function UserList() {
  const { data, isLoading, isFetching, refetch, error } = useUsers();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  async function handleSelectedUsers() {
    await db.users.bulkDelete(selectedUsers);
    setSelectedUsers([]);
    toast.success("Users deleted successfully");

    refetch();
  }

  const handleSelectUser = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    }
  };

  console.info("Users Selected: ", selectedUsers);

  return (
    <Box>
      <Header title="Dashboard" />
      <ToastContainer />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Box flex="1" borderRadius="8" bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Users
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            <Flex gap={2}>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="purple"
                leftIcon={<Icon as={RiRefreshLine} fontSize="20" />}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            </Flex>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Failed to Fetch Data</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox
                        colorScheme="purple"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(
                              data?.map((user) => user.id) || []
                            );
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        isChecked={selectedUsers.length === (data?.length || 0)}
                      />
                    </Th>
                    <Th>User</Th>
                    {isWideVersion && <Th>E-mail</Th>}
                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {data?.map((user) => (
                    <Tr key={user.id}>
                      <Td px={["4", "4", "6"]}>
                        <Checkbox
                          colorScheme="purple"
                          onChange={(e) => handleSelectUser(e, user?.id)}
                          isChecked={selectedUsers.includes(user.id)}
                        />
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold" color="purple.400">
                            {user.name}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.email}</Td>}
                      <Td>
                        <Link href={`/user/edit/${user.id}`}>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={
                              <Icon as={RiAccountPinBoxLine} fontSize="16" />
                            }
                            cursor="pointer"
                          >
                            {isWideVersion ? "Edit" : ""}
                          </Button>
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
          <Flex mt="8" justify="space-between" align="center">
            <Button
              size="sm"
              fontSize="sm"
              colorScheme="red"
              onClick={handleSelectedUsers}
            >
              Remove Selected Users
            </Button>
            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="purple"
              href="/user/create"
            >
              Register
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
