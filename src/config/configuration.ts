import 'dotenv/config'

export default () => ({
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
})
