//Coded by: Ahmed Al-Ansi
//Importing libraries
const express = require("express");
const app = express();
const routes = require("./routes.js");
const path = require("path");
const cors = require('cors');
const nodemailer = require('nodemailer');

//Coded by: Ing Ji for the next 4 lines of code
//vite server runs on port 5173 on default
const corsOptions = {
    origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

//Make all client side files publicly accessable
app.use("/Client-side", express.static("Client-side"));

//Getting server live
app.get("/", function(req, res)
{
res.sendFile(path.join(__dirname, "../Client-side/src/index.js"));
});

//forgot password from ing ji
app.post("/forgotPassword/:email", async function(req, res){
    const { email } = req.params;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });
  
    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.EMAIL , // sender address
            to: email, // list of receivers
            subject: "DDT Smart Home Password Reset", // Subject line
            html: `<p>Please click the link to reset your password \n</p><a href="http://localhost:5173/ResetPassword?email=${encodeURIComponent(email)}">RESET PASSWORD</a>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).send("Failed to send email.");
    }

});

//404 not found error
app.all("*", function(req, res)
{
    res.status(404).send("File not found!");
});

//Ensuring server is up
app.listen(8080, () => console.log("Server is online!"));

async function getPrediction(temperature, occupancy, energyUsage) {
    const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            temperature: temperature,
            occupancy: occupancy,
            energy_usage: energyUsage
        })
    });

    const data = await response.json();
    console.log("Prediction:", data.prediction);
    return data.prediction;
}

getPrediction(34,1,500);