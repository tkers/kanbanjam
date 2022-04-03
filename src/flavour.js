import { rand } from './utils'

export const makeBugFlavour = () =>
  rand([
    'Signup page is broken again',
    'Users are not able to log in',
    'Newsletter unsubscribe button is not working',
    'Your email verification regex missed an edge case',
    'People with a short lastname are unable to signup',
    'Payment API key has expired',
    'TLS certificates have expired',
    'Caches need to be purged after the last release',
    'DNS issues again',
  ])

export const makeFeatFlavour = () =>
  rand([
    'Implement dark mode',
    'Make the application responsive',
    'IE6 support, please!',
    'Optimise loading times',
    'Optimise bundle size',
    'Expand CDN services',
    "Migrate to K8S, it's what the cool kids use",
    'Upgrade left-pad library',
  ])
