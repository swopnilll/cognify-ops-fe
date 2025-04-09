// components/AuthButtons.tsx
import { Link } from "@tanstack/react-router";
import CognigyButton from "./CognigyButton";


const AuthButtons = () => {
  return (
    <section>
      <Link to="/signup">
        <CognigyButton
          label="Sign Up"
          variant="outlined"
          customColor="blue"
          textColor="white"
          sx={{ marginRight: "1rem", opacity: 0.7 }}
        />
      </Link>

      <Link to="/login">
        <CognigyButton
          label="Login"
          variant="outlined"
          customColor="white"
          textColor="blue"
          sx={{
            border: "1px solid blue",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        />
      </Link>
    </section>
  );
};

export default AuthButtons;
