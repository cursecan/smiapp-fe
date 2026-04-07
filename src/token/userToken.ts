
let accessToken = ''

export const useUserToken = {
    getAccessToken: () => accessToken,
    setAccessToken: (token: any) => {
        accessToken = token;
    },
    clearAccessToken: () => {
        accessToken = "";
    },
}