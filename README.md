I created this in order to better understand how async and event driven architecture works. <br>
The main goal is to keep the main thread free, and deffer CPU-intensive operations to another thread, in this way the main thread will be free to process new users that hit the server. <br>
In this Node Js application i'm using Worker Threads for simulating async tasks and users. <br>  

<br>
Main components:
<ul>
  <li>
  <b>The StreamCustom class </b><br> designed to facilitate the use of a Web Worker for processing tasks in a background thread, specifically for generating prime numbers. It manages communication with the spawned thread and allows listeners to be registered for specific events.
  </li>
  <li>
    <b>The SimulateUsers class</b> <br> 
    allows for asynchronous user simulation where user can be generated every 3 seconds in a background thread. The main thread can register callbacks to handle new user events, providing a non-blocking way to manage simulated users. 
    Within the worker thread (in SimUsers.js), a simple user object is created. The worker then sets up a regular interval using setInterval to send a message back to the main thread every 3 seconds, simulating the generation of a new user.
  </li>

<li>
<b> The AvailableThreads class</b> <br>
  allows for managing a queue of StreamCustom objects . <br> 
   Excessive threading can lead to inefficiencies, increasing contention for resources and diluting the benefits of parallelism. Therefore, especially in CPU-bound applications, it is often advisable to limit the number of concurrent threads to match the number of available physical or logical CPU cores.<br>
  This class does exactly that, it limits the number of spawned threads if the number of users are increasing and the number of available CPU's remain the same. <br> 
  In this case , if a new user comes and demand the CPU-intensive operation ( spawning prime numbers ) and the available CPU's are 0  , then I need to add the StreamCustom object in a queue , and execute it later when some thread completes the execution. <br>
  In this way excessive threading is avoided but unfortunately it could add more waiting time for some user who is last in the queue. 
  
  
  
</li>

  
</ul>
