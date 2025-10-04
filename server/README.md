Node.js - JavaScript runtime
Express.js - Web framework
TypeScript - Type-safe JavaScript
MongoDB - NoSQL database
Mongoose - MongoDB ODM
JWT - JSON Web Tokens for authentication
bcrypt - Password hashing


git clone <repository-url>
cd backend
npm install
create .env file with : {
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/event-tracker
    JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
    JWT_EXPIRE=7d
    NODE_ENV=development
}

Development Mode
 -- npm run build


 Production Mode
 -- npm run build
 -- npm start
