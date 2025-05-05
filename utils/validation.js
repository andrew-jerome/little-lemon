export const validateName = (name) => {
    if (name == null || name == '' || !name.match(/^[A-Za-z]+$/)) {
        return false;
    }
    return true
}

export const validateEmail = (email) => {
    if (!email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        return false;
    }
    return true
}

export const validatePhone = (number) => {
    if (number == '' || number.match(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)) {
        return true
    } 
    return false
}

export const validatePersonalInfo = (personalInfo) => {
    if (!validateEmail(personalInfo.email)) {
        return false;
    }
    if (!validateName(personalInfo.firstName)) {
        return false;
    }
    if (!validatePhone(personalInfo.number)) {
        return false;
    }
    return true;
};