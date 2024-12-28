/*
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

// Express App
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/quizApp";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Models
const Team = mongoose.model("Team", { name: String, score: Number });
const Question = mongoose.model("Question", {
  question: String,
  options: Array,
  answer: String,
});

// REST API to fetch teams
app.get("/teams", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

// REST API to add a team
app.post("/teams", async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({ name, score: 0 });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team" });
  }
});

// REST API to update team scores
app.post("/update-score", async (req, res) => {
  const { teamName, newScore } = req.body;
  try {
    const updatedTeam = await Team.findOneAndUpdate(
      { name: teamName },
      { score: newScore },
      { new: true }
    );
    io.emit("updateScores", await Team.find()); // Emit updated scores to all clients
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Failed to update score", error });
  }
});

// REST API to fetch questions
app.get("/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});
app.post("/eliminate-team", async (req, res) => {
  const { teamName } = req.body;
  try {
    const team = await Team.findOneAndUpdate({ name: teamName }, { isEliminated: true });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: "Error eliminating team." });
  }
});

// REST API to fetch results
app.get("/results", async (req, res) => {
  const teams = await Team.find().sort({ score: -1 });
  res.json(teams);
});

// WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let currentQuestionIndex = 0;

// WebSocket events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current question to the connected client
  socket.emit("currentQuestion", currentQuestionIndex);

  // Handle request to change the question
  socket.on("nextQuestion", (index) => {
    currentQuestionIndex = index;
    io.emit("currentQuestion", currentQuestionIndex); // Broadcast the updated question to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
*/


//here is new begin:
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

// Express App
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/quizApp";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Models
const Team = mongoose.model("Team", { name: String, score: Array, isEliminated: { type: Boolean, default: false } });
const Question = mongoose.model("Question", {
  round: Number,
  question: String,
  options: Array,
  answer: String,
  isVisual: { type: Boolean, default: false },
  imageURL: {type: String, require: false},
});

// REST API to fetch teams
app.get("/teams", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

// REST API to add a team
app.post("/teams", async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({ name, score: [0,0,0,0] });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team" });
  }
});
//eliminating team:
app.post("/eliminate-team", async (req, res) => {
  const { teamName } = req.body;
  try {
    const updatedTeam = await Team.findOneAndUpdate(
      { name: teamName },
      { isEliminated: true },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    io.emit("eliminateTeam", { teamName });
    res.status(200).json({ message: "Team eliminated", team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: "Failed to eliminate team", error });
  }
});

// REST API to update team scores 
app.post("/update-score", async (req, res) => {
  const { teamName, newScore, currentQuestionIndex } = req.body;
  try {
    const scoreIndex = currentQuestionIndex < 10 ? 0 : Math.floor(currentQuestionIndex / 10);
    const updateObject = {};
    updateObject[`score.${scoreIndex}`] = newScore;
    const updatedTeam = await Team.findOneAndUpdate(
      { name: teamName },
      updateObject,
      { new: true }
    );
    io.emit("updateScores", await Team.find()); // Emit updated scores to all clients
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Failed to update score", error });
  }
});

// REST API to fetch questions
app.get("/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let currentQuestionIndex = 0;

// WebSocket events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send current question to the connected client
  socket.emit("currentQuestion", currentQuestionIndex);

  // Handle request to change the question
  socket.on("nextQuestion", (index) => {
    currentQuestionIndex = index;
    io.emit("currentQuestion", currentQuestionIndex); // Broadcast the updated question to all clients
  });
  //handle time
  socket.on("timer", (time) =>{
    io.emit("timer", time);
  })
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

