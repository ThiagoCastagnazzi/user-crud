import { useQuery } from "@tanstack/react-query";
import { db } from "../services/db";

export async function getUsers() {
  return await db.users.toArray();
}

export function useUsers() {
  return useQuery(["users"], () => getUsers(), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
