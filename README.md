# 🌤️ MoodMate

**MoodMate** is a modern, responsive **React** web app that helps you track your daily moods, add personal notes, and visualize your emotional trends over time.

> Stay in tune with your emotions — one day at a time.

---

## ✨ Features

- 🎭 **Mood Tracking**  
  Select from five moods — Angry 😠, Sad 😢, Neutral 😐, Happy 😊, and Very Happy 😄 — and write notes for each day.

- 📅 **Dynamic Calendar**  
  Easily navigate through months. Past entries are view-only; future/current dates can be edited.

- 🌦️ **Weather Integration**  
  Auto-fetches current weather based on your **geolocation** using the [OpenWeatherMap API](https://openweathermap.org/api).

- 📈 **Mood Trend Visualization**  
  Displays a **line chart** of your mood history using **Chart.js**.

- 💾 **Persistent Storage**  
  Saves mood data and calendar state in **localStorage** to retain information across sessions.

- 📱 **Responsive Design**  
  Built with **Material UI (MUI)** for a smooth experience on all devices.

- 🔔 **Snackbar Notifications**  
  Feedback for saved moods with elegant notification toasts.

---

## 🛠️ Tech Stack

| Category      | Tools / Libraries                                      |
|---------------|--------------------------------------------------------|
| **Frontend**  | React, Material-UI, Vite                               |
| **Charts**    | Chart.js, react-chartjs-2                              |
| **Date Picker** | MUI X Date Pickers with Date-fns                     |
| **API**       | OpenWeatherMap API                                     |
| **Storage**   | Browser localStorage                                   |
| **Build Tool**| Vite                                                   |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) — Version 16 or higher
- npm or yarn — For package management
- OpenWeatherMap API Key — [Get a free key here](https://home.openweathermap.org/users/sign_up)

---

## 🚀 Installation

Install Dependencies:
npm install

Or, if using yarn:
yarn install


## Set Up Environment Variables:
Create a .env file in the root directory and add your OpenWeatherMap API key:


## Run the Development Server:
npm run dev

Or with yarn:
yarn dev

The app will be available at ``http://localhost:5173 ``(or another port if specified).


## Usage

Grant Location Access: Allow the browser to access your location to fetch weather data.
Select a Date: Use the calendar to pick a date (only future or current dates are editable).
Log Your Mood:
Choose a mood from the dropdown (e.g., 😊 Happy).
Add a note describing your feelings.
Click Save to record the entry.


View Trends: The Mood Trend section displays a line chart of your mood history.
Review Notes: The All Notes section shows cards with your saved moods, notes, and weather data.
Navigate Calendar: Use the arrow buttons to change months and view mood indicators on past dates.

