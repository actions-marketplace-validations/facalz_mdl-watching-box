<div align="center">
    <img src="https://raw.githubusercontent.com/facalz/assets/main/facalz-npm/mdl-watching-box/image.png" alt="image">
    <h3>📺 mdl-watching-box</h3>
    <p>Webscrap to show what you are watching in MyDramaList</p>
    <p><sub>Don't forget to leave a ⭐ if you found this useful.</sub></p>
</div>

---

## Installation

```sh-session
//npm
npm install mdl-watching-box

//yarn
yarn add mdl-watching-box
```

## Prep work

1. Create a new public GitHub Gist. (<https://gist.github.com/>)
2. Create a token with the `gist` scope and copy it. (<https://github.com/settings/tokens/new?scopes=gist>)

## Example usage

```js
const main = require('mdl-watching-box');

const {
    GIST_ID, // Get this from the URL of your public Gist (e.g., https://gist.github.com/facalz/123456)
    GH_TOKEN, // Your secure GitHub token with gist scope
    USER, // Your MyDramaList username
    TITLE = '📺 Currently Watching | MyDramalist' // Optional: customize the Gist title
} = process.env;

main(gistId, githubToken, user, title);
```

## Environment secrets

- **GIST_ID:** The ID portion from your gist url: https://gist.github.com/facalz/`c7ecf280a4fc2214a85cef64896e020f`
- **GH_TOKEN:** The GitHub token generated above.
- **USER:** Your user in [MyDramaList](https://mydramalist.com).
- **TITLE (Optional):** Allows you to customize the title displayed for your Gist. Defaults to "📺 Currently Watching | MyDramalist".

## Donations

Feel free to use the GitHub Sponsor button to donate towards my work if you think this project is helpful.