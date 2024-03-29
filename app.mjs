import express from "express"

const app = express();

app.get("/", (req, res) => res.json("Hello World!"));

app.listen(9999, () => console.log(`Server ready at http://localhost:9999`))