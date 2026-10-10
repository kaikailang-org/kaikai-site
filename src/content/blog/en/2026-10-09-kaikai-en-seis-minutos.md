---
title: "kaikai in six minutes"
date: 2026-10-09
description: "A short video that walks through what sets kaikai apart: algebraic effects, structured concurrency, kinds, contracts, and working with agents."
slug: kaikai-in-six-minutes
titleNote: "This post was originally written in Spanish. The English translation was generated with the help of AI."
---

If you want to know what kaikai is about without reading a whole book, this video tells it in under six minutes.

<video controls preload="metadata" playsinline width="1920" height="1080" poster="/blog/kaikai-en-seis-minutos/poster-en.jpg">
  <source src="/blog/kaikai-en-seis-minutos/kaikai-en.mp4" type="video/mp4" />
  Your browser cannot play the video. You can <a href="/blog/kaikai-en-seis-minutos/kaikai-en.mp4">download it</a>.
</video>

## What you will see

- **The flavor of the language.** Immutable data, types defined by their cases, and pipes that announce their intent.
- **Algebraic effects.** A function's signature says whether it logs, keeps state, or can fail, and the caller decides how each one is resolved.
- **Tests without mocks.** Even an actor's mailbox can be replaced in a test, which finishes instantly and always gives the same result.
- **Structured concurrency.** Fibers are born inside a block and none of them outlives it.
- **Kinds.** Units of measure, currencies, and permissions that the compiler checks and that cost nothing at run time.
- **Contracts.** A function's conditions are part of its signature, and the compiler proves the ones it can.
- **Working with agents.** A typed hole lets the program compile with pieces still pending, and the compiler tells the agent what it expects in each one.

## Where to go next

If the video left you wanting to try it, [install kaikai](/en/get-started) with one line, look at the [examples](/en/examples), or read the [book](/en/book), which is complete online.
