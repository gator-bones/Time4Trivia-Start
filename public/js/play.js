document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trivia-form');
    if (!form) return; // Exit if form doesn't exist

    // Safely get questions data
    const questionsElement = document.getElementById('questions-data');
    const userElement = document.getElementById('user-data');

    if (!questionsElement || !userElement) {
        console.error('Required data elements not found');
        return;
    }

    try {
        const questionsData = JSON.parse(questionsElement.dataset.questions);
        const username = userElement.dataset.username;

        // Remove the username prompt logic and just send the score
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Calculate score
            let score = 0;
            questionsData.forEach((q, index) => {
                const selectedOption = form.querySelector(`input[name="q${index}"]:checked`);
                if (selectedOption && selectedOption.value === q.answer) {
                    score++;
                }
            });

            console.log(score)
            try {
                const response = await fetch('/submit-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ score })
                });

                const result = await response.json();
                console.log('Server response:', result); 

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to save score');
                }

                window.location.href = result.redirectUrl;
            } catch (err) {
                console.error('Error:', err);
                alert('Failed to save score. Please try again.');
            }

        });


    } catch (err) {
        console.error('Error initializing trivia game:', err);
        alert('Failed to load questions. Please refresh the page.');
    }
});