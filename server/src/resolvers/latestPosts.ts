import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

interface IPost extends Post {
  currentUserUpvoted?: boolean;
}

export default async function latestPosts(
  _,
  __,
  { isAuth, appendUpvoteInfo }
): Promise<IPost[]> {
  try {
    const { userName } = isAuth();

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { hiddenBy: { none: { name: userName } } }, // don't include hidden posts.
      include: { author: true, comments: true },
    });

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true, comments: true },
    });
  }
}