const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your name"],
        maxLength: [30, "Name Cannot exceed 30 character"],
        minLength: [4, "Name should be more than 4 Characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Email"],
        minLength: [8, "password should be more than 8 Characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});
//Hash The password
userSchema.pre("save",async function(next){
    
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcrypt.hash(this.password,10);
});

//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//Comapre Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken= function(){
    
    //Generating Token
    const resetToken=crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;


    return resetToken;
}



module.exports = mongoose.model("User",userSchema);
