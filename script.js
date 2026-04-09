// F1 Drivers 2026 Season
const f1Drivers = [
    'Lando Norris',
    'Oscar Piastri',
    'George Russell',
    'Kimi Antonelli',
    'Max Verstappen',
    'Isack Hadjar',
    'Charles Leclerc',
    'Lewis Hamilton',
    'Alex Albon',
    'Carlos Sainz',
    'Liam Lawson',
    'Arvid Lindblad',
    'Fernando Alonso',
    'Lance Stroll',
    'Esteban Ocon',
    'Ollie Bearman',
    'Nico Hulkenberg',
    'Gabriel Bortoleto',
    'Pierre Gasly',
    'Franco Colapinto',
    'Valtteri Bottas',
    'Sergio Perez'
];

// 2026 F1 Calendar with dates
const f1Races2026 = [
    { name: 'australia', displayName: 'Australian Grand Prix', date: new Date('2026-03-06') },
    { name: 'china', displayName: 'Chinese Grand Prix', date: new Date('2026-03-13') },
    { name: 'japan', displayName: 'Japanese Grand Prix', date: new Date('2026-03-27') },
    { name: 'miami', displayName: 'Miami Grand Prix', date: new Date('2026-05-01') },
    { name: 'canada', displayName: 'Canadian Grand Prix', date: new Date('2026-05-22') },
    { name: 'monaco', displayName: 'Monaco Grand Prix', date: new Date('2026-06-05') },
    { name: 'barcelona', displayName: 'Spanish Grand Prix', date: new Date('2026-06-12') },
    { name: 'austria', displayName: 'Austrian Grand Prix', date: new Date('2026-06-26') },
    { name: 'great-britain', displayName: 'British Grand Prix', date: new Date('2026-07-03') },
    { name: 'belgium', displayName: 'Belgian Grand Prix', date: new Date('2026-07-17') },
    { name: 'hungary', displayName: 'Hungarian Grand Prix', date: new Date('2026-07-24') },
    { name: 'netherlands', displayName: 'Dutch Grand Prix', date: new Date('2026-08-21') },
    { name: 'italy', displayName: 'Italian Grand Prix', date: new Date('2026-09-04') },
    { name: 'spain', displayName: 'Spanish Grand Prix', date: new Date('2026-09-11') },
    { name: 'azerbaijan', displayName: 'Azerbaijan Grand Prix', date: new Date('2026-09-24') },
    { name: 'singapore', displayName: 'Singapore Grand Prix', date: new Date('2026-10-09') },
    { name: 'united-states', displayName: 'United States Grand Prix', date: new Date('2026-10-23') },
    { name: 'mexico', displayName: 'Mexican Grand Prix', date: new Date('2026-10-30') },
    { name: 'brazil', displayName: 'Brazilian Grand Prix', date: new Date('2026-11-06') },
    { name: 'las-vegas', displayName: 'Las Vegas Grand Prix', date: new Date('2026-11-19') },
    { name: 'qatar', displayName: 'Qatar Grand Prix', date: new Date('2026-11-27') },
    { name: 'abu-dhabi', displayName: 'Abu Dhabi Grand Prix', date: new Date('2026-12-04') }
];

// Get current race based on date
function getCurrentRace() {
    const now = new Date();
    
    // Find the next upcoming race
    for (let race of f1Races2026) {
        if (race.date > now) {
            return race;
        }
    }
    
    // If no upcoming races, return the last race of the season
    return f1Races2026[f1Races2026.length - 1];
}

// Auto-fetch race results from Google search
async function fetchRaceResults(raceName) {
    try {
        const searchQuery = `F1 ${raceName} 2026 results podium finishers`;
        const response = await fetch(`https://api.allorigins.win/raw?url=https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        
        const html = await response.text();
        return parseRaceResults(html);
    } catch (error) {
        console.error('Error fetching race results:', error);
        return null;
    }
}

// Parse race results from search HTML
function parseRaceResults(html) {
    // This is a simplified parser - in production, you'd want a more robust solution
    const results = { first: null, second: null, third: null };
    
    // Look for F1 driver names in the HTML content
    f1Drivers.forEach(driver => {
        const regex = new RegExp(`${driver.replace(/ /g, '[\\s\\-]+')}`, 'gi');
        const matches = html.match(regex);
        
        if (matches && matches.length > 0) {
            // This is a simplified approach - you'd need more sophisticated parsing
            if (!results.first) results.first = driver;
            else if (!results.second) results.second = driver;
            else if (!results.third) results.third = driver;
        }
    });
    
    return results;
}

// Initialize admin panel
function initializeAdminPanel() {
    const driverSelects = ['result1st', 'result2nd', 'result3rd'];
    
    // Update admin race display
    updateAdminRaceDisplay();
    
    // Populate driver selects
    driverSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        f1Drivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver;
            option.textContent = driver;
            select.appendChild(option);
        });
    });
    
    // Add event listeners
    document.getElementById('autoFetchResults').addEventListener('click', handleAutoFetch);
    document.getElementById('submitResults').addEventListener('click', handleSubmitResults);
}

// Update admin race display
function updateAdminRaceDisplay() {
    const currentRace = getCurrentRace();
    const raceDisplay = document.getElementById('adminRaceDisplay');
    if (raceDisplay) {
        raceDisplay.textContent = `${currentRace.displayName} - ${currentRace.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
}

// Handle auto-fetch results
async function handleAutoFetch() {
    const fetchStatus = document.getElementById('fetchStatus');
    const currentRace = getCurrentRace();
    
    fetchStatus.textContent = 'Fetching results...';
    fetchStatus.className = 'fetch-status loading';
    
    const results = await fetchRaceResults(currentRace.displayName);
    
    if (results && (results.first || results.second || results.third)) {
        document.getElementById('result1st').value = results.first || '';
        document.getElementById('result2nd').value = results.second || '';
        document.getElementById('result3rd').value = results.third || '';
        
        fetchStatus.textContent = 'Results fetched successfully! Please verify and submit.';
        fetchStatus.className = 'fetch-status success';
    } else {
        fetchStatus.textContent = 'Could not fetch results. Please enter manually.';
        fetchStatus.className = 'fetch-status error';
    }
}

// Handle manual result submission
function handleSubmitResults() {
    const currentRace = getCurrentRace();
    const first = document.getElementById('result1st').value;
    const second = document.getElementById('result2nd').value;
    const third = document.getElementById('result3rd').value;
    const fetchStatus = document.getElementById('fetchStatus');
    
    if (!first || !second || !third) {
        fetchStatus.textContent = 'Please fill in all fields';
        fetchStatus.className = 'fetch-status error';
        return;
    }
    
    // Validate no duplicate drivers
    if (first === second || first === third || second === third) {
        fetchStatus.textContent = 'Please select three different drivers';
        fetchStatus.className = 'fetch-status error';
        return;
    }
    
    // Update scores with actual results
    updateScoresWithActualResults(currentRace.name, first, second, third);
    
    fetchStatus.textContent = 'Results submitted successfully! Scores updated.';
    fetchStatus.className = 'fetch-status success';
    
    // Clear form
    setTimeout(() => {
        document.getElementById('result1st').value = '';
        document.getElementById('result2nd').value = '';
        document.getElementById('result3rd').value = '';
        fetchStatus.textContent = '';
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - starting initialization...');
    
    // Test if elements exist
    const firstSelect = document.getElementById('firstPlace');
    console.log('First select element:', firstSelect);
    
    if (firstSelect) {
        console.log('DOM elements found, proceeding with initialization...');
        initializeDriverSelects();
        updateCurrentRaceDisplay();
        initializeAdminPanel();
        setupEventListeners();
        updateLeaderboard();
        setupRealtimeLeaderboard(); // Add real-time updates
        console.log('Initialization complete');
    } else {
        console.error('DOM elements not found!');
    }
});


function initializeDriverSelects() {
    console.log('Initializing driver selects...');
    console.log('Available drivers:', f1Drivers.length);
    
    const selects = ['firstPlace', 'secondPlace', 'thirdPlace'];
    
    selects.forEach(selectId => {
        console.log('Processing select:', selectId);
        const select = document.getElementById(selectId);
        
        if (!select) {
            console.error('Select element not found:', selectId);
            return;
        }
        
        console.log('Found select element, adding drivers...');
        
        // Clear existing options except the first one
        select.innerHTML = '<option value="">Select driver</option>';
        
        f1Drivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver;
            option.textContent = driver;
            select.appendChild(option);
        });
        
        console.log('Added', f1Drivers.length, 'drivers to', selectId);
    });
    
    console.log('Driver initialization complete');
}

function setupEventListeners() {
    // Form submission
    document.getElementById('predictionForm').addEventListener('submit', handlePredictionSubmit);
    
    // Clear data button
    document.getElementById('clearData').addEventListener('click', clearAllData);
    
    // Prevent duplicate driver selections
    const driverSelects = ['firstPlace', 'secondPlace', 'thirdPlace'];
    driverSelects.forEach(selectId => {
        document.getElementById(selectId).addEventListener('change', function() {
            updateDriverOptions();
        });
    });
}

function updateDriverOptions() {
    const selects = {
        firstPlace: document.getElementById('firstPlace'),
        secondPlace: document.getElementById('secondPlace'),
        thirdPlace: document.getElementById('thirdPlace')
    };
    
    const selectedDrivers = new Set();
    Object.values(selects).forEach(select => {
        if (select.value) selectedDrivers.add(select.value);
    });
    
    Object.entries(selects).forEach(([id, select]) => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select driver</option>';
        
        f1Drivers.forEach(driver => {
            if (!selectedDrivers.has(driver) || driver === currentValue) {
                const option = document.createElement('option');
                option.value = driver;
                option.textContent = driver;
                if (driver === currentValue) option.selected = true;
                select.appendChild(option);
            }
        });
    });
}

function updateCurrentRaceDisplay() {
    const currentRace = getCurrentRace();
    const raceDisplay = document.getElementById('currentRaceDisplay');
    if (raceDisplay) {
        raceDisplay.textContent = `${currentRace.displayName} - ${currentRace.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
}

function handlePredictionSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    const playerName = document.getElementById('playerName').value.trim();
    const firstPlace = document.getElementById('firstPlace').value;
    const secondPlace = document.getElementById('secondPlace').value;
    const thirdPlace = document.getElementById('thirdPlace').value;
    
    console.log('Form data:', { playerName, firstPlace, secondPlace, thirdPlace });
    
    if (!playerName || !firstPlace || !secondPlace || !thirdPlace) {
        console.log('Validation failed - missing fields');
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (firstPlace === secondPlace || firstPlace === thirdPlace || secondPlace === thirdPlace) {
        console.log('Validation failed - duplicate drivers');
        showMessage('Please select three different drivers', 'error');
        return;
    }
    
    const currentRace = getCurrentRace();
    const prediction = {
        playerName: playerName,
        raceName: currentRace.name,
        raceDisplayName: currentRace.displayName,
        raceDate: currentRace.date,
        firstPlace,
        secondPlace,
        thirdPlace,
        score: 0
    };
    
    console.log('Prediction object:', prediction);
    
    // Use Firebase database
    console.log('Using Firebase save...');
    savePredictionToFirebase(prediction);
    document.getElementById('predictionForm').reset();
    showMessage('Prediction submitted successfully!', 'success');
    updateLeaderboard(); // Refresh leaderboard
}

// Firebase save function
function savePredictionToFirebase(prediction) {
    console.log('Firebase database available:', !!database);
    console.log('Firebase object available:', !!firebase);
    
    if (!database) {
        throw new Error('Firebase database not available');
    }
    
    const newPredictionRef = database.ref('predictions').push();
    console.log('Firebase ref created:', newPredictionRef);
    
    return newPredictionRef.set({
        ...prediction,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        console.log('Firebase save successful!');
    }).catch(error => {
        console.error('Firebase save error:', error);
        throw error;
    });
}


function updateLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    
    // Load from Firebase
    database.ref('predictions').once('value', (snapshot) => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        renderLeaderboard(predictions, leaderboardDiv);
    });
}

// Setup real-time leaderboard updates
function setupRealtimeLeaderboard() {
    database.ref('predictions').on('value', (snapshot) => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        const leaderboardDiv = document.getElementById('leaderboard');
        renderLeaderboard(predictions, leaderboardDiv);
    });
}

function renderLeaderboard(predictions, leaderboardDiv) {
    // Group predictions by player and calculate scores
    const playerScores = {};
    
    predictions.forEach(prediction => {
        const playerName = prediction.playerName;
        if (!playerScores[playerName]) {
            playerScores[playerName] = {
                name: playerName,
                score: 0,
                predictions: []
            };
        }
        
        // Calculate score if actual results exist
        if (prediction.actualResults) {
            const score = calculateScore(prediction, prediction.actualResults);
            playerScores[playerName].score += score;
        }
        
        playerScores[playerName].predictions.push(prediction);
    });
    
    // Convert to array and sort by score
    const leaderboard = Object.values(playerScores).sort((a, b) => b.score - a.score);
    
    // Add ranks
    leaderboard.forEach((player, index) => {
        player.rank = index + 1;
    });
    
    // Display leaderboard
    if (leaderboard.length === 0) {
        leaderboardDiv.innerHTML = '<div class="no-data">No predictions yet. Be the first to submit!</div>';
        return;
    }
    
    leaderboardDiv.innerHTML = leaderboard.map(player => {
        let rankClass = '';
        let positionBadge = player.rank;
        
        if (player.rank === 1) {
            rankClass = 'gold';
            positionBadge = '1';
        } else if (player.rank === 2) {
            rankClass = 'silver';
            positionBadge = '2';
        } else if (player.rank === 3) {
            rankClass = 'bronze';
            positionBadge = '3';
        }
        
        return `
            <div class="leaderboard-item ${rankClass}">
                <div class="player-info">
                    <div class="player-name">
                        <span class="position-badge">${positionBadge}</span>
                        ${player.name}
                    </div>
                    <div class="player-race">${player.predictions.length} prediction(s)</div>
                </div>
                <div class="player-score">${player.score} pts</div>
            </div>
        `;
    }).join('');
}

function calculateScore(prediction, actualResults) {
    let score = 0;
    
    // Check if actual results are provided
    if (!actualResults || !actualResults.first || !actualResults.second || !actualResults.third) {
        return score;
    }
    
    // Score for correct positions
    if (prediction.firstPlace === actualResults.first) score += 10;
    if (prediction.secondPlace === actualResults.second) score += 7;
    if (prediction.thirdPlace === actualResults.third) score += 5;
    
    // Bonus for perfect prediction
    if (prediction.firstPlace === actualResults.first &&
        prediction.secondPlace === actualResults.second &&
        prediction.thirdPlace === actualResults.third) {
        score += 5; // Perfect prediction bonus
    }
    
    return score;
}


function updateScoresWithActualResults(raceName, first, second, third) {
    const actualResults = { first, second, third };
    
    // Update all predictions for this race
    database.ref('predictions').once('value', (snapshot) => {
        const updates = {};
        
        snapshot.forEach(childSnapshot => {
            const prediction = childSnapshot.val();
            const predictionId = childSnapshot.key;
            
            if (prediction.raceName === raceName && !prediction.actualResults) {
                // Calculate score
                const score = calculateScore(prediction, actualResults);
                
                // Update prediction with actual results and score
                updates[`predictions/${predictionId}/actualResults`] = actualResults;
                updates[`predictions/${predictionId}/score`] = score;
            }
        });
        
        // Apply all updates atomically
        const updatePromises = Object.entries(updates).map(([path, value]) => 
            database.ref(path).set(value)
        );
        
        Promise.all(updatePromises).then(() => {
            showMessage('Results submitted successfully! Scores updated.', 'success');
            updateLeaderboard();
        });
    });
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all prediction data? This cannot be undone.')) {
        // Clear all data from Firebase
        database.ref('predictions').remove().then(() => {
            showMessage('All data cleared successfully!', 'success');
            updateLeaderboard();
        });
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert at the top of the prediction section
    const predictionSection = document.querySelector('.prediction-section');
    predictionSection.insertBefore(messageDiv, predictionSection.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Admin function to set actual race results (for demonstration)
// This would typically be done by an admin after the race
function setActualRaceResults(raceName, first, second, third) {
    updateScoresWithActualResults(raceName, first, second, third);
}

// Example usage (you can remove this or call it from browser console):
// setActualRaceResults('bahrain', 'Max Verstappen', 'Sergio Perez', 'Charles Leclerc');

// Debug function to test scoring
function debugScoring() {
    // Load from Firebase
    database.ref('predictions').once('value', (snapshot) => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        
        console.log('All predictions:', predictions);
        
        predictions.forEach((prediction, index) => {
            console.log(`Prediction ${index + 1}:`, {
                name: prediction.playerName,
                race: prediction.raceName,
                predicted: [prediction.firstPlace, prediction.secondPlace, prediction.thirdPlace],
                actual: prediction.actualResults ? [prediction.actualResults.first, prediction.actualResults.second, prediction.actualResults.third] : 'Not set',
                score: prediction.score
            });
        });
    });
}

// Export functions for console access
window.f1PredictionApp = {
    setActualRaceResults,
    calculateScore,
    clearAllData,
    updateLeaderboard,
    debugScoring
};

