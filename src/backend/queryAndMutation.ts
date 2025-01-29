import {
  Icomment,
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
  LoginParams,
} from "@/app/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import AuthService from "./auth";
import databaseService from "./database-service";
import { QUERY_KEYS } from "./queryKeys";
import { Models } from "appwrite";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => AuthService.createAccount(user),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: LoginParams) => AuthService.login(user),
  });
};
export const useSignout = () => {
  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // We need to remove the cookie manually
      localStorage.removeItem("cookieFallback");
    },
    onError: (error) => {
      console.error("Failed to log out:", error);
    },
  });
};

export const useInitPasswordRecovery = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.initPasswordRecovery(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      userId,
      secret,
      password,
    }: {
      userId: string;
      secret: string;
      password: string;
    }) => AuthService.resetPassword(userId, secret, password),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: async () => {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error("No user data returned");
      return user;
    },
    staleTime: 60000, // Cache data for 60 seconds
    refetchOnWindowFocus: true, // Refetch when the window regains focus
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => databaseService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => databaseService.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: () => databaseService.getRecentPosts(),
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string[] }) =>
      databaseService.likePost(postId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id], // User need to see the current like count of the post when they goto post details
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // User need to see the current like count of the post in there home feed
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // User need to see the current like count of the post in a user profile
      });
    },
  });
};
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      databaseService.savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) =>
      databaseService.deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => databaseService.getPost(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => databaseService.updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      databaseService.deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => databaseService.getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      databaseService.infinitePosts({ pageParam }),

    getNextPageParam: (lastPage) => {
      // If no documents in the last page, stop fetching
      if (!lastPage || lastPage.documents.length === 0) {
        return null;
      }

      // Get the last document's $id to use as the cursor for the next page
      const lastDocId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastDocId;
    },

    initialPageParam: null, // Start with no cursor (fetch the first page)
  });
};

export const useSearchPost = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => databaseService.searchPost(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useSearchUser = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => databaseService.searchUser(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => databaseService.updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetAllUser = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => databaseService.getAllUsers(limit),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, comment }: Icomment) =>
      databaseService.createComment({ postId, userId, comment }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id], // User need to see the current like count of the post when they goto post details
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // User need to see the current like count of the post in there home feed
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // User need to see the current like count of the post in a user profile
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS], // User need to see the current like count of the post in a user profile
      });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      userId,
    }: {
      commentId: string;
      userId: string[];
    }) => databaseService.likeComment(commentId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id], // User need to see the current like count of the post when they goto post details
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // User need to see the current like count of the post in there home feed
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // User need to see the current like count of the post in a user profile
      });
    },
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      user,
      follower,
    }: {
      user: Models.Document;
      follower: Models.Document;
    }) => databaseService.followUser(user, follower),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
export const useUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      user,
      follower,
    }: {
      user: Models.Document;
      follower: Models.Document;
    }) => databaseService.unfollowUser(user, follower),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetFollower = (userIds: string[]) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWER, userIds],
    queryFn: () => databaseService.getFollowers(userIds),
    enabled: userIds.length > 0,
  });
};
