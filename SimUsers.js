const {Worker,workerData,parentPort}=require('worker_threads') 


const port=parentPort 

port.on('message',(msg)=>{

	
	const user={
		name:'John',
		age:22
	}
	setInterval(() => {

		parentPort.postMessage({newUser:'newUser',res:user})
		
	}, 3000);
	
})