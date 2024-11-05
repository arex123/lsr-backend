import express from "express";
import passport from "passport";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.CLIENT_URL,
  })
);
// router.get(
//     "/google/callback",
//     passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL}),
//     (req, res) => {
//       // Send JSON indicating authentication success
//       res.json({ success: true, user: req.user });
//     }
//   );


// Authenticated user data route
router.get("/user", (req, res) => {
  console.log(req.isAuthenticated(), req.user,req.headers.origin,process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);

  if (req.isAuthenticated()) {
    // User is authenticated, send user data
    res.json({ message:"user logged in successfuly", user: req.user });
  } else {
    // User is not authenticated, send empty response or error
    res.json({ message:"user not authorized",user: null });
  }
});


router.get('/logout',(req,res)=>{
    req.logOut(function(err){
        if(err){return next(err)}
        // res.redirect(process.env.CLIENT_URL)
        res.json({ success: true, message: "Logged out successfully" });

    })
})

export default router;
