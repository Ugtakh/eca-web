"use server";

import { cookies } from "next/headers";
import { Account, Client, ID, Storage, TablesDB } from "node-appwrite";

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "")
        .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY ?? "");


    return {
        get account() {
            return new Account(client);
        },
        get tables() {
            return new TablesDB(client);
        },
        get storage() {
            return new Storage(client);
        }
    }
}

export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "");

    const session = (await cookies()).get("session");
    if (!session || !session.value) {
        throw new Error("No session");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get tables() {
            return new TablesDB(client);
        },
        get storage() {
            return new Storage(client);
        },

        getID: () => {
            return ID.unique();
        }
    }
}
