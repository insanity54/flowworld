import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');



await pb.collection("_superusers").authWithPassword('chris@grimtech.net', 'turbo123');
const poses = await pb.collection('poses').getFullList();
console.log(JSON.stringify(poses, null, 2));

// const collection = await pb.collections.getOne('poses');

// let records = await pb. records.findAllRecords("poses",
// ???
// )