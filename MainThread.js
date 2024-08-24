const {Worker}=require('worker_threads')
const os =require('os')


class AvailableThreads{

	constructor(){
		this.queue=[]
		this.availabeThreads=os.cpus().length
	}

	pushToQueue(streamCustom){
		this.queue.unshift(streamCustom) 
		this.executeNext()
	}

	checkQueue(){
		return this.queue.length===0
	}
	executeNext(){

		if(this.availabeThreads>0 && this.queue.length>0){
			const st=this.queue.pop() 
			this.availabeThreads--
			st.on('processed',(data)=>{
		
				console.log('Prime numbers generation finished  FROM QUEUE ! ');
				console.log(data);
				availableThreads.availabeThreads++	
				this.executeNext()
			}) 

		}
	}
}

class StreamCustom{

	constructor(){
		this.worker=new Worker('./Worker.js') 
		this.listeners={}
		this.worker.on('message',(msg)=>{
			
			const {processed,res}=msg 
			if (this.listeners[processed]) {
                this.listeners[processed].forEach(callback => {
                    // Use setTimeout to ensure that this callback runs after the current execution stack is empty
                    setTimeout(() => {
                        callback(res);
                    }, 0);
                });
            }
			
		})
		this.worker.on('error',(error)=>{
			console.error('Worker error'+' '+error); 
			availableThreads.availabeThreads++
		})
		this.worker.on('exit',(code)=>{
			if(code!==0){
				console.error('Worker stopped with exit code'+' '+code); 
				availableThreads.availabeThreads++
			}
		})
	}
	on(eventType,callback){
		if(!this.listeners[eventType]){
			this.listeners[eventType]=[]
		}
		if(!this.listeners[eventType].includes(callback)){
			this.listeners[eventType].push(callback)
		}
	
		console.log('Starting to generate primes in another thread...')
		this.emit('genPrimes',2)
	}
	emit(eventType,payload){
		this.worker.postMessage({type:'genPrimes',count:5000,start:1000000000000})
	}

}

class SimulateUsers{

	constructor(){
		this.worker=new Worker('./SimUsers.js') 
		this.listeners={}

		this.worker.on('message',(msg)=>{
			
			const {newUser,res}=msg 
			if (this.listeners[newUser]) {
                this.listeners[newUser].forEach(callback => {
                    // Use setTimeout to ensure that this callback runs after the current execution stack is empty
                    setTimeout(() => {
                        callback(res);
                    }, 0);
                });
            }
			
		})
		this.worker.on('error',(error)=>{
			console.error('Simulating Users error'+' '+error); 
			
		})
		this.worker.on('exit',(code)=>{
			if(code!==0){
				console.error('Simulating users stopped with exit code'+' '+code); 
				
			}
		})

	}

	on(eventName,callback){

		if(!this.listeners[eventName]){
			this.listeners[eventName]=[]
		}

		if(!this.listeners[eventName].includes(callback)){
			this.listeners[eventName].push(callback)

		}

		this.worker.postMessage({type:'genUsers'})
	}
}

const simUsers=new SimulateUsers()
const availableThreads=new AvailableThreads()
console.log(availableThreads.availabeThreads);


simUsers.on('newUser',(data)=>{
	console.log('New User found ! I can process this because the main thread is free ');
	console.log(data); 

	console.log(`Number of available parallelism is ${availableThreads.availabeThreads}`);
	console.log('******************************');
		
	if(availableThreads.availabeThreads>0){

		if(availableThreads.checkQueue()===true){
			//if the queue in the availableThreads is 0

			const st=new StreamCustom()
			st.on('processed',(data)=>{
		
				console.log('Prime numbers generation finished ! ');
				console.log(data);
				availableThreads.availabeThreads++
				
			}) 
			availableThreads.availabeThreads--
		}
		else{
			const st=new StreamCustom()
			availableThreads.pushToQueue(st) 
			availableThreads.executeNext()
		}
	}
	else{

		const st=new StreamCustom()
		availableThreads.pushToQueue(st)
	}
	
})


console.log('still doing things in the Main Thread');

setTimeout(()=>{

	console.log('BUYAKASA');
	
},4000)

setTimeout(()=>{

	console.log('BUYAKASA');
	
},2000)

console.log('still doing things in the Main Thread');

setTimeout(()=>{

	console.log('BUYAKASA');
	
},6000)

console.log('All operations completed. Main Thread is now free');
console.log(availableThreads.availabeThreads);


