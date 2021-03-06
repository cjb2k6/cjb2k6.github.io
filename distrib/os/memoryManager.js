var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(mainMemory, partitions) {
            if (mainMemory === void 0) { mainMemory = new TSOS.Memory(); }
            if (partitions === void 0) { partitions = []; }
            this.mainMemory = mainMemory;
            this.partitions = partitions;
            this.init();
        }
        MemoryManager.prototype.init = function () {
        };
        MemoryManager.prototype.loadProgram = function (prgm, partition) {
            var currByte = "";
            var tsb = "MEM";
            if (partition === -1) {
                tsb = _krnHardDriveDriver.rollOut(prgm, partition);
            }
            else {
                var memLoc = (MEMORY_SIZE * partition) - MEMORY_SIZE;
                console.log("Loading at :" + memLoc);
                for (var i = 0; i < prgm.length; i++) {
                    currByte = currByte + prgm[i];
                    if (currByte.length > 1) {
                        this.mainMemory.mainMem[memLoc].setHex(currByte);
                        memLoc++;
                        currByte = "";
                    }
                }
                this.setPartition(partition, true);
                TSOS.Control.updateMemoryTable();
            }
            return tsb;
        };
        MemoryManager.prototype.clearAllMem = function () {
            this.mainMemory.clear(0);
            for (var i = 1; i < MEMORY_PARTITIONS + 1; i++) {
                this.partitions[i] = false;
            }
            TSOS.Control.updateMemoryTable();
        };
        MemoryManager.prototype.clearPartition = function (partition) {
            if (!this.partitionIsValid(partition)) {
                console.log("Invalid memory partition: " + partition);
            }
            else {
                this.mainMemory.clear(partition);
                this.setPartition(partition, false);
                TSOS.Control.updateMemoryTable();
            }
        };
        MemoryManager.prototype.partitionIsValid = function (partition) {
            if (partition < 1 || partition > MEMORY_PARTITIONS) {
                return false;
            }
            return true;
        };
        MemoryManager.prototype.partitionIsAvailable = function (partition) {
            if (this.partitionIsValid(partition)) {
                return !this.partitions[partition];
            }
            return false;
        };
        MemoryManager.prototype.setPartition = function (partition, isUsed) {
            if (this.partitionIsValid(partition)) {
                this.partitions[partition] = isUsed;
            }
        };
        MemoryManager.prototype.getNextFreePartition = function () {
            for (var i = 1; i < MEMORY_PARTITIONS + 1; i++) {
                if (this.partitionIsAvailable(i)) {
                    return i;
                }
            }
            return -1;
        };
        MemoryManager.prototype.getByteFromAddr = function (address, pcb) {
            var base = 0;
            var limit = TOTAL_MEMORY_SIZE;
            if (pcb !== undefined) {
                base = pcb.base;
                limit = pcb.limit;
            }
            if (address > limit || address < base) {
                console.log("Memory Access Violation at: " + address);
                _CurrentPCB.processState = TERMINATED;
                _StdOut.putText("ERROR: MEMORY ACCESS VIOLATION. PID[" + _CurrentPCB.processID + "]. ");
            }
            else {
                return this.mainMemory.mainMem[address];
            }
        };
        MemoryManager.prototype.getProgram = function (pcb) {
            var program = "";
            for (var i = pcb.base; i < pcb.limit; i++) {
                program += this.getByteFromAddr(i, pcb).getHex();
            }
            return program;
        };
        MemoryManager.prototype.setByteAtAddr = function (byte, address, pcb) {
            if (address > pcb.limit || address < pcb.base) {
                _CurrentPCB.processState = TERMINATED;
                _StdOut.putText("ERROR: MEMORY ACCESS VIOLATION. PID[" + _CurrentPCB.processID + "]. ");
            }
            else {
                this.mainMemory.mainMem[address] = byte;
                return true;
            }
            return false;
        };
        MemoryManager.prototype.printMemory = function () {
            return this.mainMemory.toString();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
