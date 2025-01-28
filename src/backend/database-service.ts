import { Icomment, INewPost, IUpdatePost, IUpdateUser } from "@/app/types";
import {
  Client,
  ID,
  Databases,
  Avatars,
  Storage,
  Query,
  Models,
} from "appwrite";

const userCollection = process.env
  .NEXT_PUBLIC_APPWRITE_USER_COLLECTION as string;
const postsCollection = process.env
  .NEXT_PUBLIC_APPWRITE_POST_COLLECTION as string;
const saveCollection = process.env
  .NEXT_PUBLIC_APPWRITE_SAVE_COLLECTION as string;
const commentsCollection = process.env
  .NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION as string;
const dbID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;

export class DatabaseService {
  private client: Client;
  private databases: Databases;
  private avatars: Avatars;
  private storage: Storage;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("6749ff550024dc225a68");

    this.databases = new Databases(this.client);
    this.avatars = new Avatars(this.client);
    this.storage = new Storage(this.client);
  }

  async saveUserToDb(users: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
  }) {
    try {
      const newUserDoc = await this.databases.createDocument(
        dbID,
        userCollection,
        ID.unique(),
        users
      );
      return newUserDoc;
    } catch (error) {
      console.log(error);
    }
  }

  // You can add more database-related methods here
  async getInitialsAvatar(name: string): Promise<URL> {
    return new URL(this.avatars.getInitials(name));
  }

  async fetchUserData(user: Models.User<Models.Preferences>) {
    try {
      const userData = await this.databases.listDocuments(
        dbID,
        userCollection,
        [Query.equal("accountId", user.$id)]
      );
      // console.log(userData.documents[0]);
      return userData.documents[0];
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.databases.getDocument(
        dbID,
        userCollection,
        userId
      );
      if (!user) throw Error;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async uplodeFile(file: File): Promise<Models.File | null> {
    try {
      const url = await this.storage.createFile(bucketId, ID.unique(), file);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getFileURL(file: string) {
    try {
      const URL = this.storage.getFilePreview(bucketId, file);
      if (!URL) throw new Error("File preview URL could not be generated.");
      return URL;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.storage.deleteFile(bucketId, fileId);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createPost(post: INewPost) {
    try {
      const file = await this.uplodeFile(post.file[0]);
      if (!file) throw Error("File could not be uploaded");
      const url = await this.getFileURL(file.$id);
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      const newPost = await this.databases.createDocument(
        dbID,
        postsCollection,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          location: post.location,
          imageId: file.$id,
          imageUrl: url,
          tags: tags,
        }
      );
      if (!newPost) {
        this.deleteFile(file.$id);
      }
      return newPost;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRecentPosts() {
    try {
      const posts = this.databases.listDocuments(dbID, postsCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(25),
      ]);
      if (!posts) throw Error;
      return posts;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async likePost(postID: string, likesArray: string[]) {
    try {
      const updatedPost = await this.databases.updateDocument(
        dbID,
        postsCollection,
        postID,
        {
          likes: likesArray,
        }
      );
      if (!updatedPost) throw Error;
      return updatedPost;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async savePost(userId: string, postId: string) {
    try {
      const updatedPost = await this.databases.createDocument(
        dbID,
        saveCollection,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
      );
      if (!updatedPost) throw Error;
      return updatedPost;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteSavedPost(saveId: string) {
    try {
      const status = await this.databases.deleteDocument(
        dbID,
        saveCollection,
        saveId
      );
      if (!status) throw Error;
      return status;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getPost(postId: string) {
    try {
      const post = await this.databases.getDocument(
        dbID,
        postsCollection,
        postId
      );
      if (!post) throw Error;
      return post;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async updatePost(post: IUpdatePost) {
    const hasImage = post.file && post.file.length > 0;

    try {
      // Initialize default image values (existing image details)
      let image = {
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      };

      if (hasImage) {
        // Upload new file to Appwrite storage
        const uploadedFile = await this.uplodeFile(post.file[0]);
        if (!uploadedFile) throw new Error("File upload failed");

        // Generate the file URL
        const fileUrl = await this.getFileURL(uploadedFile.$id);
        if (!fileUrl) {
          // Cleanup uploaded file if URL generation fails
          await this.deleteFile(uploadedFile.$id);
          throw new Error("File URL generation failed");
        }

        // Update image details
        image = {
          imageId: uploadedFile.$id,
          imageUrl: fileUrl,
        };
      }

      // Convert tags string into an array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      // Update the post in the database
      const updatedPost = await this.databases.updateDocument(
        dbID,
        postsCollection,
        post.postId,
        {
          caption: post.caption,
          location: post.location,
          imageId: image.imageId,
          imageUrl: image.imageUrl,
          tags: tags,
        }
      );

      if (!updatedPost) {
        // Rollback newly uploaded file in case of update failure
        if (hasImage) {
          await this.deleteFile(image.imageId);
        }
        throw new Error("Post update failed");
      }

      // Safely delete the old file after a successful update
      if (hasImage && post.imageId) {
        await this.deleteFile(post.imageId);
      }

      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      return null; // Return null on failure
    }
  }

  async deletePost(postId: string, imageId: string) {
    try {
      const postStatus = await this.databases.deleteDocument(
        dbID,
        postsCollection,
        postId
      );
      const imageStatus = await this.databases.deleteDocument(
        dbID,
        bucketId,
        imageId
      );
      if (postStatus && imageStatus) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getUserPosts(userId: string) {
    try {
      const post = await this.databases.listDocuments(dbID, postsCollection, [
        Query.equal("creator", userId),
        Query.orderDesc("$createdAt"),
      ]);
      if (!post) throw Error;

      return post;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async infinitePosts({ pageParam }: { pageParam: string | null }) {
    const queries = [Query.orderDesc("$updatedAt"), Query.limit(5)];
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam)); // Apply cursor only when pageParam exists
    }

    try {
      const posts = await this.databases.listDocuments(
        dbID,
        postsCollection,
        queries
      );

      // Return the fetched posts or an empty array
      return posts || { documents: [] };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { documents: [] }; // Return empty array on failure
    }
  }

  async searchPost(search: string) {
    try {
      const post = await this.databases.listDocuments(dbID, postsCollection, [
        Query.search("caption", search),
      ]);
      // If no posts are found, handle it here
      if (!post.documents || post.documents.length === 0) {
        console.log("No posts found for the given search query.");
        return undefined;
      }
      return post;
    } catch (error) {
      console.log("Error occurred while searching for posts:", error);
      return undefined;
    }
  }

  // async getSavedPosts(userId: string) {
  //   try {
  //     const savedPost = await this.databases.listDocuments(dbID, saveCollection,[
  //       Query.equal("user", userId),
  //       Query.orderDesc("$createdAt"),
  //     ]);
  //     if (!savedPost) throw Error;
  //     if (savedPost.documents.length === 0) return null;
  //     return savedPost;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  async updateUser(user: IUpdateUser) {
    const hasImage = user.file && user.file.length > 0;

    try {
      // Initialize default image values (existing image details)
      let image = {
        imageId: user.imageId,
        imageUrl: user.imageUrl,
      };

      if (hasImage) {
        // Upload new file to Appwrite storage
        const uploadedFile = await this.uplodeFile(user.file[0]);
        if (!uploadedFile) throw new Error("File upload failed");

        // Generate the file URL
        const fileUrl = await this.getFileURL(uploadedFile.$id);
        if (!fileUrl) {
          // Cleanup uploaded file if URL generation fails
          await this.deleteFile(uploadedFile.$id);
          throw new Error("File URL generation failed");
        }

        // Update image details
        image = {
          imageId: uploadedFile.$id,
          imageUrl: fileUrl,
        };
      }

      // Update the post in the database
      const updateUser = await this.databases.updateDocument(
        dbID,
        userCollection,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );

      if (!updateUser) {
        // Rollback newly uploaded file in case of update failure
        if (hasImage) {
          await this.deleteFile(image.imageId);
        }
        throw new Error("Post update failed");
      }

      // Safely delete the old file after a successful update
      if (hasImage && user.imageId) {
        await this.deleteFile(user.imageId);
      }

      return updateUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null; // Return null on failure
    }
  }
  async getAllUsers(limit?: number) {
    const queries = [Query.orderDesc("$createdAt")];
    if (limit) queries.push(Query.limit(limit));
    try {
      const users = await this.databases.listDocuments(
        dbID,
        userCollection,
        queries
      );
      if (!users) throw Error;
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createComment({ postId, userId, comment }: Icomment) {
    console.log(postId, userId, comment);
    try {
      const newComment = await this.databases.createDocument(
        dbID,
        commentsCollection,
        ID.unique(),
        {
          postid: postId,
          author: userId,
          text: comment,
        }
      );
      if (!newComment) throw Error;
      return newComment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async likeComment(commentId: string, likesArray: string[]) {
    try {
      const updatedComment = await this.databases.updateDocument(
        dbID,
        commentsCollection,
        commentId,
        {
          likes: likesArray,
        }
      );
      if (!updatedComment) throw Error;
      return updatedComment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // async followUser(currentUserId: string, targetUserId: string): Promise<void> {
  //   try {
  //     // Fetch users
  //     const currentUser = await this.databases.getDocument(
  //       dbID,
  //       userCollection,
  //       currentUserId
  //     );
  //     const targetUser = await this.databases.getDocument(
  //       dbID,
  //       userCollection,
  //       targetUserId
  //     );

  //     // Ensure follow documents exist
  //     const ensureFollowDoc = async (userId: string, followField: string) => {
  //       if (!followField) {
  //         const newFollowDoc = await this.databases.createDocument(
  //           dbID,
  //           followCollection,
  //           ID.unique(),
  //           {
  //             follower: [],
  //             following: [],
  //           }
  //         );
  //         await this.databases.updateDocument(dbID, userCollection, userId, {
  //           follow: newFollowDoc.$id,
  //         });
  //         return newFollowDoc.$id;
  //       }
  //       return followField;
  //     };

  //     const currentUserFollowId = await ensureFollowDoc(
  //       currentUserId,
  //       currentUser.follow
  //     );
  //     const targetUserFollowId = await ensureFollowDoc(
  //       targetUserId,
  //       targetUser.follow
  //     );

  //     const currentUserFollow = await this.databases.getDocument(
  //       dbID,
  //       followCollection,
  //       currentUserFollowId
  //     );
  //     const targetUserFollow = await this.databases.getDocument(
  //       dbID,
  //       followCollection,
  //       targetUserFollowId
  //     );

  //     const updatedFollowingList = [
  //       ...new Set([...currentUserFollow.following, targetUserId]),
  //     ];
  //     const updatedFollowersList = [
  //       ...new Set([...targetUserFollow.follower, currentUserId]),
  //     ];

  //     await this.databases.updateDocument(
  //       dbID,
  //       followCollection,
  //       currentUserFollowId,
  //       { following: updatedFollowingList }
  //     );
  //     await this.databases.updateDocument(
  //       dbID,
  //       followCollection,
  //       targetUserFollowId,
  //       { follower: updatedFollowersList }
  //     );

  //     console.log("Follow action completed successfully!");
  //   } catch (error) {
  //     console.error("Error following user:", error);
  //   }
  // }
  async followUser(currentUser: Models.Document, targetUser: Models.Document) {
    try {
      const updatedFollowingList = Array.isArray(currentUser.following)
        ? [...currentUser.following, targetUser.$id]
        : [targetUser.$id];

      const updatedFollowersList = Array.isArray(targetUser.followers)
        ? [...targetUser.followers, currentUser.$id]
        : [currentUser.$id];

      const updatedFollowing = await this.databases.updateDocument(
        dbID,
        userCollection,
        currentUser.$id,
        { following: updatedFollowingList }
      );

      const updatedFollower = await this.databases.updateDocument(
        dbID,
        userCollection,
        targetUser.$id,
        { follower: updatedFollowersList }
      );

      if (!updatedFollowing || !updatedFollower) throw Error;

      return { updatedFollowing, updatedFollower };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async unfollowUser(
    currentUser: Models.Document,
    targetUser: Models.Document
  ) {
    try {
      const updatedFollowingList = Array.isArray(currentUser.following)
        ? currentUser.following.filter((id) => id !== targetUser.$id)
        : [];

      const updatedFollowersList = Array.isArray(targetUser.followers)
        ? targetUser.followers.filter((id) => id !== currentUser.$id)
        : [];

      const updatedFollowing = await this.databases.updateDocument(
        dbID,
        userCollection,
        currentUser.$id,
        { following: updatedFollowingList }
      );

      const updatedFollower = await this.databases.updateDocument(
        dbID,
        userCollection,
        targetUser.$id,
        { follower: updatedFollowersList }
      );

      if (!updatedFollowing || !updatedFollower) throw Error;

      return { updatedFollowing, updatedFollower };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFollowers(userIds: string[]): Promise<Models.Document[] | null> {
    try {
      // Use Promise.all to handle multiple async operations
      const followers = await Promise.all(
        userIds.map((id) =>
          this.databases.getDocument(dbID, userCollection, id)
        )
      );
      return followers; // Return the resolved list of followers
    } catch (error) {
      console.error("Error fetching followers:", error);
      return null; // Return null in case of an error
    }
  }

  async searchUser(search: string) {
    try {
      const post = await this.databases.listDocuments(dbID, userCollection, [
        Query.search("name", search),
      ]);
      // If no posts are found, handle it here
      if (!post.documents || post.documents.length === 0) {
        console.log("No user found for the given search query.");
        return undefined;
      }
      return post;
    } catch (error) {
      console.error("Error occurred while searching for posts:", error);
      return undefined;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
