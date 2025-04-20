import { ClipLoader } from "react-spinners";
import { useAuth } from "../../hooks/useAuthV2";

const GlobalLoader = () => {

  const {isLoading} = useAuth();


  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <ClipLoader color="#00BFFF" loading={isLoading} size={100} />
    </div>
  );
};

export default GlobalLoader;