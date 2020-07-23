
Couple of **T**ypescript **h**igher **o**rder functions for use with promise based network or other IO apis.

`npm install promises-tho`

Packaged using @pika/pack for CommonJS, ES Module & deno compatible package formats. 

Why use this? 

I got tired of writing  `while(--tries) await something ` type loops and
other on the fly stuff, but here's why you might want to use it:  

- Keeps type signatures if you are using TypeScript. 
- Sensible defaults for use in browser scenarios, where concurrent requests are limited.
- Easily tweakable options, use it in nodejs/server side too.
- Just a few simple, composable functions
  - `retryWithBackoff` - Wraps a promise returning function with retries and backoff. 
  - `batch` - Splits a large group of operations into batches 
  - `batchWithProgress` - Splits a large group of operations into batches while returning intermediate results. 


Uses https://www.npmjs.com/package/debug for logging, using the `promises-tho` namespace. enable `promises-tho:*` in your environment to see retries, timings, delays etc.  

See [src/](src/) for JsDoc full options & defaults.  


Examples: 

## Retry with backoff

```typescript 

import { retryWithBackoff } from "promises-tho";

// some promise returning function. 
const getFoo = (id: number): Promise<Foo> = { /*...*/ };   

const getFooWithRetries = retryWithBackoff(getFoo); 

// getFooWithRetries will have the same type signature as the original, (id:number) => Promise<Foo>
const foo = await getFooWithRetries(myFooId);

```

## Batching

```typescript 

import { retryWithBackoff, batch } from "promises-tho";

// some promise returning function. 
const getFoo = (id: number): Promise<Foo> = { /*...*/ };   

const getFooWithRetries = retryWithBackoff(getFoo); 

const getFoos = batch(getFooWithRetries); 

// getFoos will have the type signature: (ids: number[]) => Promise<Foo[]>
const foo = await getFoos(myFooId);

```

Settings some options:

```typescript 

import { retryWithBackoff, batch } from "promises-tho";

// some promise returning function. 
const getFoo = (id: number): Promise<Foo> = { /*...*/ };   

const getFooWithRetries = retryWithBackoff({ tries: 7, pow: 3, startMs: 250 }, getFoo); 

const getFoos = batch({ batchSize: 4, batchDelayMs: 150 }, getFooWithRetries); 

// getFoos will have the type signature: (ids: number[]) => Promise<Foo[]>
const foos = await getFoos([1,2,3,4,5,6,7,8,9]);

```

Options shown are the default. Will result in `getFoo` called in batches of 4, with a 150ms delay between batches. 
If any of the `getFoo` call fails, it will be re-tried up to max of 7 times over around 1 minute. If any of the
calls to `getFoo` exhaust their retries, the entire batch will fail. See notes below on error handling if you need 
different behaviour.  


Short version: 

```typescript

const getFoos = batch(retryWithBackoff(getFoo));

const foos = await getFoos(myFooIds);

```


## Batching with intermediate results



```typescript

import { batchWithProgress, retryWithBackoff } from "promises-tho";


// assuming getSomething returns Promise<Foo>

const getSomethingBatched = batchWithProgress(retryWithBackoff(getSomething)); 

let job = {
  pending: [1,2,3,4,5,6,7],
  completed: [] as Foo[],
  batched: 0 // just to make compatible type for below, alternatively use type annotation with let.    
}

while (job.pending.length) {
  
  // Execute the next batch (4 items by default)
  job = await getSomethingBatched(job);

  if (job.batched) {
    // .batched is the number of results appended to the completed array in the last iteration.
    // get the last N from the `.completed` array by passing a negative index to slice, 
    const latestThingsWeGot = job.completed.slice(-job.batched); 
    // do something with the results from the latest iteration, maybe diplay in UI 
    // or some start some other dependent async work. 
  }
}

// finished, so 
// job.pending.length === 0
// job.completed = [...all the results...]

```

You are free to modify the `completed` array if you want, it just gets appended to during
iteration, the `batched` property will be the number of items appended to it during the last iteration.  
None of the arrays passed in will be mutated, copies will be made at each iteration, and a copy of the 
job object will be returned.
A delay will be applied between iterations (default 150ms), starting only with the 2nd batch.


NOTE: `retryWithBackoff` will wrap a function with any number of arguments, but the batching functions
will only wrap a function with **exactly one argument** . This is the most common case and makes for nicer 
ergonomics. If you need to, you can make a small wrapper to your function to take only one argument.


## Error handling  

In the above examples, the entire batch will fail if the retries are exhausted for any individual item. 
Depending on your use case, you may not want this. The solution is pretty simple, just wrap the function 
with something that returns a `Foo|null` or another default value.

```typescript

const getFooWithRetries = retryWithBackoff(getFoo)

// Will have signature (id: number) => Promise<Foo|null>
const maybeGetFoo = (id: number) => getFooWithRetries(id).catch(e => null);

// Will have signature (ids: number[]) => Promise<(Foo|null)[]>
const getFoos = batch(maybeGetFoo); 


```

There is a tiny helper function for this included in the library, `softFailWith` . Generally you shoudn't be using this but there
cases where it makes sense, if you are batching a lot of operations and are ok with some failing. 

```typescript

import { retryWithBackoff, softFailWith, batch } from 'promises-tho';

const maybeGetFoos = batch(softFailWith(null, retryWithBackoff(getFoo)))


```



TODO: discuss correct way handle verifying read/write operation (so Foo is really a Foo, or your write was really succeful). TLDR,
this should be taken care of in `getFoo` or whatever promise based operation you are wrapping. If you expect to get invalid responses that you don't want to retry, your `getFoo` method should model that and return Promise<Foo|InvalidResponse> or similar. 
NOTE: this is **not** the same as retries being exhausted and the above `softFailWith`. 

Both these types of error handling are app and use-case specific. 








