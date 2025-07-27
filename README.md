# Flow World

A global yoga experience

## Project Requirements

* [x] Global flow, a randomly selected flow that everyone can do together with a chat. Each pose is held for 42 seconds.
* [x] This is a zero-stress website. We don't give the user any opportunities to fail.
* [x] NO LOGINS/ACCOUNTS. LOGINS ARE STRESSFUL.
* [x] No ego, no vanity. No usernames, no reputation, no stored identities. 
* [x] Yoga pose displays on screen
* [x] pose name displays on screen
* [x] Chat displays on screen
* [x] Flow randomizer creates random flows
* [x] SSE global flow, chat
* [x] htmx chat POSTs
* [x] Pose name is read aloud by TTS
* [x] Orbit around the character by default
* [x] Moderated chat
* [ ] chat history
* [ ] Flows stored in db
* [ ] users can create flows
* [ ] Flow upvoting
* [ ] Pose upvoting
* [ ] GLOBAL flow session on the main page.
* [ ] Bookmarkable flows
* [ ] Difficulty slider, which shows alternative poses. For example, advanced would show three legged dog, Intermediate would show downdog, while beginner would show puppy pose. This lets all participants be doing approximately the same pose at the same datetime.
* [ ] hypermedia
* [ ] cute 3d avatar doing the global poses
* [ ] Three.js 
* [ ] Optional ambient music (inspired by https://ambient.garden/)
* [ ] flow creator
* [ ] pose creator
* [ ] share your flow via [cool URL](https://www.w3.org/Provider/Style/URI)
* [ ] Proof-of-Work antispam
* [ ] No burdened 3rd party software licensing
* [ ] basic camera controls
* [ ] tipping with LN/Zaps
* [ ] tipping with Paypal
* [ ] random nanoid stored in localStorage.
* [ ] random nanoid maps to generative sacred symbol
* [ ] achievements
* [ ] cosmetic unlocks
* [ ] i18n

## attribution

Soldier by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/9wbCF0iWpu)
Hyper Casual Character by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/6kFNcL9OnO)
Animated Human by Quaternius (https://poly.pizza/m/c3Ibh9I3udk)
Stylized Character by Zsky [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/tVqkTeQhCO)

## doki-doki ideas

* [ ] the human.glb model is a 3d model version of the author. Model made by https://www.fiverr.com/harunyiit/do-retro-style-ps1-like-3d-models
* [ ] there's a human.glb model of temphuibis too
* [ ] user-selectable human.glb models

## monetization ideas

* [ ] people can donate to get themselves immortalized and added to the app as a player selectable model


## name ideas

* forever.yoga
* flow.world


## Gamification

Flow World is not a game. It is a celebration of collective presence rather than competition. "Your presence itself is the reward."



### Impermanence as a Feature 

There are no logins or identies on flow world, only Bindu. This Bindu is a drop of your awareness, fleeting and radiant.

* [ ] Bindu gain 1 effort Point per every pose present (numbers are hidden from UI)
* [ ] lotus flower grows and glows with points
* [ ] Bindu vanish when reaching 1000 points

### Compassion and Connection

* [ ] You can send send “metta” (loving-kindness) to others.


### Humility

* [ ] The app explicitly avoids rankings to cultivate humility and inclusivity.

### Phrases

* [ ] Our practice is not isolated; it’s part of a web of compassion and awakening.
* [ ] Achievements are gifts, not just personal accomplishments.


### domains

multiplayer.yoga SELECTED
flowworld.yoga SELECTED, then deprecated (maybe we can A-B test using this)
markov.yoga $2
42second.yoga $2
alternative.yoga $2
computer.yoga $2
voyage.yoga $2
temp.yoga $2
player.yoga $2
updog.yoga $2
chain.yoga $2
internet.yoga $52
bridge.yoga $2
sphinx.yoga $2
brake.yoga $2
break.yoga $2
catcow.yoga $2
yogatime.yoga $2
timeto.yoga $2
time2.yoga $2
hold.yoga $2
breakfor.yoga $2
forevertogether.yoga $2
break4.yoga $2
flowww.yoga $2


#### selected domain

flowworld.yoga


### music commission

Hi Temph, I'm building an interactive yoga website and I need some ambient music. Low bpm, calming music to help people meditate and focus. I want your own retro futuristic nature type spin on it. The website works as follows. There's a mystical dark background with a 3d model of a person in the foreground and they hold a pose for 1 minute. Then after that, they switch to a different pose and hold for another minute. The website shows the same exact pose to every visitor at the same time, so it's like all the visitors from around the globe are doing the same yoga class together. And there's going to be a chat so everyone can connect. There's no start or end, so everyone can join at any time and hop into the session. Anyway, that's my project idea I'm working on. Let me know if you can make a track for that. Thank you

Thanks Temph, I really appreciate your help on this. I'm in no rush so please take the full two weeks-- I know the phrase, "You can't rush art" is so true. I'm really excited about this project, it's one that's been floating around in my head for a few years. I started doing yoga stretches every day starting in 2019. Just a few minutes a day but it made me feel a lot better. I started to wonder if I could make yoga an online multiplayer game lol. I follow youtube yoga tutorials and started wanting more connection than what the video can give me, but I think an in-person yoga class requires too much vulnerability. So the yoga website is a middle ground and that's where the idea came from. It's an experiment to see if I can help people by providing yoga flows for focus/relaxation/strength and an optional chat for them to connect. And I've been watching your videos lately and been thinking of you, so I got the idea to see if you could help with the project with an original track. So that's where we are now lol. Happy to hear you'll give it a shot. I look forward to hearing what you come up with. 😀 Let me know if there's anything you need from me.


## Dev notes

### create db migration

    dotenvx run -f .env.development.local -- npx prisma migrate dev --name "add xyz"


## Reference Photos (for posing in dust3d)

- [ ] mountain  
- [x] standingForwardFold  
- [x] ragdoll  
- [x] plank  
- [x] sidePlankR  
- [x] sidePlankL  
- [x] supportedSidePlankR  
- [x] supportedSidePlankL  
- [x] wildThingR  
- [x] wildThingL  
- [x] halfwayLift  
- [x] catCow  
- [x] downDog  
- [x] threeLeggedDogL  
- [x] threeLeggedDogR  
- [x] warriorOneL  
- [x] warriorOneR  
- [x] seatedForwardFold  
- [x] seated  
- [x] upDog  
- [x] cobra  
- [ ] lizardL  
- [ ] lizardR  
- [ ] pigeonL  
- [ ] pigeonR  
- [ ] corpse  
- [ ] happyBaby  
- [ ] staff  
- [ ] kneesToChest  
- [ ] runnersLungeR  
- [ ] runnersLungeL  
- [ ] bridge  
- [ ] sphinx  
- [ ] triangleL  
- [ ] triangleR  
