const mongoose = require("mongoose");

mongoose.set('strictQuery', true)
const  connectDatabase = () =>{
	mongoose.connect(process.env.DB,{useNewUrlParser :true,useUnifiedTopology:true}).then((data)=>{
		console.log(`MongoDb connected with the server : ${data.connection.host}`);
	}).catch((err)=>{
		console.log(err);
	});
};

module.exports = connectDatabase;