# siren - InfoShare Platform

InfoShare is a web application for sharing and discovering local information, events, and alerts. Built with Django and React, it allows users to post and view information tied to specific locations.

## Features

- User authentication and authorization
- Create, read, update, and delete posts
- Geolocation integration for posts
- Responsive React frontend
- RESTful API backend with Django

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/miofuku/siren.git
   cd siren
   ```

2. Set up a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

5. Run migrations:
   ```
   python3 manage.py migrate
   ```

6. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

## Running the Application

1. Start the Django development server:
   ```
   python3 manage.py runserver
   ```

2. In a new terminal, start the React development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

- `GET /api/posts/`: List all posts
- `POST /api/posts/`: Create a new post
- `GET /api/posts/<id>/`: Retrieve a specific post
- `PUT /api/posts/<id>/`: Update a specific post
- `DELETE /api/posts/<id>/`: Delete a specific post

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.