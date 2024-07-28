const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "'WEBSITE' BED Assignment 2 API",
    description: "This API allows users to manage their social interactions on a platform. Users can create, view, update, and delete posts, as well as add, view, update, and delete comments on posts. Additionally, users have the ability to like or unlike posts. The API supports user authentication, enabling users to register and log in to their accounts. Once logged in, users can view other people's profiles and update or delete their own profiles through the profile button.",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);