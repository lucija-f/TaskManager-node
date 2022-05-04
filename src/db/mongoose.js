const mongoose = require('mongoose')

// mongoose connects to the database
mongoose.connect(process.env.MONGODB_URL)

