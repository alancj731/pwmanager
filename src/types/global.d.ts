export interface UserInDB {
    id: number;
    name: string;
    email: string;
    password: string;
};

export interface ResponseData {
    error?: string;
    message?: string;
    data?: any;
};
