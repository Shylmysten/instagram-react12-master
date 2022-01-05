import { Typography } from "@material-ui/core";
import React from "react";
import Layout from "../components/shared/Layout";
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return <Layout title="Page Not Found" marginTop={120}>
    <Typography variant="h5" align="center" paragraph>
      Sorry, this page isn't available.
    </Typography>
    <Typography align="center" paragraph>
      The link you followed may be broken, or the page may have been removed.
      <Link to="/">
    {" "}
      <Typography color="primary" component="span">
        Go back to Instagram.
      </Typography>
    </Link>
    </Typography>

  </Layout>;
}

export default NotFoundPage;