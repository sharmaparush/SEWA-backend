const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://parushsharma501:Greenland12%23@cluster0.qxenitc.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;