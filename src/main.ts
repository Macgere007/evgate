import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';

import Amplify from 'aws-amplify';

const awsConfig = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: environment.cognitoIdentityPoolId,
      region: environment.cognitoUserPoolRegion,
      // OPTIONAL - Amazon Cognito Federated Identity Pool Region
      // Required only if it's different from Amazon Cognito Region
      identityPoolRegion: environment.cognitoIdentityPoolRegion,
      userPoolId: environment.cognitoUserPoolId,
      userPoolWebClientId: environment.cognitoAppClientId,
      // OPTIONAL: Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true,

      // OPTIONAL - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      // cookieStorage: {
      //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      //   domain: '',
      //   // OPTIONAL - Cookie path
      //   path: '/',
      //   // OPTIONAL - Cookie expiration in days
      //   expires: 365,
      //   // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      //   sameSite: "strict",
      //   // OPTIONAL - Cookie secure flag
      //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      //   secure: true
      // },

      // OPTIONAL - customized storage object
      //storage: MyStorage,

      // OPTIONAL - Manually  set the authentication flow type. Default is 'USER_SRP_AUTH'
      //authenticationFlowType: 'USER_PASSWORD_AUTH',

      // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
      //clientMetadata: { myCustomKey: 'myCustomValue' },

      // OPTIONAL - Hosted UI configuration
      oauth: {
        domain: environment.oauthDomain,
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: environment.oauthRedirectSignIn,
        redirectSignOut: environment.oauthRedirectSignOut,
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
      }
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    API: {
      endpoints: [
            {
                name: environment.userApiName,
                endpoint: environment.userApiUrl
            },
            {
              name: environment.lookupApiName,
              endpoint: environment.lookupApiUrl
            },
            {
              name: environment.dashboardApiName,
              endpoint: environment.dashboardApiUrl
            },
            {
              name: environment.breakerApiName,
              endpoint: environment.breakerApiUrl
            },
            {
                name: environment.evApiName,
                endpoint: environment.evApiUrl
            },
            {
                name:environment.topupApiName,
                endpoint:environment.topupApiUrl
            }
      ]
    },
    // // eslint-disable-next-line @typescript-eslint/naming-convention
    // Storage: {
    // // eslint-disable-next-line @typescript-eslint/naming-convention
    //   AWSS3: {
    //       bucket: environment.uploadS3BucketName, //REQUIRED -  Amazon S3 bucket name
    //       region: environment.cognitoUserPoolRegion, //OPTIONAL -  Amazon service region
    //       identityPoolId: environment.cognitoIdentityPoolId
    //   }
    // }
  };

  Amplify.configure(awsConfig);

  if ( environment.production )
  {
      enableProdMode();
      if(window){
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          window.console.log=() => {};
      }
  }

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
