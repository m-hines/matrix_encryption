const prompt = require('prompt-sync')( {sigint: true} );

const letterObject = {
    ' ': 0,
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
    'I': 9,
    'J': 10,
    'K': 11,
    'L': 12,
    'M': 13,
    'N': 14,
    'O': 15,
    'P': 16,
    'Q': 17,
    'R': 18,
    'S': 19,
    'T': 20,
    'U': 21,
    'V': 22,
    'W': 23,
    'X': 24,
    'Y': 25,
    'Z': 26,
    '.': 27,
    ',': 28,
    '!': 29,
    '?': 30,
    '0': 31,
    '1': 32,
    '2': 33,
    '3': 34,
    '4': 35,
    '5': 36,
    '6': 37,
    '7': 38,
    '8': 39,
    '9': 40
}
// each 1x2 array in a message we are going to encrypt will be multiplied by this array:
const keyMatrix = [[2, .5], [12, 5]];

const encrypt = (message) => {
    let upperString = message.toUpperCase();
    // make sure the message string has an even number of characters:
    if (upperString.length % 2 !== 0) {
        upperString += ' ';
    }
    const pairsArray = [];
    // loop through upperString, incrementing i by 2 each loop; make a 1x2 array inside the lopp for each pair of characters in upperString, and push that array to the pairsArray outside the loop:
    for (i = 0; i < upperString.length; i += 2) {
        const innerPair = [upperString[i]];
        innerPair.push(upperString[i + 1]);
        console.log(innerPair);
        pairsArray.push(innerPair);
    }
    // loop through each 1x2 array in pairsArray, converting each character into a digit:
    for (i = 0; i < pairsArray.length; i ++) {
        for (j = 0; j < 2; j ++) {
            const letter = pairsArray[i][j];
            const numberValue = letterObject[letter];
            pairsArray[i][j] = numberValue;
        }
    }
    // loop through each 1x2 array in pairsArray, multplying each digit by the keyMatrix array:
    const encryptedArray = [];
    for (i = 0; i < pairsArray.length; i ++) {
        let encryptedPair = [0, 0];
        encryptedPair[0] = (pairsArray[i][0] * keyMatrix[0][0]) + (pairsArray[i][1] * keyMatrix[1][0])
        encryptedPair[1] = (pairsArray[i][0] * keyMatrix[0][1]) + (pairsArray[i][1] * keyMatrix[1][1])
        encryptedArray.push(encryptedPair);
    }
    return encryptedArray;
}
const decrypt = (message) => {
    // message takes a string of numbers separated by commas, and we make it into an array of 1x2 arrays:
    const splitMessage = message.split(',');
    // if message had an odd number of numbers (although it shouldn't), we make add one to make it even:
    if (splitMessage.length % 2 !== 0) {
        splitMessage.push('0');
    }
    for (i = 0; i < splitMessage.length; i ++) {
        const myNumber = Number(splitMessage[i]);
        splitMessage[i] = myNumber;
    }
    const numberPairsArray = [];
    // loop through splitMessage, incrementing i by 2 each loop; make a 1x2 array inside the loop for every pair of elements, and push that array to the numberPairsArray outside the loop, so that numberPairsArray is an array of 1x2 number arrays:
    for (i = 0; i < splitMessage.length; i += 2) {
        const innerPair = [splitMessage[i]];
        innerPair.push(splitMessage[i + 1]);
        numberPairsArray.push(innerPair);
    }
    // we get the inverse of keyMatrix, which we will use to decrypt the message that was encrypted with keyMatrix:
    const determinant = (keyMatrix[0][0] * keyMatrix[1][1]) - (keyMatrix[1][0] * keyMatrix[0][1]);
    const inverseOfKeyMatrix = [[(1/determinant) * keyMatrix[1][1], (1/determinant) * (keyMatrix[0][1] * -1)], [(1/determinant) * (keyMatrix[1][0] * -1), (1/determinant) * keyMatrix[0][0]]];
    let decryptedArray = [];
    // we loop through numberPairsArray, multiplying it by inverseOfKeyMatrix, so that we end up with an array of numbers within the range of the values in letterObject:
    for (i = 0; i < numberPairsArray.length; i ++) {
        let decryptedPair = [0, 0];
        decryptedPair[0] = (numberPairsArray[i][0] * inverseOfKeyMatrix[0][0]) + (numberPairsArray[i][1] * inverseOfKeyMatrix[1][0])
        decryptedPair[1] = (numberPairsArray[i][0] * inverseOfKeyMatrix[0][1]) + (numberPairsArray[i][1] * inverseOfKeyMatrix[1][1])
        decryptedArray.push(decryptedPair);  
    }
    // we use this function to get the keys in letterObject by their values (since we are turning numberPairsArray into an array of letters and other characters):
    const getKeyByValue = (object, value) => {
        return Object.keys(object).find((element) => {
            if (object[element] === value) {
                return element;
            }
        })
    }
    for (i = 0; i < decryptedArray.length; i ++) {
        for (j = 0; j < 2; j ++) {
            decryptedArray[i][j] = getKeyByValue(letterObject, decryptedArray[i][j]);
        }
    }
    console.log(decryptedArray);
    return decryptedArray;
}

const message = prompt('Would you like to encrypt or decrypt? Input e for encypt, d for decrypt.');
if (message == 'e') {
    encryptThis = prompt('What message would you like to encrypt?');  // takes upper and lower case letters, numbers, basic punctuation
    const encryptedMessage = encrypt(encryptThis);
    console.log(`Your message in its encrypted form is: ${encryptedMessage}`);
} else {
    decryptThis = prompt('What message would you like to decrypt?');  // takes a string of positive or negative integers separated by commas, no spaces
    const decryptedMessage = decrypt(decryptThis);
    console.log(`Your message in its decrypted form is: ${decryptedMessage}`)
}

