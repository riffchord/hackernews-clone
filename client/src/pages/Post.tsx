import React, { FunctionComponent } from "react";
import { css, useTheme } from "@emotion/react";
import { useQuery, gql } from "@apollo/client";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
};

const POST = gql`
  query Post($id: Int!) {
    post(id: $id) {
      title
      link
      upvote
      createdAt
      author {
        name
      }
    }
  }
`;

type ComponentProps = {
  postId: string;
};

const Post: FunctionComponent<ComponentProps> = ({ postId }) => {
  const theme = useTheme();
  const { data } = useQuery(POST, {
    variables: { id: Number(postId) },
  });

  let body = null;
  if (data && data.post) {
    body = <PostListItem post={data.post} rank={null} />;
  }

  return (
    <div css={theme.layout}>
      <Header />
      <div css={styles.container}>{body}</div>
    </div>
  );
};

export default Post;
