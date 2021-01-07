import React, { useState } from "react";
import FileBase from "react-file-base64";
import { createPost, updatePost } from "../redux/actions/posts";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import NotificationSystem from "react-notification-system";
import { Redirect } from "react-router-dom";
import { CodeSlash } from "react-bootstrap-icons";
import { useAuth0 } from "@auth0/auth0-react";
import HashLoader from "react-spinners/HashLoader";
import Fade from "react-reveal/Fade";
import "../index.css";

const FormComponent = ({ isFromModal, post, onHide }) => {
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading, user } = useAuth0();

  const notificationSystem = React.createRef();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [postData, setPostData] = useState({
    creator: isFromModal ? post.creator : "",
    title: isFromModal ? post.title : "",
    message: isFromModal ? post.message : "",
    tags: isFromModal ? post.tags : [],
    selectedFile: isFromModal ? post.selectedFile : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    postData.creator = user.nickname;

    setLoading(true);

    const notification = notificationSystem.current;

    if (isFromModal) {
      dispatch(updatePost(post._id, postData)).then(() => {
        setLoading(false);
        notification.addNotification({
          level: "success",
          autoDismiss: 3,
          position: "br",
          children: (
            <div>
              <h6>Post updated successfully!</h6>
            </div>
          ),
        });
      });

      setTimeout(() => {
        onHide();
        clearTimeout();
      }, 2000);
    }

    if (!isFromModal) {
      if (!postData.selectedFile) {
        notification.addNotification({
          level: "error",
          autoDismiss: 3,
          position: "br",
          children: (
            <div>
              <h6>Please upload a valid code snippet image !</h6>
            </div>
          ),
        });
        setLoading(false);
      } else {
        dispatch(createPost(postData)).then(() => {
          setLoading(false);
          notification.addNotification({
            // message: "Post created successfully !",
            level: "success",
            autoDismiss: 3,
            position: "br",
            children: (
              <div>
                <h6>Post created successfully!</h6>
              </div>
            ),
          });
          setTimeout(() => {
            setMessage("Post created successfully !");
            clearTimeout();
          }, 2000);
        });
      }
    }
  };

  if (!isAuthenticated && !isLoading) {
    return <Redirect to="/login" />;
  } else
    return !message ? (
      <Fade>
        <Container
          style={{ marginTop: "30px", height: "100%vh" }}
          className={!isFromModal ? "col-md-4 col-sm-8" : "col-lg"}
        >
          {message && setMessage("")}
          {isFromModal ?? <h2>Create an awesome snippet post 😎</h2>}
          <Form onSubmit={(e) => handleSubmit(e)} id="postForm">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Eg : My MongoDb Post model"
                name="title"
                value={postData.title}
                required
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                placeholder="Eg : This is the schema"
                name="message"
                value={postData.message}
                required
                onChange={(e) =>
                  setPostData({ ...postData, message: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Eg : #mongodb , #models (seperated by , )"
                name="tags"
                value={postData.tags}
                required
                onChange={(e) =>
                  setPostData({ ...postData, tags: e.target.value.split(",") })
                }
              />
            </Form.Group>
            <Form.Label>Code snap</Form.Label>
            <br />
            <FileBase
              type="file"
              required={true}
              multiple={false}
              name="selectedFile"
              value={postData.selectedFile}
              onDone={(data) => {
                console.log(data);
                if (
                  data.type === "image/jpeg" ||
                  data.type === "image/jpg" ||
                  data.type === "image/png"
                ) {
                  console.log("Yes");
                  setPostData({ ...postData, selectedFile: data.base64 });
                }
              }}
            />

            <Button variant="dark" type="submit" block className="mt-4">
              {isFromModal ? "Edit" : "Submit"} <CodeSlash className="ml-1" />
            </Button>

            {loading && (
              <Container
                className="text-center"
                style={{
                  marginTop: "25px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <HashLoader />
                <small className="mt-2">
                  {isFromModal ? "Finishing up ..." : "Uploading..."}
                </small>
              </Container>
            )}
            <NotificationSystem ref={notificationSystem} />
          </Form>
        </Container>
      </Fade>
    ) : (
      <Redirect to="/" />
    );
};

export default FormComponent;
