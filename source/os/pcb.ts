///<reference path="../globals.ts" />

/* ------------
     pcb.ts

     Requires global.ts.

     Process Control Block Object, used to keep track
     of data related to a process that is in execution.
     ------------ */

module TSOS {

    export class Pcb {
        //Used to keep track and assign new process IDs
        public static currentProcessNum: number = 0;

        constructor(public processState: number = NEW,
                    public processID: number = 0,
                    public programCounter: number = 0,
                    public accumulator: number = 0,
                    public IR: Byte = new Byte(),
                    public x: number = 0,
                    public y: number = 0,
                    public z: number = 0,
                    public partition: number = 0,
                    public base: number = 0,
                    public limit: number = 0) {
          this.init();
        }

        public init(): void {
            this.processID = Pcb.currentProcessNum;
            Pcb.currentProcessNum++;
        }
        public setPartition(partition: number): void{
          this.partition = partition;
          this.base = (partition - 1) * MEMORY_SIZE;
          this.limit = (partition * MEMORY_SIZE) - 1;
          this.programCounter = this.base;
          console.log("Partition: " + this.partition + " Base: " + this.base + " Limit: " + this.limit);
        }

        public incrementPC(): void{
          this.programCounter++;
          _CPU.PC++;
          //If PC excedes memory size, wrap-around to start of memory
          if(this.programCounter > this.limit){
            this.programCounter = this.base;
            _CPU.PC = this.base;
          }
        }

        public updatePcb(): void{
          this.programCounter = _CPU.PC;
          this.accumulator = _CPU.Acc;
          this.IR = _CPU.IR;
          this.x = _CPU.Xreg;
          this.y = _CPU.Yreg;
          this.z = _CPU.Zflag;
        }
    }
}
