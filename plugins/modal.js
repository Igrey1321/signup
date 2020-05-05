let signUpHtml = `
  <div class="modal_overlay" id="sign_up_overlay">
    <div class="modal_window" id="sign_up_window">
      <div class="modal_title">
        <span class="closed_form" id="closed_signup"></span>
      </div>
      <div class="modal_body">
        <div class="container_img" id="img_none">
          <div class="container_img_center">
            <span>
              <img id ="avatar" src="#" alt="Avatar">
            </span>
          </div>
        </div>
        <div class="get_file">
          <div class="form-group">
          <label class="label">
            <span class="title">Add Avatar</span>
            <input id="get_avatar" type="file">
          </label>
          </div>
        </div>
        <input type="text" id="name" placeholder="Name">
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="pass_one" placeholder="Password">
        <input type="password" id="pass_two" placeholder="Repeate password">
      </div>
      <div class="modal_footer">
        <button class="submit_style" id="submit">Submit</button>
      </div>
    </div>
  </div>
`
let logInHtml = `
  <div class="modal_overlay" id="log_in_overlay">
    <div class="modal_window" id="log_in_window">
      <div class="modal_title">
        <span class="closed_form" id="closed_login"></span>
      </div>
      <div class="modal_body">
        <p class="modal_text" id="modal_error"></p>
        <input type="text" id="login_in" placeholder="Login">
        <input type="password" id="pass_in" placeholder="Password">
      </div>
      <div class="modal_footer">
      <button class="submit_style" id="submit_in">Submit</button>
      </div>
    </div>
  </div>
`
class Modal {
  constructor (html, time) {
    this.modal = document.createElement('div')
    this.modal.classList.add('modal')
    this.modal.insertAdjacentHTML('afterbegin',html)
    document.body.appendChild(this.modal)
  }
  open () {
    this.modal.classList.add('open')
  }
  closed () {
    this.modal.classList.remove('open')
    this.modal.classList.add('hide')
    setTimeout(() => {
      this.modal.classList.remove('hide')
    },300)
  }
}

let modalSignUp = new Modal(signUpHtml)
let modalLogIn = new Modal(logInHtml)