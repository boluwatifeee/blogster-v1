import express from "express";
import { authUser, registerUser } from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/auth", authUser);
router.post("/register", registerUser);
// router.route("/").post(registerUser).get(protect, admin, getUsers);
// router.post("/logout", logoutUser);

// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);
// router
//   .route("/:id")
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

export default router;
