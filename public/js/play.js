document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trivia-form');
    if (!form) {
        console.error('Trivia form not found.');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        let score = 0;
        const questionsCount = form.querySelectorAll('.question-block').length;
        
        for (let i = 0; i < questionsCount; i++) {
            const selectedOption = form.querySelector(`input[name="q${i}"]:checked`);
            
            if (selectedOption) {
                // To check the answer, we need a simple way to access it.
                // We'll assume the correct answer is available via a data attribute.
                // This will require a small change to your Pug file.
                const questionBlock = form.querySelector(`.question-block:nth-of-type(${i + 1})`);
                const correctAnswer = questionBlock.dataset.answer;

                if (selectedOption.value === correctAnswer) {
                    score++;
                }
            }
        }
        
        console.log('Final Score:', score);

        try {
            const response = await fetch('/g/submit-score', {
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
});