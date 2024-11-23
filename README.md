# BlogIt

BlogIt is a web application that allows users to create, read, and manage blog posts.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Features

- User authentication (registration and login)
- Create, edit, and delete blog posts
- Markdown support for writing posts
- Intuitive design with a clean UI
- Protected routes for creating and managing content

## Technologies

- **Frontend:** React, Toast-UI Editor, Toastify.js, Validator.js, react-query
- **Backend:** Node.js, Express, Passport.js, jsonwebtoken, bcrypt
- **Database:** MongoDB (using Mongoose)
- **Styling:** SCSS (custom styles and transitions)
- **Development Tools:** VS Code, Postman (for API testing)

## Installation

To set up BlogIt locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/JuhilSavani/BlogIt.git
    cd BlogIt
    ```

2.  Install dependencies for the backend:
    ```bash
    cd server
    npm install --force
    ```

3.  Set up the environment variables. Create a **.env** file in the server directory with the following variables:
    - Copy the **.env.example** file to **.env** in the server directory:
        ```bash
        cp .env.example .env
        ```
    - Update the values in the **.env** file as needed (e.g., `DB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`).
<br/>

4.  Install dependencies for the frontend:
    ```bash
    cd ../client
    npm install --force
    ```

5.  Start the backend:
    ```bash
    cd server
    npm run dev
    ```

6.  In another terminal, start the frontend:
    ```bash
    cd client
    npm run dev
    ```

7.  Open your browser and access the application at http://localhost:3000.

## Usage
- Registration: New users can create an account to access all features.
- Login: Registered users can log in to create and manage their blog posts.
- Create Post: Authenticated users can create new blog posts using rich text editor.
- Update Post: Authenticated users can update their existing blog post using rich text editor.
- Read Posts: All users can view blog posts created by others.

## API Endpoints

1. **Authentication** `/authorize`
    - POST `/register` - Register a new user
    - POST `/login` - Log in a user
    - POST `/logout` - Log out a user
    - GET `/refresh` - Refresh the authentication token
<br/>

2. **Verification** `/verify`
    - GET `/:email` - Verify if the email is legit 
    - POST `/account` - Check if the username or email already exists
<br/>

3. **Blog Posts** `/protected`

    - GET `/retreive/blogs` - Retrieve all blog posts (protected)
    - GET `/retreive/blog/:id` - Retrieve single blog post (protected)
    - POST `/publish/blog` - Create a new blog post (protected)
    - PUT `/edit/blog/:id` - Update a blog post (protected)
    - DELETE `/delete/blog/:id` - Delete a blog post (protected)

## Contributing
Contributions are welcome! If you have suggestions or improvements, please fork the repository and create a pull request.

**Happy coding! :rocket:**

---

