import { rand } from './utils'

export const makeBugFlavour = () =>
  rand([
    'The newsletter unsubscribe button is not working. Users are very annoyed.',
    'The newsletter subscribe button is not working. Marketing is not very happy.',
    'Users are reporting they are getting billed twice this month. While this is great for us, we should treat this as a bug.',
    'Your email validation regex missed an edge case again, a lot of users are unable to sign up.',
    'Your phone number validation regex missed an edge case. We are missing a lot of sign ups because of this.',
    'The payment API key has expired. Our service is not working.',
    'US-1 datacenters are unreachable, we need to redeploy asap!',
    'The US-1 datacenters are on fire. Our service is offline until we move it.',
    'EU-1 is reporting outages, we should quickly migrate to another datacenter.',
    'The EU-1 datacenters were stolen. We need to push our application to the new servers quickly.',
    "DNS issues again. People can't reach our application.",
    'Users are unable to log in because of an issue in our authentication service.',
    'Our application keeps crashing because of a memory leak. Better fix it fast.',
    "Undefined is not a function. Let's define it then!",
    'Images on the application are not loading, we need to resolve it.',
  ])

export const makeFeatFlavour = () =>
  rand([
    'Implement dark mode for our application.',
    'Improve the responsiveness of our webpages.',
    'Could we implement IE6 support?',
    'We should try to optimise our loading times a little.',
    'We can optimise the bundle size more.',
    'Add more CDN regions for performance.',
    "Migrate everything to K8S, it's what the cool kids use nowadays.",
    "Migrate everything to Azure, it's what the cool kids use nowadays.",
    "Migrate everything to GCP, it's what the cool kids use nowadays.",
    "Migrate everything to AWS Lambdas, it's what the cool kids use nowadays.",
    "Let's refactor some code!",
    'As a user, I want to be able to search for the items I am looking for so that I can find things easily.',
    'As a user, I want to be able to subscribe to a weekly newsletter so that I can enjoy the latest updates.',
    'As a user, I want to authenticate using my social media accounts so that I can login faster.',
    'As a user, I want to verify my phone number so that I can enable 2FA',
  ])
