///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode == 32)  ||  // space
                (keyCode == 13) ||          //enter
                (keyCode == 9) ||          //tab
                (keyCode == 38) ||          //up
                (keyCode == 40) ||          //down
                (keyCode == 8)) {            // backspace
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57))) { //digits
                if (isShifted) {
                    switch (keyCode){
                        case 48:
                            chr = ")";
                            break;
                        case 49:
                            chr = "!";
                            break;
                        case 50:
                            chr = "@";
                            break;
                        case 51:
                            chr = "#";
                            break;
                        case 52:
                            chr = "$";
                            break;
                        case 53:
                            chr = "%";
                            break;
                        case 54:
                            chr = "^";
                            break;
                        case 55:
                            chr = "&";
                            break;
                        case 56:
                            chr = "*";
                            break;
                        case 57:
                            chr = "(";
                            break;
                    }
                } else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            } else {
                switch (keyCode) {
                    case 186:
                        if (isShifted) {
                            chr = ":";
                        } else {
                            chr = ";";
                        }
                        break;
                    case 187:
                        if (isShifted) {
                            chr = "+";
                        } else {
                            chr = "=";
                        }
                        break;
                    case 188:
                        if (isShifted) {
                            chr = "<";
                        } else {
                            chr = ",";
                        }
                        break;
                    case 189:
                        if (isShifted) {
                            chr = "_";
                        } else {
                            chr = "-";
                        }
                        break;
                    case 190:
                        if (isShifted) {
                            chr = ">";
                        } else {
                            chr = ".";
                        }
                        break;
                    case 191:
                        if (isShifted) {
                            chr = "?";
                        } else {
                            chr = "/";
                        }
                        break;
                    case 192:
                        if (isShifted) {
                            chr = "~";
                        } else {
                            chr = "`";
                        }
                        break;
                    case 219:
                        if (isShifted) {
                            chr = "{";
                        } else {
                            chr = "[";
                        }
                        break;
                    case 220:
                        if (isShifted) {
                            chr = "|";
                        } else {
                            chr = "\\";
                        }
                        break;
                    case 221:
                        if (isShifted) {
                            chr = "}";
                        } else {
                            chr = "]";
                        }
                        break;
                    case 222:
                        if (isShifted) {
                            chr = "\"";
                        } else {
                            chr = "'";
                        }
                        break;
                }
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
