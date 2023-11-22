import { Auth } from 'aws-amplify';
import { User } from 'app/models/user.type';
import { CognitoUser} from 'amazon-cognito-identity-js';
import { from, Observable } from 'rxjs';
import { _MatRadioButtonBase } from '@angular/material/radio';

export class AuthAmplify {
    constructor() {

    }

    /**
     * getIdToken get Access Token from the user session return from Auth Amplify
     */
     static getAccessToken(cognitoUser: CognitoUser): string {
        if (!cognitoUser) {
            return null;
        }

        const session = cognitoUser.getSignInUserSession();
        return session.getAccessToken().getJwtToken();
    }

    /**
     * getIdToken get Id Token from the user session return from Auth Amplify
     */
     static getIdToken(cognitoUser: CognitoUser): string {
        if (!cognitoUser){
            return null;
        }

        const session = cognitoUser.getSignInUserSession();
        return session.getIdToken().getJwtToken();
    }

    /**
     * getRefreshToken get Refresh Token from the user session return from Auth Amplify
     */
     static getRefreshToken(cognitoUser: CognitoUser): string {
        if (!cognitoUser) {
            return null;
        }

        const session = cognitoUser.getSignInUserSession();
        return session.getRefreshToken().getToken();
    }

    /**
     * getUserData get user information from the user session return from Auth Amplify
     */
    static getUserData(cognitoUser: CognitoUser): Promise<User | any> {
        if (!cognitoUser) {
            return null;
        }

        const promise = new Promise<User| any>((resolve, reject) => {
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    if (err.message === 'User does not exist.') {
                        localStorage.clear()
                        window.location.reload()
                    }

                    reject(err);
                    return null;
                };

                let userId = null;
                let userName = null;
                let userEmail = null;
                let userIdentities = null;
                let providerType = null;
                let userPicture = null;
                let companyId = null;
                let isAdmin = null;
                let userRole = null

                for (const attr of attributes) {
                    switch(attr.Name) {
                        case 'sub':
                            userId = attr.Value;
                            break;
                        case 'name':
                            userName = attr.Value;
                            break;
                        case 'userRole':
                            userRole = attr.Value;
                            break;
                        case 'email':
                            userEmail = attr.Value;
                            break;
                        case 'identities':
                            userIdentities = attr.Value;
                            break;
                        case 'picture':
                            userPicture = attr.Value;
                            break;
                    }
                }

                if (userIdentities) {
                    const identities = JSON.parse(userIdentities);
                    if (identities.length > 0) {
                        const identity = identities[0];
                        providerType = identity.providerType;
                    }
                }

                const user: User = {
                    id: userId,
                    name: userName,
                    companyId: companyId,
                    // companyType: companyType,
                    email: userEmail,
                    avatar: 'assets/images/avatars/brian-hughes.jpg',
                    status: 'online',
                    isAdmin: eval(isAdmin)
                };

                if (providerType) {
                    user.type = providerType;
                }

                if (userPicture) {
                    user.avatar = userPicture;
                }

                resolve(user);
            });
        });

        return promise;
    }

    /**
     * getCurrentSessionUser get authenticated user from current session
     */
    static getCurrentSessionUser(): Observable<any> {
        const promise = new Promise<boolean>((resolve, reject) => {
            Auth.currentSession().then(
                () => {
                    Auth.currentAuthenticatedUser().then(
                        (user) => {
                            resolve(user);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                },
                (err) => {
                    reject(err);
                }
            );
        });

        return from(promise);
    }
}
