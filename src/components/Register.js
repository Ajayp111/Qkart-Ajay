import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

   
  const [formStatus, setFormStatus] = useState("unsubmitted");
  let handleChange = (e) => {
    let [key, value] = [e.target.name, e.target.value];
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const register = async (formData) => {
    console.log(formData);

    const valid = validateInput(formData);
    if (valid) {
      setFormStatus("submitted");
      try {
        let res = await axios.post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        });
        console.log(res);
        enqueueSnackbar("Registered Successfully", {variant:"success"});
        history.push("/login", { from: "Register" })
        setFormStatus("unsubmitted");
      } catch (e) {
        setFormStatus("submitted");
        console.log(e.response.data);
        if (e.response) {
          enqueueSnackbar(e.response.data.message, {variant: "error"});
        } else {
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON", {variant: "error"});
        }
        setFormStatus("unsubmitted");
      }
      
    }
    
  };


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
      let msg="";

    if (!data.username) {
      msg = "Username is a required field";
    } else if (data.username.length < 6) {
      msg = "Username must be at least 6 characters";
    } else if (!data.password) msg = "Password is a required field";
    else if (data.password.length < 6) {
      msg = "Password must be at least 6 characters";
    } else if (data.password !== data.confirmPassword)
      msg = "Passwords do not match";

     
     
    console.log(msg);
    if (msg){
      enqueueSnackbar(msg, {variant: "warning"});
       return false;
    }
    else {
      return true;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={formData.username}
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            fullWidth
          />
          {formStatus==="unsubmitted"?<Button
            className="button"
            variant="contained"
            onClick={() => register(formData)}
          >
            Register Now
          </Button>:<div className="spinner"><CircularProgress/></div>}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login ">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
