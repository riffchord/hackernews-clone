import React, { FunctionComponent, useState, useEffect } from "react";
import { Comment } from "@prisma/client/index";
import { css, useTheme } from "@emotion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { gql, useMutation } from "@apollo/client";
import { navigate } from "@reach/router";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";
import { Link } from "@reach/router";

const styles = {
  container: css`
    color: #000;
    padding: 0.5em;
    font-size: 0.9em;
  `,
  title: css`
    margin-left: 0.1em;
  `,
  button: css`
    background: none;
    border: none;
    &:hover {
      cursor: pointer;
    }
  `,
  domain: (theme) => css`
    color: ${theme.colors.primary};
    font-size: 0.7em;
    margin-left: 0.5em;
  `,
  link: css`
    &:hover {
      text-decoration: underline;
    }
  `,
};

const ADD_FAVORITE = gql`
  mutation AddFavorite($postId: Int!) {
    addFavorite(postId: $postId) {
      code
      success
      message
    }
  }
`;

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($postId: Int!) {
    removeFavorite(postId: $postId) {
      code
      success
      message
    }
  }
`;

export interface IPost {
  id: number;
  title: string;
  link: string;
  domain: string;
  upvote: number;
  createdAt: number;
  author: {
    name: string;
  };
  comments: Comment[];
  currentUserFavorited: boolean | null;
}

type ComponentProps = {
  post: IPost;
  rank?: number | null;
};

const PostListItem: FunctionComponent<ComponentProps> = ({ post, rank }) => {
  const {
    id,
    title,
    link,
    domain,
    upvote,
    createdAt,
    author: { name },
    comments,
    currentUserFavorited,
  } = post;

  const theme = useTheme();
  const [isFavorited, setIsFavorited] = useState<null | boolean>(
    currentUserFavorited
  );
  const [addFavorite, { data: addFavoriteData }] = useMutation(ADD_FAVORITE, {
    variables: { postId: id },
  });
  const [removeFavorite, { data: removeFavoriteData }] = useMutation(
    REMOVE_FAVORITE,
    {
      variables: { postId: id },
    }
  );

  const handleFavClick = () => {
    if (isFavorited === true) {
      removeFavorite();
    } else if (isFavorited === false) {
      addFavorite();
    }
  };

  useEffect(() => {
    if (addFavoriteData) {
      const { success, code } = addFavoriteData.addFavorite;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "Please log in.",
            redirectedFrom: `/post/${id}`,
          },
        });
      } else if (success === true) {
        setIsFavorited(true);
      }
    }
  }, [addFavoriteData]);

  useEffect(() => {
    if (removeFavoriteData) {
      const { success } = removeFavoriteData.removeFavorite;
      if (success === true) {
        setIsFavorited(false);
      }
    }
  }, [removeFavoriteData]);

  return (
    <div css={styles.container}>
      {/* upper row */}
      <div>
        {rank && (
          <span
            css={css`
              color: ${theme.colors.primary};
            `}
          >
            {rank}.
          </span>
        )}
        <button css={styles.button}>
          <img src={upArrow} alt="up arrow" height="12px" width="12px" />
        </button>
        <a css={styles.title} href={link}>
          {title}
        </a>
        <span css={styles.domain}>
          (
          <Link to={`/from/${domain}`} css={styles.link}>
            {domain}
          </Link>
          )
        </span>
      </div>

      {/* bottom row */}
      <div>
        <span
          css={(theme) => css`
            color: ${theme.colors.primary};
            font-size: 0.6rem;
            margin-left: ${rank ? "4em" : "2.5em"};
          `}
        >
          {upvote} points by{" "}
          <Link to={`/user/${name}`} css={styles.link}>
            {name}
          </Link>{" "}
          <Link to={`/post/${id}`} css={styles.link}>
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
          </Link>
          {" | "}
          {currentUserFavorited !== null && (
            <>
              <button
                css={(theme) => css`
                  ${styles.button}
                  padding: 0;
                  font-size: 0.6rem;
                  color: ${theme.colors.primary};
                  &:hover {
                    text-decoration: underline;
                  }
                `}
                onClick={handleFavClick}
              >
                {isFavorited ? "un-favorite" : "favorite"}
              </button>
              {" | "}
            </>
          )}
          <Link to={`/post/${id}`} css={styles.link}>
            {comments.length === 0 ? "discuss" : `${comments.length} comments`}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PostListItem;
