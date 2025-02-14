import * as React from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import useStyles from "../styles";
import { useState } from "react";
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
import SkillListEdit from "../components/SkillListEdit";
import SocialListItem from "../components/SocialListItem";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const classes = useStyles();

  //Scroll to top when entering page
  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get("/api/options").then((res) => {
      console.log(res.data);
      setOptions(res.data);
    });
  }, []);

  useEffect(() => {
    // --->
    axios.get("api/users/self").then((res) => {
      setOldProfile(res.data);
      setRole(res.data.role);
    });
  }, []);

  const submitEditProfile = () => {
    const skills = [];
    for (let skill of Object.keys(skillsObject)) {
      if (skillsObject[skill] == true) skills.push(skill);
    }

    const newData = {
      role,
      skills,
      shortBio,
      bio,
      socialMedia,
    };

    axios.patch("/api/users/self", newData).then((res) => {
      console.log(res.data);
      navigate("/My-Profile");
    });
  };

  const [oldProfile, setOldProfile] = useState({});

  const [options, setOptions] = useState("");
  const params = useParams();
  const userId = params.id;

  const [role, setRole] = React.useState(oldProfile.role);
  const [bio, setBio] = React.useState(oldProfile.bio);
  const [shortBio, setShortBio] = React.useState(oldProfile.shortBio);
  const [socialMedia, setSocialMedia] = React.useState(
    oldProfile.setSocialMedia
  );

  const [skillsObject, setSkillsObject] = React.useState({});

  const [value, setValue] = React.useState("Controlled");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.container}>
      <Container max-Width="sm">
        <Typography variant="h2" align="center" color="secondary" gutterBottom>
          Edit your profile
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Edit your profile in order to best match you with other Collab||8rs!
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
                <CardMedia
                  className={classes.createProfMedia}
                  image="https://i.pinimg.com/474x/50/9b/1d/509b1dcaadfdc98a39c5e0bec21fc197.jpg"
                />
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      component="label"
                      style={{ marginTop: "30px" }}
                    >
                      Change Profile Picture
                      <input type="file" hidden />
                    </Button>
                  </Grid>
                </Grid>
                <Box>
                  <Typography
                    className={classes.title}
                    variant="h5"
                    color="secondary"
                  >
                    Preferred Role
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

                  <SkillListEdit
                    skillsObject={skillsObject}
                    setSkillsObject={setSkillsObject}
                    oldProfile={oldProfile}
                  />
                </Box>

                <Typography
                  className={classes.title}
                  variant="h6"
                  color="secondary"
                >
                  Short Bio
                </Typography>
                <div>
                  <TextField
                    id="filled-multiline-static"
                    label=""
                    multiline
                    rows={1}
                    defaultValue=""
                    variant="outlined"
                    color="secondary"
                    style={{ width: "75%" }}
                    value={oldProfile.shortBio}
                    onChange={(event) => setShortBio(event.target.value)}
                  />
                </div>
                {options && (
                  <SocialListItem
                    setSocialMedia={setSocialMedia}
                    socialMediaOptions={options.socialMedia}
                  />
                )}

                <Typography
                  className={classes.title}
                  variant="h6"
                  color="secondary"
                >
                  Bio
                </Typography>
                <div>
                  <TextField
                    id="filled-multiline-static"
                    label=""
                    multiline
                    rows={6}
                    defaultValue={oldProfile.bio}
                    variant="outlined"
                    color="secondary"
                    style={{ width: "75%" }}
                    onChange={(event) => setBio(event.target.value)}
                  />
                </div>
              </CardContent>
              <div>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => submitEditProfile()}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                  <Grid item>
                    <Link to="/Home">
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ marginBottom: "15px" }}
                      >
                        Cancel
                      </Button>
                    </Link>
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
