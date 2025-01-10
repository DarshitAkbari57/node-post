Blog API
A RESTful API built with Node.js, Express, and MongoDB for managing blog posts with tags and image handling.
Features

Create posts with base64 encoded images
Tag management for posts
Advanced post filtering and search
Pagination and sorting
Swagger documentation
MongoDB integration
Base64 image validation
Error handling

Prerequisites

Node.js (v14+ recommended)
MongoDB (v4+ recommended)
npm or yarn package manager

Installation

Clone the repository:

git clone [<repository-url>](https://github.com/DarshitAkbari57/node-post.git)
cd blog-api

Install dependencies:

npm install

Create a .env file in the root directory with the following content:

MONGODB_URI=mongodb://localhost:27017/blog
PORT=3000

Start the development server:

npm run dev
The API will be available at http://localhost:3000/api
API Endpoints
GET /api/posts
Get all posts with filtering, sorting, and pagination options.
Query Parameters:

page (default: 1): Page number for pagination
limit (default: 10): Number of items per page
sortBy (default: 'createdAt'): Field to sort by
sortOrder (default: 'desc'): Sort order ('asc' or 'desc')
keyword: Search in title and description
tag: Filter by tag name

