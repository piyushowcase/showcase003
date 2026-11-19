import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.rout.js"
import creditsRouter from "./routes/credits.route.js"
import { stripeWebhook } from "./controlers/credits.controller.js"
dotenv.config()

const app = express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://examnotesai-wtqn.onrender.com"
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or if origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
// app.use(cors(
//     {origin: "https://one-noteaiclient1.onrender.com",
//         credentials:true,
//         methods:["GET","POST","PUT","DELETE","OPTIONS"]
//     }
// ))

// Stripe must receive the original raw request body for signature verification.
// This route must be registered before express.json().
app.post("/api/credits/webhook", express.raw({ type: "application/json" }), stripeWebhook)

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000

app.get("/",(req, res)=>{
    res.json({message: "ExamNote AI Backend  running "})
})
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/notes",notesRouter)
app.use("/api/pdf",pdfRouter)
app.use("/api/credits",creditsRouter)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`server is running on this port ${PORT}`)
    })
  } catch (error) {
    console.error("Server startup failed:", error)
    process.exit(1)
  }
}

startServer()
