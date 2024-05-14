export const mustSpecialCharacterCheck = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
export const mustLowerCaseLetters = /^(?=.*[a-z])/;
export const mustNumbers = /^(?=.*\d)/;
export const mustUpperCaseLetters = /^(?=.*[A-Z])/;
//export const emailRegx = /^[a-zA-Z0-9._-]?[+a-zA-Z0-9._-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
export const emailRegx = /^[A-Za-z0-9._+\-\']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
export const phoneNumberRegx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const requiredField = "This Field is Required"
export const onlyCharacter = /^[A-Za-z\s]*$/
