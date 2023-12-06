const dotenv = require("dotenv")
dotenv.config()

module.exports = {
    PORT: process.env.PORT, 
    API_KEY_SYN: process.env.API_KEY_SYN,
    API_KEY_DICT: process.env.API_KEY_DICT
}