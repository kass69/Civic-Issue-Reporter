import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import { User } from "../models/User.models.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    const {username, email, phone, password} = req.body
    
    // validation -> ?not empty
    if(
        [username, email, phone, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required");
    }

    // check if user already exists via email
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User already exist with same email or username")
    }

    // create user object -> entry in DB
    const user = await User.create({
        username,
        email,
        phone,
        password,
    })
    
    // remove password and refresh token field from response
    
    // check for user creation
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
});

export {registerUser}