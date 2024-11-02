// Register
const register = (req: any, res: any) => {
    const {fullName, email, password} = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are rquired"})
    }

    // const findUserByEmail = await
}

// Login
const login = (req:any, res:any) => {
    return res.status(200).json({message: "login"})
}
export {register, login}