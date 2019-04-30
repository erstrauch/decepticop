#! C:\Python27\python.exe

import cgi, cgitb; cgitb.enable()

gameInfo = cgi.FieldStorage(keep_blank_values=True)

# if 'calibrating' in fields:
	# fields = ["timestamp","touchpoint"]
	# out_filename = "calibration_out.csv"
# else:
fields = ["timestamp","player","action","lie","cards"]
out_filename = "gamestate_out.csv"
# time.sleep(3)

gameDict = dict(zip(fields, len(fields)*['']))
for k in gameInfo.keys():
	if k in fields:
		gameDict[k] = gameInfo[k].value

parsedInfo = len(fields) * [None]
for i,field in enumerate(fields):
	parsedInfo[i] = gameDict[field]

with open(out_filename,'a+') as f:
	f.write(','.join(parsedInfo)+'\n')

print 'Content-type: text/html\r\n\r\n'
for key in gameInfo.keys():
	print key, gameInfo[key].value
