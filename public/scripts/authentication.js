const auth = localStorage.getItem('email')
const userToken = localStorage.getItem('token')
if(!auth || !userToken){
    console.log("Not authenticated", auth, userToken)
    window.location.href="index.html"
}

function logout(){
    localStorage.clear()
    window.location.reload()
}
