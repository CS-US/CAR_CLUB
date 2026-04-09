// Simple Firebase Functions (Name-based system)
import { ref, set, get, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { database } from "./firebase-config.js";

// Save prediction to Firebase
function savePrediction(prediction) {
    const predictionRef = ref(database, 'predictions/' + Date.now());
    return set(predictionRef, {
        ...prediction,
        timestamp: serverTimestamp()
    });
}

// Save user profile (name-based)
function saveUserProfile(name, data) {
    const userRef = ref(database, 'users/' + name.replace(/[^a-zA-Z0-9]/g, '_'));
    return set(userRef, {
        name: name,
        ...data,
        lastUpdated: serverTimestamp()
    });
}

// Get user profile
function getUserProfile(name) {
    const userRef = ref(database, 'users/' + name.replace(/[^a-zA-Z0-9]/g, '_'));
    return get(userRef).then(snapshot => snapshot.val());
}

// Load all predictions for leaderboard
function loadAllPredictions() {
    const predictionsRef = ref(database, 'predictions');
    return get(predictionsRef).then(snapshot => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        return predictions;
    });
}

// Real-time leaderboard updates
function setupRealtimeLeaderboard(callback) {
    const predictionsRef = ref(database, 'predictions');
    onValue(predictionsRef, (snapshot) => {
        const predictions = [];
        snapshot.forEach(childSnapshot => {
            predictions.push(childSnapshot.val());
        });
        callback(predictions);
    });
}

// Update scores with actual results
function updateScoresWithActualResults(raceName, first, second, third) {
    const actualResults = { first, second, third };
    
    // Update all predictions for this race
    const predictionsRef = ref(database, 'predictions');
    return get(predictionsRef).then(snapshot => {
        const updates = {};
        
        snapshot.forEach(childSnapshot => {
            const prediction = childSnapshot.val();
            const predictionId = childSnapshot.key;
            
            if (prediction.raceName === raceName) {
                // Calculate score
                const score = calculateScore(prediction, actualResults);
                
                // Update prediction with actual results and score
                updates[`predictions/${predictionId}/actualResults`] = actualResults;
                updates[`predictions/${predictionId}/score`] = score;
                
                // Update user's total points
                const userName = prediction.playerName;
                const userKey = userName.replace(/[^a-zA-Z0-9]/g, '_');
                updates[`users/${userKey}/totalPoints`] = serverTimestamp();
            }
        });
        
        // Apply all updates atomically
        return Promise.all(Object.entries(updates).map(([path, value]) => 
            set(ref(database, path), value)
        ));
    });
}

// Calculate score function
function calculateScore(prediction, actualResults) {
    let score = 0;
    
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
        score += 5;
    }
    
    return score;
}
