const mongoose = require('mongoose'); // Ensure the path is correct

async function seedDatabase() {
  try {
    // Connect to MongoDB (use 127.0.0.1 instead of localhost for compatibility)
    await mongoose.connect('mongodb://127.0.0.1:27017/quizApp');
    console.log('Connected to MongoDB');
    const questionSchema = new mongoose.Schema({
        round: Number,
        qno: Number,
       question: String,
        options: [String],
        answer: String,
        isVisual: { type: Boolean, default: false},
        imageURL: {type: String, require: false},
      });
      const teamSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        score: { type: [Number], default: [0,0,0,0] },
        isEliminated: { type: Boolean, default: false},
      });
     
       
      const Question = mongoose.model('Question', questionSchema);
    const Team = mongoose.model('Team', teamSchema);
    // Clear existing data
  
    await Question.deleteMany({});
    await Team.deleteMany({});

    console.log('Existing data cleared');

    // Add questions
    const questions = [
  { round: 1, qno: 1, question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
  { round: 1, qno: 2, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { round: 1, qno: 3, question: "What is the boiling point of water?", options: ["90°C", "100°C", "120°C", "80°C"], answer: "100°C" },
  { round: 1, qno: 4, question: "What is the largest planet?", options: ["Mars", "Earth", "Jupiter", "Venus"], answer: "Jupiter", isVisual: true, imageURL: "https://c02.purpledshub.com/uploads/sites/41/2024/04/jupiter.jpg?w=1200" },
  { round: 1, qno: 5, question: "What is the speed of light?", options: ["3x10^8 m/s", "3x10^7 m/s", "3x10^6 m/s", "3x10^5 m/s"], answer: "3x10^8 m/s" },
  { round: 1, qno: 6, question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Austen", "Hemingway"], answer: "Shakespeare" },
  { round: 1, qno: 7, question: "What is the smallest prime number?", options: ["1", "2", "3", "5"], answer: "2" },
  { round: 1, qno: 8, question: "Which is the tallest mountain?", options: ["K2", "Kangchenjunga", "Mount Everest", "Makalu"], answer: "Mount Everest" },
  { round: 1, qno: 9, question: "What is the chemical symbol for Gold?", options: ["Ag", "Au", "Pt", "Pb"], answer: "Au" },
  { round: 1, qno: 10, question: "Who is the inventor of the telephone?", options: ["Edison", "Bell", "Tesla", "Faraday"], answer: "Bell" },

  // Round 2 Questions
  { round: 2, qno: 1, question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], answer: "Da Vinci", isVisual: true, imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" },
  { round: 2, qno: 2, question: "What is the square root of 81?", options: ["7", "8", "9", "10"], answer: "9" },
  { round: 2, qno: 3, question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Saturn"], answer: "Mars" },
  { round: 2, qno: 4, question: "What is the chemical formula for water?", options: ["CO2", "H2O", "O2", "H2O2"], answer: "H2O" },
  { round: 2, qno: 5, question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
  { round: 2, qno: 6, question: "What is 15 x 5?", options: ["70", "75", "80", "85"], answer: "75" },
  { round: 2, qno: 7, question: "Who discovered gravity?", options: ["Einstein", "Newton", "Galileo", "Kepler"], answer: "Newton" },
  { round: 2, qno: 8, question: "What is the national flower of India?", options: ["Rose", "Lily", "Lotus", "Jasmine"], answer: "Lotus" },
  { round: 2, qno: 9, question: "Who is the father of computers?", options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"], answer: "Charles Babbage" },
  { round: 2, qno: 10, question: "What is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], answer: "Pacific" },

  // Round 3 Questions
  { round: 3, qno: 1, question: "What is the first element on the periodic table?", options: ["Helium", "Hydrogen", "Oxygen", "Lithium"], answer: "Hydrogen" },
  { round: 3, qno: 2, question: "Who is known as the Iron Man of India?", options: ["Nehru", "Patel", "Gandhi", "Bose"], answer: "Patel" },
  { round: 3, qno: 3, question: "What is the capital of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Nagoya"], answer: "Tokyo" },
  { round: 3, qno: 4, question: "What is 7 x 8?", options: ["54", "56", "58", "60"], answer: "56" },
  { round: 3, qno: 5, question: "Who invented the light bulb?", options: ["Tesla", "Edison", "Faraday", "Newton"], answer: "Edison" },
  { round: 3, qno: 6, question: "What is the freezing point of water?", options: ["0°C", "100°C", "50°C", "-10°C"], answer: "0°C" },
  { round: 3, qno: 7, question: "Which planet has the most moons?", options: ["Earth", "Jupiter", "Saturn", "Mars"], answer: "Saturn" },
  { round: 3, qno: 8, question: "What is the main language spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: "Portuguese" },
  { round: 3, qno: 9, question: "What is the speed of sound?", options: ["340 m/s", "400 m/s", "300 m/s", "350 m/s"], answer: "340 m/s" },
  { round: 3, qno: 10, question: "What is the national bird of the USA?", options: ["Bald Eagle", "Robin", "Hawk", "Pigeon"], answer: "Bald Eagle" },

  // Round 4 Questions
  { round: 4, qno: 1, question: "What is the smallest country in the world?", options: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"], answer: "Vatican City" },
  { round: 4, qno: 2, question: "What is the highest-grossing movie?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars"], answer: "Avatar" },
  { round: 4, qno: 3, question: "Who is the author of 'Harry Potter'?", options: ["Rowling", "Tolkien", "Lewis", "Collins"], answer: "Rowling" },
  { round: 4, qno: 4, question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars", "Earth"], answer: "Mercury" },
  { round: 4, qno: 5, question: "What is the national animal of India?", options: ["Elephant", "Tiger", "Peacock", "Lion"], answer: "Tiger" },
  { round: 4, qno: 6, question: "Who painted the Sistine Chapel?", options: ["Da Vinci", "Michelangelo", "Raphael", "Van Gogh"], answer: "Michelangelo" },
  { round: 4, qno: 7, question: "What is the national currency of Japan?", options: ["Yuan", "Won", "Yen", "Dollar"], answer: "Yen" },
  { round: 4, qno: 8, question: "Who discovered penicillin?", options: ["Fleming", "Pasteur", "Curie", "Darwin"], answer: "Fleming" },
  { round: 4, qno: 9, question: "What is the atomic number of Carbon?", options: ["5", "6", "7", "8"], answer: "6" },
  { round: 4, qno: 10, question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" }
      // Add more questions as needed
    ];
    await Question.insertMany(questions);

    // Add teams
    const teams = [
      { name: 'Team A', score: [0,0,0,0] },
      { name: 'Team B', score: [0,0,0,0] },
      { name: 'Team C', score: [0,0,0,0] },
      { name: 'Team D', score: [0,0,0,0] },
      { name: 'Team E', score: [0,0,0,0] },
      { name: 'Team F', score: [0,0,0,0] },
      { name: 'Team G', score: [0,0,0,0] },
      { name: 'Team H', score: [0,0,0,0] },
    ];
    await Team.insertMany(teams);

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

seedDatabase();
