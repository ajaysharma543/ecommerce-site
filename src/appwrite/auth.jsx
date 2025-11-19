import { Client, Account, ID, Databases, Query } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
  client = new Client();
  account;
  database;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
  }

  async Createuser({ email, password, name, phone }) {
          const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        await this.login({ email, password });
        await this.database.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteusercollection,
          ID.unique(),
          {
            name: name,
            number: phone,
            email: email,
            id: userAccount.$id,
            role: "user", 
          }
        );
      }
      return userAccount;
  }
  async getUserDataById(userId) {
  try {
    const result = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteusercollection,
      [Query.equal("id", userId)] // `id` here is the Appwrite Auth ID stored during user creation
    );
    return result.documents[0];
  } catch (error) {
    console.error("getUserDataById error:", error);
    return null;
  }
}


  async getCurrentUserData() {
  try {
    const userAccount = await this.account.get();

    const userDoc = await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteusercollection,
      [Query.equal("email", userAccount.email)]
    );

    if (userDoc.documents.length === 0) {
      throw new Error("User document not found");
    }

    const userData = userDoc.documents[0];

    return {
      name: userData.name,
      email: userData.email,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}


  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  async getCurrentUser() {
  try {
    const userAccount = await this.account.get();
    const userDoc = await this.database.listDocuments(conf.appwriteDatabaseId, conf.appwriteusercollection, [
      Query.equal("email", [userAccount.email]),
    ]);
    return {
      ...userAccount,
      role: userDoc.documents[0].role,
    };
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
}

  async getUserDataByEmail(email) {
    try {
      const result = await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteusercollection,
        [Query.equal("email", email)]
      );
      return result.documents[0]; 
    } catch (error) {
      console.log("getUserDataByEmail error", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("logout error", error);
    }
  }
}

const authservice = new AuthService();
export default authservice;
