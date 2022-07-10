## Getting Started

1. Configure the `secrets.json` file following the `secrets.example.json` file
2. `npm install`
3. `npm run build`
4. `npm start`
5. Go to http://localhost:3000/

## Documentation

### Why NextJS

For a short project, it's very easy to create a backend + frontend using NextJS.

### Why Tailwind

Simple to setup with NextJS, very customizable. With a bit more time, I would create a /components folder to reuse the most common patterns (buttons, ...).

### Caching & Scaling

The concept of caching is hidden behind the `CacheGateway` interface, that allows to change implementation and infrastructure without changing the rest of the code.

Caching is here is easier, because there is no user input data in the process.

The `FileCache` implementation works well in development and should work when deploying in a single process. It can be replaced by a Redis Cache, or an S3 Cache when deploying in Kubernetes, or in our case on Serverless functions.

We could also improve caching: at this time, all requests made between the cache expiration and the resolution of the first request will all trigger an external API call. We could use a kind of queue or lock to resolve all user requests using a single external API request.

### Loading

I implemented a quick loading system, because it's important to show the user their data state, especially if they are going to reload often. It has some limitations, but going into a more production ready webapp, I would certainly something prod-ready such as `react-query`. We could add an auto reload based on the cache duration after we handled the last problem mentionned above.

### Going further with N2YO API

It's quite easy to sort by the highest Orbital velocity, because it's the same as sorting by the lowest altitude (with the assumption given in the challenge).

The N2YO API provides a way to predict when a satellite will be visible again in the next few days. I didn't have time to implement this, as it needs time to understand how the data could be presented in a way that is helpful to the user.

### With way more satellites

If we had many more satellites to handle, it would require to use pagination in order to not fill the browser with a million items. Considering we are using an external API, if the external API doesn't handle sorting, it means that we should need to load all satellites in our backend, and compute the sorting there. This is not efficient at all and would certainly break.

### Monitoring

- Monitor requests to external API: we want to make sure we don't request too much to keep our app available.
- Monitor cache hits: it can help us adjust the cache duration to balance the "freeze" of user data versus the numbers of requests to the external API

It's quite difficult to use Prometheus here if we imagine that this is going to run in a Serverless environement.

### Testing

Of course, with the project groing I would add testing focused on these points:

- Use case testing on the front end: ensuring the user receive reloaded data.
- Testing data formatting in the API
- Testing the `FileCache` thoroughly

However I wouldn't test the external API, or add a `3rd party` test that would not run automatically.