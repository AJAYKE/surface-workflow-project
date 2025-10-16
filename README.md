The following email is to explain the assignment and what I did.

## MAIN SUBMISSION: https://surface-ajay.vercel.app/
## HTML to test the tag: 
    (Index.html)[https://github.com/AJAYKE/surface-workflow-project/blob/main/public/index.html]
## Code: https://github.com/AJAYKE/surface-workflow-project/

Firstly, thank you for this assignment. I got to know about the Identity graph. It is really fascinating. I did not know about that till now. Secondly, working on building a bare minimum version of it felt good. I will read more about it.

The following is the explanation for how and why I wrote the code and the technical and design decisions I have taken.

### The Logical Requirements and Flow:
1. The clients come to this page, and they get a script which they will add to their website.
2. Client updates their website code to send the events to us for the events they want to be tracked.
3. When the end user starts using the client's website, it generates events, our server consumes the events and shows them to the client.

### What did I do:
1. I removed the queue logic, as it felt intimidating at first glance, and kept it simple to have just one simple JS script tag. (Product Decision)
2. I did not include the syntax highlighter for the code. Earlier in the design, there were multiple lines of code, so the syntax highlighter makes sense. Now, since it is only one line, I did not want to add another package (Product and Technical).
3. And along with the script, we have a tag ID, and all the events for that client are tracked through that tag ID.
4. You can use this html file to test the events tracking, update the header with your script.
5. When the website is loaded for the first time, when we get the first event that is considered as a successful connection, and the subsequent event tags can be loaded with the Test Tag button.
6. Initially, we try to treat the user as an anonymous user and assign a UUID once we get the identity event. We resolve the user, which you can see while the events are getting populated.

### Technical and Code Structuring:
1. Firstly, I like Tailwind CSS for how it makes development easy, but I hate it coz it clutters my code. I remember looking at some open source codebase where they moved all the styles to an object, and I loved it. Separating CSS powers and my clean core business logic. That is how my code will be.
2. As you might think, I did not put all the status and updates in enums or some global variables. I would like to not complicate my codebase, unless it is used across multiple components. I try to keep it simple and dumb. That is the second principle I followed.
3. I just kept two simple backend APIs, one post to dump the events and one get to load the events.
4. I used polling instead of websockets, and the reasons are simple. As the surface is a B2B and has only a few hundred users, it is not ideal to complicate the code with sockets, so I kept a simple GET request with paginated polling. This also makes our life easier with local testing and integration testing too.
5. For the CSS, I did not check in detail for every nook and corner. I just focused on getting the skeleton right.
6. And I also want to mention that I used chatgpt to complete it faster and understand things faster.

### Deployment:
1. Frontend and Backend on Vercel
2. Database on Neon
