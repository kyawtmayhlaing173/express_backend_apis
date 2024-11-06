import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'F93U56G4OjWrShL';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, JWT_SECRET);
}

export const decode = (token: string): string | null | JwtPayload => {
    return jwt.decode(token);
}