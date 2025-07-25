// yoga.js
// Be sure to not use "'" in the displayNames as this will cause json stringify errors

import { randomOne } from "./random.js";



export const poses = [
    { name: 'mountain', displayName: 'Mountain Pose', difficulty: 1 },
    { name: 'standingForwardFold', displayName: 'Standing Forward Fold', difficulty: 1 },
    { name: 'ragdoll', displayName: 'Ragdoll', difficulty: 1 },
    { name: 'plank', displayName: 'Plank Pose', difficulty: 2 },
    { name: 'sidePlankR', displayName: 'Side Plank Right', difficulty: 3, mirror: 'sidePlankL' },
    { name: 'sidePlankL', displayName: 'Side Plank Left', difficulty: 3, mirror: 'sidePlankR' },
    { name: 'supportedSidePlankR', displayName: 'Supported Side Plank Right', difficulty: 2, mirror: 'supportedSidePlankL' },
    { name: 'supportedSidePlankL', displayName: 'Supported Side Plank Left', difficulty: 2, mirror: 'supportedSidePlankR' },
    { name: 'wildThingR', displayName: 'Wild Thing Right', difficulty: 4, mirror: 'wildThingL' },
    { name: 'wildThingL', displayName: 'Wild Thing Left', difficulty: 4, mirror: 'wildThingR' },
    { name: 'halfwayLift', displayName: 'Halfway Lift', difficulty: 1 },
    { name: 'catCow', displayName: 'Cat, Cow', difficulty: 1 },
    { name: 'downDog', displayName: 'Down Dog', difficulty: 3 },
    { name: 'threeLeggedDogL', displayName: 'Three Legged Dog Left', difficulty: 4 },
    { name: 'threeLeggedDogR', displayName: 'Three Legged Dog Right', difficulty: 4 },
    { name: 'warriorOneL', displayName: 'Warrior One Left', difficulty: 1, mirror: 'warriorOneR' },
    { name: 'warriorOneR', displayName: 'Warrior One Right', difficulty: 1, mirror: 'warriorOneL' },
    { name: 'seatedForwardFold', displayName: 'Seated Forward Fold', difficulty: 1 },
    { name: 'seated', displayName: 'Seated', difficulty: 1 },
    { name: 'upDog', displayName: 'Upward Facing Dog', difficulty: 1 },
    { name: 'cobra', displayName: 'Cobra Pose', difficulty: 1 },
    { name: 'lizardL', displayName: 'Lizard Pose Left', difficulty: 2 },
    { name: 'lizardR', displayName: 'Lizard Pose Right', difficulty: 2 },
    { name: 'pigeonL', displayName: 'Pigeon Pose Left', difficulty: 2 },
    { name: 'pigeonR', displayName: 'Pigeon Pose Right', difficulty: 2 },
    { name: 'corpse', displayName: 'Corpse', difficulty: 1 },
    { name: 'happyBaby', displayName: 'Happy Baby', difficulty: 1 },
    { name: 'staff', displayName: 'Staff Pose', difficulty: 1 },
    { name: 'kneesToChest', displayName: 'Knees to Chest', sanskrit: 'Apanasana', difficulty: 1 },
    {
        name: 'runnersLungeR', displayName: 'Runner&apos;s Lunge Right', mirror: 'runnersLungeL', difficulty: 1
    },
    {
        name: 'runnersLungeL', displayName: 'Runner&apos;s Lunge Left', mirror: 'runnersLungeR', difficulty: 1
    },
    { name: 'bridge', displayName: 'Bridge Pose', difficulty: 2 },
    { name: 'sphinx', displayName: 'Sphinx Pose', difficulty: 1 },
    { name: 'triangleL', displayName: 'Triangle Pose Left', difficulty: 1, mirror: 'triangleR' },
    { name: 'triangleR', displayName: 'Triangle Pose Right', difficulty: 1, mirror: 'triangleL' },
];

export const mirrors = Object.fromEntries(
    poses
        .filter(p => p.mirror)
        .flatMap(p => [[p.name, p.mirror]])
);


// Markov chain-style transitions
export const transitionsTable = {
    seatedForwardFold: [
        { next: 'seated', weight: 0.1 },
        { next: 'staff', weight: 0.1 },
        { next: 'plank', weight: 0.1 },
        { next: 'triangleL', weight: 0.3 },
        { next: 'triangleR', weight: 0.3 },
    ],
    runnersLungeR: [
        { next: 'standingForwardFold', weight: 0.5 },
        { next: 'mountain', weight: 0.5 },
    ],
    runnersLungeL: [
        { next: 'standingForwardFold', weight: 0.5 },
        { next: 'mountain', weight: 0.5 },
    ],
    triangleR: [
        { next: 'seatedForwardFold', weight: 0.5 },
        { next: 'standingForwardFold', weight: 0.1 },
        { next: 'triangleL', weight: 0.9 },
    ],
    triangleL: [
        { next: 'seatedForwardFold', weight: 0.5 },
        { next: 'standingForwardFold', weight: 0.1 },
        { next: 'triangleR', weight: 0.9 },
    ],
    pigeonR: [
        { next: 'pigeonL', weight: 0.5 },
        { next: 'standingForwardFold', weight: 0.1 },
        { next: 'plank', weight: 0.1 },
        { next: 'warriorOneR', weight: 0.1 },
        { next: 'sidePlankR', weight: 0.1 },
    ],
    pigeonL: [
        { next: 'pigeonR', weight: 0.5 },
        { next: 'standingForwardFold', weight: 0.1 },
        { next: 'plank', weight: 0.1 },
        { next: 'warriorOneL', weight: 0.1 },
        { next: 'sidePlankL', weight: 0.1 },

    ],
    lizardR: [
        { next: 'pigeonR', weight: 0.5 },
        { next: 'runnersLungeR', weight: 0.1 },
        { next: 'plank', weight: 0.1 },
    ],
    lizardL: [
        { next: 'pigeonL', weight: 0.5 },
        { next: 'runnersLungeL', weight: 0.1 },
        { next: 'plank', weight: 0.1 },
    ],
    warriorOneR: [
        { next: 'lizardR', weight: 0.5 },
        { next: 'runnersLungeR', weight: 0.5 },
        { next: 'plank', weight: 0.1 },
    ],
    warriorOneL: [
        { next: 'lizardL', weight: 0.5 },
        { next: 'runnersLungeL', weight: 0.5 },
        { next: 'plank', weight: 0.1 },
    ],
    mountain: [
        { next: 'standingForwardFold', weight: 0.9 },
        { next: 'plank', weight: 0.05 },
        { next: 'ragdoll', weight: 0.5 },
    ],
    happyBaby: [
        { next: 'seated', weight: 0.5 },
        { next: 'kneesToChest', weight: 0.5 },
    ],
    kneesToChest: [
        { next: 'seated', weight: 0.5 },
        { next: 'corpse', weight: 0.5 },
    ],
    seated: [
        { next: 'mountain', weight: 0.1 },
        { next: 'staff', weight: 0.1 },
        { next: 'catCow', weight: 0.1 },
    ],
    corpse: [
        { next: 'seated', weight: 0.9 },
        { next: 'staff', weight: 0.1 },
        { next: 'happyBaby', weight: 0.5 },
    ],
    staff: [
        { next: 'mountain', weight: 0.5 },
        { next: 'seatedForwardFold', weight: 0.5 },
    ],
    ragdoll: [
        { next: 'halfwayLift', weight: 0.5 },
        { next: 'mountain', weight: 0.5 },
        { next: 'plank', weight: 0.5 },
        { next: 'catCow', weight: 0.5 },
    ],
    downDog: [
        { next: 'standingForwardFold', weight: 0.8 },
        { next: 'threeLeggedDogL', weight: 0.3 },
        { next: 'threeLeggedDogR', weight: 0.3 },
    ],
    threeLeggedDogL: [
        { next: 'warriorOneL', weight: 0.5 },
        { next: 'downDog', weight: 0.5 },
    ],
    threeLeggedDogR: [
        { next: 'warriorOneR', weight: 0.5 },
        { next: 'downDog', weight: 0.5 },
    ],
    standingForwardFold: [
        { next: 'plank', weight: 0.5 },
        { next: 'halfwayLift', weight: 0.5 },
        { next: 'sidePlankR', weight: 0.1 },
        { next: 'sidePlankL', weight: 0.1 },
    ],
    halfwayLift: [
        { next: 'mountain', weight: 0.9 },
        { next: 'standingForwardFold', weight: 0.1 },
    ],
    plank: [
        { next: 'sidePlankL', weight: 0.1 },
        { next: 'sidePlankR', weight: 0.1 },
        { next: 'mountain', weight: 0.1 },
        { next: 'upDog', weight: 0.9 },
        { next: 'cobra', weight: 0.9 },
        { next: 'sphinx', weight: 0.9 },
        { next: 'downDog', weight: 0.2 },
        { next: 'warriorOneL', weight: 0.3 },
        { next: 'runnersLungeR', weight: 0.1 },
        { next: 'runnersLungeL', weight: 0.1 },
    ],
    cobra: [
        { next: 'downDog', weight: 0.9 },
        { next: 'catCow', weight: 0.3 },
    ],
    sphinx: [
        { next: 'downDog', weight: 0.9 },
        { next: 'catCow', weight: 0.3 },
    ],
    upDog: [
        { next: 'downDog', weight: 0.9 },
        { next: 'catCow', weight: 0.3 },
    ],
    sidePlankR: [
        { next: 'wildThingR', weight: 0.5 },
        { next: 'supportedSidePlankR', weight: 0.5 }
    ],
    sidePlankL: [
        { next: 'wildThingL', weight: 0.5 },
        { next: 'supportedSidePlankL', weight: 0.5 }
    ],
    catCow: [
        { next: 'plank', weight: 0.5 },
        { next: 'downDog', weight: 0.2 },
        { next: 'standingForwardFold', weight: 0.5 },
        { next: 'ragdoll', weight: 0.3 }
    ],
    bridge: [
        { next: 'happyBaby', weight: 0.5 },
        { next: 'corpse', weight: 0.5 },
    ],
    supportedSidePlankR: [
        { next: 'plank', weight: 0.5 },
        { next: 'bridge', weight: 0.5 },
    ],
    supportedSidePlankL: [
        { next: 'plank', weight: 0.5 },
        { next: 'bridge', weight: 0.5 },
    ],
    wildThingL: [
        { next: 'plank', weight: 0.9 },
        { next: 'wildThingR', weight: 0.9 },
        { next: 'bridge', weight: 0.5 },
    ],
    wildThingR: [
        { next: 'plank', weight: 1.0 },
        { next: 'wildThingL', weight: 0.9 },
        { next: 'bridge', weight: 0.5 },
    ],
    supportedSidePlankR: [
        { next: 'mountain', weight: 0.01 },
        { next: 'corpse', weight: 0.1 },
    ]
};

// Easier/harder alternatives
export const alternatives = {
    sidePlank: {
        easier: ['supportedSidePlank'],
        harder: ['wildThing']
    },
    downDog: {
        easier: ['dolphin', 'puppy'],
        harder: ['headStand']
    }
};


