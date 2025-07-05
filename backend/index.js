import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";
dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen( port, () => {
        console.log(`Server is running on port : ${port}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed!\n", error);
    process.exit(1);
})

app.get("/", (req,res) => {
    res.send(`<h1>Server is Ready !</h1>`);
})

