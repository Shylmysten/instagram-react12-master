import React from "react";
import Layout from "../components/shared/Layout";
import { useProfilePageStyles } from "../styles";
import { defaultCurrentUser } from "../data"
import { Button, Card, CardContent, Hidden, Typography } from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";
import { Link } from "react-router-dom";
import { GearIcon } from "../icons";

function ProfilePage() {
  const isOwner = true;
  const [showOptionsMenu, setOptionsMenu] = React.useState(false);
  const classes = useProfilePageStyles();

  function handleOptionsMenuClick() {
    setOptionsMenu(true);
  }

  return (
    <Layout title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner}/>
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                user={defaultCurrentUser}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
              <PostCountSection />
              <NameBioSection />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture size={77} isOwner={isOwner}/>
                <ProfileNameSection 
                  user={defaultCurrentUser}
                  isOwner={isOwner}
                  handleOptionsMenuClick={handleOptionsMenuClick}
                />
              </section>
              <NameBioSection />
            </CardContent>
            <PostCountSection />
          </Card>
        </Hidden>
      </div>
    </Layout>
  );
}

function ProfileNameSection({ user, isOwner, handleOptionsMenuClick }) {
  const classes = useProfilePageStyles();

  let followButton;
  const isFollowing = false;
  const isFollower = false;
  if(isFollowing) {
    followButton = (
      <Button variant="outlined" className={classes.button}>
        Following
      </Button>
    );
  } else if(isFollower) {
    followButton = (
      <Button variant="contained" color="primary" className={classes.button}>
        Follow Back
      </Button>
    );
  } else {
    followButton = (
      <Button variant="contained" color="primary" className={classes.button}>
        Follow
      </Button>
    );
  }


  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>
              {user.username}
          </Typography>
          {isOwner ? (
            <>
              <Link to="/accounts/edit">
                <Button variant="outlined">Edit Profile</Button>
              </Link>
              <div onClick={handleOptionsMenuClick} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <>
              {followButton}
            </>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && (
              <div onClick={handleOptionsMenuClick} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to="/accounts/edit">
              <Button variant="outlined" style={{ width: "100%" }}>Edit Profile</Button>
            </Link>
          ) : followButton }
        </section>
      </Hidden>
    </>
  );
}

function PostCountSection() {
  return (
    <>
      PostCountSection
    </>
  );
}

function NameBioSection() {
  return (
    <>
      NameBioSection
    </>
  );
}

export default ProfilePage;
