---
title: New features
description: A quick overview of new features in IceRPC compared to Ice.
---

## New protocol with streaming support

IceRPC adds a new protocol named `icerpc` that supports streaming. Streaming allows you to send a stream of bytes or
Slice-defined types with your request or response with no or very little overhead.

The new icerpc protocol runs over multiplexed transports such as QUIC.

## Modular API

IceRPC offers a much more modular API than Ice.

For example, with Ice, most of the invocation logic is implemented by the Communicator, and you can customize
Communicator's behavior through configuration.

With IceRPC, the invocation logic consists of multiple objects that you compose to form an invocation pipeline: you can
include only what you need in this invocation pipeline and you can easily insert your own custom logic in this pipeline.

## Async-only API

Ice's APIs are based on the assumption that async APIs are well-suited for RPCs but hard to use and occasionally slower;
therefore it's necessary to offer synchronous/blocking APIs in addition to the async APIs, for ease of use and possibly
increased performance.

For example, the Slice operation `sayHello` is mapped to two methods on proxies generated by Ice's Slice compiler:
 - `sayHello`, which blocks the caller until the response is received and decoded
 - `sayHelloAsync`, which does not block the caller but returns the response through a task, future or callback
 depending on the language mapping

And as an Ice user, you can choose to call `sayHello` (easy to code but you block the calling thread) or `sayHelloAsync`
(you don't block the calling thread but it's harder to get the response).

IceRPC takes a different, more modern approach: the async/await syntax makes async programming so easy there is no need
to provide a redundant synchronous API. With IceRPC:
 - methods that may take a while because their implementations can wait for IOs are async (e.g. proxy methods)
 - methods that never wait for IOs are synchronous (e.g. string-parsing methods)

Synchronous methods usually complete quickly since they don't wait for any IOs.

## Slice is optional

With Ice, you have to use Slice to encode your request and response payloads, even if you're just sending bytes.

With IceRPC, Slice is optional: the IceRPC core sends and receives requests and responses with byte stream payloads,
and doesn't know how these byte streams are encoded. This allows you to use IceRPC with Slice, or with another IDL, or
with no IDL at all.

## New Slice

IceRPC introduces a completely new Slice compilation model and Slice syntax.

The Ice-Slice (.ice) compilation model is very much like C++, where each Slice file needs to #include the Slice files
with the definitions it depends on. On the other hand, the new Slice (.slice) compilation model is more like C# and
Java: the compilation uses a set of reference files specified as argument to the compiler, and there is no #include
preprocessing directive.

The Slice syntax is also brand new. Ice-Slice (.ice) uses a C-like syntax for parameters and fields, such as:
```ice
struct Person {
    string name;
    TimeStamp dob;
}

interface Finder {
    Person findByName(string name);
}
```

IceRPC's Slice (.slice) uses instead a Rust/Swift-like syntax for parameters and fields:
```slice
struct Person {
    name: string
    dob: TimeStamp
}

interface Finder {
    findByName(name: string) -> Person
}
```