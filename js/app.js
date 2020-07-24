//= ==============================data========================

const [name, email, passOne, passTwo, submit, signUpWindow, signupButton,
  avatar, img, loginIn, passIn, submitIn, logInWindow, loginButton,
  imgNone, userAvatar, closedSignup, closedLogIn, signUpOverlay, logInOverlay, userName,
  modalError, exit] = ['name', 'email', 'pass_one', 'pass_two', 'submit', 'sign_up_window', 'signupButton',
  'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in_window', 'loginButton',
  'img_none', 'user_avatar', 'closed_signup', 'closed_login', 'sign_up_overlay', 'log_in_overlay', 'user_name',
  'modal_error', 'exit']
  .map((item) => document.getElementById(item));

passTwo.disabled = true;
submit.disabled = true;

//= ==============================function==========================

const fetchRequest = async (nameUser) => await (await
fetch(`http://localhost:3000/users?name=${nameUser}`)).json();


const requestUser = async (nameUser) => {
  if (nameUser !== '') {
    const usersData = await fetchRequest(nameUser);
    const localHash = localStorage.getItem('hash');
    if (usersData[0].passhash === localHash) {
      renderUser(nameUser, usersData[0].avatar);
    }
  }
};

const saveUserLocal = (key, value) => {
  localStorage.setItem(key, value);
};

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
  modalError.innerText = '';
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
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.value,
      passhash: hash,
      avatar: img.src,
      email: email.value,
    }),
  }).then((response) => {
    if (response.ok) {
      saveUserLocal('name', name.value);
      saveUserLocal('hash', hash);
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
    if (usersData.length === 0) {
      modalError.innerText = `User ${loginIn.value} not found`;
    } else
    if (passValue === usersData[0].passhash) {
      saveUserLocal('name', loginIn.value);
      saveUserLocal('hash', usersData[0].passhash);
      renderUser(loginIn.value, usersData[0].avatar);
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
  localStorage.clear();
};

//= ============================================ function call

(function autoAuthorization() {
  const localUser = localStorage.getItem('name');
  if (localUser !== null) {
    requestUser(localUser);
  }
}());
