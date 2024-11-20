const mongoose = require('mongoose');
const connect = "mongodb+srv://pranaykumarbandla9:gdp123@cluster.01a4d.mongodb.net/Redox?retryWrites=true&w=majority&appName=Cluster"
const connectDatabase = async () => {
    try {
        const { connection } = await mongoose.connect(connect);
        console.log(`Connected to: ${connection.name}`);
    } catch (err) {
        console.error("Connect error:", err);
    }
};

module.exports = connectDatabase;



//mongodb://127.0.0.1:27017/Redox

//mongodb+srv://madhu:madhu123@game.c4dmm.mongodb.net/redox?retryWrites=true&w=majority&appName=Game
