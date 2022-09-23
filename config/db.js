const { connect } = require('mongoose');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wut3k.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-2gkexp-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bexu61a.mongodb.net/?retryWrites=true&w=majority`;
module.exports = connect(uri, { useNewUrlParser: true });
