/**
 * Seligson.fi counter utility functions
 */

// check number for comma and replace with dot if found any, strip spaces
// and return as float
function checkNumber(val)
{
    return parseFloat(val.toString().replace(",", ".").replace(" ", ""));
}

// round to seleted amount of decimals and check number for dot and replace
// with comma if found any and return as string
function showNumber(val, decimals)
{
    if (isNaN(parseFloat(val)))
        return 0;

    val = roundNumber(val, decimals);

    // replace dots with commas and return as string
    return val.toString().replace(".", ",");
}

// round to seleted amount of decimals
function roundNumber(num, decimals)
{
    // if decimals not set, default to 0
    if (isNaN(decimals))
        decimals = 0;

    // the actual rounding
    num = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

    return num;
}

// validate a positive numeric value
function validateNumber(val)
{
    val = checkNumber(val);
    //return !isNaN(val) && val >= 0;
    return !isNaN(val);
}

// validate input field element and replace with cleaned up value
// show (or return) error message if not valid
function validateField(e, return_msg)
{
    message = "";

    // if not a valid number
    if (!validateNumber(e.value)) {

        $(e).val(0);
        // get custom error message for this field
        message = getErrorMsg($(e).attr('id'));

        // if we didn't get custom error message, use default
        if (message == $(e).attr('id'))
            message = getErrorMsg('default', "Virheellinen syöte. Tarkista arvo.");
    }
    // else valid number, update value with formatted number
    else {
        // check for custom decimals for this field
        if (typeof decimals != "undefined" && decimals[$(e).attr('id')] > 1)
            $(e).val(showNumber(checkNumber(e.value), decimals[$(e).attr('id')]));
        // otherwise round with 1 decimal
        else
            $(e).val(showNumber(checkNumber(e.value), 4));
    }

    // if we have error message
    if (message.length > 0) {
        // output or return it
        if (return_msg == true)
            return message;
        else
            alert(message);
    }
}

// validate current field
function validateThis()
{
    validateField(this);
}

// validate all fields (field list passed as parameter)
function validateAll(fields)
{
    messages = new Array();

    // loop fields
    for (var i in fields) {
        // validate field
        message = validateField($("#" + fields[i]).get(0), true);

        // if validation failed (i.e. we got error message), add it to messages
        if (typeof message != "undefined" && message.length > 0)
            messages.push(message);
    }

    // if we got error messages
    if (messages.length > 0) {
        // join them and output to user
        alert(messages.join("\n"));
        return false;
    }
    else {
        return true;
    }
}

// get correct text according to years (1 year / n years)
function getYearsText(years)
{
    return years + " " + ((years == 1) ? getText("1_year", "vuosi") : getText("n_years", "vuotta"));
}

// return text from language file if found, and default text otherwise
function getText(langKey, defaultText)
{
    defaultText = (typeof defaultText != "undefined" && defaultText.length > 0) ? defaultText : langKey;
    return (typeof langTexts != "undefined" && langTexts[langKey]) ? langTexts[langKey] : defaultText;
}

// return error message from language file if found, and default text otherwise
function getErrorMsg(langKey, defaultText)
{
    defaultText = (typeof defaultText != "undefined" && defaultText.length > 0) ? defaultText : langKey;
    return (typeof errorMessages != "undefined" && errorMessages[langKey]) ? errorMessages[langKey] : defaultText;
}
