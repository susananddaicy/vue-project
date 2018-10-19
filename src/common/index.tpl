<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edag">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
</head>
<body>
  {{#if body}}
  {{{body}}}
  {{else}}
  <div id="app">
  </div>
  {{/if}}

  <script defer src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</body>
