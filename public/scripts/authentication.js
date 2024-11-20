const auth = localStorage.getItem('email')
if(!auth){
  //  window.location.href="index.html"
}

function logout(){
    localStorage.clear()
   // window.location.reload()
}
