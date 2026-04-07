let accessToken = "";

export const tokenStore = {
    getAccessToken: () => accessToken,
    setAccessToken: (token) => {
        accessToken = token;
    },
    clearAccessToken: () => {
        accessToken = "";
    },
}