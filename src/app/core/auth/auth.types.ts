import { User } from 'app/models/user.type';

export interface AuthResponse
{
    accessToken: string;
    user: User;
    tokenType: string;
}
