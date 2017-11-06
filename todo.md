# TODO

## [#61 Implement OpenID](https://github.com/pypa/warehouse/issues/61)

- [Authomatic](https://authomatic.github.io/authomatic/)
    + OpenID + Auth1 and 2 providers
    + Integration with Pyramid
    + Saves to session
+ Questions:
    * we'd need to create and store the user information based on the providers
        - that is separate from registration how much do we need to replicate?
    * are passwords applicable?
    * we'd need to auth on the API as well
        - How would that work? the user would have to go through the login flow from twine?
+ Actions:
    * Add login with <Provider> buttons in the UI
    * Add views for logging in through a provider
+ Analysis:
    * `warehouse.account.views` functions `login` and `logout`
        * Logging in `_login_user` would need passed as a session updater to authomatic or called after the actual log in.
        * Logging out invalidates the session and redirects, we would need to call authomatic if the user's logged in through it
