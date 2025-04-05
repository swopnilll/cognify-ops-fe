import { Link } from "@tanstack/react-router";
import CognigyButton from "./ui/CognigyButton";
import Logo from "./ui/Logo";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center bg-white shadow-neutral-400">
      <Link to="/"><Logo src="images/logo.jpeg" /></Link>

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
    </header>
  );
};

export default Header;
