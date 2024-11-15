import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

//auth user / get token  - public POST /api/users/auth
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPass(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ error: "no user found" });
    }
  } catch (error) {
    res.status(500).json({ error: "server error" });
    console.log(error);
  }
};

//reg user  -  public  -  public POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400).json({ error: "This email is registerd" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
  }
};

//logout / clear cookie  -  public POST /api/users/logout
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: new Date(0),
  });

  res.status(200).json({ message: "logged out successfuly" });
};

//get user profile  - privet GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (user) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
};

//update user profile  - private PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(4000).json({ error: "Incorrect data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

//get all user  -   privet/admin GET /api/users
const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(204).json({ message: "No user found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//get user by id  -  privet/admin GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(204).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//delete user  - privet/admin DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400).json({ message: "Can not delete admin" });
        return;
      }
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "User Deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//update user  - privet/admin PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUser,
  deleteUser,
  getUserById,
  updateUser,
};
