
let accessToken = ''

export const useUserToken = {
    getAccessToken: () => accessToken,
    setAccessToken: (token: string) => {
        accessToken = token;
    },
    clearAccessToken: () => {
        accessToken = "";
    },
}