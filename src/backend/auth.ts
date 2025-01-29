import { Client, Account, ID, Models, Avatars } from "appwrite";
import { INewUser, LoginParams   } from "@/app/types/index";
import databaseService from "./database-service";


const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
const passwordRecoveryURL = process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_URL as string;

class AuthService {
  private client: Client;
  private account: Account;
  private avatars: Avatars;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(projectId);
    this.account = new Account(this.client);
    this.avatars = new Avatars(this.client);
  }

  async createAccount({
    email,
    password,
    name,
  }: INewUser): Promise<Models.Session | Models.User<object>> {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // Using Avatars SDK to generate avatar URL
        const avatarUrl = this.avatars.getInitials(name);

        await databaseService.saveUserToDb({
          accountId: userAccount.$id,
          name: userAccount.name,
          email: userAccount.email,
          username: name,
          imageUrl: avatarUrl,
        });

        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginParams): Promise<Models.Session> {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<Models.Document | null> {
    try {
      const currentUser = await this.account.get();
      if (currentUser) {
        const data = await databaseService.fetchUserData(currentUser);
        return data || null;
      }
    } catch (error) {
      // console.log("Appwrite service :: getCurrentUser :: error", error);
      console.log("welcome", error);
    }
    return null;
  }

  async logout(): Promise<boolean> {
    try {
      if (!this.account) {
        console.log("Account instance is not initialized.", this.account);
        return false;
      }
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("AuthService :: logout :: error", error);
      return false;
    }
  }

  async initPasswordRecovery(email: string) {
    try {
      const recovert = await this.account.createRecovery(
        email,
        passwordRecoveryURL
      );
      return recovert;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(userId: string, secret: string, password: string) {
    try {
      return await this.account.updateRecovery(userId, secret, password);
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
