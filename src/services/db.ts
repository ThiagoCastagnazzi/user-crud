import Dexie, { Table } from "dexie";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class MySubClassedDexie extends Dexie {
  users!: Table<User>;

  constructor() {
    super("users");
    this.version(1).stores({
      users: "++id, name, email, password",
    });
  }
}

export const db = new MySubClassedDexie();
