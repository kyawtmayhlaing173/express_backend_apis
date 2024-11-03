import { URL } from "url";

export function validateUrl(value: string) {
    try {
        new URL(value);
        return true;
    } catch(e) {
        return false;
    }
}