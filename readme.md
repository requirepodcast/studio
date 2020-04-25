# Require Podcast's render server

After creating a podcast episode, we always need to publish it on YouTube too. Because of very long duration of videos, the render takes up to 3 hours, and completly prevents me from using my computer. That's why I decided to create a server, that will automatically generate and render our YouTube videos.

### Plans

- [x] Basic layout of background, text and logo
- [x] Create a render script, that given the audio file and title, will generate full youtube podcast episode
- [ ] Create a REST API, to interact with the renderer
- [ ] Implement automatic YouTube publishing
