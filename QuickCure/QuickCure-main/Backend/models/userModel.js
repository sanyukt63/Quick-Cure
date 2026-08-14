const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String
    }
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET,);
    return token;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}


const userModel = mongoose.model('User',userSchema);

module.exports = userModel;