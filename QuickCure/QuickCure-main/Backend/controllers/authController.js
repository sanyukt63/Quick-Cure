

const userModel = require('../models/userModel');
const userService = require('../services/userService');
const blacklistTokenModel = require('../models/blacklistTokenModel');
const Doctor = require('../models/doctorModel');


module.exports.registerUser = async (req , res ,next)=>{

    const {name,email,password,role = 'patient', licenseNumber, specialization,hospital, yearsOfExperience,qualification,bio, city, fees} = req.body

    const isAlreadyUser = await userModel.findOne({email});
    if(isAlreadyUser){
        return res.status(400).json({message: 'User already exist'});
    }

    const hashedPassword = await userModel.hashPassword(password)
    
    const user = await userService.createUser({
        name,
        email,
        password: hashedPassword,
        role
    });

    if (role === 'doctor') {
        await Doctor.create({
            user: user._id,
            name,
            specialization: specialization || 'General Physician',
            licenseNumber: licenseNumber || `LIC-${Date.now()}`,
            yearsOfExperience: yearsOfExperience || 0,
            hospital,
            qualification,
            bio,
            city: city || '',
            fees: fees || 500,
            verified: false,
            schedule: []
        });
    }

    const token = user.generateAuthToken();

    res.cookie('token',token);

    res.status(201).json({token,user});

}

module.exports.loginUser = async (req,res,next)=>{

    const {email,password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return res.status(401).json({message: "Invalid email or password"})
    }
    
    const token = user.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({token,user})
}

module.exports.logoutUser = async (req, res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    await blacklistTokenModel.create({token})
    res.status(200).json({message: 'Logged out'});
}