import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import Spinner from "../components/Spinner.js";
import { useAuth } from "../contexts/AuthProvider";
import "../pages/styles/AuthPages.css";
import PopUpAlert from "../components/PopUpAlert";

export default function LoginPage() {
  // Get the login function from the authentication context
  const { login } = useAuth();

  // Get the navigate function from the router
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message = "We are having trouble logging you in, please try reloading or contacting us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };

  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | Login";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate(`/myprofile`);
    } catch (error) {
      console.error("Error while logging in:", error.message);
      if(error.message.includes("Invalid email") || error.message.includes("not found")){
        setError(`No matching account found, Please Sign Up!`);
      }
      else if(error.message.includes("Incorrect password")){
        setError("Incorrect password. Please try again.");
      }
      else{
      setError("An error occurred while logging in. Please try again.");}
      showAlert();
    } finally {
      setIsLoading(false);
    }

    // Reset fields after submission for demonstration purposes
    setEmail("");
    setPassword("");
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
    {popAnAlert()}
    <div className="signin-page">
      <div className="signin-image">
        <h1>Start New Journey!</h1>
        <p>Want to create an account?</p>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
      <div className="signin-form">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          <div className="email-input">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="password-input">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
    </>
  );
}
