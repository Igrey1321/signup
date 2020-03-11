let hash = '';

const [name, email, passOne, passTwo, submit, signup, ignupButton
  , avatar, img, loginIn, passIn, submitIn, log_in, loginButton, imgNone
    , userAvatar] =
    [ 'name', 'email', 'pass_one', 'pass_two', 'submit', 'signup', 'ignupButton'
    ,'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in', 'loginButton', 'img_none'
      , 'user_avatar' ]
        .map ( item => document.getElementById ( item ) )

passTwo.disabled = true;
submit.disabled = true;

signup.style.display = 'none'
log_in.style.display = 'none'

signupButton.onclick = function (event) {
  signup.style.display != 'none' ? signup.style.display = 'none' : signup.style.display = 'block'
    , log_in.style.display = 'none'
};
loginButton.onclick = function (event) {
  log_in.style.display != 'none' ? log_in.style.display = 'none' : log_in.style.display = 'block'
    , signup.style.display = 'none'
};

email.onchange = function (event) {
  event.target.test = Boolean(event.target.value.length >= 5
    && event.target.value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/));
  event.target.style.border = event.target.test ? '1px solid green' : '1px solid  red';
}
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
  event.target.style.color = event.target.value
            === passOne.value ? 'green' : 'red';
};

passTwo.onchange = function (event) {
  if (event.target.value === passOne.value) { hash = Sha256.hash(event.target.value); }
  submit.disabled = !(hash
            && name.value.match(/\S/));
};

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
      document.cookie = `name=${name.value}`;
      document.cookie = `hash=${hash}`;
      userAvatar.src = `${img.src}`
      signup.style.display = 'none'
    } else throw new Error('Error cookie');
  });
};

//===============================Photo

avatar.onchange = function (event) {
  img.src = URL
    .createObjectURL(event.target.files[0]);
};

avatar.onchange = function (event) {
  let data;
  const reader = new FileReader();
  reader.onload = function (event) {
    imgNone.style.background = 'none';
    img.src = data = event.target.result;
    img.style.opacity = ('1');
  };
  reader.readAsDataURL(event.target.files[0]);
};

//===============================formLogin

let usersData = {};
let hashIn = '';
submitIn.onclick = function (event) {
  fetch(`https://garevna-rest-api.glitch.me/user/${loginIn.value}`)
    .then((response) => {response.json()
      .then((response) => {usersData = response;
        hashIn = Sha256.hash(passIn.value);
          if (hashIn === usersData.passhash) {
            userAvatar.src = `${usersData.avatar}`
            log_in.style.display = 'none'
          }  

      });
    });
};