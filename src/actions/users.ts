"use server";

import { createClient, createAdminClient } from "@/lib/supabase";
import { handleError } from "@/lib/utils";

export const loginAction = async (username: string, password: string) => {
  try {
    const { auth } = await createClient();
    const email = `${username}@mailinator.com`;
    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const registerWithUsernameAction = async (
  username: string,
  password: string
) => {
  try {
    const { auth } = await createClient();
    const email = `${username}@mailinator.com`;
    const { data, error } = await auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateUserAction = async (password: string) => {
  try {
    const { auth } = await createClient();

    const { data: userData, error: userError } = await auth.getUser();
    if (userError || !userData?.user) throw new Error("User not authenticated");

    const { data, error } = await auth.updateUser({
      password,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateUserAdminAction = async (
  id: string,
  newUsername: string,
  newPassword: string
) => {
  try {
    const { auth } = await createAdminClient();
    const email = `${newUsername}@mailinator.com`;

    if (newUsername) {
      const { error } = await auth.admin.updateUserById(id, { email: email });
      if (error) throw error;
    }

    if (newPassword) {
      const { error } = await auth.admin.updateUserById(id, {
        password: newPassword,
      });
      if (error) throw error;
    }
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export async function deletUserAction(id: string) {
  try {
    const { auth } = await createAdminClient();
    const { error } = await auth.admin.deleteUser(id);
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    handleError(error);
  }
}

export async function getUser() {
  const { auth } = await createClient();
  const userObject = await auth.getUser();
  return userObject.data.user;
}

export async function getAllUsers() {
  const { auth } = await createAdminClient();
  const {
    data: { users },
    error,
  } = await auth.admin.listUsers();
  const parsedUsers = users.map((user) => ({
    id: user.id,
    username: user.email?.replace(/@mailinator\.com/, ""),
    last_sign_in_at: user.last_sign_in_at,
    created_at: user.created_at,
  }));
  return parsedUsers;
}
