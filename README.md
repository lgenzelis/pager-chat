# Pager Take Home Assignment

This repo implements a `socket-io` based Chat client.

Production version can be accessed [here](https://lucas-chat-pager.web.app).

### Future improvements

Currently we only display up to 100 messages on the chat box, to avoid performance issues on low end devices.
This is far from ideal. We should consider using a virtualized list instead of trying to render all the messages at once.
Moreover, a virtualized list would help avoid poor network performance when there are too many GIFs.
