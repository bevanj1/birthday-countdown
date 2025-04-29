import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Remove injectStyles function

const startDate = new Date("2025-05-01");

const generateDays = () => {
  const stored = localStorage.getItem("days");
  if (stored) return JSON.parse(stored);

  const dayList = [];
  for (let i = 0; i < 26; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dayList.push({
      day: i + 1,
      date: date.toDateString(),
      media: [],
    });
  }
  localStorage.setItem("days", JSON.stringify(dayList));
  return dayList;
};

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/login" />;
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "nikkibaby" && password === "bevanlovesyou") {
      localStorage.setItem("auth", "true");
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const Home = ({ days }) => {
  const [countdown, setCountdown] = useState("");

  // Function to calculate the time remaining
  const calculateCountdown = () => {
    const targetDate = new Date("2025-05-26T00:00:00");
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    // If the target date has passed, show "Happy Birthday Baby"
    if (timeDifference <= 0) {
      setCountdown("Happy Birthday Baby");
      return;
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);

    setCountdown(`${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
  };

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      <h1> Birthday Countdown </h1>
      <h2>Wohooo!!!</h2>
      <h2>Lets go gorgeous</h2>

      <div className="countdown-timer">
        <h2>{countdown}</h2>
      </div>

      <ul className="day-list">
        {days.map((item) => (
          <li key={item.day}>
            <Link to={`/day/${item.day}`}>
              Day {item.day} - {item.date}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DayPage = () => {
  const { day } = useParams();
  const data = require("./data/dayData").default;
  const current = data.find((d) => d.day === parseInt(day));

  if (!current)
    return <p>WOMAN HAVE PATIENCE!!!!! we are not yet on this day</p>;

  return (
    <div className="day-page">
      <h2>Day {current.day}</h2>
      <p>{current.message}</p>
      <div className="media-wrap">
        {current.media.map((filename, i) => {
          const isVideo =
            filename.endsWith(".mp4") || filename.endsWith(".mov");
          const src = `/assets/day${current.day}/${filename}`;
          return (
            <div className="media-card" key={i}>
              {isVideo ? (
                <video src={src} controls />
              ) : (
                <img src={src} alt={`media-${i}`} />
              )}
            </div>
          );
        })}
      </div>
      <Link to="/">← Back to list</Link>
    </div>
  );
};

function App() {
  const [days, setDays] = useState(generateDays());

  useEffect(() => {
    localStorage.setItem("days", JSON.stringify(days));
  }, [days]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home days={days} />
            </PrivateRoute>
          }
        />
        <Route
          path="/day/:day"
          element={
            <PrivateRoute>
              <DayPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
