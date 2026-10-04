// -----------------------------
// DATA (objects and arrays)
// -----------------------------

// Object 1: information about each role.
// The keys (volunteer, foster, adoption) match the data-role on the
// services page buttons AND the option values in the contact form.
const roles = {
  volunteer: {
    label: "Volunteer",
    tip: "Volunteers help with events, animal care, transportation, and community outreach."
  },
  foster: {
    label: "Foster",
    tip: "Fosters give an animal a safe, temporary home until it is adopted."
  },
  adoption: {
    label: "Adoption Information",
    tip: "We will share our adoption steps and the pets who are ready for a new home."
  }
};

// Array: the form fields that must be filled in
const requiredFields = ["name", "email", "interest", "availability", "message"];

// Object 2: the error message for each form field
const errorMessages = {
  name: "Please enter your name (at least 2 characters).",
  email: "Please enter a valid email address, like name@example.com.",
  interest: "Please choose an interest type.",
  availability: "Please tell us when you are available.",
  message: "Your message must be at least 10 characters."
};

// The name we save the choice under in localStorage
const storageKey = "savedInterest";

// -----------------------------
// BROWSER STORAGE
// -----------------------------

// Saves the chosen role in localStorage
function saveInterest(role) {
  localStorage.setItem(storageKey, role);
}

// Loads the saved role (only if it is one of our roles)
function getSavedInterest() {
  const saved = localStorage.getItem(storageKey);
  if (saved && roles[saved]) {
    return saved;
  }
  return null;
}

// -----------------------------
// INTERACTIVE FEATURE (services.html)
// -----------------------------

// Shows the chosen role on the page and highlights its button
function showInterest(role, intro) {
  const result = document.getElementById("interest-result");
  result.textContent = intro + roles[role].label + ". " + roles[role].tip;

  const buttons = document.querySelectorAll(".interest-btn");
  buttons.forEach(function (button) {
    if (button.dataset.role === role) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}

// Runs when one of the role buttons is clicked
function handleInterestClick(event) {
  const role = event.target.dataset.role;
  saveInterest(role);
  showInterest(role, "Great choice! We saved your interest: ");
}

// Sets up the buttons and shows the saved choice when the page opens
function setUpInterestButtons() {
  const buttons = document.querySelectorAll(".interest-btn");
  if (buttons.length === 0) {
    return; // we are not on the services page
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", handleInterestClick);
  });

  const saved = getSavedInterest();
  if (saved) {
    showInterest(saved, "Welcome back! Your saved interest is: ");
  }
}

// -----------------------------
// PRE-FILL THE FORM (contact.html)
// -----------------------------

// Picks the saved role in the Interest Type dropdown,
// and saves a new choice if the user changes it here
function setUpInterestDropdown() {
  const select = document.getElementById("interest");
  if (!select) {
    return; // we are not on the contact page
  }

  const saved = getSavedInterest();
  if (saved) {
    select.value = saved;
  }

  select.addEventListener("change", function () {
    if (roles[select.value]) {
      saveInterest(select.value);
    }
  });
}

// -----------------------------
// FORM VALIDATION (contact.html)
// -----------------------------

// Puts a red error message right under the field
function showError(input, message) {
  const error = document.createElement("span");
  error.className = "error";
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
  input.classList.add("invalid");
}

// Removes the old error messages before checking again
function clearErrors() {
  document.querySelectorAll(".error").forEach(function (error) {
    error.remove();
  });
  document.querySelectorAll(".invalid").forEach(function (input) {
    input.classList.remove("invalid");
  });
}

// Checks the email format, for example name@example.com
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Checks one field and returns true if it is OK
function checkField(id) {
  const input = document.getElementById(id);
  const value = input.value.trim();

  // Required field check
  let isOk = value !== "";

  // Extra checks for some fields
  if (id === "name" && value.length < 2) {
    isOk = false;
  }
  if (id === "email" && !isValidEmail(value)) {
    isOk = false;
  }
  if (id === "message" && value.length < 10) {
    isOk = false;
  }

  if (!isOk) {
    showError(input, errorMessages[id]);
  }
  return isOk;
}

// Runs when the form is submitted
function validateForm(event) {
  // This is a class project with no server, so the page never reloads.
  // The user's answers stay in the boxes so they can fix any mistakes.
  event.preventDefault();
  clearErrors();

  const formMessage = document.getElementById("form-message");
  let formIsValid = true;

  requiredFields.forEach(function (id) {
    if (!checkField(id)) {
      formIsValid = false;
    }
  });

  if (formIsValid) {
    const name = document.getElementById("name").value.trim();
    formMessage.textContent = "Thank you, " + name + "! We received your form and will contact you soon.";
  } else {
    formMessage.textContent = "";
  }
}

// Connects the form to the validation
function setUpForm() {
  const form = document.querySelector("form");
  if (!form) {
    return; // only the contact page has a form
  }
  form.addEventListener("submit", validateForm);
}

// -----------------------------
// START (runs on every page)
// -----------------------------
setUpInterestButtons();
setUpInterestDropdown();
setUpForm();
