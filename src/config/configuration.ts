import 'dotenv/config'

export default () => ({
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  database: {
    url: process.env.DATABASE_URL,
  },
})
