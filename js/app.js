let hash = ''

const login = document.getElementById ('login')

const pass1 = document.getElementById ('pass1')

const pass2 = document.getElementById ('pass2')
pass2.disabled = true

const submit = document.getElementById ('submit')
submit.disabled = true

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

// Photo
const avatar = document.body.appendChild(
    document.createElement('input')
)

const img = document.body.appendChild (
    document.createElement ('img')
)
avatar.type = 'file'
avatar.onchange = function (event) {
    img.src = URL
        .createObjectURL (event.target.files [0])
}

avatar.onchange = function (event) {
    let data
    const reader = new FileReader
    reader.onload = function (event) {
        img.src = data = event.target.result
    }
    reader.readAsDataURL (event.target.files [0])
}
fetch ('https://garevna-rest-api.glitch.me/user/frodo')

const getUser = async (login) => {
    try {
        let data = await(
            (await fetch (`https://garevna-rest-api.glitch.me/user/${login}`)).json())
                document.body.appendChild(
                    document.createElement('img')
                )
    } catch (err) {
        console.warn ('User is not defined')
    }
}