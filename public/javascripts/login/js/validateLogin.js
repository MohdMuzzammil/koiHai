
function registerFormValidity(form) {
    if(form.name === "" ||
        form.mobNo === "" ||
        form.aadhaarNo === "" ||
        form.address === "" ||
        form.city === "" ||
        form.username === "" ||
        form.profession === "" ||
        form.password1 === "" ||
        form.password2 === ""){
        alert("Fields can't be empty...!!");
        return false;
    }
    if(form.password1 !== form.password2){
        alert("Passwords and confirm password must be same...!!!!");
        return false;
    }
    return true;
}

function loginFormValidity(form){
    if(form.username === "" || form.password === "")
    {
        alert("Please fill in the credentials.. If dont have account, create one..!!");
        return false;
    }
    else return true;
}

function myFunction(form_name) {
    var values = document.getElementsByClassName(form_name)[0].getElementsByTagName("input");
    var data ;
    if(form_name==='left-form'){
        data = {
            name : values[0].value,
            mobNo : values[1].value,
            aadhaarNo : values[2].value,
            address : values[3].value,
            city : values[4].value,
            profession : values[5].value,
            username : values[6].value,
            password1 : values[7].value,
            password2 : values[8].value
        }
        return registerFormValidity(data);
    }
    if(form_name==='right-form'){
        data = {
            username : values[0].value,
            password : values[1].value
        }
        return loginFormValidity(data);
    }
    return false;
}