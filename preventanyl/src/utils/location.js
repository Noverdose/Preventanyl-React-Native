export const getCurrentLocation = (successCallback, failureCallback) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    }).then (result => {
        successCallback (result);
    }).catch (error => {
        failureCallback (result);
    });
};