<template>
  <div class="container">
    <div class="row">
      <div class="col-md-offset-4 col-sm-9 col-md-7 col-lg-5 mx-auto" v-if="form == 1">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign In</h5>
            <h6 class="text-center success" v-if="signUp.status == 200">{{signUp.msg}}</h6>
            <h6 class="text-center error" v-if="siginform.status == 404">{{siginform.error}}</h6>
            <form class="form-signin" @submit.prevent="doSigin">
              <div class="form-group">
                <label for="username">Email address</label>
                <input type="email" name="useremail" id="username"  v-model="siginform.username" class="form-control" placeholder="Email address" required autofocus>
              </div>

              <div class="form-group">
                <label for="loginpwd">Password</label>
                <input type="password" id="loginpwd" v-model="siginform.password" class="form-control" placeholder="Password" required>
              </div>
              <div>
                 <button class="btn btn-primary" type="submit">Sign in</button>
                 <button class="btn btn-default pull-right" @click="toRegister">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
       <div class="col-md-offset-4 col-sm-9 col-md-7 col-lg-5 mx-auto" v-else-if="form == 2">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Register</h5>
            <form class="form-signin" @submit.prevent="doSignUp">
              <div class="form-group">
                <label for="inputEmail">Full name</label>
                <input type="text"  v-model="registerform.name" class="form-control" placeholder="Full name" required autofocus>
              </div>
              <div class="form-group">
                <label for="inputEmail">Email</label>
                <input type="email"  v-model="registerform.email" class="form-control" placeholder="Email address" required autofocus>
              </div>

              <div class="form-group">
                <label for="regpwd">Password</label>
                <input type="password" id="regpwd" v-model="registerform.password" class="form-control" placeholder="Password" required>
              </div>
               <div class="form-group">
                <label for="cnfpwd">Password</label>
                <input type="password" id="cnfpwd" v-model="registerform.confirm" class="form-control" placeholder="Confirm password" required>
              </div>
              <div class="btn-group">
                 <button class="btn btn-primary" type="submit">Sing up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            siginform: {
                username: null,
                password: null,
                status: 200,
                msg: 'success',
                error: 'Your account or password is incorrect.'
            },
            registerform: {
                name:null,
                email: null,
                password: null,
                confirm: null
            },
            form: 1,
            signUp: {
                status: 404,
                msg: 'Sign up successfull.'
            }
        }
    },
    mounted () {

    },
    methods: {
        doSigin(event){
            event.preventDefault();
            let loginObj = this.siginform
            // compire this with localstorge data
            let userList = localStorage.getItem('users') ? localStorage.getItem('users') : null;
            if (userList !== null) {
                userList = JSON.parse(userList);
                let res = userList.filter((iterator) => {
                    return (iterator.email === loginObj.username && iterator.password === loginObj.password) ? true : false;
                })
                if (res.length > 0) {
                    // success login
                    localStorage.setItem('session', true)
                    this.$router.push('/notes')
                } else{
                    this.siginform.status = 404;
                }
            } else {
                alert('Please register');
            }
        },
        toRegister() {
            if (this.form === 1) {
                this.form = 2
                this.registerform = {
                    name:null,
                    email: null,
                    password: null,
                    confirm: null
                 }
            }
        },
        doSignUp(event){
            try {
                let newUser = new Object()
                Object.assign(newUser, this.registerform);
                delete newUser.confirm
                var success = false
                if (localStorage.getItem('users')) {
                    let fullUser = localStorage.getItem('users');
                    fullUser = JSON.parse(fullUser);
                    fullUser.push(newUser);
                    // update users list
                    fullUser = JSON.stringify(fullUser);
                    localStorage.setItem('users', fullUser);
                    success = true
                } else {
                    let arr = [];
                    arr.push(newUser);
                    // create new user list
                    arr = JSON.stringify(arr);
                    localStorage.setItem('users', arr);
                    success = true
                }
                if (success) {
                    this.signUp.status = 200;
                    this.form = 1;
                }
            } catch (error) {
                
            }
            
        }
    }
  
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
    margin-top: 64px;
    border: 1px solid #dadce0;
    border-radius: 4px;
}
.card-body {
    padding:48px 40px 36px;
}
.card-title{
    font-size: 24px;
    font-weight: 400;
} 
.text-center {
    text-align: center;
}
label {
    font-weight: 400;
}
.success {
    font-size: 16px;
    color: #3CA300;
}
.error{
    font-size: 14px;
    color: #B64A00;
}
</style>
