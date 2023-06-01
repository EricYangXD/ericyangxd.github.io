---
title: Mock data
author: EricYangXD
date: "2023-05-16"
meta:
  - name: keywords
    content: jsonplaceholder,mockjs,fakeimg.pl
---

## jsonplaceholder.typicode.com

```js
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((json) => console.log(json));

// response:
// {
//   "userId": 1,
//   "id": 1,
//   "title": "delectus aut autem",
//   "completed": false
// }
```

1. JSONPlaceholder comes with a set of 6 common resources:

- `/posts 100 posts`
- `/comments 500 comments`
- `/albums 100 albums`
- `/photos 5000 photos`
- `/todos 200 todos`
- `/users 10 users`

2. All HTTP methods are supported. You can use http or https for your requests.

- `GET /posts`
- `GET /posts/1`
- `GET /posts/1/comments`
- `GET /comments?postId=1`
- `POST /posts`
- `PUT /posts/1`
- `PATCH /posts/1`
- `DELETE /posts/1`

## Mockjs

## fakeimg.pl

```html
<img src="https://fakeimg.pl/300/">
<img src="https://fakeimg.pl/250x100/">
<img src="https://fakeimg.pl/250x100/ff0000/">
<img src="https://fakeimg.pl/350x200/ff0000/000">
<img src="https://fakeimg.pl/350x200/ff0000,128/000,255">
<img src="https://fakeimg.pl/350x200/?text=Hello">
<img src="https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto">
<img src="https://fakeimg.pl/350x200/?text=World&font=lobster">
```