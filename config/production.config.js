module.exports = {
  ENV: "production",
  MONGO_URI: process.env.MONGO_URI,
  MAIL_CONFIG: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_CODE,
    },
  },
  GOOGLE_AUTH_CONFIG: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/user/auth/google/callback",
  },
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  APP_NAME: "Codieal App",
  AVATAR_PATH: "/uploads/users/avatars",
  DEFAULT_AVATAR_PATH: "/assets/images/avatar.png",
  SASS_FILE_PATH: "./assets/scss",
  PORT: 8000,
  SECRET: process.env.SECRET
};
