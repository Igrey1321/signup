//===============================variables

const [name, email, passOne, passTwo, submit, signup, ignupButton
  , avatar, img, loginIn, passIn, submitIn, logIn, loginButton, imgNone
    , userAvatar, closedSignup, closedLogIn] =
    [ 'name', 'email', 'pass_one', 'pass_two', 'submit', 'signup', 'ignupButton'
    ,'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in', 'loginButton', 'img_none'
      , 'user_avatar', 'closed_signup', 'closed_log_in']
        .map ( item => document.getElementById ( item ) )

//===============================data

const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/, "$1")
let hash = ''
passTwo.disabled = true
submit.disabled = true
signup.style.display = 'none'
logIn.style.display = 'none'
let usersData = {}
let hashIn = ''

//===============================function
const fetchRequest = async nameUser => {
  const usersData = await (await fetch(`https://garevna-rest-api.glitch.me/user/${nameUser}`)).json()
  return usersData
}

const cookieRead = async name => {
  if (name !== '') {
    const usersInfo = fetchRequest(name)
    const usersObj = await usersInfo
    const cookieHash = document.cookie.replace(/(?:(?:^|.*;\s*)hash\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    if (usersObj.passhash === cookieHash) {
      userAvatar.src = `${usersObj.avatar}`
    }
  }
}

const trigger = elem => elem.style.display = elem.style.display === 'none' ? 'block' : 'none'

const formOff = elem => elem.style.display = 'none'

//===============================callback

signupButton.onclick = function (event) {
  trigger(signup)
  formOff(logIn)
}
loginButton.onclick = function (event) {
  trigger(logIn)
  formOff(signup)
}
closedSignup.onclick = function (event) {
  formOff(signup)
}
closedLogIn.onclick = function (event) {
  formOff(logIn)
}

email.onchange = function (event) {
  event.target.test = Boolean(event.target.value.length >= 5
    && event.target.value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/))
  event.target.style.border = event.target.test ? '1px solid green' : '1px solid  red'
}
passOne.oninput = function (event) {
  event.target.test = Boolean(event.target.value.length >= 8
        && event.target.value.match(/\d\w/g))
  event.target.style.color = event.target.test ? 'green' : 'red'
}
passOne.onchange = function (event) {
  if (event.target.test) {
    passTwo.disabled = false
  }
}
passTwo.oninput = function (event) {
  event.target.style.color = event.target.value
            === passOne.value ? 'green' : 'red'
}
passTwo.onchange = function (event) {
  if (event.target.value === passOne.value) { hash = Sha256.hash(event.target.value) }
  submit.disabled = !(hash
            && name.value.match(/\S/))
}

submit.onclick = function (event) {
  fetch(`https://garevna-rest-api.glitch.me/user/${name.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      passhash: hash,
      avatar: img.src,
      email: email.value,
    }),
  }).then((response) => {
    if (response.ok) {
      document.cookie = `name=${name.value}`
      document.cookie = `hash=${hash}`
      userAvatar.src = `${img.src}`
      signup.style.display = 'none'
    } else throw new Error('Error cookie')
  })
}

avatar.onchange = function (event) {
  img.src = URL
    .createObjectURL(event.target.files[0])
}
avatar.onchange = function (event) {
  let data
  const reader = new FileReader()
  reader.onload = function (event) {
    imgNone.style.background = 'none'
    img.src = data = event.target.result
    img.style.opacity = ('1')
  }
  reader.readAsDataURL(event.target.files[0])
}

submitIn.onclick = function (event) {
  fetch(`https://garevna-rest-api.glitch.me/user/${loginIn.value}`)
    .then((response) => response.json()
      .then((response) => {usersData = response
        hashIn = Sha256.hash(passIn.value)
          if (hashIn === usersData.passhash) {
            document.cookie = `name=${loginIn.value}`
            document.cookie = `hash=${hashIn}`
            userAvatar.src = `${usersData.avatar}`
            logIn.style.display = 'none'
          }  
      })
    )
}
//===============================function call
cookieRead(cookieValue)