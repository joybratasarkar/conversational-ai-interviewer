import { HttpContextToken } from "@angular/common/http";

export const useErrorHandler = new HttpContextToken<boolean>(()=> true);