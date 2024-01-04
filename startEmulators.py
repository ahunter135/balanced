# Simple script to look in env file and start the emulators that are set to true

import os
import webbrowser
import threading
import time


def openBrowser(url):
    webbrowser.open(url)

def runCommand(command):
    os.system(command)

AUTH_EMULATOR_BOOL_VARIABLE = "useFirebaseAuthEmulator"
FIRESTORE_EMULATOR_BOOL_VARIABLE = "useFirestoreEmulator"

FIREBASE_CLI_FIRESTORE_EMULATOR_NAME = "firestore"
FIREBASE_CLI_AUTH_EMULATOR_NAME = "auth"

# Figure out what emulators to use
emulators = []
envFile = os.open("src/environments/environment.ts", os.O_RDONLY)
text = os.read(envFile, 1000000)
text = text.decode("utf-8").split("\n")
for line in text:
    if AUTH_EMULATOR_BOOL_VARIABLE in line:
        if "true" in line:
            emulators.append(FIREBASE_CLI_AUTH_EMULATOR_NAME)
    if FIRESTORE_EMULATOR_BOOL_VARIABLE in line:
        if "true" in line:
            emulators.append(FIREBASE_CLI_FIRESTORE_EMULATOR_NAME)
os.close(envFile)

commandString = "firebase emulators:start --only " + ",".join(emulators)
print("Running command: " + commandString)

commandThread = threading.Thread(target=runCommand, args=(commandString,))
commandThread.start()

# Open the browser after 7 seconds
time.sleep(7)
openBrowser("http://localhost:4000")
