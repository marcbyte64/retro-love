1 LET N = 123
2 LET F% = 1.23
3 LET S$ = "FOO"

10 PRINT "Hello World"
20 PRINT "Want to read it again?"
30 INPUT "Y/N"; A$
40 PRINT
50 IF A$="Y" OR A$="y" THEN 10
60 IF A$="N" OR A$="n" THEN 80
70 GOTO 30
80 PRINT "ok. bye then"

90 PRINT "NUMBER N: "; N
100 PRINT "FLOAT F%: "; F%
110 PRINT "STRING S$: "; S$
