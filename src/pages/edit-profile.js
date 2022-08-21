import React from "react";
import Layout from "../components/shared/Layout";
import { useEditProfilePageStyles } from "../styles";
import { Button, Drawer, Hidden, IconButton, List, ListItem, ListItemText, Slide, Snackbar, TextField, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
// import { defaultCurrentUser } from "../data";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from 'react-hook-form';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { EDIT_USER, EDIT_USER_AVATAR } from "../graphql/mutations";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";

function EditProfilePage({ history }) {
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showDrawer, setDrawer] = React.useState(false);

  if(loading) return <LoadingScreen/>

  function handleToggleDrawer() {
    setDrawer(prev => !prev);
  }

  function handleSelected(index) {
    switch(index) {
      case 0:
        return path.includes('edit');
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch(index) {
      case 0:
        history.push('/accounts/edit');
        break;
      default:
        break;
    }
  }

  const options = [
    "Edit Profile",
    "Change Password",
    "Apps and Website",
    "Email and SMS",
    "Push Notifications",
    "Manage Contact",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagram"
  ]

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  )

  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu/>
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot
               }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes('edit') && <EditUserInfo user={data.users_by_pk}/>}
        </main>
      </section>
    </Layout>
  )
}

const DEFAULT_ERROR = { type: '', message: '' };

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm({ mode: 'onBlur' });
  const { updateEmail } = React.useContext(AuthContext);
  const [ profileImage, setProfileImage ] = React.useState(user.profile_image);
  const [ editUser ] =useMutation(EDIT_USER);
  const [ editUserAvatar ] = useMutation(EDIT_USER_AVATAR);
  const [ error, setError ] = React.useState(DEFAULT_ERROR);
  const [ open, setOpen ] = React.useState(false);

  async function onSubmit(data) {
    try {
      setError(DEFAULT_ERROR);
      // console.log(data)
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  function handleError(error) {
    console.log(error.message.includes("users_username_key"))
    if(error.message.includes("users_username_key")) {
      setError({ type: "username", message: "That username is already in use"})
    } else if (error.code.includes('auth')) {
      setError({ type: "email", message: error.message});
    } else {
      console.log(error)
      setError(error.message)
    }
  }

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(event.target.files[0]);
    console.log({ url });
    const variables = { id: user.id, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input 
            accept="image/*"
            id="image"
            type="file"
            style={{ visibility: 'hidden'}}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Typography 
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>

        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem name="name" {...register('name',{required: true,minLength: 5, maxLength: 20 })} text="name" formItem={user.name}/>
        <SectionItem name="username" error={error} {...register('username',{ required: true, minLength: 5, maxLength: 20, pattern: /^[a-zA-Z0-9_.]*$/ })} text="Username" formItem={user.username}/>
        <SectionItem name="website" {...register('website',{validate: input => Boolean(input) ? isURL(input, { protocols: ['http','https'], require_protocol: true }) : true })} text="Website" formItem={user.website}/>
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField
           name="bio" {...register('bio',{ maxLength: 120 })}
            variant="outlined"
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div/>
          <Typography color="textSecondary" className={classes.justifySelfStart}>
            Personal information
          </Typography>
        </div>
        <SectionItem name="email" error={error} {...register('email', { required: true,validate: input => isEmail(input) })} text="Email" formItem={user.email} type="email"/>
        <SectionItem name="phoneNumber" {...register('phoneNumber', { validate: input => Boolean(input) ?  isMobilePhone(input) : true  })} text="Phone Number" formItem={user.phone_number}/>
        <div className={classes.sectionItem}>
          <div/>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >Submit</Button>
        </div>
      </form>
      <Snackbar 
        open={open}
        autoHideDuration={3000}
        TransitionComponent={Slide}
        message={<span>Profile updated</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  )
}

const SectionItem = React.forwardRef(({ type = "text", text, formItem, name, error, ...rest }, ref) => {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} alight="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>
            {text}
          </Typography>
        </Hidden>
      </aside>
      <TextField
        {...rest}
        name={name}
        variant="outlined"
        fullWidth
        defaultValue={formItem}
        type={type}
        className={classes.textField}
        inputProps={{
          className: classes.textFieldInput
        }}
        ref={ref}
        helperText={error?.type === name && error.message}
      />
    </div>
  )
})

export default EditProfilePage;
