import React from "react";
import { useLoginPageStyles } from "../styles";
import SEO from '../components/shared/Seo';
import { Button, Card, CardHeader, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FacebookIconBlue from '../images/facebook-icon-blue.svg';
import FacebookIconWhite from '../images/facebook-icon-white.png';
import isEmail from 'validator/lib/isEmail';
import { AuthContext } from "../auth";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from './signup';

function LoginPage() {
  const classes = useLoginPageStyles();
  const { 
    register, 
    handleSubmit, 
    watch,
    formState
   } = useForm({ mode: 'onBlur' });
   const { loginWithEmailAndPassword } = React.useContext( AuthContext );
   const [showPassword, setPasswordVisibility] = React.useState(false);
   const hasPassword = Boolean(watch('password'));
   const history = useHistory();
   const [error, setError] = React.useState('');
   const client = useApolloClient();

  async function onSubmit({ input, password}) {

    try {
      setError('');
      if(!isEmail(input)) {
        input = await getUserEmail(input);
      }
      // console.log({ input, password })    
      await loginWithEmailAndPassword(input, password);
      setTimeout(() => history.push('/'), 0);
    } catch (error) {
        console.error("Error logging in", error);
        handleError(error);
    } 
  }


  function handleError(error) {
    if(error.code.includes('auth')) {
      setError(error.message);
    }
  }

  async function getUserEmail(input) {
      const variables = { input }
      const response = await client.query({
          query: GET_USER_EMAIL,
          variables
      })
      const userEmail = response.data.users[0]?.email || "no@email.com";
      return userEmail;
  }

  function togglePasswordVisibility() {
    setPasswordVisibility(prev => !prev);
  }

  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader}/>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="input"
                fullWidth
                variant="filled"
                label="Username, Email, or Phone"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                {...register('input',{
                  required: true,
                  minLength: 5,
                })}
              />
              <TextField
                name="password"
                fullWidth
                {...register('password',{
                  required: true,
                  minLength: 5
                })}
                variant="filled"
                label="Password"
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment>
                      <Button onClick={ togglePasswordVisibility }>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                type={showPassword ? "text" : "password"}


              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting }
              >
                Log In
              </Button>
              <div className={classes.orContainer}>
                <div className={classes.orLine} />
                <div>
                  <Typography varient="body2" color="textSecondary">
                    OR
                  </Typography>
                </div>
                <div className={classes.orLine} />
              </div>
              <LoginWithFacebook color="secondary" iconColor="blue" />
              <AuthError error={error}/>
              <Button fullWidth color="secondary">
                <Typography variant="caption">
                  Forgot password?
                </Typography>
              </Button>
            </form>
          </Card>
          <Card className={classes.signUpCard}>
              <Typography align="right" variant="body2">
                Don't have an account?
              </Typography>
              <Link to="/accounts/emailsignup">
                <Button color="primary" className={classes.signUpButton}>
                  Sign Up
                </Button>
              </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const { logInWithGoogle } = React.useContext(AuthContext);
  const facebookIcon = iconColor === 'blue' ? FacebookIconBlue : FacebookIconWhite;
  const [error, setError] = React.useState('');
  const history = useHistory();

  async function handleLoginWithGoogle() {
    try {
      await logInWithGoogle();
      setTimeout(() => history.push('/'), 0);
    } catch (error) {
      console.error('Error logging in with Google', error);
      setError(error.message);
    }
  }

  return (
    <>
      <Button onClick={handleLoginWithGoogle} fullWidth color={color} variant={variant}>
        <img src={facebookIcon} alt="facebook icon" className={classes.facebookIcon}/>
        Log In With Facebook
      </Button>
      <AuthError error={error}/>
    </>
  )
}

export default LoginPage;
