//= ==============================data========================

const [name, email, passOne, passTwo, submit, signUpWindow, signupButton,
  avatar, img, loginIn, passIn, submitIn, logInWindow, loginButton,
  imgNone, userAvatar, closedSignup, closedLogIn, signUpOverlay, logInOverlay, userName,
  modalError, exit] = ['name', 'email', 'pass_one', 'pass_two', 'submit', 'sign_up_window', 'signupButton',
  'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in_window', 'loginButton',
  'img_none', 'user_avatar', 'closed_signup', 'closed_login', 'sign_up_overlay', 'log_in_overlay', 'user_name',
  'modal_error', 'exit']
  .map((item) => document.getElementById(item));
const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/, '$1');
passTwo.disabled = true;
submit.disabled = true;

//= ==============================function==========================

const fetchRequest = async (nameUser) => await (await
fetch(`https://garevna-rest-api.glitch.me/user/${nameUser}`)).json();

const cookieRead = async (nameUser) => {
  if (nameUser !== '') {
    const usersInfo = await fetchRequest(nameUser);
    const cookieHash = document.cookie.replace(/(?:(?:^|.*;\s*)hash\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    if (usersInfo.passhash === cookieHash) {
      renderUser(nameUser, usersInfo.avatar);
    }
  }
};

const cookieSave = (nameUser, passhash) => {
  document.cookie = `name=${nameUser}`;
  document.cookie = `hash=${passhash}`;
};
function cookiesDelete() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}

const renderUser = (userNameText, imgURL) => {
  signupButton.style.display = 'none';
  loginButton.style.display = 'none';
  userName.insertAdjacentText('afterbegin', userNameText);
  userAvatar.src = `${imgURL}`;
  userAvatar.style.display = 'block';
  exit.style.display = 'block';
};
const signupNull = () => {
  img.src = 'img/user.svg';
  name.value = '';
  email.value = '';
  email.style.border = 'none';
  passOne.value = '';
  passTwo.value = '';
};
const logInNull = () => {
  loginIn.value = '';
  passIn.value = '';
};

//= ==============================callback===============

signupButton.onclick = function (event) {
  modalSignUp.open();
  signupNull();
};

loginButton.onclick = function (event) {
  modalLogIn.open();
  logInNull();
};

closedSignup.onclick = function (event) {
  modalSignUp.closed();
};

closedLogIn.onclick = function (event) {
  modalLogIn.closed();
};
signUpOverlay.onclick = function (event) {
  modalSignUp.closed();
};
logInOverlay.onclick = function (event) {
  modalLogIn.closed();
};
signUpWindow.onclick = (event) => event.stopPropagation();
logInWindow.onclick = (event) => event.stopPropagation();

//= ============================================ login

email.onchange = function (event) {
  event.target.test = Boolean(event.target.value.length >= 5
    && event.target.value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/));
  event.target.style.border = event.target.test ? '1px solid green' : '1px solid  red';
};
passOne.oninput = function (event) {
  event.target.test = Boolean(event.target.value.length >= 8
        && event.target.value.match(/\d\w/g));
  event.target.style.color = event.target.test ? 'green' : 'red';
};
passOne.onchange = function (event) {
  if (event.target.test) {
    passTwo.disabled = false;
  }
};
passTwo.oninput = function (event) {
  let hash = '';
  event.target.style.color = event.target.value
    === passOne.value ? 'green' : 'red';
  if (event.target.value === passOne.value) {
    hash = Sha256.hash(event.target.value);
  }
  submit.disabled = !(hash && name.value.match(/\S/));
};

submit.onclick = function (event) {
  const hash = Sha256.hash(passTwo.value);
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
      cookieSave(name.value, hash);
      renderUser(name.value, img.src);
      modalSignUp.closed();
      signupNull();
    } else throw new Error('Error cookie');
  });
};

avatar.onchange = function (event) {
  img.src = URL.createObjectURL(event.target.files[0]);
};
avatar.onchange = function (event) {
  const reader = new FileReader();
  reader.onload = function (event) {
    imgNone.style.background = 'none';
    img.src = event.target.result;
    img.style.opacity = ('1');
  };
  reader.readAsDataURL(event.target.files[0]);
};

//= ============================================ login

submitIn.onclick = async function (event) {
  const passValue = Sha256.hash(passIn.value);
  if (loginIn.value !== '') {
    const usersData = await fetchRequest(loginIn.value);
    if (usersData.error === 404) {
      modalError.innerText = `User ${loginIn.value} not found`;
    } else
    if (passValue === usersData.passhash) {
      cookieSave(loginIn.value, usersData.passhash);
      renderUser(loginIn.value, usersData.avatar);
      modalLogIn.closed();
      logInNull();
    } else modalError.innerText = 'Incorrect password';
  }
};

//= ============================================ exit

exit.onclick = function (event) {
  signupButton.style.display = 'block';
  loginButton.style.display = 'block';
  userName.innerText = '';
  userAvatar.style.display = 'none';
  exit.style.display = 'none';
  cookiesDelete();
};

//= ============================================ function call

cookieRead(cookieValue);
