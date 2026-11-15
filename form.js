// display information box with char count
const infoBox = document.querySelector('.information')
infoBox.hidden = false;

// display remaining character count
const characterThreshold = 100;
const comment = document.getElementById('comments')
const count = document.querySelector('#info-message');
const progressBar = document.getElementById('char-progress');
progressBar.max = comment.maxLength; 
comment.addEventListener('input', getRemainingCharacterCount)

function getRemainingCharacterCount() {
    const remainingCharacters = comment.maxLength - comment.value.length;
    progressBar.value = comment.value.length;
    count.textContent = `${remainingCharacters} characters remaining`;

    if (remainingCharacters === 0) {
        count.textContent = `Character limit reached. ${remainingCharacters} characters remaining!`
    }
    else if (remainingCharacters <= characterThreshold) {
        count.textContent = `Warning: ${remainingCharacters} characters remaining!`
    }

    infoBox.classList.toggle('at-limit', remainingCharacters === 0);
    infoBox.classList.toggle('warning', remainingCharacters > 0 && remainingCharacters <= characterThreshold);
}

getRemainingCharacterCount();

// display error box when a field isnt filled in correctly
const errorBox = document.querySelector('.error')
const errorMessage = document.querySelector('#error-message')
const name = document.getElementById('name')
const email = document.getElementById('email')
const visitedFields = [];
const formFields = [name, email, comment]


for (const field of formFields) {
    field.dataset.baseDescribedby = field.getAttribute('aria-describedby') || '';
}

function fieldChecker(field){
    field.setCustomValidity("")

    if (field.validity.valueMissing) {
        if (field === name) {
            const message = "Name: Please enter your name.";
            field.setCustomValidity(message);
            return message;
        } else if (field === email) {
            const message = "Email: Please enter your email.";
            field.setCustomValidity(message);
            return message;
        } else {
            const message = "Comments: Please write a comment.";
            field.setCustomValidity(message);
            return message;
        }
    } else if (field.validity.typeMismatch) {
        const message = "Email: Please enter a valid email. Example: name@example.com";
        field.setCustomValidity(message);
        return message;
    } else if (field.validity.tooShort){
        const message = `Comments: Your comment must be at least ${field.minLength} characters long. You have typed ${field.value.length} characters.`
        field.setCustomValidity(message);
        return message
    }
    return ""
}


function displayErrors(){
    errorMessage.replaceChildren()

    for (const field of formFields){
        const message = fieldChecker(field);
        const describedBy = [field.dataset.baseDescribedby];

        if (message !== "" && visitedFields.includes(field)){
            const listElem = document.createElement('li');
            listElem.textContent = message;
            listElem.id = `${field.id}-error`;
            errorMessage.append(listElem)
            describedBy.push(listElem.id);
        }

        const ids = describedBy.join(' ').trim();
        if (ids) {
            field.setAttribute('aria-describedby', ids);
        } else {
            field.removeAttribute('aria-describedby');
        }
    }
    if (errorMessage.children.length !== 0) {
        errorBox.hidden = false;
    } else {
        errorBox.hidden = true;
    }
}
// check if user has edited a field 
for (const field of formFields) {
    field.addEventListener("change", () => {
        visitedFields.push(field);
        displayErrors()
    })
    field.addEventListener("input", () => {
        displayErrors();
    })
}

const form_errors = [];
const form = document.querySelector('.form');
form.addEventListener('invalid', (event) => {
    const failedField = event.target;
    visitedFields.push(failedField)
    const message = fieldChecker(failedField);
    form_errors.push({field: failedField.name, error: message})
    displayErrors()
},{capture: true});

const hidden_form_errors = document.querySelector('#form-errors')
form.addEventListener("submit", () => {
    hidden_form_errors.value = JSON.stringify(form_errors)
})

