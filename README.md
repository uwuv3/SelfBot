<h1>Selfbot</h1>

<details><summary>How to start project</summary>

<h2>First : Start the install.bat or go the shell and run the command;</h2>

```bat
npm install
```

<h3>After : Start the start.bat and wait or go the shell and run the command;</h3>

```bash
node .
```

</details>

<details>
<summary>How to get token</summary>
<strong>Copy code to console Discord [Ctrl + Shift + I]</strong>

```js
window.webpackChunkdiscord_app.push([
  [Math.random()],
  {},
  (req) => {
    for (const m of Object.keys(req.c)
      .map((x) => req.c[x].exports)
      .filter((x) => x)) {
      if (m.default && m.default.getToken !== undefined) {
        return copy(m.default.getToken());
      }
      if (m.getToken !== undefined) {
        return copy(m.getToken());
      }
    }
  },
]);
console.log("%cWorked!", "font-size: 50px");
console.log(`%cYou now have your token in the clipboard!`, "font-size: 16px");
```

Creator : <img src="https://cdn.discordapp.com/emojis/889092230063734795.png" alt="." width="16" height="16"/> [<strong>hxr404</strong>](https://github.com/hxr404/Discord-Console-hacks)
</br>

<h3></h3>
<img src="https://cdn.discordapp.com/attachments/1008726715469660251/1074989693462134794/image.png">

</details>

<strong><h3>Required node</h3></strong>
<img alt="node-current" src="https://img.shields.io/node/v/discord.js-selfbot-v13?style=plastic">
