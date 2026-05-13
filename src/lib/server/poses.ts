export type Pose = {
  name: string;
  displayName: string;
  rarity: number;
  difficulty: string;
  mirror: string;
  neighbors: string[];
};

const data: Pose[] = [
  { name: "mountain", displayName: "Mountain", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["bridge", "runnersLungeL", "runnersLungeR", "sphinx", "headToKneeL", "headToKneeR", "kneesToChest", "staff", "happyBaby", "corpse", "pigeonR", "pigeonL", "lizardL", "lizardR", "cobra", "upDog", "seated", "seatedForwardFold", "warriorOneR", "warriorOneL", "threeLeggedDogR", "threeLeggedDogL", "downDog", "catCow", "wildThingL", "wildThingR", "supportedSidePlankL", "supportedSidePlankR", "sidePlankR", "sidePlankL", "plank", "ragdoll", "standingForwardFold"] },
  { name: "standingForwardFold", displayName: "Standing Forward Fold", rarity: 2, difficulty: "beginner", mirror: "", neighbors: ["plank", "halfwayLift", "sidePlankR", "sidePlankL"] },
  { name: "ragdoll", displayName: "Ragdoll", rarity: 3, difficulty: "beginner", mirror: "", neighbors: ["halfwayLift", "mountain", "plank", "catCow"] },
  { name: "plank", displayName: "Plank", rarity: 2, difficulty: "intermediate", mirror: "", neighbors: ["sidePlankL", "sidePlankR", "mountain", "upDog", "cobra", "sphinx", "downDog", "warriorOneL", "runnersLungeL", "runnersLungeR"] },
  { name: "sidePlankL", displayName: "Side Plank Left", rarity: 2, difficulty: "intermediate", mirror: "sidePlankR", neighbors: ["plank"] },
  { name: "sidePlankR", displayName: "Side Plank Right", rarity: 2, difficulty: "intermediate", mirror: "sidePlankL", neighbors: ["sidePlankL", "plank"] },
  { name: "supportedSidePlankR", displayName: "Supported Side Plank Right", rarity: 1, difficulty: "beginner", mirror: "supportedSidePlankL", neighbors: ["plank"] },
  { name: "supportedSidePlankL", displayName: "Supported Side Plank Left", rarity: 1, difficulty: "beginner", mirror: "supportedSidePlankR", neighbors: ["supportedSidePlankR"] },
  { name: "wildThingR", displayName: "Wild Thing Right", rarity: 4, difficulty: "intermediate", mirror: "wildThingL", neighbors: ["plank", "ragdoll"] },
  { name: "wildThingL", displayName: "Wild Thing Left", rarity: 4, difficulty: "intermediate", mirror: "wildThingR", neighbors: ["wildThingR", "plank", "ragdoll"] },
  { name: "halfwayLift", displayName: "Halfway Lift", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["plank", "ragdoll", "mountain", "standingForwardFold"] },
  { name: "catCow", displayName: "Cat Cow", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["ragdoll", "mountain", "standingForwardFold"] },
  { name: "downDog", displayName: "Down Dog", rarity: 1, difficulty: "intermediate", mirror: "", neighbors: ["plank", "mountain", "standingForwardFold"] },
  { name: "threeLeggedDogL", displayName: "Three Legged Dog Left", rarity: 2, difficulty: "intermediate", mirror: "threeLeggedDogR", neighbors: ["downDog", "mountain"] },
  { name: "threeLeggedDogR", displayName: "Three Legged Dog Right", rarity: 2, difficulty: "intermediate", mirror: "threeLeggedDogL", neighbors: ["downDog", "threeLeggedDogL"] },
  { name: "warriorOneL", displayName: "Warrior One Left", rarity: 1, difficulty: "beginner", mirror: "warriorOneR", neighbors: ["mountain"] },
  { name: "warriorOneR", displayName: "Warrior One Right", rarity: 1, difficulty: "beginner", mirror: "warriorOneL", neighbors: ["warriorOneL", "mountain"] },
  { name: "seatedForwardFold", displayName: "Seated Forward Fold", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["mountain"] },
  { name: "seated", displayName: "Seated", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["seatedForwardFold", "mountain"] },
  { name: "upDog", displayName: "Up Dog", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["downDog", "plank", "mountain", "standingForwardFold"] },
  { name: "cobra", displayName: "Cobra", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["upDog", "downDog", "plank"] },
  { name: "lizardR", displayName: "Lizard Right", rarity: 4, difficulty: "intermediate", mirror: "lizardL", neighbors: ["seated", "ragdoll", "plank"] },
  { name: "lizardL", displayName: "Lizard Left", rarity: 4, difficulty: "intermediate", mirror: "lizardR", neighbors: ["lizardR", "downDog", "plank"] },
  { name: "pigeonL", displayName: "Pigeon Left", rarity: 2, difficulty: "beginner", mirror: "pigeonR", neighbors: ["lizardL", "seated", "mountain"] },
  { name: "pigeonR", displayName: "Pigeon Right", rarity: 2, difficulty: "beginner", mirror: "pigeonL", neighbors: ["lizardR", "seated", "mountain"] },
  { name: "corpse", displayName: "Corpse", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["seated", "catCow", "mountain"] },
  { name: "happyBaby", displayName: "Happy Baby", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["corpse", "seated", "catCow", "plank"] },
  { name: "staff", displayName: "Staff", rarity: 2, difficulty: "beginner", mirror: "", neighbors: ["corpse", "happyBaby", "cobra", "seated", "halfwayLift", "plank", "mountain", "standingForwardFold", "ragdoll"] },
  { name: "kneesToChest", displayName: "Knees To Chest", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["corpse", "seated", "mountain"] },
  { name: "runnersLungeR", displayName: "Runner's Lunge Right", rarity: 1, difficulty: "beginner", mirror: "runnersLungeL", neighbors: ["staff", "kneesToChest", "pigeonR", "cobra", "upDog", "downDog"] },
  { name: "runnersLungeL", displayName: "Runner's Lunge Left", rarity: 1, difficulty: "beginner", mirror: "runnersLungeR", neighbors: ["runnersLungeR", "staff", "kneesToChest", "pigeonL", "cobra", "upDog", "downDog"] },
  { name: "bridge", displayName: "Bridge", rarity: 2, difficulty: "intermediate", mirror: "", neighbors: ["plank", "mountain"] },
  { name: "sphinx", displayName: "Sphinx", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["downDog", "plank", "mountain"] },
  { name: "headToKneeL", displayName: "Head To Knee Left", rarity: 1, difficulty: "beginner", mirror: "headToKneeR", neighbors: ["staff", "seatedForwardFold", "wildThingL", "supportedSidePlankL", "sidePlankL"] },
  { name: "headToKneeR", displayName: "Head to Knee Right", rarity: 1, difficulty: "beginner", mirror: "headToKneeL", neighbors: ["wildThingR", "supportedSidePlankR", "sidePlankR", "staff", "seatedForwardFold"] },
  { name: "treeL", displayName: "Tree Left", rarity: 2, difficulty: "beginner", mirror: "treeR", neighbors: ["mountain"] },
  { name: "treeR", displayName: "Tree Right", rarity: 2, difficulty: "beginner", mirror: "treeL", neighbors: ["mountain"] },
];

export const poseMap: Record<string, Pose> = Object.fromEntries(data.map(p => [p.name, p]));
export const poseList: Pose[] = data;
