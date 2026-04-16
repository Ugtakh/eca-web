"use server";

import { AppwriteException } from "appwrite";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/client";

export const signIn = async (email: string, password: string) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    });
    return { status: true, userId: session.userId };
  } catch (error) {
    const er = error as AppwriteException;
    return { status: false, error: er };
  }
};

export const getUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    if (!user) throw new Error("No User");
    return user;
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  const { account } = await createSessionClient();
  (await cookies()).delete("session");
  account.deleteSession({ sessionId: "current" });
  redirect("/login");
};
