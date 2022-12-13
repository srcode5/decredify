// import modules
import express from 'express';
const morgan = require('morgan')
const { json, urlencoded } = express;
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv'
import fs from 'fs';
dotenv.config()

// app
const app = express();

dotenv.config();



// dbConnect();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// routes

fs.readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));


// port
const port = process.env.PORT || 8080;

// listener
const server = app.listen(port, () =>
	console.log(`Server is running on port ${port}`)
);

try {
	mongoose.connect( process.env.MONGO_URI, { 
		useNewUrlParser: true, 
        useUnifiedTopology: true,
	}, () =>
	console.log("connected"));    
	}catch (error) { 
	console.log("could not connect");    
}