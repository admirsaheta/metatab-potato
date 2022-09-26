// Authentication method inside the extension

function authorize() {
    return browser.storage.local.get()
    .then(authPass)
    .then(storeAuth)
}

function authPass(data) {
    if (!data || !data.auth || !data.auth.access_token) {
        return browser.runtime.sendMessage({action: "authorize", host: location.host})
    }
    return data.auth
}

function storeAuth(auth) {
    browser.storage.local.set({auth: auth})
    return auth
}

export default authorize;