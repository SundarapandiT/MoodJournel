import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, Card, CardContent, IconButton, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import './index.css';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const App = () => {
  // Initialize state from localStorage or default values
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [weather, setWeather] = useState({ temp: null, condition: '' });
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('moodHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Error loading mood history from localStorage:', error);
      return [];
    }
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(() => {
    try {
      const savedYear = localStorage.getItem('currentYear');
      return savedYear ? parseInt(savedYear) : new Date().getFullYear();
    } catch (error) {
      console.error('Error loading current year from localStorage:', error);
      return new Date().getFullYear();
    }
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    try {
      const savedMonth = localStorage.getItem('currentMonth');
      return savedMonth ? parseInt(savedMonth) : new Date().getMonth();
    } catch (error) {
      console.error('Error loading current month from localStorage:', error);
      return new Date().getMonth();
    }
  });
  const today = new Date();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Save moodHistory to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    } catch (error) {
      console.error('Error saving mood history to localStorage:', error);
    }
  }, [moodHistory]);

  // Save currentYear and currentMonth to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('currentYear', currentYear.toString());
      localStorage.setItem('currentMonth', currentMonth.toString());
    } catch (error) {
      console.error('Error saving calendar state to localStorage:', error);
    }
  }, [currentYear, currentMonth]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_API_KEY;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          setWeather({
            temp: data.main.temp,
            condition: data.weather[0].main,
          });
        });
      }
    };
    fetchWeather();
  }, []);

  const saveMood = () => {
    if (mood && note && selectedDate >= today.setHours(0, 0, 0, 0)) {
      const dateStr = selectedDate.toLocaleDateString();
      const existingIndex = moodHistory.findIndex(entry => entry.date === dateStr);
      if (existingIndex >= 0) {
        const updatedHistory = [...moodHistory];
        updatedHistory[existingIndex] = { mood, note, date: dateStr, weather };
        setMoodHistory(updatedHistory);
      } else {
        setMoodHistory([...moodHistory, { mood, note, date: dateStr, weather }]);
      }
      setMood('');
      setNote('');

      // Show success message
      setSnackbarMessage('Mood saved successfully!');
      setOpenSnackbar(true);
    }
  };

  // Dynamic calendar data
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (newDate >= today.setHours(0, 0, 0, 0)) {
      setSelectedDate(newDate);
    }
  };

  const getMoodForDate = (date) => {
    const entries = moodHistory.filter(entry => entry.date === new Date(currentYear, currentMonth, date).toLocaleDateString());
    return entries.length > 0 ? entries[entries.length - 1].mood : '';
  };

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Map moods to numerical values for graphing
  const moodToValue = (mood) => {
    switch (mood) {
      case '😡': return 1; // Angry
      case '😞': return 2; // Sad
      case '😐': return 3; // Neutral
      case '😊': return 4; // Happy
      case '😄': return 5; // Very Happy
      default: return 0;
    }
  };

  // Prepare data for the chart
  const chartData = {
    labels: moodHistory.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood Trend',
        data: moodHistory.map(entry => moodToValue(entry.mood)),
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            switch (value) {
              case 1: return '😡 Angry';
              case 2: return '😞 Sad';
              case 3: return '😐 Neutral';
              case 4: return '😊 Happy';
              case 5: return '😄 Very Happy';
              default: return '';
            }
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const moodValue = context.raw;
            switch (moodValue) {
              case 1: return 'Angry 😡';
              case 2: return 'Sad 😞';
              case 3: return 'Neutral 😐';
              case 4: return 'Happy 😊';
              case 5: return 'Very Happy 😄';
              default: return 'No Mood';
            }
          },
        },
      },
    },
  };

  const formatDateWithSuffix = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 2,
        background: '#ffcc80',
        borderRadius: 2,
        boxShadow: 1,
        width: '90%',
        [theme => theme.breakpoints.down('sm')]: {
          p: 1,
          width: '95%',
        },
      }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>MoodMate</Typography>
        <Typography variant="h6" align="center" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {formatDateWithSuffix(selectedDate)}
        </Typography>

        <Typography variant="subtitle1" align="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          🌡️ {weather.temp !== null ? `${weather.temp}°C` : 'Loading...'}
        </Typography>
        <Box sx={{
          display: 'flex',
          gap: 1,
          mb: 2,
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
        }}>
          <IconButton onClick={() => changeMonth(-1)} sx={{ p: { xs: 0.5, sm: 1 } }}><ArrowBackIosIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} /></IconButton>
          <Box sx={{
            width: { xs: '100%', sm: '300px' },
            background: '#fff',
            borderRadius: 1,
            p: 1,
            maxWidth: '300px',
          }}>
            <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <Typography key={day} variant="caption" sx={{ textAlign: 'center', fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>{day}</Typography>
              ))}
              {Array(firstDay).fill(null).map((_, i) => (
                <Typography key={`empty-${i}`} variant="body2" sx={{ textAlign: 'center' }}></Typography>
              ))}
              {days.map(day => {
                const date = new Date(currentYear, currentMonth, day);
                const isPast = date < today.setHours(0, 0, 0, 0);
                const mood = getMoodForDate(day);
                return (
                  <Typography
                    key={day}
                    variant="body2"
                    onClick={() => !isPast && handleDateClick(day)}
                    sx={{
                      textAlign: 'center',
                      background: selectedDate.toDateString() === date.toDateString() ? '#ff9800' : isPast ? '#e0e0e0' : 'transparent',
                      color: selectedDate.toDateString() === date.toDateString() ? '#fff' : '#000',
                      borderRadius: '50%',
                      width: { xs: '25px', sm: '30px' },
                      height: { xs: '25px', sm: '30px' },
                      lineHeight: { xs: '25px', sm: '30px' },
                      mx: 'auto',
                      cursor: isPast ? 'default' : 'pointer',
                      position: 'relative',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {day}
                    {mood && (
                      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                        {mood}
                      </span>
                    )}
                  </Typography>
                );
              })}
            </Box>
          </Box>
          <IconButton onClick={() => changeMonth(1)} sx={{ p: { xs: 0.5, sm: 1 } }}><ArrowForwardIosIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} /></IconButton>
        </Box>
        <Select value={mood} onChange={(e) => setMood(e.target.value)} sx={{ mb: 2, width: '100%', fontSize: { xs: '0.875rem', sm: '1rem' } }} disabled={selectedDate < today.setHours(0, 0, 0, 0)}>
          <MenuItem value="😡" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>😡 Angry</MenuItem>
          <MenuItem value="😞" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>😞 Sad</MenuItem>
          <MenuItem value="😐" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>😐 Neutral</MenuItem>
          <MenuItem value="😊" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>😊 Happy</MenuItem>
          <MenuItem value="😄" sx={{ fontSize: { xs: '1rem', sm: '1rem' } }}>😄 Very Happy</MenuItem>
        </Select>
        <TextField
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling today?"
          fullWidth
          sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          disabled={selectedDate < today.setHours(0, 0, 0, 0)}
        />
        <Button variant="contained" onClick={saveMood} sx={{ backgroundColor: '#ff9800', mb: 3, width: '100%', fontSize: { xs: '0.875rem', sm: '1rem' } }} disabled={selectedDate < today.setHours(0, 0, 0, 0)}>Save</Button>
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Mood Trend</Typography>
          {moodHistory.length > 0 ? (
            <Box sx={{ mb: 3, background: '#fff', borderRadius: 1, p: 2 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          ) : (
            <Typography align="center" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>No mood data available yet.</Typography>
          )}
          <Typography variant="h5" gutterBottom align="center" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>All Notes</Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(200px, 1fr))' },
            gap: 2,
            justifyContent: 'center',
          }}>
            {moodHistory.map((entry, index) => (
              <Card key={index} sx={{ background: '#ffe0b2', p: 1, borderRadius: 1, width: { xs: '100%', sm: 'auto' } }}>
                <CardContent sx={{ p: { xs: 1, sm: 1 } }}>
                  <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>{entry.mood}</Typography>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>{entry.note}</Typography>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>🌡️ {entry.weather.temp}°C</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default App;