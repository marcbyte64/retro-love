import * as storage from '../app/storage';
import { dispatcher } from '../app/dispatcher';

export function injectTestData() {
  const testVariables: Record<string, string | number> = {
    A: 123,
    AB: 9,
    B: 2,
    C: 3,
    C$: 'STRING',
    'D%': 3.1415,
  };

  const testPrompts = [
    //'10 print "HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%',
    //'20 print "--------"',
    //'30 goto 10',
    //'5 if 5 > 1 then print "5 is greater than 1"',
    //'10 input "Enter 2 Numbers?"; A, B%',
    //'20 print "The sum of " ; A ; " and " ; B% ; " is " ; A + B%',
    //'30 goto 10',
    '10 clr',
    '20 print "===== MAIN MENU ====="',
    '30 print "1. PAGE ONE"',
    '40 print "2. PAGE TWO"',
    '50 print "3. PAGE THREE"',
    '60 print "====================="',
    '70 input "CHOOSE A PAGE (1-3)"; A',
    '80 if A=1 then 1000',
    '90 if A=2 then 2000',
    '100 if A=3 then 3000',

    '1000 clr',
    '1010 print "===== MAIN MENU ====="',
    '1020 print "1. PAGE ONE"',
    '1030 print "2. PAGE TWO"',
    '1040 print "3. PAGE THREE"',
    '1060 print "====================="',
    '1070 print "You are on Page 1"',
    '1080 print "====================="',
    '1090 input "CHOOSE A PAGE (1-3)"; A',
    '1100 if A=1 then 1000',
    '1110 if A=2 then 2000',
    '1120 if A=3 then 3000',

    '2000 clr',
    '2010 print "===== MAIN MENU ====="',
    '2020 print "1. PAGE ONE"',
    '2030 print "2. PAGE TWO"',
    '2040 print "3. PAGE THREE"',
    '2060 print "====================="',
    '2070 print "You are on Page 2"',
    '2080 print "====================="',
    '2090 input "CHOOSE A PAGE (1-3)"; A',
    '2100 if A=1 then 1000',
    '2110 if A=2 then 2000',
    '2120 if A=3 then 3000',

    '3000 clr',
    '3010 print "===== MAIN MENU ====="',
    '3020 print "1. PAGE ONE"',
    '3030 print "2. PAGE TWO"',
    '3040 print "3. PAGE THREE"',
    '3060 print "====================="',
    '3070 print "You are on Page 3"',
    '3080 print "====================="',
    '3090 input "CHOOSE A PAGE (1-3)"; A',
    '3100 if A=1 then 1000',
    '3110 if A=2 then 2000',
    '3120 if A=3 then 3000',
  ];

  // inject test prompts
  for (const prompt of testPrompts) {
    dispatcher.dispatchCommand(prompt);
  }

  // inject test variables
  for (const [name, value] of Object.entries(testVariables)) {
    storage.storeVariable(name, value);
  }

  // run prompts
  dispatcher.dispatchCommand("run");
}
