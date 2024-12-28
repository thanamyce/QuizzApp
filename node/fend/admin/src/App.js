/*
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newTeam, setNewTeam] = useState("");
  const [socket, setSocket] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Fetch teams and questions
    const fetchInitialData = async () => {
      try {
        const teamsRes = await axios.get("http://localhost:4000/teams");
        const questionsRes = await axios.get("http://localhost:4000/questions");
        setTeams(teamsRes.data);
        setQuestions(questionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();

    // WebSocket setup
    const socketInstance = io("http://localhost:4000");
    setSocket(socketInstance);

    // Listen for updates
    socketInstance.on("updateScores", (updatedTeams) => setTeams(updatedTeams));
    socketInstance.on("currentQuestion", (index) => setCurrentQuestionIndex(index));

    return () => socketInstance.disconnect(); // Cleanup WebSocket connection
  }, []);

  const addTeam = async () => {
    if (!newTeam.trim()) return;
    try {
      const response = await axios.post("http://localhost:4000/teams", { name: newTeam });
      setTeams((prev) => [...prev, response.data]);
      setNewTeam(""); // Clear input field
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const updateScore = async (teamName, points) => {
    const team = teams.find((t) => t.name === teamName);
    if (!team || team.isEliminated) return;

    try {
      const newScore = team.score + points;
      await axios.post("http://localhost:4000/update-score", { teamName, newScore });
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const nextQuestion = () => {
    if (isGameOver) return;

    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    socket.emit("nextQuestion", nextIndex); // Notify all clients
  };

  const eliminateTeam = async (teamName) => {
    try {
      await axios.post("http://localhost:4000/eliminate-team", { teamName });
      setTeams((prev) =>
        prev.map((team) =>
          team.name === teamName ? { ...team, isEliminated: true } : team
        )
      );
    } catch (error) {
      console.error("Error eliminating team:", error);
    }
  };

  const declareWinner = () => {
    if (teams.length === 0) return;

    const maxScore = Math.max(...teams.map((team) => (team.isEliminated ? -Infinity : team.score)));
    const winners = teams.filter((team) => team.score === maxScore && !team.isEliminated);

    setWinner(winners);
    setIsGameOver(true);

    // Emit result to clients
    socket.emit("gameOver", winners);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      
      <div className="mb-4">
        <h4>Current Question:</h4>
        <p>{questions[currentQuestionIndex]?.question || "No question available"}</p>
        <button className="btn btn-primary" onClick={nextQuestion} disabled={isGameOver}>
          Next Question
        </button>
      </div>

      
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Team Name"
          className="form-control"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
        <button className="btn btn-success mt-2" onClick={addTeam} disabled={isGameOver}>
          Add Team
        </button>
      </div>

      
      <div className="mb-4">
        <button className="btn btn-warning" onClick={declareWinner} disabled={isGameOver}>
          Declare Winner
        </button>
      </div>

      
      {isGameOver && winner && (
        <div className="alert alert-success">
          <h3>Winner(s):</h3>
          <ul>
            {winner.map((team) => (
              <li key={team._id}>{team.name}</li>
            ))}
          </ul>
        </div>
      )}

      
      <div className="row mt-4">
        {teams.map((team) => (
          <div key={team._id} className="col-md-4">
            <div className={`card mb-3 ${team.isEliminated ? "bg-secondary" : "bg-dark"} text-white`}>
              <div className="card-body text-center">
                <h5 className="card-title">{team.name.toUpperCase()}</h5>
                <p className="card-text display-4">{team.score}</p>
                <button
                  className="btn btn-success mx-2"
                  onClick={() => updateScore(team.name, 5)}
                  disabled={team.isEliminated || isGameOver}
                >
                  +5
                </button>
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => updateScore(team.name, -5)}
                  disabled={team.isEliminated || isGameOver}
                >
                  -5
                </button>
                <button
                  className="btn btn-warning mt-2"
                  onClick={() => eliminateTeam(team.name)}
                  disabled={team.isEliminated || isGameOver}
                >
                  Eliminate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
*/



import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newTeam, setNewTeam] = useState("");
  const [socket, setSocket] = useState(null);
  const [time, setTime] = useState(30);

  useEffect(() => {
    // Fetch teams and questions
    axios.get("http://localhost:4000/teams").then((res) => setTeams(res.data));
    axios.get("http://localhost:4000/questions").then((res) => setQuestions(res.data));

    // WebSocket setup
    const socketInstance = io("http://localhost:4000");
    setSocket(socketInstance);

    // Listen for updates
    socketInstance.on("updateScores", (updatedTeams) => setTeams(updatedTeams));
    socketInstance.on("currentQuestion", (index) => setCurrentQuestionIndex(index));
    socketInstance.on("eliminateTeam", ({ teamName }) => {
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.name === teamName ? { ...team, isEliminated: true } : team
        )
      );
    });

    return () => socketInstance.disconnect(); // Cleanup
  }, []);

  const addTeam = () => {
    if (!newTeam) return;
    axios
      .post("http://localhost:4000/teams", { name: newTeam })
      .then((res) => setTeams((prev) => [...prev, res.data]))
      .catch((err) => console.error(err));
    setNewTeam("");
  };

  const eliminateLowestScoringTeam = async () => {
    if (teams.length === 0) {
      alert("No teams available to eliminate.");
      return;
    }
  
    // Filter active teams (not eliminated)
    const activeTeams = teams.filter((team) => !team.isEliminated);
  
    if (activeTeams.length === 0) {
      alert("All teams are already eliminated.");
      return;
    }
  
    // Find the lowest-scoring team
    let lowestScoringTeam = activeTeams[0];
    activeTeams.forEach((team) => {
      const teamScore = team.score[currentQuestionIndex < 10 ? 0 : Math.floor(currentQuestionIndex / 10)];
      const lowestScore = lowestScoringTeam.score[currentQuestionIndex < 10 ? 0 : Math.floor(currentQuestionIndex / 10)];
  
      if (teamScore < lowestScore) {
        lowestScoringTeam = team;
      }
    });
  
    const teamName = lowestScoringTeam.name;
  
    // Send request to eliminate the team
    try {
      const res = await axios.post("http://localhost:4000/eliminate-team", { teamName });
      if (res.status === 200) {
        alert(`${teamName} has been eliminated.`);
        // Fetch updated team list
        const updatedTeams = await axios.get("http://localhost:4000/teams");
        setTeams(updatedTeams.data); // Update the state with new team list
      }
    } catch (err) {
      console.error("Error eliminating team:", err);
      alert("Failed to eliminate team. Check the server.");
    }
  };
  
  
  const updateScore = (teamName, points) => {
    const team = teams.find((t) => t.name === teamName);
    if (!team) return;

    const newScore = team.score[currentQuestionIndex<10?0:Math.floor(currentQuestionIndex/10)] + points;
    axios
      .post("http://localhost:4000/update-score", { teamName, newScore, currentQuestionIndex })
      .catch((err) => console.error("Error updating score:", err));
  };

  const nextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    socket.emit("nextQuestion", nextIndex); // Emit new question index to server
  };
  const timer = () => {
    socket.emit("timer", time); // Emit new question index to server
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin Dashboard ROUND: {currentQuestionIndex<10?1:Math.floor(currentQuestionIndex/10)+1}</h1>

      <div className="mb-3">
        <h4>Current Question:</h4>
        <p>{currentQuestionIndex+1} {questions[currentQuestionIndex]?.question || "No question available"}</p>
        <button className="btn btn-primary" onClick={nextQuestion}>
          Next Question
        </button>
        <button className="btn btn-primary" onClick={timer}>Timer</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="New Team Name"
          className="form-control"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTeam}>
          Add Team
        </button>
      </div>

      <div className="row mt-4">
      {teams.map((team) => (
  <div key={team._id} className="col-md-4">
    {team.isEliminated ? (
      <div className="card text-white bg-secondary mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">{team.name.toUpperCase()}</h5>
          <p className="card-text display-4">
            {team.score[0]} {team.score[1]} {team.score[2]} {team.score[3]}
          </p>
          <p className="card-text">Eliminated Team</p>
        </div>
      </div>
    ) : (
      <div className="card text-white bg-dark mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">{team.name.toUpperCase()}</h5>
          <p className="card-text display-4">
            {team.score[0]} {team.score[1]} {team.score[2]} {team.score[3]}
          </p>
          <button
            className="btn btn-success mx-2"
            onClick={() => updateScore(team.name, 5)}
          >
            +5
          </button>
          <button
            className="btn btn-danger mx-2"
            onClick={() => updateScore(team.name, -5)}
          >
            -5
          </button>
        </div>
      </div>
    )}
  </div>
))}

      </div>
      <div className="mb-3">
        <button className="btn btn-danger mt-2" onClick={eliminateLowestScoringTeam}>
          ELIMINATE
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;


