import {decode} from 'base-64';

export function decodeJwt(token: string) {
	token = token.replace("Bearer ", "");
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
        decode(base64)
            .split('')
            .map(function (c) {
                return "%" + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
}


