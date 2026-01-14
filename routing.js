/**
 * AKH HUB UNIFIED ROUTING
 * This logic ensures that the Professor can switch between views 
 * during the development/marketing phase.
 */
function navigateTo(role) {
    const routes = {
        'master': 'MASTERDASHBOARD.html',
        'trainer': 'TRAINERBOARD.html',
        'student': 'STUDENTSDASHBOARD.html'
    };
    window.location.href = routes[role];
}

// Example usage: 
// <button onclick="navigateTo('master')">Admin Access</button>
