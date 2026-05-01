import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const API = "https://tk5cb04oei.execute-api.us-east-1.amazonaws.com/prod";

  // ✅ Auto login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoggedIn(true);
    }
  }, []);

  // 🔐 LOGIN / SIGNUP
  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const endpoint = isLogin ? "/login" : "/signup";

    try {
      const res = await fetch(API + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.message || res.status));
        return;
      }

      if (isLogin) {
        localStorage.setItem("user", email);
        setLoggedIn(true);
      } else {
        alert("Signup successful! Now login.");
        setIsLogin(true);
      }

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={styles.container}>
      {loggedIn ? (
        <MainApp
          text={text}
          setText={setText}
          result={result}
          setResult={setResult}
          setLoggedIn={setLoggedIn}
          API={API}
        />
      ) : (
        <AuthUI
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

//////////////////////////////////////////////////////
// 🔐 AUTH UI
//////////////////////////////////////////////////////
const AuthUI = ({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
}) => {
  return (
    <div style={styles.card}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={handleSubmit}>
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>

      <button
        style={styles.toggle}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
};

//////////////////////////////////////////////////////
// 🚀 MAIN APP (AI GRADER)
//////////////////////////////////////////////////////
const MainApp = ({ text, setText, result, setResult, setLoggedIn, API }) => {

  // 🔥 REAL API CALL
  const handleEvaluate = async () => {
    if (!text) {
      alert("Enter assignment first");
      return;
    }

    try {
      const res = await fetch(API + "/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.message || res.status));
        return;
      }

      setResult("Score: " + data.score);

    } catch (err) {
      console.error(err);
      alert("API error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <h1>🧠 AI Assignment Grader</h1>

      <textarea
        placeholder="Paste your assignment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "300px",
          height: "150px",
          padding: "10px",
          borderRadius: "8px",
        }}
      />

      <br /><br />

      <button style={styles.button} onClick={handleEvaluate}>
        Evaluate
      </button>

      <p>{result}</p>

      <br />

      <button style={styles.toggle} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

//////////////////////////////////////////////////////
// 🎨 STYLES
//////////////////////////////////////////////////////
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toggle: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default App;