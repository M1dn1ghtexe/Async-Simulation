const generatePrimes=require('./prime-generator')
const {Worker,workerData,parentPort}=require('worker_threads')


const port=parentPort 

port.on('message',(msg)=>{

	const primes=generatePrimes(msg.count,msg.start) 
	
	parentPort.postMessage({processed:'processed',res:primes})
})