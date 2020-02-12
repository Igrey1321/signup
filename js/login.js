const loginIn = document.getElementById('login_in');
const passIn = document.getElementById('pass_in');
const submitIn = document.getElementById('submit_in');
let usersData = {};
let hashIn = '';
submitIn.onclick = function (event) {
  fetch(`https://garevna-rest-api.glitch.me/user/${loginIn.value}`)
    .then((response) => {
      response.json()
        .then((response) => {
          usersData = response;
          hashIn = Sha256.hash(passIn.value);
          hashIn === usersData.passhash ? console.log('Pass good') : console.log('Pass error');
        });
    });
};
