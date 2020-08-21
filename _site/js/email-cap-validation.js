//Hide the error message on foucus
function hideErrorMsg() {
    document.getElementById('emailBox-error').style.display = "none";
}

//Show the error message on blur 
function showErrorMsg() {
    document.getElementById('emailBox-error').style.display = "block";
}

function emailIsValid(emailAdd) {
    var regExpr = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\w+)*(\\.\\w{2,3})+$");
  
    return regExpr.test(emailAdd);
}

function isEmailValid(userEmail) {
    var emailTxt = document.getElementById('emailInput').value;

    //hide error message if valid email address & enable submit button
    if (emailIsValid(emailTxt)) {
        hideErrorMsg();
        document.getElementById('emailSubButton').disabled = false;
    }
    //show error message if email is not valid & disable submit button
    else {
        showErrorMsg();
        document.getElementById('emailSubButton').disabled = true;
    }
}

//Function to change form action when submitting
function setFormAction() {
    document.getElementById('insightSubscribe').action ='/admin/mailchimp-submission';
}