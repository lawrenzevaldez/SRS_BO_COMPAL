let apiUrl = 'http://192.168.0.62:1112/api/'
export { apiUrl }
function msgSuccess(title=200, msg="Something wrong in server"){
    new PNotify({
        title: title,
        text: msg,
        addclass: 'bg-success'
    });
}
export { msgSuccess }

function msgError(title=401, msg="Something wrong in server"){
    new PNotify({
        title: title,
        text: msg,
        addclass: 'bg-danger'
    });
}

export { msgError }



function tokenApi(token="token",check="token"){
    if (check == "token") {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(token)
            }
        }
        return config
    }

    if (check == "check") {
        return localStorage.getItem(token)
    }
    
    if (check == 'header') {
        return {
            'Authorization': 'Bearer ' + localStorage.getItem(token)
        }
    }
}
export { tokenApi }

function removeToken(token="token") {
    localStorage.removeItem(token)
}
export { removeToken }

function getSessionCurrentUrl(obsession, value) {
    let session_id     = obsession.$session.id()
    obsession.$session.renew(session_id)
    obsession.$session.set('get_current_url', value)
}
export { getSessionCurrentUrl }

function f_apiUrl(url) {
    return apiUrl+url
}
export { f_apiUrl }
