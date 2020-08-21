// form labels


var IputEffect = function(){
    var labelPosition, actions;


    actions = {
        activate: function(el) {
            el.parentNode.classList.add('input-filled');
        },
        deactivate: function(el) {
            if (el.value === '') {
                el.parentNode.classList.remove('input-filled'); 
            }
        }
    };

    labelPosition = function (el) {
        if (el.value !== '') 
            actions.activate(el);
            el.addEventListener('focus', function(){
                actions.activate(this);
            });
            el.addEventListener('blur', function(){
                actions.deactivate(this);
            });
    };

    document.querySelectorAll('.input-field').forEach(function(el){
        labelPosition(el); 
    });
};

IputEffect();

// validations
var contactData = {
    "iam": {
        "validators": {
            "required": true
        },
        "errorMessage" : "Please select a value from the dropdown."
    },
    "subject": {
        "validators": {
            "required": true
        },
        "errorMessage" : "Please select a value from the dropdown."
    },
    "contactname": {
        "validators": {
            "required": true,
            "regex": "^[A-Za-zàâçéèêëîïôûùüÿñæœ\\' \\.-]*$"
        },
        "errorMessage" : "Please enter valid name in this field."
    },
    "company": {
        "validators": {
            "required": true,
        }
    },
    "email": {
        "validators": {
            "required": true,
            "regex": "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\w+)*(\\.\\w{2,3})+$"
        },
        "errorMessage" : "Please enter a valid email address."
    },
    "phone": {
        "validators": {
            "required": true,
            "regex": "^[2-9][0-9]{2}-?[0-9]{3}-?[0-9]{4}$"
        },
        "errorMessage" : "Please enter valid phone number in this field."
    },

    "state": {
        "validators": {
            "required": true
        },
        "errorMessage" : "Please select a value from the dropdown."
    },
    "zip": {
        "validators": {
            "required": true,
            "regex": "^[0-9]{5}(?:-[0-9]{4})?$"
        },
        "errorMessage" : "Please enter valid ZIP code in this field."
    },
    "comments": {
        "validators": {
            "required": true
        }
    },
};

function onInputChange(obj, objID, objIDError) {
    if (!RegExp(contactData[objID]["validators"]["regex"]).test(obj.value)) {
        document.getElementById(objIDError).innerHTML = contactData[objID]["errorMessage"];
        document.getElementById(objIDError).classList.add("error");
        document.getElementById(objID).classList.add("errorBorder");
        document.getElementById(objID).parentNode.classList.remove("success");
    }
    else {
        document.getElementById(objIDError).innerHTML = "";
        document.getElementById(objIDError).classList.remove("error");
        document.getElementById(objID).classList.remove("errorBorder");
        document.getElementById(objID).parentNode.classList.add("success");
    }
}
function onInputBlur(obj, objID, objIDError) {
    if (contactData[objID]["validators"]["required"] == true && obj.value.length == 0) {
        document.getElementById(objIDError).innerHTML = "This field is required";
        document.getElementById(objIDError).classList.add("error");
        document.getElementById(objID).classList.add("errorBorder");
        document.getElementById(objID).parentNode.classList.remove("success");
    }
}