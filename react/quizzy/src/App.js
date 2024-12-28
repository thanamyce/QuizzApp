
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import './App.css';

// Connect to WebSocket server
const socket = io("http://localhost:4000");

const QuizApp = () => {
  
  const [questions, setQuestions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [time, setTime] = useState(null);

  useEffect(() => {
    // WebSocket listeners
    socket.on("updateQuestions", (data) => setQuestions(data));
    socket.on("currentQuestion", (index) => setCurrentQuestionIndex(index));
    socket.on("updateScores", (data) => setTeams(data));
    socket.on("timer", (time) => setTime(time));
    socket.on("eliminateTeam", ({ teamName }) => {
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.name === teamName ? { ...team, isEliminated: true } : team
        )
      );
    });

    // Fetch initial data from backend
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
    fetch("http://localhost:4000/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data));

    return () => {
      // Cleanup WebSocket listeners
      socket.off("updateQuestions");
      socket.off("currentQuestion");
      socket.off("updateScores");
    };
  }, []);

  // Function to navigate to the next question
  const handleNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length; // Loop back to the start
    setCurrentQuestionIndex(nextIndex);
    socket.emit("nextQuestion", nextIndex); // Notify the server
  };

  return (
    <div className="container mt-4" >
      <h1 className="text-center mb-4 fw-bold " style={{ fontSize: '55px', backgroundColor: '#5C7C89',  borderColor: 'black', color: 'white', padding: '1px', borderRadius: '15px' }}>ROUND: {currentQuestionIndex<10?1:Math.floor(currentQuestionIndex/10)+1}</h1>

      
      <div className="row mb-5 d-flex and justify-content-center" >
        {teams
        .filter((team) => !team.isEliminated)
        .map((team) => (
          <div key={team._id} className="col-md-3">
            <div className="card text-white  mb-3" style={{backgroundColor: '#DEF2F1'}}>
              <div className="card-body text-center">
                <h5 className="card-title" style={{color: '#17252A'}}>{team.name.toUpperCase()}</h5>
                <p className="card-text fw-bold display-4" style={{color: '#17252A',}}>{team.score[currentQuestionIndex<10?0:Math.floor(currentQuestionIndex/10)]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

     
     
      <Carousel
        activeIndex={currentQuestionIndex}
        onSelect={() => {}}
        interval={null} // Disable auto-scroll
        controls={false} // Disable default controls
        indicators={false} // Hide indicators
      >
        {questions.map((q) => (
    <Carousel.Item key={q._id}>
      {q.isVisual ? (
        // Visual question layout
        <div
          className="d-flex align-items-center justify-content-center p-5 rounded shadow"
          style={{ minHeight: "300px", border: "1px solid #ddd", backgroundColor: "#DEF2F1", marginBottom: "25px" }}
        >
          {/* Image on the left */}
          <div className="me-4" style={{ flex: 1 }}>
            <img
              src={q.imageURL}
              alt="Visual Question"
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}
            />
          </div>

          {/* Question and options on the right */}
          <div style={{ flex: 2 }}>
            <h3 className="text-center mb-4 fw-bold" style={{ fontSize: "30px", color: "#17252A" }}>
              {q.qno}. {q.question}
            </h3>
            <div className="d-flex flex-column align-items-start">
              {q.options.map((opt, index) => (
                <div
                  key={index}
                  className="list-group-item list-group-item-action text-center fw-bold fs-4 mb-3"
                  style={{ cursor: "pointer", backgroundColor: "#5C7C89", color: "white", padding: "10px", borderRadius: "15px" }}
                >
                  {index + 1}. {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Non-visual question layout (default)
        <div
          className="d-flex flex-column align-items-center justify-content-center p-5 rounded shadow"
          style={{ minHeight: "300px", border: "1px solid #ddd", backgroundColor: "#DEF2F1", marginBottom: "25px" }}
        >
          <h3 className="text-center mb-4 fw-bold" style={{ fontSize: "30px", color: "#17252A" }}>
            {q.qno}. {q.question}
          </h3>
          <div className="container">
            <div className="row">
              {q.options.map((opt, index) => (
                <div
                  key={index}
                  className="col-6 mb-4"
                >
                  <div
                    className="list-group-item list-group-item-action text-center fw-bold fs-4"
                    style={{ cursor: "pointer", backgroundColor: "#5C7C89", color: "white", padding: "10px", borderRadius: "15px" }}
                  >
                    {index + 1}. {opt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Carousel.Item>
  ))}
      </Carousel>

      
      
    </div>
  );
};

export default QuizApp;

