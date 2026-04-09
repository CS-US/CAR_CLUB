# CLUB CAR CLUB - F1 Predictions Championship 2026

A modern web application for F1 race predictions where players guess the podium finishers and compete for points on a leaderboard.

## Features

- **Automatic Race Selection**: System automatically detects the next upcoming F1 race based on current date
- **2026 Season Data**: Updated with all 22 drivers from the 2026 F1 season including new teams Cadillac and Audi
- **Prediction Submission**: Players submit their predictions for 1st, 2nd, and 3rd place finishers
- **Dynamic Leaderboard**: Real-time leaderboard showing player rankings and scores
- **Scoring System**: Points awarded based on correct predictions with bonus for perfect predictions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All predictions saved locally using browser localStorage

## Scoring System

- **1st Place Correct**: 10 points
- **2nd Place Correct**: 7 points  
- **3rd Place Correct**: 5 points
- **Perfect Prediction**: +5 bonus points (all three positions correct)

## How to Use

### For Players

1. **Open the Website**: Simply open `index.html` in any modern web browser
2. **Enter Your Name**: Type your name in the first field
3. **View Current Race**: The system automatically displays the next upcoming F1 race
4. **Make Predictions**: Select your predicted 1st, 2nd, and 3rd place finishers from the 2026 driver lineup
5. **Submit**: Click "Submit Prediction" to save your entry
6. **View Leaderboard**: Check the leaderboard to see current standings

### For Administrators

After each race, administrators can update the actual results to calculate scores:

1. Open the browser developer console (F12)
2. Use the admin function to set actual results:
   ```javascript
   f1PredictionApp.setActualRaceResults('raceName', '1st Driver', '2nd Driver', '3rd Driver');
   ```
   
   Example:
   ```javascript
   f1PredictionApp.setActualRaceResults('bahrain', 'Max Verstappen', 'Sergio Perez', 'Charles Leclerc');
   ```

## File Structure

```
windsurf-project/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This documentation file
```

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (no frameworks required)
- **Storage**: Browser localStorage for data persistence
- **Design**: Responsive grid layout with modern UI components
- **Compatibility**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Browser Console Functions

The following functions are available in the browser console for advanced usage:

- `f1PredictionApp.setActualRaceResults(raceName, first, second, third)` - Set actual race results and calculate scores
- `f1PredictionApp.calculateScore(prediction, actualResults)` - Calculate score for a prediction
- `f1PredictionApp.clearAllData()` - Clear all prediction data
- `f1PredictionApp.loadLeaderboard()` - Refresh the leaderboard display

## 2026 F1 Calendar

The application automatically selects the next upcoming race from the 2026 F1 season:
- Australian Grand Prix - March 6-8
- Chinese Grand Prix - March 13-15
- Japanese Grand Prix - March 27-29
- Miami Grand Prix - May 1-3
- Canadian Grand Prix - May 22-24
- Monaco Grand Prix - June 5-7
- Spanish Grand Prix - June 12-14
- Austrian Grand Prix - June 26-28
- British Grand Prix - July 3-5
- Belgian Grand Prix - July 17-19
- Hungarian Grand Prix - July 24-26
- Dutch Grand Prix - August 21-23
- Italian Grand Prix - September 4-6
- Spanish Grand Prix - September 11-13
- Azeraijan Grand Prix - September 24-26
- Singapore Grand Prix - October 9-11
- United States Grand Prix - October 23-25
- Mexican Grand Prix - October 30 - November 1
- Brazilian Grand Prix - November 6-8
- Las Vegas Grand Prix - November 19-21
- Qatar Grand Prix - November 27-29
- Abu Dhabi Grand Prix - December 4-6

## Driver List

Includes all 22 drivers from the 2026 F1 season:
- **McLaren**: Lando Norris, Oscar Piastri
- **Mercedes**: George Russell, Kimi Antonelli
- **Red Bull**: Max Verstappen, Isack Hadjar
- **Ferrari**: Charles Leclerc, Lewis Hamilton
- **Williams**: Alex Albon, Carlos Sainz
- **Racing Bulls**: Liam Lawson, Arvid Lindblad
- **Aston Martin**: Fernando Alonso, Lance Stroll
- **Haas**: Esteban Ocon, Ollie Bearman
- **Audi**: Nico Hulkenberg, Gabriel Bortoleto
- **Alpine**: Pierre Gasly, Franco Colapinto
- **Cadillac**: Valtteri Bottas, Sergio Perez

## Deployment

### Simple Deployment

1. Upload all files to a web server or hosting service
2. Share the URL with club members
3. No server-side configuration required

### Advanced Options

For more advanced features, you could:
- Host on GitHub Pages, Netlify, or Vercel for free
- Add a backend database for multi-device synchronization
- Implement user authentication for personalized experiences
- Add race schedule and countdown timers

## Privacy & Data

- All data is stored locally in the user's browser
- No personal information is transmitted to external servers
- Data persists between browser sessions
- Users can clear their data at any time using the "Clear All Data" button

## Support

For issues or feature requests, please contact the CLUB CAR CLUB administrators.

---

**Enjoy the F1 prediction season! 🏎️**
