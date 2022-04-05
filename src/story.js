import { createTicket } from './tickets'
import { countActiveBugs, countCompletedFeatures } from './task'
import { makeFeatFlavour, makeBugFlavour } from './flavour'
import { addWorker, stopAllWorkers } from './workers'
import { addComp, addType, addAssi } from './rewards'
import { rand } from './utils'

let mayhemInterval

let maxBugs = 0
const checkGameOver = () => {
  const bugs = countActiveBugs()
  if (bugs >= 10) {
    stopAllWorkers()
    clearInterval(mayhemInterval)
    createTicket({
      type: 'Task',
      size: 32,
      onPlan: () => window.location.reload(),
      description: `<strong>Game Over</strong><br><br>You managed to implement <strong>${countCompletedFeatures()} features</strong> before inevitably losing to the overwhelming amount of bugs in your product.<br><br><em>Play again?</em>`,
    })
  }
}
let meanSizeIx = 1.4
const getRandomSize = () => {
  meanSizeIx += 0.025
  const offset = Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3)
  const sizeIx = Math.floor(meanSizeIx + offset)
  const ix = Math.max(0, Math.min(sizeIx, 5))
  return [1, 2, 4, 8, 16, 32][ix]
}

let bugChance = 0.2
let devsLeft = 6
let devTimer = 25
const createRandomTicket = () => {
  bugChance += 0.005
  devTimer -= 1
  if (devsLeft > 0 && devTimer <= 0 && Math.random() < 0.2) {
    devsLeft--
    devTimer += 25
    createTicket({
      type: 'Task',
      description: 'Hire a new developer to your team',
      size: devsLeft > 5 ? 8 : devsLeft >= 4 ? 16 : 32,
      onDone: addWorker,
    })
  } else if (Math.random() < bugChance) {
    createTicket({
      type: 'Bug',
      description: makeBugFlavour(),
      size: getRandomSize(),
    })
    checkGameOver()
  } else {
    createTicket({
      type: 'Feature',
      description: makeFeatFlavour(),
      size: getRandomSize(),
    })
  }
}
let maxTokens = 5
let inDelay = 4
let outDelay = 8
let tokens = Math.ceil(Math.random() * maxTokens)
let inTimer = inDelay
let outTimer = 1 + Math.random() * 3

const sprinkleChaos = () => {
  // console.log({ tokens, meanSizeIx, bugChance, maxBugs })

  inTimer -= 0.2
  if (inTimer < 0) {
    inTimer = inDelay
    if (tokens < maxTokens) {
      tokens++
    }
  }
  outTimer -= 0.2
  if (outTimer < 0) {
    outTimer = Math.random() * outDelay
    if (tokens > 0) {
      tokens--
      createRandomTicket()
      maxTokens += 0.034
      inDelay -= 0.018
      outDelay -= 0.036
    }
  }
}

export const startMayhem = () => {
  mayhemInterval = setInterval(sprinkleChaos, 200)
}

const events = [
  {
    pause: true,
    tickets: [
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
    ],
  },
  {
    delay: 1,
    pause: true,
    ticket: {
      type: 'Task',
      size: 2,
      description:
        "That took far too long! Upper management is <em>not happy</em> at all.<br><br>Let's increase our performance rating by prioritising this task next:<br><strong>Hire an extra developer to the team</strong>",
      onDone: addWorker,
    },
  },
  {
    delay: 1,
    pause: true,
    tickets: [
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
      { type: 'Feature', description: makeFeatFlavour(), size: 2 },
      { type: 'Bug', description: makeBugFlavour(), size: 2 },
    ],
  },
  {
    delay: 1,
    pause: true,
    tickets: [
      {
        type: 'Task',
        size: 1,
        description:
          "Much better! This is a tough job, so don't forget to make your team work on tickets that make your life a little easier every now and then.",
      },
      {
        type: 'Task',
        size: 1,
        description:
          "But also don't forget to work on new features! We need to give our users a reason to keep using our service!",
      },
      {
        type: 'Task',
        size: 1,
        description:
          "Of course don't forget to keep an eye on those nasty bugs either, we want to keep customer complaints to a minimum at all times. You get the gist.",
      },
    ],
  },
  {
    pause: true,
    ticket: {
      type: 'Task',
      size: 1,
      onPlan: startMayhem,
      description:
        'That concludes your onboarding for today. Good luck, fellow manager!',
    },
  },
  {
    delay: 12,
    ticket: {
      type: 'Task',
      description:
        'Upgrade the ticket tracking software to enable a new feature:<br><br><strong>Add estimated ticket complexity</strong>',
      size: 4,
      onDone: addComp,
    },
  },
  {
    delay: 24,
    ticket: {
      type: 'Task',
      description:
        'Upgrade the ticket tracking software to enable a new feature:<br><br><strong>Add team member assignment indicators</strong>',
      size: 8,
      onDone: addAssi,
    },
  },
  {
    delay: 36,
    ticket: {
      type: 'Task',
      description:
        'Upgrade the ticket tracking software to enable a new feature:<br><br><strong>Add ticket type indicators</stromg>',
      size: 8,
      onDone: addType,
    },
  },
]

let wait = 0
const unwait = () => {
  wait--
}

export const startGame = () => {
  const tick = () => {
    if (wait > 0) return
    if (events.length === 0) return
    if (events[0].delay-- > 0) return
    const ev = events.shift()
    const tickets = ev.tickets || [ev.ticket]
    if (ev.pause) {
      wait = tickets.length
      tickets.forEach((t) => {
        if (t.onDone) {
          let oldDone = t.onDone
          t.onDone = (x) => {
            oldDone(x)
            unwait()
          }
        } else {
          t.onDone = unwait
        }
      })
    }
    tickets.reverse().forEach(createTicket)
  }

  createTicket({
    type: 'Task',
    description:
      'Welcome to your first day as a product owner!<br/><br/>There is no time to waste! Plan your first task by dragging this ticket to the <strong>todo</strong> column.',
    size: 2,
    onStart: () =>
      createTicket({
        type: 'Task',
        description:
          "Great job! Your loyal resour... I mean <em>developers</em>, have already started implementing the task you carefully selected.<br><br>Let's try that one more time.",
        size: 1,
        onPlan: () =>
          createTicket({
            type: 'Bug',
            description:
              'Uh oh! Some of our users are reporting a nasty <strong>Bug</strong> in our product.<br><br>You know what that means: Time to squash that bug by <em>skilfully planning</em> this ticket into the next sprint!',
            size: 2,
            onDone: () =>
              createTicket({
                type: 'Task',
                description:
                  'Fantastic! Fixing bugs is a sure way to keep our valued customers happy. Another way to improve their satisfaction is by implementing new <strong>Features</strong>.<br><br>Are you ready to <em>really</em> roll up your sleeves?',
                size: 1,
                onStart: () => {
                  setInterval(tick, 1000)
                },
              }),
          }),
      }),
  })
}
