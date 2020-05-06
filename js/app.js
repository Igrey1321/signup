//===============================data========================

const [name, email, passOne, passTwo, submit, signUpWindow, ignupButton
  , avatar, img, loginIn, passIn, submitIn, logInWindow, loginButton
  , signupButton, imgNone, userAvatar, closedSignup, closedLogIn
  , signUpOverlay, logInOverlay, userName, modalError] =
    [ 'name', 'email', 'pass_one', 'pass_two', 'submit', 'sign_up_window', 'ignupButton'
    ,'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in_window', 'loginButton'
    , 'signupButton', 'img_none', 'user_avatar', 'closed_signup', 'closed_login'
    , 'sign_up_overlay', 'log_in_overlay', 'user_name', 'modal_error']
        .map ( item => document.getElementById ( item ) )
const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/, "$1")
passTwo.disabled = true
submit.disabled = true
submitIn.disabled = true

//===============================function==========================
const fetchRequest = async nameUser => await (await 
  fetch(`https://garevna-rest-api.glitch.me/user/${nameUser}`)).json()

const cookieRead = async name => {
  if (name !== '') {
    const usersInfo = await fetchRequest(name)
    const cookieHash = document.cookie.replace(/(?:(?:^|.*;\s*)hash\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    if (usersInfo.passhash === cookieHash) {
      renderUser(name, usersInfo.avatar)
    }
  }
}
const renderUser = (userNameText, imgURL) => {
  signupButton.style.display = 'none'
  loginButton.style.display = 'none'
  userName.insertAdjacentText("afterbegin", userNameText)
  userAvatar.src = `${imgURL}`
  userAvatar.style.display = 'block'
}
//===============================callback===============

signupButton.onclick = function (event) {
  modalSignUp.open()
}
loginButton.onclick = function (event) {
  modalLogIn.open()
}
closedSignup.onclick = function (event) {
  modalSignUp.closed()
}
closedLogIn.onclick = function (event) {
  modalLogIn.closed()
}
signUpOverlay.onclick = function (event) {
  modalSignUp.closed()
}
logInOverlay.onclick = function (event) {
  modalLogIn.closed()
}
signUpWindow.onclick = (event) => event.stopPropagation()
logInWindow.onclick = (event) => event.stopPropagation()

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
  let hash = ''
  if (event.target.value === passOne.value) { 
    hash = Sha256.hash(event.target.value) 
  }
  submit.disabled = !(hash && name.value.match(/\S/))
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
      renderUser(name.value, img.src)
      modalSignUp.closed()
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

let loginSuccess = {
  loginCorrect: false,
  passCorrect: false,
  passHash: '',
  avatar: '',
}
loginIn.onchange = async function () {
  modalError.textContent = ''
  loginSuccess.loginCorrect = false
  let usersData
  if (loginIn.value !== '') {
    usersData = await fetchRequest(loginIn.value)
    if (usersData.error === 404) {
      modalError.innerText = `User ${loginIn.value} not found`
    }else  loginSuccess.loginCorrect = true
      loginSuccess.passHash = usersData.passhash
      loginSuccess.avatar = usersData.avatar
  }
}
passIn.oninput = function () {
  modalError.textContent = ''
  let passvalue = Sha256.hash(event.target.value)
  if (passvalue === loginSuccess.passHash) {
    submitIn.disabled = false
  }else modalError.innerText = `Incorrect password`
}
submitIn.onclick = async function (event) {
  if (loginSuccess.loginCorrect) {
    document.cookie = `name=${loginIn.value}`
    document.cookie = `hash=${loginSuccess.passHash}`
    renderUser(loginIn.value, loginSuccess.avatar)
    modalLogIn.closed()
  }
}
//===============================function call====================
cookieRead(cookieValue)