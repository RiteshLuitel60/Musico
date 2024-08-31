import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const clientId =
  "187054712023-79qv27op3v37l3196764gmi800p7jhqr.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();
  const onSuccess = (res) => {
    console.log("Login success! Current user: ", res.profileObj);
    navigate("/");
  };

  const onFailure = (res) => {
    console.log("Login failed! res: ", res);
    navigate("/around-you");
  };

  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
