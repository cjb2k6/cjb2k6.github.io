/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "PhazonOS";   // 'cause Metroid Prime is awesome.
const APP_VERSION: string = "6.6";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

const CONTEXT_IRQ: number = 2;

//Memory Info
const MEMORY_SIZE: number = 256;
const MEMORY_PARTITIONS: number = 3;
const TOTAL_MEMORY_SIZE: number = MEMORY_PARTITIONS * MEMORY_SIZE;

//Harddrive Info
const TRACKS: number = 4;
const SECTORS: number = 8;
const BLOCKS: number = 8;
const BLOCK_SIZE: number = 64;

//Process States
const NEW: number = 0;
const RUNNING: number = 1;
const WAITING: number = 2;
const READY: number = 3;
const TERMINATED: number = 4;

//Scheduling Modes
const RR: number = 0; //Round Robin
const FCFS: number = 1; //First Come, First Serve
const PRTY: number = 2; //Non-premptive Priority


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _HardDrive: TSOS.HardDrive;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _MemoryManager: TSOS.MemoryManager;

var _CurrentPCB: TSOS.Pcb = null;  //The currently executing process's PCB
var _ReadyQueue: TSOS.Queue<TSOS.Pcb>;  //Queue of processes waiting to execute
var _ResidentList: TSOS.ResidentList;  //List of processes currently occupying memory
var _CpuScheduler: TSOS.CpuScheduler;

var _TimeQuantum: number = 6;  //Measured in clock cycles

var _SchedMode: number = RR; //Current Scheduling Algorithm. Default: Round Robin

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

var _Status: string = "";

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

var _SingleStepMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnHardDriveDriver: TSOS.DeviceDriverHardDrive;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
