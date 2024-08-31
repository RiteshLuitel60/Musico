import { useNavigate } from "react-router-dom";
import { GoogleLogout } from "@react-oauth/google";

const clientId =
  "187054712023-79qv27op3v37l3196764gmi800p7jhqr.apps.googleusercontent.com";

function Logout() {
  const navigate = useNavigate();

  const onSuccess = () => {
    console.log("Logout successful");
    // Clear any user-related data from local storage or state if necessary
    // For example:
    // localStorage.removeItem('user');
    // dispatch(clearUserData());
    navigate("/LoginPage"); // Redirect to login page after successful logout
  };

  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
