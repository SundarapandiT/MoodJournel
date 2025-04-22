MoodMate
MoodMate is a React-based web application that allows users to track their daily moods, add notes, and visualize mood trends over time. The app features a dynamic calendar, weather integration via the OpenWeatherMap API, and a line chart to display mood trends. All data, including mood history and calendar state, is persisted in the browser's localStorage.
Features

Mood Tracking: Select from five mood states (Angry, Sad, Neutral, Happy, Very Happy) and add notes for each day.
Dynamic Calendar: Navigate through months to select dates and view past moods (future dates only for input).
Weather Integration: Automatically fetches current weather based on the user's geolocation using the OpenWeatherMap API.
Mood Trend Visualization: Displays a line chart of mood trends using Chart.js.
Persistent Storage: Saves mood history and calendar state in localStorage for persistence across sessions.
Responsive Design: Built with Material-UI, ensuring a mobile-friendly interface.
Snackbar Notifications: Provides feedback when moods are saved successfully.

Tech Stack

Frontend: React, Material-UI, Chart.js, react-chartjs-2
Date Handling: MUI X Date Pickers with Date-fns adapter
API: OpenWeatherMap API for weather data
Storage: Browser localStorage for persisting data
Build Tool: Vite
CSS: Custom styles with responsive design

Prerequisites

Node.js: Version 16 or higher
npm or yarn: For package management
OpenWeatherMap API Key: Obtain a free API key from OpenWeatherMap.

Installation



Install Dependencies:
npm install

Or, if using yarn:
yarn install


Set Up Environment Variables:Create a .env file in the root directory and add your OpenWeatherMap API key:


Run the Development Server:
npm run dev

Or with yarn:
yarn dev

The app will be available at http://localhost:5173 (or another port if specified).


Usage

Grant Location Access: Allow the browser to access your location to fetch weather data.
Select a Date: Use the calendar to pick a date (only future or current dates are editable).
Log Your Mood:
Choose a mood from the dropdown (e.g., 😊 Happy).
Add a note describing your feelings.
Click Save to record the entry.


View Trends: The Mood Trend section displays a line chart of your mood history.
Review Notes: The All Notes section shows cards with your saved moods, notes, and weather data.
Navigate Calendar: Use the arrow buttons to change months and view mood indicators on past dates.

