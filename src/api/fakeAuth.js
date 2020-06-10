//import Cryptr from 'cryptr';
//const cryptr = new Cryptr('myTotalySecretKey');
var fakeAuth = {
    isAuthenticated(){
     
     if(localStorage.getItem("auth")!=null&& localStorage.getItem("token")!=null)
     {
      //  getOneRole(localStorage.getItem("auth")).then(res=>{
          return true;
      //  }).catch(err=>{ return false})

     }
     return false;
    },
    authenticate(username,token) {
      localStorage.setItem("auth",username);
   //   localStorage.setItem("token",cryptr.encrypt(role));
      localStorage.setItem("token",token);
     // this.isAuthenticated = true;
     // setTimeout(cb, 100); // fake async
    },
    getUsername(){
      return localStorage.getItem("auth")
    },
    getAccessToken(){
      return localStorage.getItem("token")
    },
    signout(cb) {
      localStorage.clear()
      sessionStorage.clear()
      setTimeout(cb, 100);
    }
};
export default fakeAuth