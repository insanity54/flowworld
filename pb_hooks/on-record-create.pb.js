/// <reference path="../pb_data/types.d.ts" />


// pb_hooks/custom-hooks.pb.js

onRecordCreate((e) => {
    // e.app
    // e.record

    const defaultPose = {
        name: 'mountain',
        displayName: 'Mountain',
    }


    // $apis.requireSuperuserAuth()

    // console.log(`EYYY WE GOT A FLOW. isDev? ${$app.isDev()} `);
    // console.log(JSON.stringify(e))

    const record = e.record;
    // // @todo get the pose variations
    e.app.expandRecord(record, ['pose'], null);
    const poseRecord = record.expandedOne('pose');

    console.log(`poseRecord=${JSON.stringify(poseRecord)}`)

    let pose;
    if (!poseRecord) {
        pose = defaultPose;
    } else {
        pose = {
            name: poseRecord.get('name'),
            displayName: poseRecord.get('display_name').replace(/'/g, "ʹ"),
        }
    }

    const data = {
        model: '/human2.glb',
        environment: '/spruit_sunrise_1k_HDR.hdr',
        pose,
        // variations
    }

    // // @TODO 
    // // console.log(JSON.stringify(e.app))

    // console.log(JSON.stringify(e.app));

    const ORIGIN = $os.getenv('ORIGIN')
    if (!ORIGIN) {
        console.error('Missing required ORIGIN environment variable')
        // Handle error case
    }
    
    // // Here we make a HTTP POST request to /api/pose
    // // the JSVM handler at /api/pose creates the next pose in the flows collection for us.
    // // we do this HTTP request because this here event handler does't have access to pocketpages context.datastar,
    // // which is needed in order to broadcast the new pose to all clients.
    // // the datastar context is only available to pages, not event handlers.
    $http.send({
        url: `${ORIGIN}/api/pose`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        },
        timeout: 3
    })


    e.next();
}, "flows")
