var MicrosoftAuthConfig = {
    OAUTH_APP_ID : string = "bb084afc-cbd2-4541-9d4c-b7ba39799b71",
    OAUTH_APP_PASSWORD : string = "eIgs1gFQCe/zt[TDj8[?9gQio7--6Bz2",
    OAUTH_REDIRECT_URI : string = "http://localhost:4000/microsoftAuth/callback",
    OAUTH_SCOPES : string = "profile offline_access user.read calendars.read mail.read",
    OAUTH_AUTHORITY : string = "https://login.microsoftonline.com/common/",
    OAUTH_ID_METADATA : string = "v2.0/.well-known/openid-configuration",
    OAUTH_AUTHORIZE_ENDPOINT : string = "oauth2/v2.0/authorize",
    OAUTH_TOKEN_ENDPOINT : string ="oauth2/v2.0/token",
};

module.exports = MicrosoftAuthConfig;