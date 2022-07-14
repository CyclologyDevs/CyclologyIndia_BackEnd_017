require("dotenv").config();
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

//console.log(process.env.PORT || 3100);
//console.log(salt);

/*
async function makePasswords(password, passwordEncrypted)
{
    let ans = await bcrypt.compare(password, passwordEncrypted);
    return ans
}

let password = "Aritra07"
let passwordEncrypted001 = '$2a$10$YmobwkledOcRbE20LzB8Je1yBSMVBeRD4rJe.7yAJupHgYsxrv1GK'
let passwordEncrypted002 = '$2a$10$4MAX2Ng.DLoT9F.e.n4l8ORo7s4YGnQjTPnhYXezXozDzZz8RuJUy'
let passwordEncrypted = bcrypt.hashSync(password, salt)

//console.log(passwordEncrypted);

let PHash = makePasswords(password, passwordEncrypted002)
    

setTimeout(() => {
    console.log(PHash)
}, 1000);
*/


if(undefined)
    console.log("T")
else
    console.log("F")