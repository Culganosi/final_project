import * as React from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import useStyles from "../styles";
import { useState, useRef } from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  CardContent,
  Grid,
  TextField,
  CardMedia,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import SkillListItem from "../components/SkillListItem";
import SocialListItem from "../components/SocialListItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//
//Import firebase config
import { storage } from "./../firebase-config";

//CSS STYLE IMPORT
import "./CreateProfile.css";

export default function CreateProfile() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [options, setOptions] = useState("");
  const [role, setRole] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [shortBio, setShortBio] = React.useState("");
  const [socialMedia, setSocialMedia] = React.useState({});
  const [skillsObject, setSkillsObject] = React.useState({
    default: false,
  });

  //Image upload variables
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState("");
  const [imageAsPreview, setImageAsPreview] = useState("");
  const fileInputRef = useRef();

  //Scroll to top when entering page
  //Load options from API
  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get("/api/options").then((res) => {
      console.log(res.data);
      setOptions(res.data);
    });
  }, []);

  //Only call "create profile" once the image has uploaded
  useEffect(() => {
    if (imageAsUrl) {
      createProfile();
    }
  }, [imageAsUrl]);

  //Send the input to the database
  const createProfile = () => {
    const skills = [];
    for (let skill of Object.keys(skillsObject)) {
      if (skillsObject[skill] == true) skills.push(skill);
    }
    skills.sort();
    const userData = {
      role,
      skills,
      shortBio,
      bio,
      socialMedia,
      avatar: imageAsUrl,
    };

    axios.patch("/api/users/self", userData).then((res) => {
      navigate("/Home");
    });
  };

  ///-----------For image upload

  //When the circular button is clicked, redirect to click the file upload instead
  const handleCircleClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  //When user chooses a new image, store it if it's valid
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    if (image && image.type.substr(0, 5) === "image") {
      setImageAsFile((imageFile) => image);
    }
  };

  //When the user's uploaded image changes
  //read it into a data string and store it
  useEffect(() => {
    if (imageAsFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageAsPreview(reader.result);
      };
      reader.readAsDataURL(imageAsFile);
    }
  }, [imageAsFile]);

  const handleFireBaseUpload = (e) => {
    //Random name for storing image file
    const randomFileName = (Math.random() + 1).toString(36);
    //Upload the image
    const uploadTask = storage
      .ref(`/images/${randomFileName}`)
      .put(imageAsFile);
    //Get the URL of the image
    uploadTask.on(
      "state_changed",
      (snapShot) => {},
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref("images")
          .child(randomFileName)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl(fireBaseUrl);
          });
      }
    );
  };

  ///

  return (
    <div className={classes.container}>
      <Container max-Width="sm">
        <Typography variant="h2" align="center" color="secondary" gutterBottom>
          Create your profile
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Set up your profile in order to best match you with other Collab||8rs!
        </Typography>
      </Container>

      <Box
        border={2}
        padding={5}
        margin={6}
        borderRadius={16}
        borderColor="#363667"
      >
        <Grid container justify="center" alignItems="stretch">
          <Grid item>
            <Paper
              className={classes.card}
              elevation={8}
              style={{ padding: "80px" }}
            >
              <CardContent>
                {/* Avatar selection here */}

                <Typography
                  className={classes.title}
                  style={{ marginBottom: "10px" }}
                  variant="h5"
                  color="secondary"
                >
                  The avatar is the window to the soul
                </Typography>

                {/* Display either the preview or the circular button */}
                {imageAsPreview ? (
                  <img
                    src={imageAsPreview}
                    className="avatar-preview"
                    onClick={handleCircleClick}
                  />
                ) : (
                  <button className="avatar-button" onClick={handleCircleClick}>
                    Upload an image
                  </button>
                )}

                {/* This is actually hidden */}
                <form>
                  <input
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    name="avatar"
                    onChange={handleImageAsFile}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                </form>

                <Box>
                  <Typography
                    className={classes.title}
                    style={{ marginBottom: "10px" }}
                    variant="h5"
                    color="secondary"
                  >
                    Which role best describes you?
                  </Typography>
                  <Grid container>
                    <Grid item xs={10}>
                      <ToggleButtonGroup
                        fullWidth="true"
                        color="primary"
                        value={role}
                        orientation={"horizontal"}
                        size={"medium"}
                        exclusive
                        onChange={(event) => setRole(event.target.value)}
                      >
                        {options &&
                          options.roles.map((role) => (
                            <ToggleButton
                              value={role}
                              style={{
                                borderRadius: "15px",
                                marginRight: "10px",
                              }}
                            >
                              {role}
                            </ToggleButton>
                          ))}
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>

                  <br />
                  {options && (
                    <SkillListItem
                      skillsObject={skillsObject}
                      setSkillsObject={setSkillsObject}
                      skillsOptions={options.skills}
                    />
                  )}
                </Box>

                {options && (
                  <SocialListItem
                    setSocialMedia={setSocialMedia}
                    socialMedia={socialMedia}
                    socialMediaOptions={options.socialMedia}
                  />
                )}

                <br />

                <Typography
                  className={classes.title}
                  variant="h5"
                  color="secondary"
                >
                  Describe yourself in 100 characters or less!
                </Typography>
                <div>
                  <TextField
                    id="filled-multiline-static"
                    inputProps={{ maxLength: 100 }}
                    label="Write a short & sweet intro"
                    multiline
                    rows={2}
                    defaultValue=""
                    variant="outlined"
                    color="secondary"
                    style={{ width: "100%" }}
                    value={shortBio}
                    onChange={(event) => setShortBio(event.target.value)}
                  />
                </div>

                <br />
                <Typography
                  className={classes.title}
                  variant="h5"
                  color="secondary"
                >
                  And now write as much as you want to help Collab||8'ors know
                  you better!
                </Typography>
                <div>
                  <TextField
                    id="filled-multiline-static"
                    label="Share more about your background and interests, what collaborations you're seeking, or anything else!"
                    multiline
                    rows={6}
                    defaultValue={bio}
                    variant="outlined"
                    color="secondary"
                    style={{ width: "100%" }}
                    onChange={(event) => setBio(event.target.value)}
                  />
                </div>
              </CardContent>
              <div>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  style={{ paddingRight: 15, marginTop: 5 }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleFireBaseUpload()}
                    >
                      Create Profile
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      style={{ marginBottom: "15px" }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
