let hash = '';
const login = document.getElementById('login');
const pass1 = document.getElementById('pass1');
const pass2 = document.getElementById('pass2');
pass2.disabled = true;
const submit = document.getElementById('submit');
submit.disabled = true;
const signup = document.getElementById('signup');
const signupButton = document.getElementById('signupButton');
signupButton.onclick = () => {
  signup.style.display = 'block';
};
pass1.oninput = function (event) {
  event.target.test = Boolean(event.target.value.length >= 8
        && event.target.value.match(/\d\w/g));
  event.target.style.color = event.target.test ? 'green' : 'red';
};
pass1.onchange = function (event) {
  if (event.target.test) {
    pass2.disabled = false;
  }
};
pass2.oninput = function (event) {
  event.target.style.color = event.target.value
            === pass1.value ? 'green' : 'red';
};

pass2.onchange = function (event) {
  if (event.target.value === pass1.value) { hash = Sha256.hash(event.target.value); }
  submit.disabled = !(hash
            && login.value.match(/\S/));
};

submit.onclick = function (event) {
  fetch(`https://garevna-rest-api.glitch.me/user/${login.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      passhash: hash,
      avatar: img.src,
    }),
  }).then((response) => {
    if (response.ok) {
      document.cookie = `login=${login.value}`;
      document.cookie = `hash=${hash}`;
    } else throw new Error('');
  });
};

// Photo
const avatar = document.getElementById('get_avatar');

const img = document.getElementById('avatar');

avatar.onchange = function (event) {
  img.src = URL
    .createObjectURL(event.target.files[0]);
};

avatar.onchange = function (event) {
  let data;
  const reader = new FileReader();
  reader.onload = function (event) {
    img.src = data = event.target.result;
    img.style.opacity = ('1');
  };
  reader.readAsDataURL(event.target.files[0]);
};
fetch(`https://garevna-rest-api.glitch.me/user/${login}`);

const getUser = async (login) => {
  try {
    const data = await (
      (await fetch(`https://garevna-rest-api.glitch.me/user/${login}`)).json());
    document.body.appendChild(
      document.createElement('img'),
    );
  } catch (err) {
    console.warn('User is not defined');
  }
};
