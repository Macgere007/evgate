import {pro, basic,hyundai, cp} from './environment-stage'

export const environment = {
  ...cp,
  production: true,
  appVersion: '1.1',
  cognitoUserPoolRegion: 'ap-southeast-1',
  cognitoIdentityPoolRegion: 'ap-southeast-1',
  oauthRedirectSignIn: 'http://localhost:4200',
  oauthRedirectSignOut: 'http://localhost:4200/sign-out',
  defaultGridPageSize: 10,
  userApiName: 'userapi',
  lookupApiName: 'lookupapi',
  dashboardApiName: 'dashboardapi',
  breakerApiName: 'breakerapi',
  evApiName: 'evapi',
  topupApiName: 'topupapi',
  sesSourceEmailAddress: 'support@energie.co.id',
  allowSignUp: true
};
