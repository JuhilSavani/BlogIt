import { Link } from "react-router-dom";

function Home() {
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
          <button>
            <Link to="/sign-up">Register</Link>
          </button>
          <button>
            <Link to="/sign-in">Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
