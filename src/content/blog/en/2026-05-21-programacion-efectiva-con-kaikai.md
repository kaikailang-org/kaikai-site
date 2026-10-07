---
title: "Effective Programming with kaikai"
date: 2026-05-21
description: "Introducing kaikai: where the name comes from, a first program, algebraic effects, pipes, and why the language is built with agents in mind."
slug: effective-programming-with-kaikai
titleNote: "This post was originally written in Spanish. The English translation was generated with the help of AI."
---

> *"Simplicity is prerequisite for reliability."* — Edsger Dijkstra

For many years I've been chewing on the idea of a functional, general-purpose language that I could actually use in my personal projects and even at work (we'll see if I pull that off). At university I learned to build compilers, and I fell in love with programming language design. I also designed domain-specific languages to solve real problems.

One day, after a conversation with a friend, I came to the conclusion that AI could not only help me finish my project, but that the models also have an advantage I don't: they have read every paper in the world on compilers and language theory. That power had to be put to use.

I set out to build, in one month and using an agent, a complete compiler for a language I've been designing for more than 10 years.

Was the experiment a success? I think so, but there are nuances and lessons that I'll leave for future posts. Forgive me for telling the whole story in parts, but first things first, and right now I want to introduce the language.

In 2017 I gave a talk called "Esos raros lenguajes nuevos" ("Those Strange New Languages") where I explain, in a fun way, why there are so many programming languages; [the video is on YouTube](https://www.youtube.com/watch?v=Hp9HwLPYkjI) (in Spanish).
There I introduced Ogú, a language I designed and which is really a prototype of the language I'm presenting today.
The story of how I put that compiler together is written up in the article [Fake it till you make it](https://lnds.net/blog/lnds/2017/03/01/fake-it-till-you-make-it/) (in Spanish), on my personal blog.

Today I'm going to show you kaikai, the language that captures everything I think a programming language should have in the agentic era.

Let's talk about the name first.

## Kaikai

![kaikai logo](/kaikai-logo.svg)

Kaikai is a Rapa Nui game. According to [SIGPA](https://www.sigpa.cl/ficha-elemento/kai-kai-de-rapa-nui):

> It is a practice in which a figure or "ideogram" is formed by interlacing strings between the fingers of the hands, with the help of the mouth or feet. It is associated with a recited story called pata'u ta'u. Through this tradition, knowledge about many areas of life is passed on, such as the arts, agriculture or fishing, among others.

It's the string game: cat's cradle in English, or ayatori in Japanese. But in Rapa Nui it is bound up with oral tradition and poetry.

At first I was thinking of the kai kai of Mapuche mythology, but when I discovered the Rapa Nui kaikai it clicked immediately, because it reminded me of Rich Hickey's famous talk, ["Simple Made Easy"](https://www.infoq.com/presentations/Simple-Made-Easy/).

In the talk, Hickey discusses the difference between simple and complex, citing the etymological origin of the terms. At its root, "complex" means "to be braided together". "Simple", on the other hand, implies a single fold, or a single strand of a braid.

And that's what kaikai is: a game in which, with just one string and through skillful, simple movements, you build complex figures.

## My first program

In the talk I mentioned, I say that the first thing I ever learned to program was a converter between degrees Celsius and Fahrenheit. Well, to keep up the tradition, and because it's the only thing I know how to program, here is what it looks like in kaikai:

```kaikai
# temperature converter

unit F
unit C

const f2c : Real<F/C> = 9.0<F>/5.0<C>
const c2f : Real<C/F> = 5.0<C>/9.0<F>

fn celsius_to_fahrenheit(c : Real<C>) : Real<F> = (c * f2c) + 32.0<F>

fn fahrenheit_to_celsius(f : Real<F>) : Real<C> = (f - 32.0<F>) * c2f

fn main() {
    let c = 35.0<C>
    let f = celsius_to_fahrenheit(c)
    println("#{c} -> #{f}")
    let f = 100.0<F>
    let c = fahrenheit_to_celsius(f)
    println("#{f} -> #{c}")
  }
```

This little program introduces several features of kaikai.

Comments start with `#`. What follows are two definitions of units of measure, F and C. For example, `unit F` defines the unit F, to represent degrees Fahrenheit.

This is a feature I took from F#, because it gets rid of a whole pile of errors.

Think of a fintech application where you have to convert from euros to dollars: if you mix currencies, it can be a disaster. Units of measure (UoM) extend the type system (technically, they add a "kind" to the type).

If NASA had used kaikai, the [Mars Climate Orbiter](https://en.wikipedia.org/wiki/Mars_Climate_Orbiter) failure would not have happened.

Apart from UoM, kaikai doesn't look very novel. But what if I told you that this program is showing algebraic effects in use and you haven't even noticed?

## Algebraic effects

Effects what!

![wut](/blog/programacion-efectiva-con-kaikai/wut.gif)

I don't want to scare you. It's actually a very simple concept, but one with a lot of theory behind it, and kaikai is one of the few languages that implements this feature.

In [Revelaciones](https://lnds.net/blog/lnds/2015/10/01/revelaciones/) (in Spanish) I explain, in a mystical way, like an almost religious epiphany, that every useful program must interact with the world. That breaks the purity that functional languages promise.

The path taken by the creators of pure functional languages like Haskell was to bring in category theory: something fairly complicated, which seeks to encapsulate the effects that happen in a program.

When you write to the console, you are producing a side effect. When you write to the database, or when you read from the database, you are under the influence of an effect.

In that post I explained that there are 4 horsemen that affect our programs:

- Failure: your programs can fail for thousands of reasons; this is traditionally handled with exceptions (try/catch).
- Configuration: the behavior of your program is affected by the configuration of the environment it is running in.
- Uncertainty: a pure function maps one input to a single output. That is known as referential transparency. But there are non-deterministic functions, because the result depends on other factors: the result of a database query, the answer from an LLM, etc.
- Destruction: this is the most common kind of effect; you print to the console or to a printer, send an email, write one file, delete another, etc.

For kaikai, all of these are effects. A `println` is an effect. In particular, it is part of the `Stdout` effect (which in turn is part of an effect that groups them: `Io`).
Reading environment variables is part of the `Env` effect. To handle an exception you use the `Fail` effect.
For concurrency you use the `Fiber` effect or the `Actor` effect. And in other extensions outside the standard library you have things like the `Db` effect.

How do you declare an effect? Let's see:

```kaikai
effect Log {
  log(msg: String) : Unit
}
```

And you use it like this:

```kaikai
fn greet(name: String) : Unit / Log {
  Log.log("hello, " ++ name)
}

fn main() {
  handle {
    greet("kaikai")
    greet("world")
  } with Log {
    log(msg, resume) -> {
      println("[INFO] " ++ msg)
      resume(())
    }
  }
}
```

What happens here is that you must either handle the effect or declare that you are not going to handle it, and you assume that whoever uses your function will handle it.

In this example, `greet` declares that it returns nothing (type `Unit`) and that it has an effect inside (this is declared after the slash '/'). The function's signature declares that it calls an effect, but does not handle it.

The `main` function takes care of handling `Log` using the `handle ... with` construct.

The beautiful thing about effects is that they bring all these concepts together into one. Concurrency, exceptions, logs, input/output, etc. They are all effects. You don't have to learn different concepts or different language constructs to handle each case.

Think of `async` in JavaScript or Rust, and other languages. One thing that happens is that when you mark a function as `async`, it contaminates the whole chain, and you have to start putting `async` or `await` everywhere; besides being awkward, it starts to lose its meaning. In kaikai this is just one more effect, the syntax goes in the signature, and you handle it where it belongs, not somewhere else.

Effects can, of course, define default handlers to improve their ergonomics. That's why you can use `println` without having to write a `handle` block.

## Pipes, pipes everywhere

Kaikai has the `|>` operator from Elixir and other languages, but it also has other extensions. The `|` operator is a map, `||` is a flatmap, and `|?` is a filter. This is a whim, but it's a useful one.

Let's look at an example:

```kaikai
fn up_to_loop(i: Int, n: Int, acc: [Int]) : [Int]
  = if i > n { list_reverse(acc) } else { up_to_loop(i + 1, n, [i, ...acc]) }

fn up_to(n: Int) : [Int] = up_to_loop(1, n, [])

fn square(n: Int) : Int = n * n

fn divisors(n: Int) : [Int] = [1, n]

fn is_even(n: Int) : Bool = n % 2 == 0

fn main() {
  let total = up_to(4)                # [1, 2, 3, 4]
    | square                          # [1, 4, 9, 16]      (map)
    || divisors                       # [1, 1, 1, 4, 1, 9, 1, 16] (flat-map)
    |? is_even                        # [4, 16]            (filter)
    |> list.sum                       # 20                 (apply)

  println("total=#{total}")
}
```

This lets you write less, and in my opinion it is sometimes clearer than writing `|> filter`.

Oh, and `|>` lets you choose where the argument is going to go. For example:

```kaikai

fn foo(x: Int, y: Int, z: Int) : Int = ?

fn main() {
   2 |> foo(3, _, 4)
}
```

Here the value 2 is passed in the position marked by `_`.

By the way, you can make your own type support pipes if you implement the functions `map`, `flat_map` and `filter`.
Pipes are a special case of a protocol.

Protocols are similar to interfaces or traits. In kaikai, protocols are closer to Go's interfaces.

One more thing: the `?` is a "hole", a feature that goes in the direction of helping AIs write kaikai code.

## Agent Friendly

Holes are a mechanism with a long history, one of the most recent proposals being the paper by Cyrus Omar, Ian Voysey, Ravi Chugh and Matthew Hammer, "Live Functional Programming with Typed Holes", from 2019.

You can define a function like this:

```kaikai
fn circle_area(r : Real<cm>) : Real<cm> = ?area_in_cm_to_be_defined
```

Here you have left a hole called `?area_in_cm_to_be_defined` that you are going to write later (or ask an agent to write for you). The program will compile and, at runtime, it will fail when it reaches the hole.

Apart from holes, kaikai helps agents by producing ergonomic errors, and you can run analyses with JSON output. It also has commands like `kai info --json`.

You can tell your agent to do this:

```
kai info syntax --json
```

And it will have information about kaikai's syntax (the version without JSON you can read yourself).

If you want to know about effects you run: `kai info effects`.

There are more uses for holes, and other agent-friendly features, that you can explore and learn on your own in the book.

Yes, there's a book!

## The book

Of course, the launch of the language includes more than the compiler. That is part of the experiment.

Kaikai comes into the world with a website, [https://kaikai-lang.org/](https://kaikai-lang.org/en/), and a book you can download right there (in Spanish and English).

The book was written by an agent and I acted as editor; the prologue I wrote by hand (just like this post).

It is also born with some basic packages: [ahu](https://github.com/kaikailang-org/ahu), a framework for building concurrent applications; [kohau](https://github.com/kaikailang-org/kohau), a database driver for sqlite (and, in the future, postgres); and [henua](https://github.com/kaikailang-org/henua), a framework for building DDD applications (it implements a Repository and an EventBus).

And, of course, plugins for Neovim and Visual Studio Code (for those who keep suffering with that thing).

Yes, all of it built with agents working in parallel. But that is the third part of the story.

## What comes next?

I believe AIs and humans are going to need new languages. Right now there is a trend toward using Rust because AI makes it possible, because the complexities of that language can be dealt with. But, in my opinion, there is room for languages as powerful as Rust but not as complicated. There are features of kaikai that rival Rust, which for lack of space I can't lay out here, but which I'll tell you about later on.

Well, this is the official launch of kaikai. Now you have to help me, because it isn't ready for production. There are still several improvements to implement, but you can already use it to experiment, to create frameworks and libraries, and to validate that it is possible to use kaikai in production. If you find something, or want to know whether we will support some feature, open an issue on GitHub and I'll see what can be done.

I ask you to spread the word. I'll take care of promoting it among colleagues and friends, and of course in the English-speaking tech sphere too, because kaikai is for the whole world. And I believe it is a novel contribution.

If you like it, you can support me by spreading the word, by using it, and by contributing to the side projects I'm already preparing. Soon I'll publish documents explaining how to collaborate and contribute to kaikai in a way that lets us build a community that makes the language grow.
