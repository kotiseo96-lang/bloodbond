import { Database } from "./database";


export type Tables<
T extends keyof Database["public"]["Tables"]
> =
Database["public"]["Tables"][T]["Row"];



export type Donor =
Tables<"donors">;



export type Order =
Tables<"orders">;



export type Profile =
Tables<"profiles">;