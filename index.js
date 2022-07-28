// IMPORTS
// https://stackoverflow.com/questions/50007055/fetch-request-to-local-file-not-working
// Create a web server with express js, then define routes to the resource for Get and Post operations.

// -----START GLOBAL VARIABLES-----
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form')
const ideaListEl = document.querySelector('.ideas');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags__list');

// -----START COUNTER COMPONENT-----
const inputHandler = () => {
    // Purpose: count and limit characters input to 150. This function works with the textarea element with attribute maxlenth equal to 150.

    // Define maximum number of characters
    const maxChar = MAX_CHARS;

    // Determine number of characters currently typed.
    const nbrTyped = textareaEl.value.length;

    // Calculate nbr of characters remaining.
    const charLeft = maxChar - nbrTyped;

    // Write remaining characters to UI. NOTE: const value is updated after every keypress.
    counterEl.textContent = charLeft;
} /* END inputtHandler */

textareaEl.addEventListener('input',inputHandler)
// -----END COUNTER COMPONENT-----

// -----START FORM COMPONENT-----
// There are two ways to listen to a form: the submit event on the form element or the click event on the submit button.

const submitHandler = (event) => {
    // Prevent default browser actions (submit to action address and reload page)
    event.preventDefault();
    // Get text from textarea.
    const text = textareaEl.value;  

    // Validate text. Check if hashtag is present, if text is long enough. 
    if (text.includes('#') && text.length >= 5) {
        // Display valid feedback for 2 seconds.
        formEl.classList.add('form--valid');
        // Expire (time out) the feedback.
        setTimeout(() => {
            formEl.classList.remove('form--valid');
        }, 2000);
    } else {
        // Display invalid feedback for 2 seconds.
        formEl.classList.add('form--invalid'); 
        // Expire (time out) the feedback.
        setTimeout(() => {
            formEl.classList.remove('form--invalid');
            if (!text.includes('#')) {
                alert('You must include a hashtag and the name of an initiative. Example: #name.');
            } 
            if (text.length < 5) {
                alert('Your idea must be longer than 4 characters.');
            }
        }, 2000)

        // Refocus the text area for a better UX.
        textareaEl.focus()

        // Halt the function to prevent storing/displaying the value.
        return;
    }

    // Add valid text to list. Extract the hashtag in order to display prominently. Then get the initiative name w/o the hashtag.
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const initiative = hashtag.substring(1);
    const badgeLetter = initiative.substring(0,1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    // Create template literal for new ideas.
    const ideaHTML = `
        <li class = 'idea'>
            <button class="upvote">
                <i class='fa-solid fa-caret-up upvote__icon'></i>
                <span class='upvote__count'>${upvoteCount}</span>
            </button>
            <section class='idea__badge'>
                <p class='idea__letter'>${badgeLetter}</p>
            </section>
            <div class='idea__content'> 
                <p class='idea__company'>${initiative}</p>
                <p class='idea__text'>${text}</p>
            </div>
            <p class='idea__date'>${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>

        </li>
        `;
    
    // Insert idea into list. Sample: Put recycle bins at every entrance #GreenCampus.
    ideaListEl.insertAdjacentHTML("beforeend" ,ideaHTML);

    // Clear and refocus text area. Blur the submit button. Reset the counter.
    textareaEl.value = '';
    submitBtnEl.blur();
    counterEl.textContent = MAX_CHARS;

    // Create object representation of new idea.
    const newIdea = {upvoteCount:upvoteCount,company:initiative,badgeLetter:badgeLetter,daysAgo:daysAgo,text:text};
    console.log(JSON.stringify(newIdea));
    // Post the new idea to the file. Fetch request with POST must be made to a web server. No POSTS to a file server are allowed (405 error results).
    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(newIdea),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            console.log('Data not saved.');
            alert('Data was not saved.');
            return;
        }
        console.log('Data saved successfully.');
    }).catch(error => {
        console.log(error);
    });
}; /* END submitHandler */

formEl.addEventListener('submit', submitHandler)
// -----END FORM COMPONENT-----

// -----START FEEDBACK LIST COMPONENT-----
// Define click handler function and listen to list items
const listEventHandler = event => {
    console.log(event)
    // get clickd HTML element
    const clickedEl = event.target;

    // determine if upvote and respond.
    const upvoteIntention = clickedEl.className.includes('upvote');
    if (upvoteIntention) {
        // Increase the vote count and disable the button.
        const upvoteBtnEl = clickedEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        // Use querySelect on the upvote button element (do not search the entire document)
        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count')
        // Use a plus (+) to convert string to nbr. Create variable with let to enable change.
        let upvoteCount = +upvoteCountEl.textContent;
        upvoteCountEl.textContent = ++upvoteCount;
        // Write new count to file.
         
        // ------- start here tomorrow -------
        // Create express app with routes and then
        // Create this update.

    } else {
        clickedEl.closest('.idea').classList.toggle('idea--expand');
    }
}

ideaListEl.addEventListener('click', listEventHandler);

// Read json from local file and write to UI
fetch('data/ideas.json').then(response => {
    // Start collecting data and return promise of entire data structure
    return response.json();
    }).then(data => {
    // Remove the spinner.
    spinnerEl.remove();
    // Iterate over all ideas in the array.
    data.ideas.forEach((idea) => {
        // Create a display for each idea.
        const ideaHTML = `
            <li class = 'idea'>
                <button class="upvote">
                    <i class='fa-solid fa-caret-up upvote__icon'></i>
                    <span class='upvote__count'>${idea.upvoteCount}</span>
                </button>
                <section class='idea__badge'>
                    <p class='idea__letter'>${idea.badgeLetter}</p>
                </section>
                <div class='idea__content'> 
                    <p class='idea__initiative'>${idea.initiative}</p>
                    <p class='idea__text'>${idea.text}</p>
                </div>
                <p class='idea__date'>${idea.daysAgo === 0 ? 'NEW' : `${idea.daysAgo}d`}</p>

            </li>
        `;
        // Render ideas on the page.
        ideaListEl.insertAdjacentHTML('beforeend', ideaHTML);
    })
}).catch((error) => {
    ideaListEl.textContent = `Failed to fetch ideas: ${error.message}`;
});
// -----END FEEDBACK LIST COMPONENT-----

// -----START HASHTAGS COMPONENT-----
const filterEventHandler = (event) => {
    console.log(event);
    // Get the click target 
    const clickedEl = event.target;
    // Exit function if target is not hashtag
    if (clickedEl.className != 'hashtag') return;
    // Get text content of target
    const initiativeName = clickedEl.textContent.substring(1).toLowerCase().trim();
    // Iterate over idea list and evaluate child nodes.
    ideaListEl.childNodes.forEach(child => {
        // Halt and goto next if node is text.
        if (child.nodeType === 3) return;
        // Extract initiative name from child.
        const initiativeLabel = child.querySelector('.idea__initiative').textContent.toLowerCase().trim();
        // Compare initiative names: child vs click target.
        if (initiativeName != initiativeLabel) {
            // remove ideas if name != label
            child.remove();
        } 
    });

};

hashtagListEl.addEventListener('click', filterEventHandler);

// -----END HASHTAGS COMPONENT-----
