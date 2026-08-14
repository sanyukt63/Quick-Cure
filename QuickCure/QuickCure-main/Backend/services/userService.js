const userModel = require('../models/userModel')

module.exports.createUser = async ({
    name,
    email,
    password,
    role,licenseNumber, specialization, yearsOfExperience, city, fees
})=> {
    if(!name || !email || !password || !role){
        throw new Error("All fields are required")
    }
    const user = await userModel.create({
        name,
        email,
        password,
        role,licenseNumber, specialization, yearsOfExperience, city, fees
    })
    return user;
}