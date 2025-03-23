import CognigyButton from "./ui/CognigyButton";
import Logo from "./ui/Logo";

const Header = () => {
  return (
    <header className="p-6 flex justify-between">
      <Logo src="/public/images/logo.jpeg" />

      <section>
        <CognigyButton
          label="Sign Up"
          variant="outlined"
          customColor="blue"
          textColor="white"
          sx={{ marginRight: "1rem", opacity: 0.7 }}
        />

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
      </section>
    </header>
  );
};

export default Header;
