import React, { useState, FunctionComponent } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Redirect, RouteComponentProps } from "@reach/router";
import { css, useTheme } from "@emotion/react";

import Header from "../components/Header";
import validateSubmit from "../utils/validateSubmit";
import { ME } from "../api/queries";
import { ADD_POST } from "../api/mutations";

const styles = {
  container: (theme) => css`
    color: ${theme.colors.primary};
    background-color: ${theme.colors.bg};
  `,
  error: css`
    margin-left: 0.5em;
  `,

  formInput: css`
    margin-bottom: 0.5em;
  `,
  label: css`
    display: inline-block;
    // other elements will have (3 + 0.5)em margin-left to align with labels.
    margin-left: 0.5em;
    width: 3em;
  `,
  input: css`
    width: 40em;
  `,
  textContainer: css`
    margin-top: 0.5em;
    display: flex;
    align-items: center;
  `,
  button: css`
    font-size: 0.9rem;
    margin-left: 3.5rem;
    margin-top: 1rem;
  `,
  caution: css`
    font-size: 0.9rem;
    margin-left: 3.5rem;
    margin-top: 2rem;
    padding-bottom: 3rem;
  `,
};

interface IAddPostInput {
  link: string;
  title: string;
}

const Submit: FunctionComponent<RouteComponentProps> = () => {
  const theme = useTheme();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const { data, loading } = useQuery(ME, { fetchPolicy: "network-only" });
  const [addPost, { data: postData }] = useMutation(ADD_POST);

  const handleSubmit = (post: IAddPostInput) => {
    try {
      validateSubmit({ title, link });
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    addPost({ variables: { post } });

    setTitle("");
    setLink("");
  };

  if (postData && postData.addPost) {
    const { success, message } = postData.addPost;
    if (success) {
      return <Redirect to="/" noThrow />;
    } else {
      console.log(message);
    }
  }

  if (loading) {
    return null;
  } else if (data && data.me) {
    return (
      <div css={theme.layout}>
        <Header onlyTitle="Submit" />
        <div css={styles.container}>
          {errorMessage && <span css={styles.error}>{errorMessage}</span>}
          <div
            css={css`
              ${styles.formInput};
              padding-top: 1em;
            `}
          >
            <label htmlFor="title" css={styles.label}>
              title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              css={styles.input}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div css={styles.formInput}>
            <label htmlFor="url" css={styles.label}>
              url
            </label>
            <input
              type="text"
              name="url"
              id="url"
              css={styles.input}
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
          </div>

          <span
            css={css`
              font-weight: bold;
              margin-left: 3.5em;
            `}
          >
            or
          </span>

          <div css={styles.textContainer}>
            <label htmlFor="text" css={styles.label}>
              text
            </label>
            <textarea name="text" id="text" css={styles.input} rows={4} />
          </div>

          <button
            css={styles.button}
            onClick={() => handleSubmit({ link, title })}
          >
            submit
          </button>

          <p css={styles.caution}>
            Leave url blank to submit a question for discussion. If there is no
            url, the text (if any) will appear at the top of the thread.
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <Redirect
        to="/login"
        noThrow
        state={{
          message: "You have to be logged in to submit.",
          redirectedFrom: "/submit",
        }}
      />
    );
  }
};

export default Submit;
