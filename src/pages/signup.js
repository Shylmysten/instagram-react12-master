import React from "react";
import { useSignUpPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import { Button, Card, InputAdornment, TextField, Typography } from "@material-ui/core";
import { LoginWithFacebook } from "./login";
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../auth";
import { useForm } from "react-hook-form";
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons';
import isEmail from 'validator/lib/isEmail';
import { useApolloClient } from "@apollo/react-hooks";
import { CHECK_IF_USERNAME_IS_TAKEN } from "../graphql/queries";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { 
    register, 
    handleSubmit, 
    formState,
   } = useForm({ mode: 'onBlur' });
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);

  const history = useHistory();
  const [error, setError] = React.useState('');
  const client = useApolloClient();
  
  
  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   await signUpWithEmailAndPassword(values);
  //   history.push('/');
  // }

  async function onSubmit(data) {
      // console.log({data})
      try {
        setError('');
        await signUpWithEmailAndPassword(data);
        setTimeout(() => history.push('/'), 0);
      } catch(error) {
        console.error('Error Signing Up', error);
        // setError(error.message);
        handleError(error);
      }
  }

  function handleError(error) {
    if(error.message.includes("users_username_key")) {
      setError('That username is already in use')
    } else if (error.code.includes('auth')) {
      setError(error.message);
    } else {
      console.log(error)
      setError(error.message)
    }
  }

  React.useEffect(() => {
    console.log("touchedFields", formState.touchedFields);
  },[formState]);

  async function validateUserName(username) {
    const variables = { username };
    const response = await client.query({
      query: CHECK_IF_USERNAME_IS_TAKEN,
      variables
    })
    const isUsernameValid = response.data.users.length === 0;
    return isUsernameValid;
  }

  const errorIcon = (
    <InputAdornment>
      <HighlightOff style={{ color: 'red', width: 30, height: 30 }} />
    </InputAdornment>
  )

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline style={{ color: '#ccc', width: 30, height: 30 }} />
    </InputAdornment>
  )

  return (
    <>
      <SEO title="Sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <div className={classes.cardHeader}/>
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook color="primary" iconColor="white" variant="contained"/>
            <div className={classes.orContainer}>
                <div className={classes.orLine} />
                <div>
                  <Typography varient="body2" color="textSecondary">
                    OR
                  </Typography>
                </div>
                <div className={classes.orLine} />
              </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                {...register('email', {
                  required: true,
                  validate: input => isEmail(input) // returns true or false
                })}
                InputProps={{
                  endAdornment: formState.errors.email ? errorIcon : formState.touchedFields.email && validIcon,
                  
                }}
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="name"
                {...register('name',{
                  required: true,
                  minLength: 5,
                  maxLength: 20
                })}
                InputProps={{
                  endAdornment: formState.errors.name ? errorIcon : formState.touchedFields.name && validIcon,
                  
                }}
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="username"
                {...register('username',{
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  validate: async (input) => await validateUserName(input),
                  // accept only lowercase/uppercase letters, numbers, periods and underscores
                  pattern: /^[a-zA-Z0-9_.]*$/
                })}
                InputProps={{
                  endAdornment: formState.errors.username ? errorIcon : formState.touchedFields.username && validIcon,
                  
                }}
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                {...register('password',{
                  required: true,
                  minLength: 5
                })}
                InputProps={{
                  endAdornment: formState.errors.password ? errorIcon : formState.touchedFields.password && validIcon,
                  
                }}
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                className={classes.textField}
                autoComplete="new-password"
                type="password"
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting }
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={error}/>
          </Card>
          <Card className={classes.loginCard}>
              <Typography align="right" variant="body2">
                Have an account?
              </Typography>
              <Link to="/accounts/login">
                <Button color="primary" className={classes.loginButton}>
                  Log in
                </Button>
              </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function AuthError({ error }) {
  return Boolean(error) && (
    <Typography
      align="center"
      gutterBottom
      variant="body2"
      style={{ color: 'red'}}
      >
        {error}
      </Typography>
  )
}

export default SignUpPage;
