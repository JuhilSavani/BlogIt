import { Link } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";

function Home() {
  const { auth } = useAuth();

  return (
    <div className="page home">
      <div className="container">
        <h1>
          Share&nbsp;your&nbsp;thoughts&nbsp;with&nbsp;<span>BlogIt</span>
        </h1>
        <p>
          Your personal space for microblogging—quickly share moments and ideas!
        </p>
        <div>
          {auth?.accessToken ? (
            <Link to="/create">Create a Post</Link>
          ) : (
            <>
              <Link to="/sign-up">Register</Link>
              <Link to="/sign-in">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
