let hash = '';

const [ name, email, passOne, passTwo, submit, signup, ignupButton,
   avatar, img, loginIn, passIn, submitIn, log_in, loginButton, imgNone] =
    [ 'name', 'email', 'pass_one', 'pass_two', 'submit', 'signup', 'ignupButton',
    'get_avatar', 'avatar', 'login_in', 'pass_in', 'submit_in', 'log_in', 'loginButton', 'img_none' ]
        .map ( item => document.getElementById ( item ) )

passTwo.disabled = true;
submit.disabled = true;

signup.style.display = 'none'
log_in.style.display = 'none'

signupButton.onclick = () => {
  signup.style.display != 'none' ? signup.style.display = 'none' : signup.style.display = 'block'
    , log_in.style.display = 'none'
};
loginButton.onclick = () => {
  log_in.style.display != 'none' ? log_in.style.display = 'none' : log_in.style.display = 'block'
    , signup.style.display = 'none'
};

email.onchange = () => {
  event.target.test = Boolean(event.target.value.length >= 5
    && event.target.value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/));
  event.target.style.border = event.target.test ? '1px solid green' : '1px solid  red';
}
passOne.oninput = () => {
  event.target.test = Boolean(event.target.value.length >= 8
        && event.target.value.match(/\d\w/g));
  event.target.style.color = event.target.test ? 'green' : 'red';
};
passOne.onchange = () => {
  if (event.target.test) {
    passTwo.disabled = false;
  }
};
passTwo.oninput = () => {
  event.target.style.color = event.target.value
            === passOne.value ? 'green' : 'red';
};

passTwo.onchange = () => {
  if (event.target.value === passOne.value) { hash = Sha256.hash(event.target.value); }
  submit.disabled = !(hash
            && name.value.match(/\S/));
};

submit.onclick = () => {
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
    } else throw new Error('Error cookie');
  });
};

// Photo

avatar.onchange = () => {
  img.src = URL
    .createObjectURL(event.target.files[0]);
};

avatar.onchange = () => {
  let data;
  const reader = new FileReader();
  reader.onload = () => {
    imgNone.style.background = 'none';
    img.src = data = event.target.result;
    img.style.opacity = ('1');
  };
  reader.readAsDataURL(event.target.files[0]);
};

// formLogin

let usersData = {};
let hashIn = '';
submitIn.onclick = () => {
  fetch(`https://garevna-rest-api.glitch.me/user/${loginIn.value}`)
    .then((response) => {response.json()
      .then((response) => {usersData = response;
        hashIn = Sha256.hash(passIn.value);
          hashIn === usersData.passhash ? console.log('Pass good') : console.log('Pass error');
      });
    });
};