import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { ChangePassword, User } from 'app/models/user.type';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CloudUserService
{
    private _userUrl: string = '/user-mgmt';
    private _apiName: string = environment.userApiName;

    async getCurrentUser(): Promise<any> {
        const headers = {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        };
        const body = {};
        const options = {headers: headers, body: body};

        const path = `${this._userUrl}/current`;

        const promise = API.get(this._apiName, path, options).then(
            (result) => {
              return result.message;
            },
            (err) => {
              throw(err);
            }
        );

        return promise;
    }

    async getRoles(limit?: number, lastKey?: string, filter?: string): Promise<any> {
      const headers = {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      };
      const body = {};
      const options = {headers: headers, body: body};
      const limitParam = limit ? '&limit=' + limit.toString() : '';
      const idParam = lastKey ? '&id=' + lastKey : '';
      const filterParam = filter ? '&filter=%25' + filter + '%25' : '';

      const path = `${this._userUrl}/roles?${limitParam}${idParam}${filterParam}`;

      const promise = API.get(this._apiName, path, options).then(
          (result) => {
            return result.message;
          },
          (err) => {
            throw(err.response);
          }
      );

      return promise;
  }

  async getUsers(limit?: number, filter?: string, name?:string): Promise<any> {
        const headers = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        };
        const body = {};
        const options = {headers: headers, body: body};
        const limitParam = limit ? '&limit=' + limit.toString() : '';
        const filterParam = filter ? ('&filter=' + filter) : '';
        const nameParam = name? '&name=' + name : ""

        const path = `${this._userUrl}/users?${nameParam}${limitParam}${filterParam}`;

        const promise = API.get(this._apiName, path, options).then(
            (result) => {
              return result.message;
            },
            (err) => {
              throw(err.response);
            }
        );

        return promise;
    }

    async createUser(account: User): Promise<any> {

        const session = await Auth.currentSession();
        const idToken = session.getIdToken();
        const payload = idToken.decodePayload();

        const headers = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${idToken.getJwtToken()}`
        };

        const body = {insertList:[
          {id: payload.sub},
          // eslint-disable-next-line @typescript-eslint/naming-convention
          {name: account.name},
          {title: account.title},
          {email: account.email},
          {phone: account.phone},
          {about: account.about},
          {language: account.language},
        ]};

        const options = {headers: headers, body: body};

        const path = `${this._userUrl}/users`;

        const promise = API.post(this._apiName, path, options).then(
            (result) => {
              return result.message;
            },
            (err) => {
              throw(err);
            }
        );

        return promise;
    }

    async updateUserRole(account: User): Promise<any> {
      const headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const body = {id: account.id, updateList:[
        // eslint-disable-next-line @typescript-eslint/naming-convention
        {role_id: account.roleId},
      ]};

      const options = {headers: headers, body: body};

      const path = `${this._userUrl}/users`;

      const promise = API.put(this._apiName, path, options).then(
          (result) => {

            if (result.message.error) {
              throw(result.message.error);
            }

            const updatedRecord = result.message.rows[0];
            account.updatedAt = updatedRecord.updated_at;
            return account;
          },
          (err) => {
            throw(err);
          }
      );

      return promise;
    }

    async updateUserStatus(user: User): Promise<any> {
      const headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      };

      const body = {id: user.id, updateList:[
        {status: user.status},
      ]};

      const options = {headers: headers, body: body};

      const path = `${this._userUrl}/users`;

      const promise = API.put(this._apiName, path, options).then(
          (result) => {

            if (result.message.error) {
              throw(result.message.error);
            }

            //const updatedRecord = result.message.rows[0];
            //account.updatedAt = updatedRecord.updated_at;
            return user;
          },
          (err) => {
            throw(err);
          }
      );

      return promise;
    }

    async updateUser(account: User): Promise<any> {

      const headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const body = {id: account.id, updateList:[
        {name: account.name},
        {email: account.email},
        {title: account.title},
        {status: account.status},
        {about: account.about},
        {phone: account.phone},
        {language: account.language}
      ]};

      const options = {headers: headers, body: body};

      const path = `${this._userUrl}/users`;

      const promise = API.put(this._apiName, path, options).then(
          (result) => {
            if (result.message.error) {
              throw(result.message.error);
            }

            const updatedRecord = result.message.rows[0];
            account.updatedAt = updatedRecord.updated_at;
            return account;
          },
          (err) => {
            throw(err);
          }
      );

      return promise;
    }

    async deleteUser(id: string): Promise<any> {
        const headers = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        };
        const body = {id: id};
        const options = {headers: headers, body: body};

        const path = `${this._userUrl}/users`;

        const promise = API.del(this._apiName, path, options).then(
            (result) => {
              return result.message;
            },
            (err) => {
              throw(err);
            }
        );

        return promise;
    }

    async inviteUser(email: string, currentUser: User): Promise<any> {
      const headers = {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
      };

      const body = {
        fromEmail: environment.sesSourceEmailAddress,
        email: email,
        name: email,
        company: currentUser.company,
        owner: currentUser.name,
        token: this.generateToken(email, currentUser.company, currentUser.companyType),
        url: environment.oauthRedirectSignIn
      };
      const options = {headers: headers, body: body};

      const path = `${this._userUrl}/invite-user`;

      const promise = API.post(this._apiName, path, options).then(
          (result) => {
            return result;
          },
          (err) => {
            throw(err);
          }
      );

      return promise;
  }
  async changePassword(bodyData :ChangePassword): Promise<any> {
       
    const headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
    };
    const body = bodyData;
    const options = {headers: headers, body: body};
    const path = `${this._userUrl}/changePassword`;
  
    const promise = API.put(this._apiName, path, options).then(
        (result) => {
          return result.message;
        },
        (err) => {
          throw err;
        }
    );
  
    return promise;
  
  }

  
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    generateToken(email: string, company: string, companyType: string): string
    {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 7);

      const data = {
        email: email,
        company: company,
        type: companyType,
        valid: expireDate
      };

      return CryptoJS.AES.encrypt(JSON.stringify(data), 'G445P000L').toString();
    }
}
