const JWT_Token_Provider = require('../security/auth/jwtTokenProvider');

class AuthController {
  // validate token on the server side
    validate = async (req, res) => {
        try {
        JWT_Token_Provider.authenticateToken(req, res, () => {
            // This runs only if authenticateToken succeeds
            res.status(200).json({ valid: true, user: req.user });
        });
        } catch (err) {
        console.error("Error :", err);
        res.status(400).json({ error: err.message });
        }
    }

    // refresh token func by cheking token and that token is valid
    refreshFunc = async (req, res) => {
        try {
        console.log("cookies:", req.cookies);
        const token = req.cookies.refreshToken;
        if (!token) return res.sendStatus(401);

        const user = JWT_Token_Provider.verifyRefreshToken(token);
        if (!user) return res.sendStatus(403);

        const newAccessToken = JWT_Token_Provider.generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
        } catch (err) {
        console.error("Error :", err);
        res.status(400).json({ error: err.message });
        }
    }

    // logout deleteing cookie refresh token on the server side 
    logout = async (req, res) => {
        try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

        return res.status(200).json({ message: "Logg out successfully" });
        } catch (err) {
        console.error("Error :", err);
        res.status(400).json({ error: err.message });
        }
    }
}

// Create singleton instance
const authController = new AuthController();


module.exports = {
  validate: authController.validate,
  refreshFunc: authController.refreshFunc,
  logout: authController.logout
};