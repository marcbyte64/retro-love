import * as storage from "../app/storage";
import { dispatcher } from "../app/dispatcher";

export function injectTestData() {
  const testVariables: Record<string, string | number> = {
    A: 123,
    AB: 9,
    B: 2,
    C: 3,
    C$: "STRING",
    "D%": 3.1415,
  };

  const testPrompts = [
    //'10 if 5 > 4 then print "20"',
    //'20 if 5 > 3 then print A',
    '10 print "hello"',
    '20 if 1 = 1 then print "world"',
    "30 if 1 = 1 or 2 = 3 then 10",
    '40 print "end"',
    // '10 print "HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%',
    // '20 print "--------"',
    // '30 goto 10',
    // '5 if 5 > 1 then print "5 is greater than 1"',
    // '10 input "Enter 2 Numbers?"; A, B%',
    // '20 print "The sum of " ; A ; " and " ; B% ; " is " ; A + B%',
    // '30 goto 10',

    // HOME
    /*"0 clr",
    '1 PRINT "YOLO"',
    '2 print "SOLO"',
    '10 print "\n\n"',
    '20 print "== WELCOME TO MY WEBSITE ==\n"',

    '70 print "--------------------------------"',
    '80 print ""',
    '90 print "1  ABOUT ME"',
    '100 print "2  PROJECTS"',
    '110 print "3  SKILLS"',
    '120 print "4  CONTACT"',
    '130 print "5  SYSTEM INFO"',
    '140 print ""',
    '150 print "--------------------------------"',
    '160 print ""',

    '500 print "HELLO, I\'M MARC."',
    '510 print "I LIKE TO CODE."',
    '520 print ""',

    '900 input "TYPE A NUMBER TO NAVIGATE."; A',
    "910 if A=1 then 1000",
    "920 if A=2 then 2000",
    "930 if A=3 then 3000",
    "940 if A=4 then 4000",
    "950 if A=5 then 5000",
    "960 goto 0",

    // ABOUT
    "1000 clr",
    '1010 print "\n\n"',
    '1020 print "== ABOUT ME ==\n"',

    '1030 print "--------------------------------"',
    '1040 print ""',
    '1050 print "0  HOME"',
    '1060 print "2  PROJECTS"',
    '1070 print "3  SKILLS"',
    '1080 print "4  CONTACT"',
    '1090 print "5  SYSTEM INFO"',
    '1100 print ""',
    '1110 print "--------------------------------"',
    '1120 print ""',

    '1500 print "I\'M A SOFTWARE DEVELOPER BASED IN SWITZERLAND."',
    '1510 print "MY ADVENTURE BEGAN RIGHT AFTER THE GOLDEN AGE OF COMPUTERS. ARMED WITH A C=64, MY FIRST EVER PROGRAM WAS A TEXT-ADVENTURE WRITTEN IN BASIC V2. THE INTERFACE LOOKED EERILY SIMILAR TO WHAT YOU ARE STARING AT RIGHT NOW.\n"',
    '1520 print "SINCE THEN I\'VE GAINED A FEW EXPERIENCE POINTS. WITH A BASE-CLASS OF JUNIOR WEB-DEVELOPER, I QUICKLY LEVELED UP TO A GLOBAL WEB-MANAGER, TOOK A DETOUR INTO THE LANDS OF EVENT-MANAGEMENT BEFORE RETURNING TO WEB DEVELOPMENT.\n"',
    '1530 print "MY TIME OUTSIDE OF THE DIGITAL REALM, IS MOSTLY SPENT WITH FRIENDS AND FAMILY, IN THE GYM OR EXPLORING ESCAPE - ROOMS.RECENTLY, I ALSO STARTED A NEW SIDEQUEST: SYSTEMS PROGRAMMING.THE LEARNING CURVE IS STEEP BUT THE XP IS WORTH IT.\n"',
    '1540 print "THE QUEST CONTINUES...\n"',

    '1900 input "TYPE A NUMBER TO NAVIGATE."; A',
    "1910 if A=0 then 0",
    "1920 if A=2 then 2000",
    "1930 if A=3 then 3000",
    "1930 if A=4 then 4000",
    "1930 if A=5 then 5000",*/
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
