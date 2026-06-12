const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Notification Server Running");
});

app.post("/sendNotification", async (req, res) => {

    try {

        const movieName = req.body.movieName;

        console.log("New Content:", movieName);

        res.json({
            success: true,
            message: `${movieName} received`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
