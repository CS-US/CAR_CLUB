// Firebase Database Functions

// Save prediction to Firebase
function savePrediction(prediction) {
    if (!currentUser) {
        showMessage('Please login to submit predictions', 'error');
        return Promise.reject('User not authenticated');
    }
    
    const predictionRef = database.ref('predictions').push();
    return predictionRef.set({
        ...prediction,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        // Update user's prediction count
        return database.ref('users/' + currentUser.uid).transaction(userData => {
            if (!userData) userData = {};
            userData.predictionsCount = (userData.predictionsCount || 0) + 1;
            return userData;
        });
    });
}

// Load all predictions for leaderboard
function loadPredictions() {
    return database.ref('predictions').once('value').then(snapshot => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        return predictions;
    });
}

// Real-time leaderboard updates
function setupRealtimeLeaderboard() {
    database.ref('predictions').on('value', snapshot => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        updateLeaderboardDisplay(predictions);
    });
}

// Update leaderboard display
function updateLeaderboardDisplay(predictions) {
    const leaderboardDiv = document.getElementById('leaderboard');
    
    // Group predictions by user and calculate scores
    const userScores = {};
    
    predictions.forEach(prediction => {
        const userId = prediction.userId;
        if (!userScores[userId]) {
            userScores[userId] = {
                name: prediction.playerName,
                email: prediction.userEmail,
                score: 0,
                predictions: []
            };
        }
        
        // Calculate score if actual results exist
        if (prediction.actualResults) {
            const score = calculateScore(prediction, prediction.actualResults);
            userScores[userId].score += score;
        }
        
        userScores[userId].predictions.push(prediction);
    });
    
    // Convert to array and sort by score
    const leaderboard = Object.values(userScores).sort((a, b) => b.score - a.score);
    
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
            positionBadge = '🏆';
        } else if (player.rank === 2) {
            rankClass = 'silver';
            positionBadge = '🥈';
        } else if (player.rank === 3) {
            rankClass = 'bronze';
            positionBadge = '🥉';
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

// Update scores with actual results
function updateScoresWithActualResults(raceName, first, second, third) {
    const actualResults = { first, second, third };
    
    // Update all predictions for this race
    database.ref('predictions').orderByChild('raceName').equalTo(raceName).once('value', snapshot => {
        const updates = {};
        
        snapshot.forEach(childSnapshot => {
            const prediction = childSnapshot.val();
            const predictionId = childSnapshot.key;
            
            // Calculate score
            const score = calculateScore(prediction, actualResults);
            
            // Update prediction with actual results and score
            updates[`predictions/${predictionId}/actualResults`] = actualResults;
            updates[`predictions/${predictionId}/score`] = score;
            
            // Update user's total points
            updates[`users/${prediction.userId}/totalPoints`] = firebase.database.ServerValue.increment(score);
        });
        
        // Apply all updates atomically
        database.ref().update(updates).then(() => {
            showMessage('Results submitted successfully! Scores updated.', 'success');
        });
    });
}
