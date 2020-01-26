document.head.appendChild (document.createElement ('script'))
        .src = 'https://cdn.rawgit.com/chrisveness/crypto/4e93a4d/sha256.js'

let hash = ''

const login = document.body.appendChild (
    document.createElement ('input')
)
login.placeholder = 'Login'

const pass1 = document.body.appendChild (
    document.createElement ('input')
)
pass1.placeholder = 'Password'

const pass2 = document.body.appendChild (
    document.createElement ('input')
)
pass2.disabled = true
pass2.placeholder = 'Repeate password'

const submit = document.body.appendChild (
    document.createElement ('button')
)
submit.disabled = true
submit.innerText = 'Submit'

pass1.oninput = function (event) {
    event.target.test = Boolean (event.target.value.length >= 8 
        && event.target.value.match (/\d/g)
            && event.target.value.match (/\w/g))
    event.target.style.color = event.target.test ? 'green' : 'red'
}

pass1.onchange = function (event) {
    if (event.target.test) {
        pass2.disabled = false
    }
}

pass2.oninput = function (event) {
    event.target.style.color = 
        event.target.value === 
            pass1.value ? 'green' : 'red'
}

pass2.onchange = function (event) {
    if (event.target.value === pass1.value) 
        hash = Sha256.hash (event.target.value)
        submit.disabled = !(hash &&
            login.value.match(/\S/))
}

submit.onclick = function (event) {
    fetch (`https://garevna-rest-api.glitch.me/user/${login.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            passhash: hash
        })
    }).then (response => {
        console.log (response.ok)
        if (response.ok) {
            document.cookie = `login = ${login.value}`
            document.cookie = `hash = ${hash}`
        }
    })
}