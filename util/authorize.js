// Authentication method inside the extension

function authorize() {
    return chrome.storage.local.get()
    .then(authPass)
    .then(storeAuth)
}

function authPass(data) {
    if (!data || !data.auth || !data.auth.access_token) {
        return chrome.runtime.sendMessage({action: "authorize", host: location.host})
    }
    return data.auth
}

function storeAuth(auth) {
    chrome.storage.local.set({auth: auth})
    return auth
}

export default authorize;