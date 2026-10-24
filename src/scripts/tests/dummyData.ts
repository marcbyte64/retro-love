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
    '5 PRINT "hello world',
    '10 IF 1=1 AND 2=3 OR 3=3 THEN PRINT "Hello"',

    // '10 PRINT "HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%',
    // '20 PRINT "--------"',
    // '30 GOTO 10',
    // '5 IF 5 > 1 THEN PRINT "5 is greater than 1"',
    // '10 INPUT "Enter 2 Numbers?"; A, B%',
    // '20 PRINT "The sum of " ; A ; " and " ; B% ; " is " ; A + B%',
    // '30 GOTO 10',

    // HOME
    /*"0 clr",
    '1 PRINT "YOLO"',
    '2 PRINT "SOLO"',
    '10 PRINT "\n\n"',
    '20 PRINT "== WELCOME TO MY WEBSITE ==\n"',

    '70 PRINT "--------------------------------"',
    '80 PRINT ""',
    '90 PRINT "1  ABOUT ME"',
    '100 PRINT "2  PROJECTS"',
    '110 PRINT "3  SKILLS"',
    '120 PRINT "4  CONTACT"',
    '130 PRINT "5  SYSTEM INFO"',
    '140 PRINT ""',
    '150 PRINT "--------------------------------"',
    '160 PRINT ""',

    '500 PRINT "HELLO, I\'M MARC."',
    '510 PRINT "I LIKE TO CODE."',
    '520 PRINT ""',

    '900 INPUT "TYPE A NUMBER TO NAVIGATE."; A',
    "910 IF A=1 THEN 1000",
    "920 IF A=2 THEN 2000",
    "930 IF A=3 THEN 3000",
    "940 IF A=4 THEN 4000",
    "950 IF A=5 THEN 5000",
    "960 GOTO 0",

    // ABOUT
    "1000 clr",
    '1010 PRINT "\n\n"',
    '1020 PRINT "== ABOUT ME ==\n"',

    '1030 PRINT "--------------------------------"',
    '1040 PRINT ""',
    '1050 PRINT "0  HOME"',
    '1060 PRINT "2  PROJECTS"',
    '1070 PRINT "3  SKILLS"',
    '1080 PRINT "4  CONTACT"',
    '1090 PRINT "5  SYSTEM INFO"',
    '1100 PRINT ""',
    '1110 PRINT "--------------------------------"',
    '1120 PRINT ""',

    '1500 PRINT "I\'M A SOFTWARE DEVELOPER BASED IN SWITZERLAND."',
    '1510 PRINT "MY ADVENTURE BEGAN RIGHT AFTER THE GOLDEN AGE OF COMPUTERS. ARMED WITH A C=64, MY FIRST EVER PROGRAM WAS A TEXT-ADVENTURE WRITTEN IN BASIC V2. THE INTERFACE LOOKED EERILY SIMILAR TO WHAT YOU ARE STARING AT RIGHT NOW.\n"',
    '1520 PRINT "SINCE THEN I\'VE GAINED A FEW EXPERIENCE POINTS. WITH A BASE-CLASS OF JUNIOR WEB-DEVELOPER, I QUICKLY LEVELED UP TO A GLOBAL WEB-MANAGER, TOOK A DETOUR INTO THE LANDS OF EVENT-MANAGEMENT BEFORE RETURNING TO WEB DEVELOPMENT.\n"',
    '1530 PRINT "MY TIME OUTSIDE OF THE DIGITAL REALM, IS MOSTLY SPENT WITH FRIENDS AND FAMILY, IN THE GYM OR EXPLORING ESCAPE - ROOMS.RECENTLY, I ALSO STARTED A NEW SIDEQUEST: SYSTEMS PROGRAMMING.THE LEARNING CURVE IS STEEP BUT THE XP IS WORTH IT.\n"',
    '1540 PRINT "THE QUEST CONTINUES...\n"',

    '1900 INPUT "TYPE A NUMBER TO NAVIGATE."; A',
    "1910 IF A=0 THEN 0",
    "1920 IF A=2 THEN 2000",
    "1930 IF A=3 THEN 3000",
    "1930 IF A=4 THEN 4000",
    "1930 IF A=5 THEN 5000",*/
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
