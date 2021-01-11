import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  MutationResponse: {
    __resolveType: (response) => {
      if (response.post) return "Post";
      if (response.author) return "Author";
    },
  },
  Query: {
    posts: async () => {
      return await prisma.post.findMany({ include: { author: true } });
    },
  },
  Mutation: {
    addPost: async (_, { post: { link, title, authorName } }) => {
      const newPost = await prisma.post.create({
        data: {
          link,
          title,
          author: {
            connect: { name: authorName },
          },
        },
        include: { author: true },
      });

      return {
        code: "200",
        success: true,
        message: "post created succesfully.",
        post: newPost,
      };
    },
  },
};
